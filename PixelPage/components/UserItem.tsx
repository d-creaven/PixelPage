import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';

const UserItem = ({ username, profileImageUrl, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: profileImageUrl }} style={styles.image} />
      <Text style={styles.text}>{username}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderColor: '#e1e1e1',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  text: {
    fontSize: 18,
  },
});

export default UserItem;
