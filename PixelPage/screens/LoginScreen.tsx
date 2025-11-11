import { ActivityIndicator, Button, KeyboardAvoidingView, LogBox, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Text, View } from '../components/Themed';
import { RootStackScreenProps } from '../types';
import { useState } from 'react';
import { auth } from '../FirebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore'; 
import { db } from '../FirebaseConfig';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

LogBox.ignoreAllLogs();

export default function LoginScreen({ navigation }: RootStackScreenProps<'Login'>) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  // Validate email format
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate password strength (minimum 6 characters as per Firebase requirement)
  const isValidPassword = (password: string): boolean => {
    return password.length >= 6;
  };

  // Get user-friendly error message without exposing sensitive details
  const getErrorMessage = (error: any): string => {
    const errorCode = error?.code || '';
    
    // Map Firebase error codes to user-friendly messages
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'This email is already registered. Please sign in instead.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/operation-not-allowed':
        return 'This operation is not allowed. Please contact support.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact support.';
      case 'auth/user-not-found':
        return 'No account found with this email. Please sign up first.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection and try again.';
      default:
        return 'An error occurred. Please try again.';
    }
  };

  const handleSignUp = async () => {
    // Client-side validation
    if (!email.trim()) {
      alert('Please enter your email address.');
      return;
    }
    
    if (!isValidEmail(email)) {
      alert('Please enter a valid email address.');
      return;
    }
    
    if (!password.trim()) {
      alert('Please enter a password.');
      return;
    }
    
    if (!isValidPassword(password)) {
      alert('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
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
      alert("Account created successfully! Please check your email for verification.");
    } catch (error) {
      // Log full error for debugging (remove in production or use proper logging)
      console.error('Sign up error:', error);
      // Show user-friendly error message
      alert(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    // Client-side validation
    if (!email.trim()) {
      alert('Please enter your email address.');
      return;
    }
    
    if (!isValidEmail(email)) {
      alert('Please enter a valid email address.');
      return;
    }
    
    if (!password.trim()) {
      alert('Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      // Navigation will happen automatically via auth state listener
    } catch (error: any) {
      // Log full error for debugging (remove in production or use proper logging)
      console.error('Login error:', error);
      // Show user-friendly error message
      alert(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* <KeyboardAvoidingView behavior="padding"> */}
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={[styles.input, { 
          borderColor: colors.border, 
          color: colors.text,
          backgroundColor: colors.cardBackground 
        }]}
        placeholder="Email"
        placeholderTextColor={colors.placeholder}
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
      />
      <TextInput
        style={[styles.input, { 
          borderColor: colors.border, 
          color: colors.text,
          backgroundColor: colors.cardBackground 
        }]}
        placeholder="Password"
        placeholderTextColor={colors.placeholder}
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      {isLoading ? (
        <ActivityIndicator size={'large'} color={colors.tint} />
      ) : (
        <>
          <TouchableOpacity onPress={handleLogin} style={[styles.button, { backgroundColor: colors.tint }]}>
            <Text style={[styles.buttonText, { color: 'white' }]}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSignUp} style={[styles.button, { backgroundColor: colors.tint }]}>
            <Text style={[styles.buttonText, { color: 'white' }]}>Sign Up</Text>
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
    borderRadius: 5,
  },
  button: {
    width: '100%',
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});