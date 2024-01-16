import { ActivityIndicator, StyleSheet, FlatList, TextInput, Button } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";
import { gql, useQuery,  useLazyQuery } from "@apollo/client";
import BookItem from "../components/Bookitem";
import { useState } from "react";

const query = gql`
  query SearchBooks($q: String) {
    googleBooksSearch(q: $q, country: "US") {
      items {
        id
        volumeInfo {
          authors
          averageRating
          description
          imageLinks {
            thumbnail
          }
          title
          subtitle
          industryIdentifiers {
            identifier
            type
          }
        }
      }
    }
    openLibrarySearch(q: $q) {
      docs {
        author_name
        title
        cover_edition_key
        isbn
      }
    }
  }
`;

export default function TabOneScreen({
  navigation,
}: RootTabScreenProps<'TabOne'>) {
  const [search, setSearch] = useState("");
  const [provider, setProvider] = useState<
  "googleBooksSearch" | "openLibrarySearch"
  >("googleBooksSearch")

  const [runQuery, { data, loading, error }] = useLazyQuery(query);

  const parseBook = (item: any): Book => {
    if(provider === "googleBooksSearch") {
      return {
        title: item.volumeInfo.title,
        image: item.volumeInfo.imageLinks?.thumbnail,
        authors: item.volumeInfo.authors,
        isbn: item.volumeInfo.industryIdentifiers?.[0]?.identifier,
      };
    }
    return {
      image: `https://covers.openlibrary.org/b/olid/${item.cover_edition_key}-M.jpg`,
      title: item.title,
      authors: item.author_name,
      isbn: item.isbn?.[0],
    };
  }

  // console.log(JSON.stringify(data, null, 2));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput 
          value={search} 
          onChangeText={setSearch}
          placeholder="Search Books" 
          style={styles.input}
        />
        <Button title='Search' onPress={() => runQuery({variables: {q: search}})}/>
      </View>

      <View style={styles.tabs}> 
        <Text 
          style={
            provider === "googleBooksSearch"
              ? {fontWeight: 'bold', color: "royalblue"}
              : {}
          }
          onPress={() => setProvider("googleBooksSearch")}
        >
          Google Books
        </Text>
        <Text 
          style={
            provider === "openLibrarySearch"
              ? {fontWeight: 'bold', color: "royalblue"}
              : {}
          }
          onPress={() => setProvider("openLibrarySearch")}
        >
          Open Libary
        </Text>
      </View>

      {loading && <ActivityIndicator />}
      {error && (
        <View style={styles.container}>
          <Text style={styles.title}>Error fetching books</Text>
          <Text>{error.message}</Text>
        </View>
      )}
      <FlatList
        data={
          provider === "googleBooksSearch"
            ? data?.googleBooksSearch?.items 
            : data?.openLibrarySearch?.docs || []
        }
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <BookItem book={parseBook(item)}/>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
  },
  input: {
    flex: 1,
    borderColor: 'gainsboro',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
  },
  tabs: {
    flexDirection: "row",
    height: 50,
    justifyContent: "space-around",
    alignContent: "center",
  },
});
