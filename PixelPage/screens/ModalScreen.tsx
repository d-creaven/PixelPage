import React from 'react';
import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { View, Text } from '../components/Themed';
import { auth } from '../FirebaseConfig';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

export default function ModalScreen({ navigation }) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const handleSignOut = () => {
    navigation.navigate('Profile');
    auth.signOut().then(() => {
    });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity
        style={[styles.option, { borderBottomColor: colors.border }]}
        onPress={() => {
          navigation.goBack();
          navigation.navigate('EditProfile'); // Navigates to the EditProfileScreen. // This will close the modal.
        }}
      >
        <Text style={[styles.optionText, { color: colors.text }]}>Edit Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.option, { borderBottomColor: colors.border }]} 
        onPress={handleSignOut}
      >
        <Text style={[styles.optionText, { color: colors.text }]}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginLeft: 20,
  },
  optionText: {
    fontSize: 18,
  },
  // Add other styles as needed
});


