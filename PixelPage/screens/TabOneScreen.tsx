import { ActivityIndicator, StyleSheet, FlatList } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";
import { gql, useQuery } from "@apollo/client";
import BookItem from "../components/Bookitem";

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
  const { data, loading, error } = useQuery(query, {
    variables: { q: 'Harry Potter' },
  });

  console.log(JSON.stringify(data, null, 2));

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator />}
      {error && (
        <View style={styles.container}>
          <Text style={styles.title}>Error fetching books</Text>
          <Text>{error.message}</Text>
        </View>
      )}
      <FlatList
        data={data?.googleBooksSearch?.items || []}
        renderItem={({ item }) => (
          <BookItem
            book={{
              title: item.volumeInfo.title,
              image: item.volumeInfo.imageLinks.thumbnail,
              authors: item.volumeInfo.authors,
              isbn: item.volumeInfo.industryIdentifiers[0].identifier,
            }}
          />
        )}
  showsVerticalScrollIndicator={false}
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
});
