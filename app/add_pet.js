// app/add-pet.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useTheme } from '../contexts/ThemeContext';
import Header from '../components/Header';

export default function AddPetScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  
  // Basic Info
  const [petImage, setPetImage] = useState(null);
  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState('dog');
  const [breed, setBreed] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('male');
  const [weight, setWeight] = useState('');
  
  // Additional Info
  const [microchipId, setMicrochipId] = useState('');
  const [vetName, setVetName] = useState('');
  const [vetPhone, setVetPhone] = useState('');
  const [allergies, setAllergies] = useState('');
  const [medications, setMedications] = useState('');
  const [notes, setNotes] = useState('');

  // Feeding Reminders
  const [enableFeedingReminders, setEnableFeedingReminders] = useState(true);
  const [feedingTimes, setFeedingTimes] = useState([
    { id: '1', time: '08:00 AM', enabled: true },
    { id: '2', time: '06:00 PM', enabled: true },
  ]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera roll permissions');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPetImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera permissions');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPetImage(result.assets[0].uri);
    }
  };

  const toggleFeedingTime = (timeId) => {
    setFeedingTimes(feedingTimes.map(t => 
      t.id === timeId ? { ...t, enabled: !t.enabled } : t
    ));
  };

  const savePet = async () => {
    // Validation
    if (!petName.trim()) {
      Alert.alert('Required', 'Please enter your pet\'s name');
      return;
    }

    if (!petImage) {
      Alert.alert('Required', 'Please add a photo of your pet');
      return;
    }

    try {
      setLoading(true);

      const petData = {
        // Basic Info
        name: petName.trim(),
        animal: petType,
        breed: breed.trim() || 'Mixed Breed',
        birthDate: birthDate.trim(),
        gender,
        weight: weight.trim(),
        imageUri: petImage,
        
        // Additional Info
        microchipId: microchipId.trim(),
        vetName: vetName.trim(),
        vetPhone: vetPhone.trim(),
        allergies: allergies.trim(),
        medications: medications.trim(),
        notes: notes.trim(),
        
        // Feeding Reminders
        feedingReminders: {
          enabled: enableFeedingReminders,
          times: feedingTimes.filter(t => t.enabled),
        },
        
        // Metadata
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'pets'), petData);

      Alert.alert(
        'Success!', 
        `${petName}'s profile has been created!`,
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Error saving pet:', error);
      Alert.alert('Error', 'Failed to save pet profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="Add Pet Profile" />
      
      <ScrollView contentContainerStyle={styles.content}>
        {/* Photo Section */}
        <View style={[styles.photoSection, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Pet Photo</Text>
          
          {petImage ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: petImage }} style={styles.petImage} />
              <TouchableOpacity 
                style={[styles.changePhotoButton, { backgroundColor: theme.primary }]}
                onPress={pickImage}
              >
                <MaterialIcons name="edit" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.photoButtons}>
              <TouchableOpacity 
                style={[styles.photoButton, { backgroundColor: theme.primaryLight, borderColor: theme.border }]}
                onPress={takePhoto}
              >
                <MaterialIcons name="camera-alt" size={32} color={theme.primary} />
                <Text style={[styles.photoButtonText, { color: theme.primary }]}>Take Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.photoButton, { backgroundColor: theme.primaryLight, borderColor: theme.border }]}
                onPress={pickImage}
              >
                <MaterialIcons name="photo-library" size={32} color={theme.primary} />
                <Text style={[styles.photoButtonText, { color: theme.primary }]}>Choose Photo</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Basic Info Section */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Basic Information</Text>
          
          <TextInput
            style={[styles.input, { backgroundColor: theme.primaryLight, borderColor: theme.border, color: theme.text }]}
            placeholder="Pet Name *"
            placeholderTextColor={theme.textSecondary}
            value={petName}
            onChangeText={setPetName}
          />

          <View style={styles.toggleGroup}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Pet Type</Text>
            <View style={styles.toggleButtons}>
              <TouchableOpacity
                style={[
                  styles.toggleButton, 
                  { borderColor: theme.border },
                  petType === 'dog' && { borderColor: theme.primary, backgroundColor: theme.primaryLight }
                ]}
                onPress={() => setPetType('dog')}
              >
                <Text style={[
                  styles.toggleButtonText, 
                  { color: theme.textSecondary },
                  petType === 'dog' && { color: theme.primary }
                ]}>
                  🐕 Dog
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.toggleButton, 
                  { borderColor: theme.border },
                  petType === 'cat' && { borderColor: theme.primary, backgroundColor: theme.primaryLight }
                ]}
                onPress={() => setPetType('cat')}
              >
                <Text style={[
                  styles.toggleButtonText, 
                  { color: theme.textSecondary },
                  petType === 'cat' && { color: theme.primary }
                ]}>
                  🐱 Cat
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TextInput
            style={[styles.input, { backgroundColor: theme.primaryLight, borderColor: theme.border, color: theme.text }]}
            placeholder="Breed (e.g., Golden Retriever)"
            placeholderTextColor={theme.textSecondary}
            value={breed}
            onChangeText={setBreed}
          />

          <TextInput
            style={[styles.input, { backgroundColor: theme.primaryLight, borderColor: theme.border, color: theme.text }]}
            placeholder="Birth Date (e.g., 01/15/2020)"
            placeholderTextColor={theme.textSecondary}
            value={birthDate}
            onChangeText={setBirthDate}
          />

          <View style={styles.toggleGroup}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Gender</Text>
            <View style={styles.toggleButtons}>
              <TouchableOpacity
                style={[
                  styles.toggleButton, 
                  { borderColor: theme.border },
                  gender === 'male' && { borderColor: theme.primary, backgroundColor: theme.primaryLight }
                ]}
                onPress={() => setGender('male')}
              >
                <Text style={[
                  styles.toggleButtonText, 
                  { color: theme.textSecondary },
                  gender === 'male' && { color: theme.primary }
                ]}>
                  Male
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.toggleButton, 
                  { borderColor: theme.border },
                  gender === 'female' && { borderColor: theme.primary, backgroundColor: theme.primaryLight }
                ]}
                onPress={() => setGender('female')}
              >
                <Text style={[
                  styles.toggleButtonText, 
                  { color: theme.textSecondary },
                  gender === 'female' && { color: theme.primary }
                ]}>
                  Female
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TextInput
            style={[styles.input, { backgroundColor: theme.primaryLight, borderColor: theme.border, color: theme.text }]}
            placeholder="Weight (e.g., 25 lbs)"
            placeholderTextColor={theme.textSecondary}
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
          />
        </View>

        {/* Feeding Reminders Section */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Feeding Reminders</Text>
            <Switch
              value={enableFeedingReminders}
              onValueChange={setEnableFeedingReminders}
              trackColor={{ false: '#cbd5e1', true: theme.primary }}
              thumbColor={enableFeedingReminders ? '#fff' : '#f4f4f5'}
            />
          </View>

          {enableFeedingReminders && (
            <>
              <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
                Set daily feeding times for {petName || 'your pet'}
              </Text>

              {feedingTimes.map((time) => (
                <View key={time.id} style={[styles.timeRow, { borderBottomColor: theme.borderLight }]}>
                  <View style={styles.timeLeft}>
                    <MaterialIcons name="restaurant" size={20} color={time.enabled ? theme.primary : theme.iconSecondary} />
                    <Text style={[styles.timeText, { color: theme.text }]}>{time.time}</Text>
                  </View>
                  <Switch
                    value={time.enabled}
                    onValueChange={() => toggleFeedingTime(time.id)}
                    trackColor={{ false: '#cbd5e1', true: theme.primary }}
                    thumbColor={time.enabled ? '#fff' : '#f4f4f5'}
                  />
                </View>
              ))}

              <Text style={[styles.reminderNote, { color: theme.textTertiary }]}>
                💡 You can customize feeding times later in the Feeding Reminders section
              </Text>
            </>
          )}
        </View>

        {/* Health Info Section */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Health Information (Optional)</Text>
          
          <TextInput
            style={[styles.input, { backgroundColor: theme.primaryLight, borderColor: theme.border, color: theme.text }]}
            placeholder="Microchip ID"
            placeholderTextColor={theme.textSecondary}
            value={microchipId}
            onChangeText={setMicrochipId}
          />

          <TextInput
            style={[styles.input, { backgroundColor: theme.primaryLight, borderColor: theme.border, color: theme.text }]}
            placeholder="Veterinarian Name"
            placeholderTextColor={theme.textSecondary}
            value={vetName}
            onChangeText={setVetName}
          />

          <TextInput
            style={[styles.input, { backgroundColor: theme.primaryLight, borderColor: theme.border, color: theme.text }]}
            placeholder="Vet Phone Number"
            placeholderTextColor={theme.textSecondary}
            value={vetPhone}
            onChangeText={setVetPhone}
            keyboardType="phone-pad"
          />

          <TextInput
            style={[styles.textArea, { backgroundColor: theme.primaryLight, borderColor: theme.border, color: theme.text }]}
            placeholder="Allergies (if any)"
            placeholderTextColor={theme.textSecondary}
            value={allergies}
            onChangeText={setAllergies}
            multiline
            numberOfLines={3}
          />

          <TextInput
            style={[styles.textArea, { backgroundColor: theme.primaryLight, borderColor: theme.border, color: theme.text }]}
            placeholder="Current Medications"
            placeholderTextColor={theme.textSecondary}
            value={medications}
            onChangeText={setMedications}
            multiline
            numberOfLines={3}
          />

          <TextInput
            style={[styles.textArea, { backgroundColor: theme.primaryLight, borderColor: theme.border, color: theme.text }]}
            placeholder="Additional Notes"
            placeholderTextColor={theme.textSecondary}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: theme.primary }, loading && styles.saveButtonDisabled]}
          onPress={savePet}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <MaterialIcons name="check" size={24} color="#fff" />
              <Text style={styles.saveButtonText}>Save Pet Profile</Text>
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
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  photoSection: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  imageContainer: {
    position: 'relative',
  },
  petImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  changePhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  photoButtons: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },
  photoButton: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  photoButtonText: {
    fontSize: 14,
    marginTop: 8,
    fontWeight: '600',
  },
  section: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 12,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 12,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  toggleGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  toggleButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  timeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '500',
  },
  reminderNote: {
    fontSize: 12,
    marginTop: 8,
    fontStyle: 'italic',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 8,
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