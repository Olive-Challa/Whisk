// app/home.js
import React from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  View,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import Header from "../components/Header";

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="Home" showMenu={true} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ImageBackground
          style={[styles.background, { backgroundColor: theme.background }]}
          resizeMode="cover"
        >
          <View style={[styles.overlay, { backgroundColor: theme.card }]}>
            {/* Logo and welcome text */}
            <Image
              source={require("../assets/whisk-logo.jpg")}
              style={styles.logo}
            />
            <Text style={[styles.title, { color: theme.primary }]}>Welcome to Whisk</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Your smart animal companion 🐾</Text>

            {/* Main Features */}
            <View style={styles.mainActions}>
              {/* Upload Pet Photo - Primary Action */}
              <TouchableOpacity
                style={[styles.button, styles.primaryButton, { backgroundColor: theme.primary }]}
                onPress={() => router.push("/upload")}
              >
                <MaterialIcons name="pets" size={32} color="#fff" />
                <View style={styles.buttonContent}>
                  <Text style={styles.buttonTitle}>Breed Detector</Text>
                  <Text style={styles.buttonSubtitle}>Identify your pet's breed</Text>
                </View>
              </TouchableOpacity>

              {/* My Pets */}
              <TouchableOpacity
                style={[styles.button, styles.featureButton, { 
                  backgroundColor: theme.primaryLight, 
                  borderColor: theme.border 
                }]}
                onPress={() => router.push("/my_pets")}
              >
                <MaterialIcons name="favorite" size={28} color={theme.primary} />
                <Text style={[styles.featureButtonText, { color: theme.primary }]}>My Pets</Text>
              </TouchableOpacity>

              {/* Vet Locator */}
              <TouchableOpacity
                style={[styles.button, styles.featureButton, { 
                  backgroundColor: theme.primaryLight, 
                  borderColor: theme.border 
                }]}
                onPress={() => router.push("/vet_locator")}
              >
                <MaterialIcons name="local-hospital" size={28} color="#ef4444" />
                <Text style={[styles.featureButtonText, { color: theme.text }]}>Find Nearby Vets</Text>
              </TouchableOpacity>
            </View>

            {/* Secondary Actions */}
            <View style={styles.secondaryActions}>
              <TouchableOpacity
                style={[styles.secondaryButton, { borderColor: theme.border }]}
                onPress={() => router.push("/about")}
              >
                <MaterialIcons name="info-outline" size={22} color={theme.primary} />
                <Text style={[styles.secondaryButtonText, { color: theme.primary }]}>About</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.secondaryButton, { borderColor: theme.border }]}
                onPress={() => router.push("/settings")}
              >
                <MaterialIcons name="settings" size={22} color={theme.primary} />
                <Text style={[styles.secondaryButtonText, { color: theme.primary }]}>Settings</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  overlay: {
    borderRadius: 25,
    padding: 30,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 15,
    borderRadius: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 35,
    textAlign: "center",
  },
  mainActions: {
    width: "100%",
    gap: 15,
    marginBottom: 25,
  },
  button: {
    width: "100%",
    borderRadius: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  primaryButton: {
    flexDirection: "row",
    paddingVertical: 20,
    paddingHorizontal: 20,
    gap: 15,
  },
  buttonContent: {
    flex: 1,
    alignItems: "flex-start",
  },
  buttonTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  buttonSubtitle: {
    color: "#fff",
    fontSize: 14,
    opacity: 0.9,
  },
  featureButton: {
    flexDirection: "row",
    paddingVertical: 18,
    paddingHorizontal: 20,
    gap: 12,
    borderWidth: 1.5,
  },
  featureButtonText: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    textAlign: "left",
  },
  secondaryActions: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
    marginTop: 10,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    borderWidth: 1.5,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
});