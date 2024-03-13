import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Pressable, FlatList } from 'react-native';
import { auth, db } from '../FirebaseConfig';
import { arrayRemove, arrayUnion, collection, doc, increment, onSnapshot, query, where, writeBatch } from 'firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ReviewItem from '../components/ReviewItem';

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

  const [userReviews, setUserReviews] = useState([]);
  const [following, setFollowing] = useState(false);
  const { userId } = route.params;

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'users', userId), (document) => {
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

        navigation.setOptions({ headerTitle: data.username || 'Profile' });
        const isFollowing = data.followers?.includes(auth.currentUser?.uid);
        setFollowing(isFollowing);
      }
    });

    return () => unsubscribe();
  }, [userId, navigation]);

  useEffect(() => {
    if (userId) {
      const reviewsRef = collection(db, 'reviews');
      const reviewsQuery = query(reviewsRef, where('userId', '==', userId));

      const unsubscribeReviews = onSnapshot(reviewsQuery, (querySnapshot) => {
        const reviews = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUserReviews(reviews);
        setUserData((prevUserData) => ({
          ...prevUserData,
          reviewsCount: reviews.length,
        }));
      });

      return () => unsubscribeReviews();
    }
  }, [userId]);

  const handleFollowPress = async () => {
    const currentUserUid = auth.currentUser?.uid;
    const profileUserUid = userId;

    const currentUserRef = doc(db, 'users', currentUserUid);
    const profileUserRef = doc(db, 'users', profileUserUid);

    try {
      const batch = writeBatch(db);

      if (following) {
        batch.update(currentUserRef, {
          following: arrayRemove(profileUserUid),
          followingCount: increment(-1)
        });
        batch.update(profileUserRef, {
          followers: arrayRemove(currentUserUid),
          followersCount: increment(-1)
        });
        setFollowing(false);
      } else {
        batch.update(currentUserRef, {
          following: arrayUnion(profileUserUid),
          followingCount: increment(1)
        });
        batch.update(profileUserRef, {
          followers: arrayUnion(currentUserUid),
          followersCount: increment(1)
        });
        setFollowing(true);
      }

      await batch.commit();
    } catch (error) {
      console.error("Error updating follow status: ", error);
    }
  };

  const renderReviewItem = ({ item }) => (
    <View style={styles.reviewItem}>
      <Text>{item.title}</Text>
      {/* Render additional review details here */}
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Image source={{ uri: userData.profileImageUrl }} style={styles.profileImage} />
      <Text style={styles.username}>{userData.username}</Text>
      <View style={styles.statsContainer}>
        <Text style={styles.stat}>{userData.reviewsCount} Reviews</Text>
        <Text style={styles.stat}>{userData.followersCount} Followers</Text>
        <Text style={styles.stat}>{userData.followingCount} Following</Text>
      </View>
      <Text style={styles.bio}>{userData.bio}</Text>
      <Pressable
        style={[styles.button, following ? { backgroundColor: 'lightgray' } : { backgroundColor: '#47AA71' }]}
        onPress={handleFollowPress}
      >
        <Text style={styles.buttonText}>{following ? 'Following' : 'Follow'}</Text>
      </Pressable>
    </View>
  );

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

export default GivenUserProfileScreen;