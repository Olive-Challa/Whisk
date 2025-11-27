import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
  if (!email || !password) {
    Alert.alert("Missing info", "Please enter both email and password");
    return;
  }

  // Simple placeholder login
  if (email === "test@test.com" && password === "1234") {
    router.push("/home");
  } else {
    Alert.alert("Login failed", "Invalid credentials");
  }
};


  return (
    <ImageBackground
    style={[styles.background, { backgroundColor: "#F8F3FF" }]} // 
      
    >
      <View style={styles.overlay}>
        <Image
          source={require("../assets/whisk-logo.jpg")}
          style={styles.logo}
        />
        <Text style={styles.title}>Whisk</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#B0AEBF"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#B0AEBF"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>New to Whisk? Sign up here</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    backgroundColor: "rgba(255,255,255,0.8)",
    padding: 25,
    borderRadius: 25,
    alignItems: "center",
    width: "85%",
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 15,
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
    color: "#7C83FD",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#F4F3FF",
    borderRadius: 15,
    paddingHorizontal: 15,
    color: "#333",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#A3C4F3",
    paddingVertical: 14,
    borderRadius: 15,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#A3C4F3",
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 18,
  },
  footer: {
    color: "#888",
    fontSize: 14,
    marginTop: 20,
  },
});
