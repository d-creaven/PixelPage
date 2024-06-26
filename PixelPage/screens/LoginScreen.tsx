import { ActivityIndicator, Button, KeyboardAvoidingView, LogBox, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Text, View } from '../components/Themed';
import { RootStackScreenProps } from '../types';
import { useState } from 'react';
import { auth } from '../FirebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore'; 
import { db } from '../FirebaseConfig';

LogBox.ignoreAllLogs();

export default function LoginScreen({ navigation }: RootStackScreenProps<'Login'>) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Create a user profile document in Firestore with default values
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        username: 'New User', // Default username
        reviewsCount: 0, // Default reviews count
        followers: [], 
        following: [],
        followersCount: 0, // Default followers count
        followingCount: 0, // Default following count
        bio: 'No bio provided.', // Default bio
      });
      alert("User created successfully, check email!");
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        alert("Invalid email or password " + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
    }catch (error: any) {
      console.log(error);
      alert("Invalid email or password" + error.message)
    }finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* <KeyboardAvoidingView behavior="padding"> */}
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      {isLoading ? (
        <ActivityIndicator size={'large'} color={'blue'} />
      ) : (
        <>
          <TouchableOpacity onPress={handleLogin}>
            <Text style={styles.input}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSignUp}>
            <Text style={styles.input}>Sign Up</Text>
          </TouchableOpacity>
        </>
      )}
      {/* </KeyboardAvoidingView> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
});