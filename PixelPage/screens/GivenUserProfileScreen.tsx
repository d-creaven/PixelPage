import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, ScrollView, TouchableOpacity, Pressable, FlatList, RefreshControl } from 'react-native';
import { View, Text } from '../components/Themed';
import { auth, db } from '../FirebaseConfig';
import { arrayRemove, arrayUnion, collection, doc, increment, onSnapshot, orderBy, query, where, writeBatch } from 'firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ReviewItem from '../components/ReviewItem';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import { RootStackScreenProps } from '../types';
import { Review } from '../props/Review';

const GivenUserProfileScreen = ({ route, navigation }: RootStackScreenProps<'GivenUserProfile'>) => {
  const [userData, setUserData] = useState({
    username: 'Loading...',
    reviewsCount: 0,
    followers: [] as string[],
    following: [] as string[],
    followersCount: 0,
    followingCount: 0,
    bio: '',
    profileImageUrl: 'https://via.placeholder.com/150',
  });
  const [reviews, setReviews] = useState<Review[]>([]);
  const [following, setFollowing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const { userId } = route.params;

  useEffect(() => {
    if (userId) {
      const reviewsRef = collection(db, 'reviews');
      const reviewsQuery = query(reviewsRef, where('userId', '==', userId), orderBy('timestamp','desc'));

      const unsubscribeReviews = onSnapshot(reviewsQuery, (querySnapshot) => {
        const userReviewsCount = querySnapshot.size;
        setUserData((prevUserData) => ({
          ...prevUserData,
          reviewsCount: userReviewsCount, // Update the reviews count
        }));

        const reviewsData: Review[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as Review));
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
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, colors.text]);

  const handleFollowPress = async () => {
    if (!auth.currentUser) return;
    const currentUserUid = auth.currentUser.uid;
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
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerContainer}>
        <Image source={{ uri: userData.profileImageUrl }} style={styles.profileImage} />
        <Text style={[styles.username, { color: colors.text }]}>{userData.username}</Text>
        <View style={styles.statsContainer}>
          <Text style={[styles.stat, { color: colors.text }]}>{userData.reviewsCount} Reviews</Text>
          <Text style={[styles.stat, { color: colors.text }]}>{userData.followersCount} Followers</Text>
          <Text style={[styles.stat, { color: colors.text }]}>{userData.followingCount} Following</Text>
        </View>
        <Text style={[styles.bio, { color: colors.secondaryText }]}>{userData.bio}</Text>
        <Pressable
          style={[
            styles.button, 
            following 
              ? { backgroundColor: colors.border } 
              : { backgroundColor: colors.tint }
          ]}
          onPress={handleFollowPress}
        >
          <Text style={styles.buttonText}>{following ? 'Following' : 'Follow'}</Text>
        </Pressable>
      </View>
      <FlatList
        data={reviews}
        renderItem={({ item }: { item: Review }) => <ReviewItem review={item} />}
        keyExtractor={item => item.id || ''}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={{ backgroundColor: colors.background }}
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
    button: {
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