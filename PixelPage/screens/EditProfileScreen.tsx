import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { auth, db } from '../FirebaseConfig'; // make sure to import auth from your firebase config
import { doc, updateDoc } from 'firebase/firestore';

export default function EditProfileScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');

  const handleSaveProfile = async () => {
    if (auth.currentUser) {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      try {
        await updateDoc(userRef, {
          username: username,
          bio: bio,
        });
        console.log('Profile saved!');
        // Optionally navigate back or give feedback to the user
        navigation.goBack();
      } catch (error) {
        console.error("Error updating profile: ", error);
        // Handle errors, possibly show an alert to the user
      }
    } else {
      // No user is signed in.
      console.log('No user is signed in.');
      // Handle this situation, possibly by sending them to the login screen
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Button title="Cancel" onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <Button title="Done" onPress={handleSaveProfile} />
      </View>
      <View style={styles.profileSection}>
        <Image
        source={{ uri: 'https://via.placeholder.com/150' }} // Replace with user's profile image URI
        style={styles.profileImage}
        />
        <Button title="Change profile photo" onPress={() => {}} />
      </View>
      <View style={styles.form}>
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
        <TextInput
          placeholder="Bio"
          value={bio}
          onChangeText={setBio}
          style={styles.input}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  form: {
    margin: 20,
  },
  input: {
    height: 40,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
  },
  // Add other styles as needed
});
