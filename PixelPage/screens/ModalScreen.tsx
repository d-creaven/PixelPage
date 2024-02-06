import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { auth } from '../FirebaseConfig'; // Adjust the import path as needed

export default function ModalScreen({ navigation }) {

  const handleSignOut = () => {
    navigation.navigate('Profile'); // Adjust the navigation route as necessary
    auth.signOut();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Button
        title="Edit Profile"
        onPress={() => navigation.navigate('EditProfileScreen')} // Adjust the navigation route as necessary
      />
      <Button
        title="Sign Out"
        onPress={handleSignOut}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  // Add other styles as needed
});

