// utils/breedApi.js
// Calls your local backend (which calls OpenAI) to identify cat/dog breed from an image.
// Expo SDK 54: use expo-file-system/legacy for readAsStringAsync.

import * as FileSystem from "expo-file-system/legacy";

const BASE_URL = "http://192.168.1.22:3001";

// Convert a local file URI to base64 (Expo)
async function uriToBase64(uri) {
  const cleanUri = uri.startsWith("file://") ? uri : `file://${uri}`;
  return FileSystem.readAsStringAsync(cleanUri, { encoding: "base64" });
}

export async function detectBreedFromPhoto(photoUri) {
  try {
    if (!photoUri) return { ok: false, message: "No photo provided" };

    const base64 = await uriToBase64(photoUri);

    const res = await fetch(`${BASE_URL}/api/breed`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageBase64: base64 }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        ok: false,
        message: data?.error || `Request failed (${res.status})`,
        detail: data?.detail,
        hint: data?.hint,
      };
    }

    return {
      ok: true,
      species: data?.species ?? "unknown",
      topBreeds: Array.isArray(data?.top_breeds) ? data.top_breeds : [],
      isMixedPossible: !!data?.is_mixed_possible,
      photoQuality: data?.photo_quality ?? "ok",
      notes: data?.notes ?? "",
      whatToTryNext: data?.what_to_try_next ?? "",
      raw: data,
    };
  } catch (err) {
    console.error("❌ Breed detection error:", err);
    return { ok: false, message: "Unexpected error occurred" };
  }
}
