// app/dashboard.js
// Dashboard view for Whisk.
// Displays detection history saved via AsyncStorage (utils/storage.js).
// Designed to support AI-based breed detection with graceful fallback
// for mixed or unknown breeds.

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { getDetectedPets } from "../utils/storage";

export default function Dashboard() {
  const router = useRouter();
  const [detectedPets, setDetectedPets] = useState([]);

  // Reload detection history whenever dashboard opens
  useEffect(() => {
    const loadPets = async () => {
      const pets = await getDetectedPets();
      setDetectedPets(pets);
    };

    loadPets();
  }, []);

  const lastPet = detectedPets.length > 0 ? detectedPets[0] : null;

  const formatDate = (iso) => {
    if (!iso) return "";
    return new Date(iso).toLocaleString();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Welcome back to Whisk 🐾</Text>

      {/* Last Detected Pet */}
      <View style={styles.card}>
        <Image
          source={require("../assets/whisk-logo.jpg")}
          style={styles.petImage}
        />

        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>Last Detected Pet</Text>

          {lastPet ? (
            <>
              <Text style={styles.cardSubtitle}>
                {lastPet.species.toUpperCase()} •{" "}
                {Math.round(lastPet.confidence * 100)}% confidence
              </Text>

              <Text style={styles.breedText}>
                Breed:{" "}
                {lastPet.breedGuess && lastPet.breedGuess !== "Unknown"
                  ? lastPet.breedGuess
                  : "Mixed / Unknown"}
              </Text>

              <Text style={styles.timeText}>
                {formatDate(lastPet.detectedAt)}
              </Text>
            </>
          ) : (
            <Text style={styles.cardSubtitle}>
              No detections yet — try uploading a photo!
            </Text>
          )}
        </View>
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#A3C4F3" }]}
          onPress={() => router.push("/upload")}
        >
          <Text style={styles.buttonText}>📸 Upload Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#B5EAD7" }]}
          onPress={() =>
            alert(
              "If we can’t identify a specific breed, Whisk provides guidance for mixed-breed pets."
            )
          }
        >
          <Text style={styles.buttonText}>🐕 Breed Help</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Activity */}
      <Text style={styles.sectionTitle}>Recent Activity</Text>
      <View style={styles.historyCard}>
        {detectedPets.length === 0 ? (
          <Text style={styles.historyText}>
            No activity yet — upload your first pet 🐾
          </Text>
        ) : (
          detectedPets.slice(0, 5).map((pet, index) => (
            <Text key={index} style={styles.historyText}>
              🐾 {pet.species} •{" "}
              {pet.breedGuess && pet.breedGuess !== "Unknown"
                ? pet.breedGuess
                : "Mixed / Unknown"}{" "}
              • {Math.round(pet.confidence * 100)}%
            </Text>
          ))
        )}
      </View>

      {/* Footer Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => router.push("/home")}>
          <Text style={styles.footerText}>🏠 Home</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/upload")}>
          <Text style={styles.footerText}>📷 Upload</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => alert("Settings coming soon!")}>
          <Text style={styles.footerText}>⚙️ Settings</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F8F3FF",
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: "700",
    color: "#7C83FD",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#FFF",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    padding: 15,
    width: "100%",
    marginBottom: 20,
    shadowColor: "#A3C4F3",
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  petImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#444",
  },
  cardSubtitle: {
    color: "#555",
    marginTop: 4,
  },
  breedText: {
    marginTop: 4,
    color: "#7C83FD",
    fontWeight: "600",
  },
  timeText: {
    marginTop: 2,
    fontSize: 12,
    color: "#999",
  },
  sectionTitle: {
    alignSelf: "flex-start",
    fontSize: 18,
    fontWeight: "600",
    color: "#7C83FD",
    marginTop: 10,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "600",
  },
  historyCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    width: "100%",
    shadowColor: "#A3C4F3",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    marginBottom: 60,
  },
  historyText: {
    fontSize: 15,
    color: "#555",
    marginBottom: 6,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#DDD",
  },
  footerText: {
    fontSize: 16,
    color: "#7C83FD",
  },
});
