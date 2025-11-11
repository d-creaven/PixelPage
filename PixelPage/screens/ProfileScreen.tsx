import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Image, ScrollView, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { View, Text } from '../components/Themed';
import { auth, db } from '../FirebaseConfig';
import { collection, doc, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import navigation from '../navigation';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ReviewItem from '../components/ReviewItem';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

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
  const [reviews, setReviews] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const navigation = useNavigation();

  useEffect(() => {
    const currentUserUid = auth.currentUser?.uid;

    if (currentUserUid) {
      // Setup the user data listener
      const userRef = doc(db, 'users', currentUserUid);
      const unsubscribeUser = onSnapshot(userRef, (document) => {
        if (document.exists()) {
          const data = document.data();
          setUserData((prevUserData) => ({
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

      // Setup the reviews feed
      fetchReviews(currentUserUid);

      return () => {
        unsubscribeUser();
      };
    }
  }, [auth.currentUser]);

  const fetchReviews = async (userId) => {
    const reviewsRef = collection(db, 'reviews');
    const q = query(reviewsRef, where('userId', '==', userId), orderBy('timestamp', 'desc'));
  
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedReviews = [];
      snapshot.forEach((doc) => {
        fetchedReviews.push({ id: doc.id, ...doc.data() });
      });
      setReviews(fetchedReviews);
      setRefreshing(false);
  
      // Update the reviewsCount in the userData state
      setUserData((prevUserData) => ({
        ...prevUserData,
        reviewsCount: fetchedReviews.length, // Update the reviews count
      }));
    });
  
    return () => unsubscribe();
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    const currentUserUid = auth.currentUser?.uid;
    if (currentUserUid) {
      fetchReviews(currentUserUid);
    }
  }, []);

// Profile Header component

return (
  <View style={styles.container}>
    {/* Profile Header */}
    <View style={styles.headerContainer}>
      <Image
        source={{ uri: userData.profileImageUrl }}
        style={styles.profileImage}
      />
      <Text style={[styles.username, { color: colors.text }]}>{userData.username}</Text>
      <View style={styles.statsContainer}>
        <Text style={[styles.stat, { color: colors.text }]}>{userData.reviewsCount} Reviews</Text>
        <Text style={[styles.stat, { color: colors.text }]}>{userData.followersCount} Followers</Text>
        <Text style={[styles.stat, { color: colors.text }]}>{userData.followingCount} Following</Text>
      </View>
      <Text style={[styles.bio, { color: colors.secondaryText }]}>{userData.bio}</Text>
    </View>

    {/* Reviews Feed */}
    <FlatList
      data={reviews}
      renderItem={({ item }) => <ReviewItem review={item} />}
      keyExtractor={(item) => item.id}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      style={styles.reviewsFeed}
    />
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
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
  reviewsFeed: {
    flex: 1,
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