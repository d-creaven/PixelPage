import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import { auth, db } from '../FirebaseConfig';
import { arrayRemove, arrayUnion, doc, increment, onSnapshot, writeBatch } from 'firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const GivenUserProfileScreen = ({ route, navigation }) => {
  const [userData, setUserData] = useState({
    username: 'Loading...',
    reviewsCount: 0,
    followers: [],
    following: [],
    followersCount: 0,
    followingCount: 0,
    bio: '',
    profileImageUrl: 'https://via.placeholder.com/150',
  });

  const { userId } = route.params; // Assume we pass the user ID as a route parameter

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'users', userId), (document) => {
      if (document.exists()) {
        const data = document.data();
        setUserData({
          username: data.username || '',
          reviewsCount: data.reviewsCount || 0,
          followers: data.followers || [],
          following: data.following || [],
          followersCount: data.followersCount || 0,
          followingCount: data.followingCount || 0,
          bio: data.bio || '',
          profileImageUrl: data.profileImageUrl || 'https://via.placeholder.com/150',
        });
  
        // Update the navigation header with the user's username
        navigation.setOptions({ headerTitle: data.username || 'Profile' });
  
        // Check if the current user is following the profile being viewed
        const isFollowing = data.followers?.includes(auth.currentUser?.uid);
        setFollowing(isFollowing);
      } else {
        // Handle the case where the document does not exist
      }
    }, (error) => {
      console.error("Error fetching user data: ", error);
    });
  
    return () => unsubscribe();
  }, [userId, navigation]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 }}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const [following, setFollowing] = useState(false);

  const handleFollowPress = async () => {
    const currentUserUid = auth.currentUser?.uid; // UID of the logged-in user
    const profileUserUid = userId; // UID of the user being viewed
  
    // References to both users' documents in Firestore
    const currentUserRef = doc(db, 'users', currentUserUid);
    const profileUserRef = doc(db, 'users', profileUserUid);
  
    try {
      // Start a batch write
      const batch = writeBatch(db);
  
      // Check if already following, then unfollow
      if (following) {
        batch.update(currentUserRef, {
          following: arrayRemove(profileUserUid),
          followingCount: increment(-1)
        });
        batch.update(profileUserRef, {
          followers: arrayRemove(currentUserUid),
          followersCount: increment(-1)
        });
        setFollowing(false); // Update following state to false
      } else {
        // If not already following, follow
        batch.update(currentUserRef, {
          following: arrayUnion(profileUserUid),
          followingCount: increment(1)
        });
        batch.update(profileUserRef, {
          followers: arrayUnion(currentUserUid),
          followersCount: increment(1)
        });
        setFollowing(true); // Update following state to true
      }
  
      // Commit the batch write
      await batch.commit();
    } catch (error) {
      console.error("Error updating follow status: ", error);
    }
  };
  

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <ScrollView style={styles.container}>
        <View style={styles.headerContainer}>
          <Image source={{ uri: userData.profileImageUrl }} style={styles.profileImage} />
          <View style={styles.statsContainer}>
            <Text style={styles.stat}>{userData.reviewsCount} Reviews</Text>
            <Text style={styles.stat}>{userData.followersCount} Followers</Text>
            <Text style={styles.stat}>{userData.followingCount} Following</Text>
          </View>
        </View>
        <Text style={styles.bio}>{userData.bio}</Text>
        <Pressable
          style={[styles.button, following ? { backgroundColor: 'lightgray' } : {backgroundColor: '#47AA71'}]}
          onPress={(handleFollowPress)}
        >
          <Text style={styles.buttonText}>
            {following ? 'Following' : 'Follow'}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
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

export default GivenUserProfileScreen;