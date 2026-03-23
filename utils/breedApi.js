// utils/breedApi.js
import * as FileSystem from "expo-file-system/legacy";

// Update with your computer's IP address
const BASE_URL = "https://whisk-backend-3r95.onrender.com"; async function uriToBase64(uri) {
  try {
    const cleanUri = uri.startsWith("file://") ? uri : `file://${uri}`;
    return await FileSystem.readAsStringAsync(cleanUri, { encoding: "base64" });
  } catch (error) {
    console.error("Failed to convert image to base64:", error);
    throw new Error("Failed to process image");
  }
}

export async function detectBreedFromPhoto(photoUri) {
  try {
    console.log("Converting image to base64...");
    const base64 = await uriToBase64(photoUri);

    console.log("Sending to API...");
    const response = await fetch(`${BASE_URL}/api/breed`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageBase64: base64 }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to detect breed");
    }

    const data = await response.json();
    console.log("API Response:", data);

    if (data.error) {
      return { error: data.error };
    }

    if (!data.breed || !data.animal) {
      throw new Error("Invalid response from server");
    }

    return data;

  } catch (error) {
    console.error("Breed detection error:", error);
    
    if (error.message.includes("Network request failed")) {
      return { 
        error: "Cannot connect to server. Make sure backend is running on http://192.168.1.22:3000" 
      };
    }
    
    return { 
      error: error.message || "Failed to analyze image. Please try again." 
    };
  }
}

export async function getBreedInfoManual(breed, animal, imageBase64, personalizedInfo) {
  try {
    console.log("Getting personalized breed info for:", breed, animal);
    
    const response = await fetch(`${BASE_URL}/api/breed-manual`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        breed, 
        animal, 
        imageBase64,
        personalizedInfo // Age, weight, activity level, health issues
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to get breed info");
    }

    const data = await response.json();
    console.log("Personalized breed info:", data);

    return data;

  } catch (error) {
    console.error("Manual breed info error:", error);
    
    return { 
      error: error.message || "Failed to get breed information. Please try again." 
    };
  }
}