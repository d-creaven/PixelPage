import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { auth, db } from '../FirebaseConfig';
import { collection, doc, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import navigation from '../navigation';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ReviewItem from '../components/ReviewItem';

export default function ProfileScreen() {
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
  const [userReviews, setUserReviews] = useState([]);

  useEffect(() => {
    const currentUserUid = auth.currentUser?.uid;
    if (currentUserUid) {
      const userRef = doc(db, 'users', currentUserUid);
      const unsubscribeUser = onSnapshot(userRef, (document) => {
        if (document.exists()) {
          const data = document.data();
          setUserData(prevUserData => ({
            ...prevUserData,
            username: data.username || 'Loading...',
            followers: data.followers || [],
            following: data.following || [],
            followersCount: data.followersCount || 0,
            followingCount: data.followingCount || 0,
            bio: data.bio || '',
            profileImageUrl: data.profileImageUrl || 'https://via.placeholder.com/150',
          }));
        }
      });

      const reviewsRef = collection(db, 'reviews');
      const q = query(reviewsRef, where('userId', '==', currentUserUid), orderBy('timestamp', 'desc'));
      const unsubscribeReviews = onSnapshot(q, (snapshot) => {
        const fetchedReviews = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUserReviews(fetchedReviews);
      });

      return () => {
        unsubscribeUser();
        unsubscribeReviews();
      };
    }
  }, [auth.currentUser]);

  return (
    <View style={styles.container}>
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
        <Text style={styles.bio}>{userData.bio}</Text>
        {/* You can place any other static content here, like a follow button */}
      </View>
      <ScrollView style={styles.reviewsContainer}>
        {userReviews.map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </ScrollView>
    </View>
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