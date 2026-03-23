import React, { useState } from "react";
import { useTheme } from '../contexts/ThemeContext';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  ActivityIndicator,
  StyleSheet 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { detectBreedFromPhoto } from "../utils/breedApi";

export default function UploadScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [photoUri, setPhotoUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function pickImage() {
    setError(null);

    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      setError("Permission denied for photo library");
      return;
    }

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (res.canceled) return;

    const uri = res.assets?.[0]?.uri;
    if (uri) {
      setPhotoUri(uri);
      analyzePhoto(uri);
    }
  }

  async function takePhoto() {
    setError(null);

    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      setError("Permission denied for camera");
      return;
    }

    const res = await ImagePicker.launchCameraAsync({
      quality: 0.8,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (res.canceled) return;

    const uri = res.assets?.[0]?.uri;
    if (uri) {
      setPhotoUri(uri);
      analyzePhoto(uri);
    }
  }

  async function analyzePhoto(uri) {
    const imageUri = uri || photoUri;
    if (!imageUri) {
      setError("Please select a photo first");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await detectBreedFromPhoto(imageUri);
      
      if (result.error) {
        setError(result.error);
      } else {
        router.push({
          pathname: '/results',
          params: {
            imageUri: imageUri,
            breedData: JSON.stringify(result)
          }
        });
      }
    } catch (err) {
      setError("Failed to analyze image. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.primary }]}>Breed Detector</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Identify your pet's breed with AI</Text>
        </View>

        {/* Action Buttons */}
        {!photoUri && !loading && (
          <>
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.primaryButton, { backgroundColor: theme.primary }]} 
                onPress={takePhoto}
              >
                <MaterialIcons name="camera-alt" size={24} color="#fff" />
                <Text style={styles.buttonText}>Take Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.secondaryButton, { borderColor: theme.primary }]} 
                onPress={pickImage}
              >
                <MaterialIcons name="photo-library" size={24} color={theme.primary} />
                <Text style={[styles.secondaryButtonText, { color: theme.primary }]}>Choose from Gallery</Text>
              </TouchableOpacity>
            </View>

            {/* Manual Breed Entry Button */}
            <TouchableOpacity 
              style={[styles.manualButton, { borderColor: theme.border }]} 
              onPress={() => router.push('/manual-breed')}
            >
              <MaterialIcons name="edit" size={20} color={theme.primary} />
              <Text style={[styles.manualButtonText, { color: theme.primary }]}>Can't Find My Breed?</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Loading State */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={[styles.loadingText, { color: theme.primary }]}>Analyzing your pet...</Text>
            <Text style={[styles.loadingSubtext, { color: theme.textSecondary }]}>Getting comprehensive care info</Text>
          </View>
        )}

        {/* Error State */}
        {error && !loading && (
          <View style={[styles.errorContainer, { backgroundColor: theme.card }]}>
            <MaterialIcons name="error-outline" size={48} color="#ef4444" />
            <Text style={[styles.errorText, { color: theme.text }]}>{error}</Text>
            <TouchableOpacity 
              style={[styles.retryButton, { backgroundColor: theme.primary }]} 
              onPress={() => {
                setPhotoUri(null);
                setError(null);
              }}
            >
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  actionButtons: {
    gap: 12,
    marginBottom: 12,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 15,
    gap: 10,
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    borderWidth: 2,
    paddingVertical: 16,
    borderRadius: 15,
    gap: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: "600",
  },
  manualButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    borderWidth: 1.5,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    marginBottom: 20,
  },
  manualButtonText: {
    fontSize: 15,
    fontWeight: "500",
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "600",
  },
  loadingSubtext: {
    marginTop: 8,
    fontSize: 14,
  },
  errorContainer: {
    alignItems: "center",
    paddingVertical: 40,
    borderRadius: 15,
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 20,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});