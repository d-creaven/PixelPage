import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { auth, db } from '../FirebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';

export default function ProfileScreen() {
  const [userData, setUserData] = useState({
    username: 'Loading...',
    reviewsCount: 0,
    followersCount: 0,
    followingCount: 0,
    bio: '',
    profileImageUrl: 'https://via.placeholder.com/150', // Default image in case profile image is not set
  });

  useEffect(() => {
    if (auth.currentUser) {
      const unsubscribe = onSnapshot(doc(db, 'users', auth.currentUser.uid), (document) => {
        if (document.exists()) {
          const data = document.data();
          setUserData({
            username: data.username || '',
            reviewsCount: data.reviewsCount || 0,
            followersCount: data.followersCount || 0,
            followingCount: data.followingCount || 0,
            bio: data.bio || '',
            profileImageUrl: data.profileImageUrl || 'https://via.placeholder.com/150', // Use profile image URL from Firestore, with a default placeholder
          });
        } else {
          // Handle the case where the document does not exist
        }
      }, (error) => {
        // Handle the error
        console.error("Error fetching user data: ", error);
      });

      // Cleanup listener when the component unmounts
      return () => unsubscribe();
    }
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          source={{ uri: userData.profileImageUrl }} // Use profile image URL from state
          style={styles.profileImage}
        />
        <Text style={styles.username}>{userData.username}</Text>
        <View style={styles.statsContainer}>
          <Text style={styles.stat}>{userData.reviewsCount} Reviews</Text>
          <Text style={styles.stat}>{userData.followersCount} Followers</Text>
          <Text style={styles.stat}>{userData.followingCount} Following</Text>
        </View>
      </View>
      <Text style={styles.bio}>{userData.bio}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 10,
  },
  stat: {
    alignItems: 'center',
    fontSize: 16,
  },
  bio: {
    fontSize: 14,
    padding: 15,
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'blue',
    marginHorizontal: 100,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});