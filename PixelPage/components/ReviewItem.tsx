import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ReviewItem = ({ reviewData, onLikePress, onCommentPress }) => {
  const { username, reviewCount, followerCount, rating, reviewText, likeCount, commentCount, profileImageUrl } = reviewData;

  // Generate stars for the rating
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Ionicons
        key={i}
        name={i <= rating ? "star" : "star-outline"}
        size={24}
        color={i <= rating ? "orange" : "grey"}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: profileImageUrl }} style={styles.profileImage} />
      <View style={styles.content}>
        <Text style={styles.username}>{username}</Text>
        <Text style={styles.reviewStats}>{`${reviewCount} reviews · ${followerCount} followers`}</Text>
        <View style={styles.stars}>{stars}</View>
        <Text style={styles.reviewText}>{reviewText}</Text>
        <View style={styles.socialRow}>
          <TouchableOpacity onPress={onLikePress} style={styles.socialButton}>
            <Ionicons name="heart-outline" size={24} color="black" />
            <Text style={styles.socialCount}>{likeCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onCommentPress} style={styles.socialButton}>
            <Ionicons name="chatbubble-outline" size={24} color="black" />
            <Text style={styles.socialCount}>{commentCount}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: 'white',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  content: {
    flex: 1,
    marginLeft: 10,
  },
  username: {
    fontWeight: 'bold',
  },
  reviewStats: {
    color: 'grey',
  },
  stars: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  reviewText: {
    fontSize: 14,
    color: 'black',
  },
  socialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  socialCount: {
    marginLeft: 4,
  },
});

export default ReviewItem;
