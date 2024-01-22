import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';

export default function ProfileScreen() {
  
  const userData = {
    username: 'Username',
    reviewsCount: 11,
    followersCount: 15,
    followingCount: 21,
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent a velit ornare, viverra erat in, mollis odio. Aenean quis erat congue, finibus ante nec, rutrum nisl.',
  };

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
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>
      
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