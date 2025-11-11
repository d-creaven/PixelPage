import { ActivityIndicator, FlatList, TextInput, Button, TouchableOpacity } from "react-native";
import { Text, View } from "../../components/Themed";
import BookItem from "../../components/BookItem";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { parseBook, searchGoogleBooks } from "../../services/bookService";
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../FirebaseConfig";
import UserItem from "../../components/UserItem";
import Colors from "../../constants/Colors";
import useColorScheme from "../../hooks/useColorScheme";

export default function SearchScreen() {
  const [search, setSearch] = useState("");
  const [searchMode, setSearchMode] = useState<"books" | "users">("books");
  const [booksData, setBooksData] = useState([]);
  const [booksLoading, setBooksLoading] = useState(false);
  const [booksError, setBooksError] = useState<Error | null>(null);
  const [usersData, setUsersData] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const navigation = useNavigation();

  const handleSelectBook = (book) => {
    navigation.navigate('BookDetails', { book });
  };

  const handleSelectUser = (userId) => {
    navigation.navigate('GivenUserProfile', { userId });
  };

  const searchBooks = async (searchText: string) => {
    const trimmedSearch = searchText?.trim();
    if (!trimmedSearch) {
      setBooksData([]);
      setBooksLoading(false);
      setBooksError(null);
      return;
    }

    console.log("Searching for books with text:", trimmedSearch);
    setBooksLoading(true);
    setBooksError(null);
    try {
      const result = await searchGoogleBooks(trimmedSearch);
      setBooksData(result.googleBooksSearch?.items || []);
    } catch (error) {
      console.error("Error searching books:", error);
      setBooksError(error as Error);
      setBooksData([]);
    } finally {
      setBooksLoading(false);
    }
  };

  const searchUsers = async (searchText) => {
    const trimmedSearch = searchText?.trim();
    if (!trimmedSearch) {
      setUsersData([]);
      setUsersLoading(false);
      return;
    }

    console.log("Searching for users with text:", trimmedSearch);
    setUsersLoading(true);
    try {
      const usersRef = collection(db, "users");
      const searchLower = trimmedSearch.toLowerCase();
      
      // Try Firestore range query first (requires index, but more efficient)
      // If it fails, we'll fall back to fetching all and filtering
      try {
        const q = query(
          usersRef, 
          where("username", ">=", trimmedSearch), 
          where("username", "<=", trimmedSearch + '\uf8ff')
        );
        
        const querySnapshot = await getDocs(q);
        console.log("Query snapshot size:", querySnapshot.size);
        const users = [];
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          console.log("Found user:", userData.username);
          // Filter to ensure username contains the search text (case-insensitive)
          if (userData.username && userData.username.toLowerCase().includes(searchLower)) {
            users.push({ ...userData, userId: doc.id });
          }
        });
        
        console.log("Users found:", users.length);
        setUsersData(users);
      } catch (queryError) {
        // If range query fails (e.g., missing index), fetch all users and filter client-side
        console.log("Range query failed, fetching all users:", queryError.message);
        const allUsersSnapshot = await getDocs(usersRef);
        const users = [];
        allUsersSnapshot.forEach((doc) => {
          const userData = doc.data();
          if (userData.username && userData.username.toLowerCase().includes(searchLower)) {
            users.push({ ...userData, userId: doc.id });
          }
        });
        console.log("Users found (fallback):", users.length);
        setUsersData(users);
      }
    } catch (error) {
      console.error("Error searching users:", error);
      console.error("Error details:", error.message);
      setUsersData([]);
    } finally {
      setUsersLoading(false);
    }
  };

  return (
    <SafeAreaView edges={["top"]} style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TextInput 
          value={search} 
          onChangeText={setSearch}
          placeholder={`Search ${searchMode === "books" ? "Books" : "Users"}`} 
          placeholderTextColor={colors.placeholder}
          style={[styles.input, { 
            borderColor: colors.border, 
            color: colors.text,
            backgroundColor: colors.cardBackground 
          }]}
        />
        <Button 
          title='Search' 
          onPress={() => {
            if (searchMode === "books" && search.trim()) {
              searchBooks(search.trim());
            } else if (searchMode === "users" && search.trim()) {
              searchUsers(search.trim());
            }
          }}
        />
      </View>

      <View style={styles.tabs}> 
        <Text 
          style={searchMode === "books" ? {fontWeight: 'bold', color: colors.tint} : {color: colors.text}}
          onPress={() => setSearchMode("books")}
        >
          Books
        </Text>
        <Text 
          style={searchMode === "users" ? {fontWeight: 'bold', color: colors.tint} : {color: colors.text}}
          onPress={() => setSearchMode("users")}
        >
          Users
        </Text>
      </View>

      {(booksLoading || usersLoading) && <ActivityIndicator color={colors.tint} />}
      {booksError && (
        <View style={{ padding: 20 }}>
          <Text style={[styles.title, { color: colors.text }]}>Error fetching data</Text>
          <Text style={{ color: colors.text, marginTop: 10 }}>{booksError.message}</Text>
          <Text style={{ color: colors.secondaryText, marginTop: 5, fontSize: 12 }}>
            Please check your internet connection and try again
          </Text>
        </View>
      )}
      {searchMode === "books" && !booksLoading && booksData.length === 0 && search.trim() && !booksError && (
        <View style={{ padding: 20, alignItems: 'center' }}>
          <Text style={{ color: colors.secondaryText }}>No books found</Text>
        </View>
      )}
      {searchMode === "users" && !usersLoading && usersData.length === 0 && search.trim() && (
        <View style={{ padding: 20, alignItems: 'center' }}>
          <Text style={{ color: colors.secondaryText }}>No users found</Text>
        </View>
      )}
      <FlatList
        data={searchMode === "books" ? booksData : usersData}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={{ backgroundColor: colors.background }}
        renderItem={({ item }) => (
          searchMode === "books" ? (
            <TouchableOpacity onPress={() => handleSelectBook(parseBook(item, "googleBooksSearch"))}>
              <BookItem book={parseBook(item, "googleBooksSearch")}/>
            </TouchableOpacity>
          ) : (
            // Use the UserItem component for rendering user search results
            <UserItem 
              username={item.username} 
              profileImageUrl={item.profileImageUrl}
              onPress={() => handleSelectUser(item.userId)}
            />
          )
        )} 
      />
    </SafeAreaView>
  );
}

