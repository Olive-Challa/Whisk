import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera"; 
import { useRouter } from "expo-router";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as FileSystem from "expo-file-system/legacy";
import { decodeJpeg } from "@tensorflow/tfjs-react-native";
import Svg, { Rect, Text as SvgText } from "react-native-svg";

const { width, height } = Dimensions.get("window");

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [model, setModel] = useState(null);
  const [tfReady, setTfReady] = useState(false);
  const [detections, setDetections] = useState([]);
  const cameraRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { status } = await requestPermission();
      if (status !== "granted") {
        Alert.alert("Permission needed", "Camera access is required.");
        return;
      }

      await tf.ready();
      setTfReady(true);
      const loadedModel = await cocoSsd.load();
      setModel(loadedModel);

      console.log("✅ TensorFlow and COCO-SSD model ready");
    })();
  }, []);

  const imageToTensor = async (uri) => {
    try {
      const imgB64 = await FileSystem.readAsStringAsync(uri, {
        encoding: "base64", // 
      });
      const imgBuffer = tf.util.encodeString(imgB64, "base64").buffer;
      const raw = new Uint8Array(imgBuffer);
      return decodeJpeg(raw);
    } catch (error) {
      console.error("🚨 Image conversion failed:", error);
      Alert.alert("Error", "Failed to process image.");
    }
  };

  const captureAndDetect = async () => {
    if (!cameraRef.current || !model || !tfReady) {
      Alert.alert("Please wait", "Model is still loading...");
      return;
    }

    console.log("📸 Capturing image...");
    const photo = await cameraRef.current.takePictureAsync({ base64: false });
    const imageTensor = await imageToTensor(photo.uri);

    const predictions = await model.detect(imageTensor);

    const animalClasses = [
      "dog",
      "cat",
      "bird",
      "horse",
      "sheep",
      "cow",
      "elephant",
      "bear",
      "zebra",
      "giraffe",
    ];

    const animals = predictions.filter((p) => animalClasses.includes(p.class));
    setDetections(animals);
    console.log("🐾 Detected animals:", animals);

    tf.dispose(imageTensor);
  };

  if (!permission?.granted)
    return (
      <View style={styles.container}>
        <Text>No access to camera</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={{ color: "#fff" }}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back" />

      {/* Draw bounding boxes */}
      <Svg style={StyleSheet.absoluteFill}>
        {detections.map((item, i) => {
          const [x, y, w, h] = item.bbox;
          return (
            <React.Fragment key={i}>
              <Rect
                x={x}
                y={y}
                width={w}
                height={h}
                stroke="#A3C4F3"
                strokeWidth="3"
                fill="transparent"
              />
              <SvgText
                x={x}
                y={y > 10 ? y - 5 : y + 15}
                fill="#7C83FD"
                fontSize="16"
              >
                {item.class}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>

      {/* Logo overlay */}
      <View style={styles.overlay}>
        <Image source={require("../assets/whisk-logo.jpg")} style={styles.logo} />
        <Text style={styles.title}>Whisk Detector</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={captureAndDetect}
        >
          <Text style={styles.buttonText}>Detect Animal 🐾</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => router.push("/home")}
        >
          <Text style={styles.buttonTextAlt}>← Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  camera: { width: "100%", height: "100%" },
  overlay: {
    position: "absolute",
    top: 60,
    alignSelf: "center",
    alignItems: "center",
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#7C83FD",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 60,
    alignSelf: "center",
    gap: 12,
  },
  button: {
    width: 220,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#A3C4F3",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#A3C4F3",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonTextAlt: {
    color: "#7C83FD",
    fontSize: 16,
    fontWeight: "500",
  },
  permissionButton: {
    backgroundColor: "#A3C4F3",
    padding: 15,
    borderRadius: 10,
  },
});
