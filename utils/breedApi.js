// utils/breedApi.js
// Handles breed detection using TheDogAPI / TheCatAPI
// Expo Go compatible

const DOG_API_KEY = process.env.EXPO_PUBLIC_DOG_API_KEY;
const CAT_API_KEY = process.env.EXPO_PUBLIC_CAT_API_KEY;

export async function detectBreedFromPhoto(photoUri, species) {
  try {
    if (!photoUri) {
      return { ok: false, message: "No photo provided" };
    }

    if (species !== "dog" && species !== "cat") {
      return { ok: false, message: "Invalid species" };
    }

    const apiUrl =
      species === "dog"
        ? "https://api.thedogapi.com/v1/images/upload"
        : "https://api.thecatapi.com/v1/images/upload";

    const apiKey = species === "dog" ? DOG_API_KEY : CAT_API_KEY;

    if (!apiKey) {
      console.warn("⚠️ Missing API key for", species);
      return { ok: false, message: "API key missing" };
    }

    // iOS fix: remove file:// prefix if present
    const cleanUri =
      photoUri.startsWith("file://") ? photoUri : `file://${photoUri}`;

    const formData = new FormData();
    formData.append("file", {
      uri: cleanUri,
      name: "photo.jpg",
      type: "image/jpeg",
    });

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        // ❗ Do NOT manually set Content-Type boundary
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn("❌ Upload failed:", response.status, errorText);
      return {
        ok: false,
        message: `Upload failed (${response.status})`,
      };
    }

    const data = await response.json();

    const breeds = Array.isArray(data?.breeds) ? data.breeds : [];

    if (breeds.length === 0) {
      return {
        ok: true,
        topBreed: null,
        candidates: [],
        message: "No breed detected (likely mixed)",
      };
    }

    return {
      ok: true,
      topBreed: breeds[0],     // highest confidence
      candidates: breeds,      // all detected breeds
    };
  } catch (error) {
    console.error("❌ Breed detection error:", error);
    return {
      ok: false,
      message: "Unexpected error occurred",
    };
  }
}
