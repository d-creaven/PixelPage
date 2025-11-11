import React, { useState, useEffect } from 'react';
import { ScrollView, TextInput, Button, StyleSheet, Image, Alert, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text } from '../components/Themed';
import { auth, db, storage } from '../FirebaseConfig';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import { RootStackScreenProps } from '../types';

export default function EditProfileScreen({ navigation }: RootStackScreenProps<'EditProfile'>) {
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>('');
  const [uploading, setUploading] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

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

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to change your profile picture!');
        return false;
      }
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
    
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        await uploadImage(uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const uploadImage = async (uri: string) => {
    if (!auth.currentUser) {
      Alert.alert('Error', 'You must be logged in to upload images.');
      return;
    }

    setUploading(true);
    try {
      const imageName = `profile_${auth.currentUser.uid}`;
      const storageRef = ref(storage, `profileImages/${imageName}`);

      let blob: Blob;
      
      if (Platform.OS === 'web') {
        // For web, handle data URIs and blob URLs
        if (uri.startsWith('data:')) {
          // Convert data URI to blob
          const response = await fetch(uri);
          blob = await response.blob();
        } else if (uri.startsWith('blob:')) {
          // Handle blob URLs
          const response = await fetch(uri);
          blob = await response.blob();
        } else {
          // Regular URL
          const response = await fetch(uri);
          blob = await response.blob();
        }
      } else {
        // For mobile (iOS/Android), fetch the local file URI
        const response = await fetch(uri);
        blob = await response.blob();
      }

      // Upload the blob
      await uploadBytes(storageRef, blob);

      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);
      setProfileImage(downloadURL);
      Alert.alert('Success', 'Profile picture updated! Don\'t forget to save your profile.');
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Upload Error', `Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Button title="Cancel" onPress={() => navigation.goBack()} />
          <Text style={[styles.headerTitle, { color: colors.text }]}>Edit Profile</Text>
          <Button title="Save" onPress={handleSaveProfile} />
        </View>
        <View style={styles.profileSection}>
          <Image source={{ uri: profileImage || 'https://via.placeholder.com/150' }} style={styles.profileImage} />
          {uploading ? (
            <View style={styles.uploadingContainer}>
              <ActivityIndicator size="small" color={colors.tint} />
              <Text style={[styles.uploadingText, { color: colors.text }]}>Uploading...</Text>
            </View>
          ) : (
            <Button title="Change Profile Photo" onPress={pickImage} disabled={uploading} />
          )}
        </View>
        <View style={styles.form}>
          <TextInput
            placeholder="Username"
            placeholderTextColor={colors.placeholder}
            value={username}
            onChangeText={setUsername}
            style={[styles.input, { 
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
              color: colors.text 
            }]}
          />
          <TextInput
            placeholder="Bio"
            placeholderTextColor={colors.placeholder}
            value={bio}
            onChangeText={setBio}
            style={[styles.input, { 
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
              color: colors.text 
            }]}
            multiline
            numberOfLines={4}
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
    marginBottom: 10,
  },
  form: {
    margin: 20,
  },
  input: {
    minHeight: 40,
    marginVertical: 10,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  uploadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 8,
  },
  uploadingText: {
    fontSize: 14,
  },
});
