Whisk — AI-Powered Pet Detection App- An Honors Capstone Project by Olive Challa
Whisk is a mobile application designed to help new pet owners better understand, identify, and care for their animals. Using on-device machine learning, Whisk detects cats, dogs, and other animals through the camera and provides a clean, modern dashboard for interacting with your pet data.

This project is built using React Native, Expo, and TensorFlow.js

Features
- Real-Time Animal Detection
- Uses your phone’s camera to detect common animals (dog, cat, bird, horse, etc.)
- TensorFlow.js + COCO-SSD model running fully on-device
- Bounding boxes drawn on live camera feed
- Lightweight + fast detection, optimized for mobile

Modern UI / UX
- Clean pastel aesthetic
- Simple login page

Welcome home screen
- Fully designed interactive dashboard
- Whisk branding + custom logo integration

Dashboard Overview
- Displays last detected animal
- Quick navigation shortcuts
- Health & care placeholder modules
- Activity history list
- Footer navigation for Home / Camera / Settings

Login System 
- Basic placeholder authentication
- Links into the home → dashboard → camera flow
- Ready to upgrade with Firebase Auth or backend API

Tech Stack
Layer	Technologies
Frontend / Mobile	React Native (Expo)
Navigation	expo-router
Machine Learning	TensorFlow.js + COCO-SSD
Camera	Expo Camera (CameraView API)
File Access	expo-file-system (legacy mode)
Design	React Native styles, pastel theme


Project Structure
my-tensor-app/
│
├── app/
│   ├── index.js         # Login Screen
│   ├── home.js          # Home / Landing Screen
│   ├── dashboard.js     # Dashboard UI
│   ├── camera.js        # Camera + ML detection
│   ├── layout.js        # Navigation stack
│
├── assets/              # Logos & images
├── .gitignore
├── package.json
└── README.md

Running the App
1. Install dependencies
npm install --legacy-peer-deps

2. Start the Expo development server
npx expo start -c

3. Open the App
iPhone → Scan QR code with Camera → open in Expo Go
Android → Expo Go app

Web preview → press w in terminal

Current Accomplishments (Sprint Summary)
- Working camera module
- Coco-SSD model integrated
- Animal detection with bounding boxes
-  Clean UI: Login → Home → Dashboard → Camera
-   GitHub repo created and fully updated
-   Code cleaned + commented for review
-   Project meets sprint requirements and demonstration readiness


Future Enhancements 
- Breed Identification (Advanced ML)
- Integrate MobileNet or a custom CNN model
- Add confidence scores
- Replace COCO model with species-specific classifier

 
 Pet Profiles
 - Store detected pets
 - Upload photos, notes, health data
 - Create your own “pet library”

Backend Integration
- Firebase or Supabase
- Real authentication + cloud-stored pet data

 Veterinary Care AI
 - Feeding guidelines
 - Breed-specific info
 - Grooming alerts
 - reminders

👩‍💻 Author

Olive Challa
Francis Marion University – Computer Science Major, Math Minor
Fall 2025 – Capstone Project
GitHub: https://github.com/Olive-Challa
