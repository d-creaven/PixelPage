import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { auth, db } from '../FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export default function ProfileScreen() {
  const [userData, setUserData] = useState({
    username: 'Loading...',
    reviewsCount: 0,
    followersCount: 0,
    followingCount: 0,
    bio: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.log("No such document!");
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          source={{ uri: 'https://via.placeholder.com/150' }} // Replace with user's profile image
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