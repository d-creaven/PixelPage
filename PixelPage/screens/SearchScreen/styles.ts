import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
      backgroundColor: "white",
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