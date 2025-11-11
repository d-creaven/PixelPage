import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import React from "react";
import { useMyBooks } from "../context/MyBooksProvider";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";

type BookItemProps = {
  book: Book;
};

const BookItem = ({ book }: BookItemProps) => {
  const {isBookSaved, onToggleSaved} = useMyBooks();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const saved = isBookSaved(book);
  
  return (
    <View style={styles.container}>
      <Image source={{ uri: book.image }} style={styles.image} />
      <View style={[styles.contentContainer, { borderColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>{book.title}</Text>
        <Text style={{ color: colors.secondaryText }}>by {book.authors?.join(", ")}</Text>



      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: 10,
  },
  image: {
    flex: 1,
    aspectRatio: 2 / 3,
    marginRight: 10,
  },
  contentContainer: {
    flex: 4,
    borderBottomWidth: 0.5,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
  },
  button:{
    backgroundColor: Colors.light.tint,
    alignSelf: "flex-start",
    marginTop: "auto",
    marginVertical: 10,
    borderRadius: 5,
    padding: 7,
    paddingHorizontal: 15,
  },
  buttonText:{
    color: "white",
    fontWeight: "600",
  },
});

export default BookItem;