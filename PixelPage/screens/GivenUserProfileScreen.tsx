import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Pressable, FlatList, RefreshControl } from 'react-native';
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
  const [reviews, setReviews] = useState([]);
  const [following, setFollowing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { userId } = route.params;

  useEffect(() => {
    if (userId) {
      const reviewsRef = collection(db, 'reviews');
      const reviewsQuery = query(reviewsRef, where('userId', '==', userId));

      const unsubscribeReviews = onSnapshot(reviewsQuery, (querySnapshot) => {
        const userReviewsCount = querySnapshot.size;
        setUserData((prevUserData) => ({
          ...prevUserData,
          reviewsCount: userReviewsCount, // Update the reviews count
        }));

        const reviewsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReviews(reviewsData);
        setRefreshing(false);
      });

      return () => unsubscribeReviews();
    }
  }, [userId]);

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

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 }}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

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

  const onRefresh = () => {
    setRefreshing(true);
    // Add any additional refresh logic here if necessary
  };


  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.headerContainer}>
        <Image source={{ uri: userData.profileImageUrl }} style={styles.profileImage} />
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
      <FlatList
        data={reviews}
        renderItem={({ item }) => <ReviewItem review={item} />}
        keyExtractor={item => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.flatListContentContainer}
      />
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