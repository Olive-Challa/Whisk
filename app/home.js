// app/home.js
// Home screen for Whisk. Acts as a simple hub with navigation
// to the camera and (in the future) other core features.

import React from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      style={[styles.background, { backgroundColor: "#F6F1F1" }]} // pastel fallback
      resizeMode="cover"
    >
      <SafeAreaView style={styles.overlay}>
        {/* Logo and welcome text */}
        <Image source={require("../assets/whisk-logo.jpg")} style={styles.logo} />
        <Text style={styles.title}>Welcome to Whisk</Text>
        <Text style={styles.subtitle}>Your smart animal companion 🐾</Text>

        {/* Navigation: open camera */}
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => router.push("/camera")}
        >
          <Text style={styles.buttonText}>Open Camera</Text>
        </TouchableOpacity>

        {/* Placeholder for About section */}
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => alert("About Whisk coming soon!")}
        >
          <Text style={styles.buttonTextAlt}>About Whisk</Text>
        </TouchableOpacity>

        {/* Placeholder for Settings */}
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => alert("Settings coming soon!")}
        >
          <Text style={styles.buttonTextAlt}>Settings</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 25,
    padding: 30,
    width: "85%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#7C83FD",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 30,
  },
  button: {
    width: "100%",
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 15,
  },
  primaryButton: {
    backgroundColor: "#A3C4F3",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#A3C4F3",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  buttonTextAlt: {
    color: "#7C83FD",
    fontSize: 16,
    fontWeight: "500",
  },
});
