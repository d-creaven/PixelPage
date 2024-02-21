import { ActivityIndicator, FlatList, TextInput, Button, TouchableOpacity } from "react-native";
import { Text, View } from "../../components/Themed";
import { useLazyQuery } from "@apollo/client";
import BookItem from "../../components/Bookitem";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { searchQuery } from "./queries";
import { parseBook } from "../../services/bookService";
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../FirebaseConfig";
import UserItem from "../../components/UserItem";

export default function SearchScreen() {
  const [search, setSearch] = useState("");
  const [searchMode, setSearchMode] = useState<"books" | "users">("books");
  const [usersData, setUsersData] = useState([]);

  const [runQuery, { data, loading, error }] = useLazyQuery(searchQuery);
  const navigation = useNavigation();

  const handleSelectBook = (book) => {
    navigation.navigate('BookDetails', { book });
  };

  const handleSelectUser = (userId) => {
    navigation.navigate('GivenUserProfile', { userId });
  };

  const searchUsers = async (searchText) => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", ">=", searchText), where("username", "<=", searchText + '\uf8ff'));
    const querySnapshot = await getDocs(q);
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ ...doc.data(), userId: doc.id });
    });
    setUsersData(users);
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <View style={styles.header}>
        <TextInput 
          value={search} 
          onChangeText={setSearch}
          placeholder={`Search ${searchMode === "books" ? "Books" : "Users"}`} 
          style={styles.input}
        />
        <Button title='Search' onPress={() => searchMode === "books" ? runQuery({variables: {q: search}}) : searchUsers(search)}/>
      </View>

      <View style={styles.tabs}> 
        <Text 
          style={searchMode === "books" ? {fontWeight: 'bold', color: "royalblue"} : {}}
          onPress={() => setSearchMode("books")}
        >
          Google Books
        </Text>
        <Text 
          style={searchMode === "users" ? {fontWeight: 'bold', color: "royalblue"} : {}}
          onPress={() => setSearchMode("users")}
        >
          Users
        </Text>
      </View>

      {loading && <ActivityIndicator />}
      {error && (
        <View style={styles.container}>
          <Text style={styles.title}>Error fetching data</Text>
          <Text>{error.message}</Text>
        </View>
      )}
      <FlatList
        data={searchMode === "books" ? (data?.googleBooksSearch?.items || []) : usersData}
        showsVerticalScrollIndicator={false}
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

