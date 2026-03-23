// app/manual-breed.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import { getBreedInfoManual } from "../utils/breedApi";

export default function ManualBreedScreen() {
  const router = useRouter();
  const [animalType, setAnimalType] = useState(""); // "dog" or "cat"
  const [breedName, setBreedName] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [activityLevel, setActivityLevel] = useState(""); // "low", "moderate", "high"
  const [healthIssues, setHealthIssues] = useState("");
  const [photoUri, setPhotoUri] = useState(null);
  const [loading, setLoading] = useState(false);

  async function pickImage() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permission needed", "Please grant photo library access");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  }

  async function takePhoto() {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permission needed", "Please grant camera access");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  }

  async function handleSubmit() {
    // Validate required fields
    if (!animalType) {
      Alert.alert("Missing info", "Please select Dog or Cat");
      return;
    }

    if (!photoUri) {
      Alert.alert("Missing info", "Please add a photo of your pet");
      return;
    }

    // Breed name is optional - if they don't know, AI will try to identify
    const finalBreedName = breedName.trim() || "Unknown breed - please identify";

    setLoading(true);

    try {
      // Convert image to base64
      const cleanUri = photoUri.startsWith("file://") ? photoUri : `file://${photoUri}`;
      const base64 = await FileSystem.readAsStringAsync(cleanUri, { encoding: "base64" });

      // Create personalized context
      const personalizedInfo = {
        breed: finalBreedName,
        animal: animalType,
        age: age || "Not provided",
        weight: weight || "Not provided",
        activityLevel: activityLevel || "moderate",
        healthIssues: healthIssues || "None reported",
      };

      // Get personalized breed info from API
      const result = await getBreedInfoManual(
        personalizedInfo.breed,
        personalizedInfo.animal,
        base64,
        personalizedInfo
      );

      if (result.error) {
        Alert.alert("Error", result.error);
      } else {
        // Navigate to results with the personalized data
        router.push({
          pathname: "/results",
          params: {
            imageUri: photoUri,
            breedData: JSON.stringify(result),
          },
        });
      }
    } catch (error) {
      Alert.alert("Error", "Failed to get breed information. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#7C83FD" />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.title}>Pet Profile</Text>
            <Text style={styles.subtitle}>Tell us about your pet</Text>
          </View>
        </View>

        {/* Animal Type Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>What type of pet? *</Text>
          <View style={styles.animalButtons}>
            <TouchableOpacity
              style={[
                styles.animalButton,
                animalType === "dog" && styles.animalButtonActive,
              ]}
              onPress={() => setAnimalType("dog")}
            >
              <Text style={styles.animalIcon}>🐕</Text>
              <Text
                style={[
                  styles.animalText,
                  animalType === "dog" && styles.animalTextActive,
                ]}
              >
                Dog
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.animalButton,
                animalType === "cat" && styles.animalButtonActive,
              ]}
              onPress={() => setAnimalType("cat")}
            >
              <Text style={styles.animalIcon}>🐱</Text>
              <Text
                style={[
                  styles.animalText,
                  animalType === "cat" && styles.animalTextActive,
                ]}
              >
                Cat
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Breed Name Input */}
        <View style={styles.section}>
          <Text style={styles.label}>Breed (if known)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Golden Retriever, Persian (or leave blank)"
            placeholderTextColor="#999"
            value={breedName}
            onChangeText={setBreedName}
            autoCapitalize="words"
          />
          <Text style={styles.hint}>💡 Leave blank if you're not sure - AI will identify it</Text>
        </View>

        {/* Age Input */}
        <View style={styles.section}>
          <Text style={styles.label}>Age (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 2 years, 6 months"
            placeholderTextColor="#999"
            value={age}
            onChangeText={setAge}
          />
        </View>

        {/* Weight Input */}
        <View style={styles.section}>
          <Text style={styles.label}>Weight (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 25 lbs, 5 kg"
            placeholderTextColor="#999"
            value={weight}
            onChangeText={setWeight}
          />
        </View>

        {/* Activity Level */}
        <View style={styles.section}>
          <Text style={styles.label}>Activity Level (optional)</Text>
          <View style={styles.activityButtons}>
            <TouchableOpacity
              style={[
                styles.activityButton,
                activityLevel === "low" && styles.activityButtonActive,
              ]}
              onPress={() => setActivityLevel("low")}
            >
              <MaterialIcons 
                name="chair" 
                size={20} 
                color={activityLevel === "low" ? "#fff" : "#7C83FD"} 
              />
              <Text
                style={[
                  styles.activityText,
                  activityLevel === "low" && styles.activityTextActive,
                ]}
              >
                Low
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.activityButton,
                activityLevel === "moderate" && styles.activityButtonActive,
              ]}
              onPress={() => setActivityLevel("moderate")}
            >
              <MaterialIcons 
                name="directions-walk" 
                size={20} 
                color={activityLevel === "moderate" ? "#fff" : "#7C83FD"} 
              />
              <Text
                style={[
                  styles.activityText,
                  activityLevel === "moderate" && styles.activityTextActive,
                ]}
              >
                Moderate
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.activityButton,
                activityLevel === "high" && styles.activityButtonActive,
              ]}
              onPress={() => setActivityLevel("high")}
            >
              <MaterialIcons 
                name="directions-run" 
                size={20} 
                color={activityLevel === "high" ? "#fff" : "#7C83FD"} 
              />
              <Text
                style={[
                  styles.activityText,
                  activityLevel === "high" && styles.activityTextActive,
                ]}
              >
                High
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Health Issues */}
        <View style={styles.section}>
          <Text style={styles.label}>Any health concerns? (optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="e.g., allergies, joint issues, sensitive stomach"
            placeholderTextColor="#999"
            value={healthIssues}
            onChangeText={setHealthIssues}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Photo Upload */}
        <View style={styles.section}>
          <Text style={styles.label}>Pet Photo *</Text>
          {photoUri ? (
            <View style={styles.photoPreview}>
              <Image source={{ uri: photoUri }} style={styles.photoImage} />
              <TouchableOpacity
                style={styles.removePhotoButton}
                onPress={() => setPhotoUri(null)}
              >
                <MaterialIcons name="close" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.photoButtons}>
              <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
                <MaterialIcons name="camera-alt" size={28} color="#7C83FD" />
                <Text style={styles.photoButtonText}>Take Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
                <MaterialIcons name="photo-library" size={28} color="#7C83FD" />
                <Text style={styles.photoButtonText}>Choose Photo</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <>
              <ActivityIndicator color="#fff" />
              <Text style={styles.submitButtonText}>Getting personalized care plan...</Text>
            </>
          ) : (
            <>
              <MaterialIcons name="pets" size={24} color="#fff" />
              <Text style={styles.submitButtonText}>Get Personalized Care Plan</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F3FF",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  backButton: {
    marginRight: 15,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#7C83FD",
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    marginTop: 4,
  },
  section: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  hint: {
    fontSize: 13,
    color: "#7C83FD",
    marginTop: 8,
  },
  animalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  animalButton: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#E0D7FF",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
  },
  animalButtonActive: {
    backgroundColor: "#A3C4F3",
    borderColor: "#A3C4F3",
  },
  animalIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  animalText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#7C83FD",
  },
  animalTextActive: {
    color: "#fff",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#E0D7FF",
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: "#333",
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  activityButtons: {
    flexDirection: "row",
    gap: 10,
  },
  activityButton: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#E0D7FF",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    gap: 6,
  },
  activityButtonActive: {
    backgroundColor: "#A3C4F3",
    borderColor: "#A3C4F3",
  },
  activityText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#7C83FD",
  },
  activityTextActive: {
    color: "#fff",
  },
  photoButtons: {
    flexDirection: "row",
    gap: 12,
  },
  photoButton: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#E0D7FF",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    gap: 8,
  },
  photoButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7C83FD",
  },
  photoPreview: {
    position: "relative",
  },
  photoImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
  removePhotoButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#ef4444",
    borderRadius: 20,
    padding: 6,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#A3C4F3",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 10,
    marginTop: 10,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});