import React from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { View, Text } from './Themed';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

const UserItem = ({ username, profileImageUrl, onPress }: { username: string; profileImageUrl?: string; onPress: () => void }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <TouchableOpacity 
      style={[styles.container, { borderColor: colors.border }]} 
      onPress={onPress}
    >
      <Image 
        source={{ uri: profileImageUrl || 'https://via.placeholder.com/150' }} 
        style={styles.image} 
      />
      <Text style={[styles.text, { color: colors.text }]}>{username}</Text>
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
