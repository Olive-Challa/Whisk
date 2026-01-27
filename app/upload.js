import React, { useState } from "react";
import { View, Text, Button, Image, ScrollView, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { detectBreedFromPhoto } from "../utils/breedApi";

export default function UploadScreen() {
  const [photoUri, setPhotoUri] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function pickImage() {
    setResult(null);

    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      setResult({ ok: false, message: "Permission denied for photo library" });
      return;
    }

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (res.canceled) return;

    const uri = res.assets?.[0]?.uri;
    setPhotoUri(uri || null);
  }

  async function takePhoto() {
    setResult(null);

    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      setResult({ ok: false, message: "Permission denied for camera" });
      return;
    }

    const res = await ImagePicker.launchCameraAsync({
      quality: 0.7,
    });

    if (res.canceled) return;

    const uri = res.assets?.[0]?.uri;
    setPhotoUri(uri || null);
  }

  async function analyze() {
    if (!photoUri) {
      setResult({ ok: false, message: "Pick or take a photo first" });
      return;
    }

    setLoading(true);
    setResult(null);

    const out = await detectBreedFromPhoto(photoUri);

    setResult(out);
    setLoading(false);
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>Breed Detector</Text>

      <View style={{ gap: 10 }}>
        <Button title="Pick Image" onPress={pickImage} />
        <Button title="Take Photo" onPress={takePhoto} />
        <Button title="Analyze Breed" onPress={analyze} />
      </View>

      {loading ? <ActivityIndicator size="large" /> : null}

      {photoUri ? (
        <Image
          source={{ uri: photoUri }}
          style={{ width: "100%", height: 260, borderRadius: 12 }}
          resizeMode="cover"
        />
      ) : (
        <Text style={{ color: "#666" }}>No photo selected yet.</Text>
      )}

      {result ? (
        <View style={{ padding: 12, borderWidth: 1, borderRadius: 12 }}>
          <Text style={{ fontWeight: "700" }}>
            {result.ok ? "Result" : "Error"}
          </Text>

          {result.ok ? (
            <>
              <Text>Species: {result.species}</Text>
              <Text>Photo quality: {result.photoQuality}</Text>
              <Text>Mixed possible: {String(result.isMixedPossible)}</Text>

              <Text style={{ marginTop: 8, fontWeight: "700" }}>Top Breeds:</Text>
              {(result.topBreeds || []).map((b, idx) => (
                <Text key={idx}>
                  • {b.breed} ({Math.round((b.confidence || 0) * 100)}%)
                </Text>
              ))}

              {result.notes ? (
                <Text style={{ marginTop: 8 }}>Notes: {result.notes}</Text>
              ) : null}

              {result.whatToTryNext ? (
                <Text style={{ marginTop: 8 }}>
                  Try next: {result.whatToTryNext}
                </Text>
              ) : null}
            </>
          ) : (
            <>
              <Text>{result.message}</Text>
              {result.hint ? <Text style={{ marginTop: 8 }}>Hint: {result.hint}</Text> : null}
              {result.detail ? <Text style={{ marginTop: 8 }}>Detail: {result.detail}</Text> : null}
            </>
          )}
        </View>
      ) : null}
    </ScrollView>
  );
}
