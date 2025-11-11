import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../FirebaseConfig';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function EditProfileScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>('');

  useEffect(() => {
    (async () => {
      if (auth.currentUser) {
        const docRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUsername(userData.username);
          setBio(userData.bio);
          if (userData.profileImageUrl) {
            setProfileImage(userData.profileImageUrl);
          }
        }
      }
    })();
  }, []);

  const handleSaveProfile = async () => {
    if (auth.currentUser) {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      try {
        await updateDoc(userRef, {
          username,
          bio,
          profileImageUrl: profileImage,
        });
        Alert.alert('Profile updated successfully!');
        navigation.goBack();
      } catch (error) {
        console.error("Error updating profile: ", error);
        Alert.alert("Error updating profile");
      }
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
  
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri; // Access the uri from the first asset
      uploadImage(uri);
    }
  };

  const uploadImage = async (uri) => {
    const storage = getStorage();
    const imageName = `profile_${auth.currentUser.uid}`;
    const storageRef = ref(storage, `profileImages/${imageName}`);

    const response = await fetch(uri);
    const blob = await response.blob();

    await uploadBytes(storageRef, blob);

    const downloadURL = await getDownloadURL(storageRef);
    setProfileImage(downloadURL);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Button title="Cancel" onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <Button title="Save" onPress={handleSaveProfile} />
        </View>
        <View style={styles.profileSection}>
          <Image source={{ uri: profileImage || 'https://via.placeholder.com/150' }} style={styles.profileImage} />
          <Button title="Change Profile Photo" onPress={pickImage} />
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
    </SafeAreaView>
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
});
