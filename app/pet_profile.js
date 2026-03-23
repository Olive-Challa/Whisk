// app/pet-profile.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function PetProfileScreen() {
  const router = useRouter();
  const [petName, setPetName] = useState('');
  const [saving, setSaving] = useState(false);

  const savePetProfile = async (breedData, imageUri) => {
    if (!petName.trim()) {
      Alert.alert('Missing info', 'Please enter a pet name');
      return;
    }

    try {
      setSaving(true);
      
      // Save to Firestore
      const docRef = await addDoc(collection(db, 'pets'), {
        name: petName,
        breed: breedData.breed,
        animal: breedData.animal,
        confidence: breedData.confidence,
        size: breedData.size,
        care_level: breedData.care_level,
        temperament: breedData.temperament,
        characteristics: breedData.characteristics,
        grooming: breedData.grooming,
        diet: breedData.diet,
        exercise: breedData.exercise,
        vaccines: breedData.vaccines,
        health_considerations: breedData.health_considerations,
        imageUri: imageUri,
        createdAt: new Date().toISOString(),
      });

      Alert.alert('Success!', `${petName}'s profile has been saved!`);
      router.back();
    } catch (error) {
      console.error('Error saving pet profile:', error);
      Alert.alert('Error', 'Failed to save pet profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#7C83FD" />
          </TouchableOpacity>
          <Text style={styles.title}>Save Pet Profile</Text>
        </View>

        <Text style={styles.subtitle}>Give your pet a name to save their profile</Text>

        <View style={styles.inputSection}>
          <Text style={styles.label}>Pet Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Max, Bella, Luna"
            placeholderTextColor="#999"
            value={petName}
            onChangeText={setPetName}
            autoCapitalize="words"
          />
        </View>

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={savePetProfile}
          disabled={saving}
        >
          <MaterialIcons name="save" size={24} color="#fff" />
          <Text style={styles.saveButtonText}>
            {saving ? 'Saving...' : 'Save Pet Profile'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F3FF',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#7C83FD',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    marginBottom: 30,
  },
  inputSection: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#E0D7FF',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#A3C4F3',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 10,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});