import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { auth } from '../FirebaseConfig'; // Adjust the import path as needed

export default function ModalScreen({ navigation }) {

  const handleSignOut = () => {
    navigation.navigate('Profile');
    auth.signOut().then(() => {
    });
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.option}
        onPress={() => {
          navigation.goBack();
          navigation.navigate('EditProfile'); // Navigates to the EditProfileScreen. // This will close the modal.
        }}
      >
        <Text style={styles.optionText}>Edit Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={handleSignOut}>
        <Text style={styles.optionText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 20,
  },
  option: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginLeft: 20,
  },
  optionText: {
    fontSize: 18,
  },
  // Add other styles as needed
});


