import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";

export default function Dashboard() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Welcome back to Whisk </Text>

      {/* Pet Summary Card info about pet biodata name age breed existing vacc info*/} 
      <View style={styles.card}>
        <Image
          source={require("../assets/whisk-logo.jpg")}
          style={styles.petImage}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>Last Detected Pet</Text>
          <Text style={styles.cardSubtitle}>Dog • 2 days ago</Text>
        </View>
      </View>

      {/* Quick Actions  quick help page no idea waht to put yet*/}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#A3C4F3" }]}
          onPress={() => router.push("/camera")}
        >
          <Text style={styles.buttonText}> Open Camera</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#B5EAD7" }]}
          onPress={() => alert("HOLUPPP UPDATES ON THE WAY!")}
        >
          <Text style={styles.buttonText}> View Pets</Text>
        </TouchableOpacity>
      </View>

      {/* Health Tracker */}
      <Text style={styles.sectionTitle}>Health & Care</Text>
      <View style={styles.healthCard}>
        <Text style={styles.healthTitle}>Vaccinations up-to-date </Text>
        <Text style={styles.healthSubtext}>Next vet visit: Nov 12, 2025</Text>
      </View>

      {/* Detection History contains logs of all the animals you scanned */}
      <Text style={styles.sectionTitle}>Recent Activity</Text>
      <View style={styles.historyCard}>
        <Text style={styles.historyText}> Dog detected — Oct 28, 2025</Text>
        <Text style={styles.historyText}> Cat detected — Oct 24, 2025</Text>
        <Text style={styles.historyText}> New pet profile created — Oct 20, 2025</Text>
      </View>

      {/* Footer Navigation  other options*/}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => router.push("/home")}>
          <Text style={styles.footerText}> Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/camera")}>
          <Text style={styles.footerText}> Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => alert("Settings coming soon!")}>
          <Text style={styles.footerText}> Settings</Text>
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
    color: "#777",
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
  healthCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    width: "100%",
    marginBottom: 20,
    shadowColor: "#B5EAD7",
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  healthTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
  },
  healthSubtext: {
    color: "#777",
    marginTop: 5,
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
