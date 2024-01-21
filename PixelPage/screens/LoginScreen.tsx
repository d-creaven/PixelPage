import { ActivityIndicator, Button, KeyboardAvoidingView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Text, View } from '../components/Themed';
import { RootStackScreenProps } from '../types';
import { useState } from 'react';
import { FIREBASE_AUTH } from '../FireBaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginScreen({ navigation }: RootStackScreenProps<'Login'>) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
    }catch (error: any) {
      alert("Invalid email or password" + error.message)
    }finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    setIsLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      alert("User created successfully, check email!");
    }catch (error: any) {
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
