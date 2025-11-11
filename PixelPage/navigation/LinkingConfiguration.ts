/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';

import { RootStackParamList } from '../types';

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      Root: {
        screens: {
          Feed: 'feed',
          Search: 'search',
          'My Books': 'my-books',
          Profile: 'profile',
            },
          },
      Login: 'login',
      Modal: 'modal',
      BookDetails: 'book/:bookId',
      EditProfile: 'edit-profile',
      GivenUserProfile: 'user/:userId',
      'Create Review': 'create-review',
      NotFound: '*',
    },
  },
};

export default linking;
