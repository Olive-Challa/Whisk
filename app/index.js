// app/index.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: '718169065254-r9ipjqiu10778lvj6o0s9di7cvmi7s5k.apps.googleusercontent.com',
    webClientId: '718169065254-b1k3k1tab2gnk76igkor1t3j0h1hmliq.apps.googleusercontent.com',
  });

  // Check if user is already logged in
  useEffect(() => {
    checkLoginStatus();
  }, []);

  // Handle OAuth response
  useEffect(() => {
    handleSignInResponse();
  }, [response]);

  const checkLoginStatus = async () => {
    try {
      const userData = await AsyncStorage.getItem('userInfo');
      if (userData) {
        setUserInfo(JSON.parse(userData));
        router.replace('/home');
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  };

  const handleSignInResponse = async () => {
    if (response?.type === 'success') {
      const { authentication } = response;
      
      try {
        setLoading(true);
        
        // Get user info from Google
        const userInfoResponse = await fetch(
          'https://www.googleapis.com/userinfo/v2/me',
          {
            headers: { Authorization: `Bearer ${authentication.accessToken}` },
          }
        );
        
        const user = await userInfoResponse.json();
        
        // Save user info
        await AsyncStorage.setItem('userInfo', JSON.stringify(user));
        setUserInfo(user);
        
        console.log('Signed in as:', user.email);
        router.replace('/home');
      } catch (error) {
        console.error('Error fetching user info:', error);
        Alert.alert('Error', 'Failed to get user information');
      } finally {
        setLoading(false);
      }
    } else if (response?.type === 'error') {
      Alert.alert('Error', 'Authentication failed. Please try again.');
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      await promptAsync();
    } catch (error) {
      console.error('Sign in error:', error);
      Alert.alert('Error', 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const skipLogin = () => {
    router.replace('/home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../assets/whisk-logo.jpg')}
          style={styles.logo}
        />
        
        <Text style={styles.title}>Welcome to Whisk</Text>
        <Text style={styles.subtitle}>AI-powered pet care assistant</Text>

        <View style={styles.features}>
          <View style={styles.feature}>
            <MaterialIcons name="pets" size={24} color="#7C83FD" />
            <Text style={styles.featureText}>Breed detection</Text>
          </View>
          <View style={styles.feature}>
            <MaterialIcons name="local-hospital" size={24} color="#7C83FD" />
            <Text style={styles.featureText}>Find nearby vets</Text>
          </View>
          <View style={styles.feature}>
            <MaterialIcons name="favorite" size={24} color="#7C83FD" />
            <Text style={styles.featureText}>Pet health tracking</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.googleButton}
          onPress={signInWithGoogle}
          disabled={loading || !request}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <MaterialIcons name="login" size={24} color="#fff" />
              <Text style={styles.googleButtonText}>Sign in with Google</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={skipLogin}
        >
          <Text style={styles.skipButtonText}>Continue without sign in</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          By signing in, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F3FF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#7C83FD',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  features: {
    width: '100%',
    marginBottom: 40,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  featureText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7C83FD',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    gap: 12,
  },
  googleButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  skipButton: {
    marginTop: 16,
    paddingVertical: 12,
  },
  skipButtonText: {
    color: '#7C83FD',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  disclaimer: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 40,
  },
});