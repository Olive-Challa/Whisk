// app/pet_profile.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import Header from '../components/Header';

export default function PetProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const pet = JSON.parse(params.petData);

  const deletePet = async () => {
    Alert.alert(
      'Delete Pet',
      `Are you sure you want to delete ${pet.name}'s profile? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'pets', params.petId));
              Alert.alert('Success', `${pet.name}'s profile has been deleted`);
              router.back();
            } catch (error) {
              console.error('Error deleting pet:', error);
              Alert.alert('Error', 'Failed to delete pet profile');
            }
          },
        },
      ]
    );
  };

  const InfoRow = ({ icon, label, value }) => {
    if (!value) return null;
    
    return (
      <View style={styles.infoRow}>
        <MaterialIcons name={icon} size={20} color="#7C83FD" />
        <View style={styles.infoContent}>
          <Text style={styles.infoLabel}>{label}</Text>
          <Text style={styles.infoValue}>{value}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title={pet.name} />
      
      <ScrollView contentContainerStyle={styles.content}>
        {/* Pet Image & Basic Info */}
        <View style={styles.heroSection}>
          <Image source={{ uri: pet.imageUri }} style={styles.petImage} />
          <Text style={styles.petName}>{pet.name}</Text>
          <View style={styles.petType}>
            <Text style={styles.petTypeText}>
              {pet.animal === 'dog' ? '🐕 Dog' : '🐱 Cat'}
            </Text>
            {pet.gender && (
              <Text style={styles.petGender}>
                {pet.gender === 'male' ? '♂️ Male' : '♀️ Female'}
              </Text>
            )}
          </View>
        </View>

        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <InfoRow icon="pets" label="Breed" value={pet.breed} />
          <InfoRow icon="cake" label="Birth Date" value={pet.birthDate} />
          <InfoRow icon="straighten" label="Weight" value={pet.weight} />
        </View>

        {/* Health Information */}
        {(pet.microchipId || pet.vetName || pet.vetPhone || pet.allergies || pet.medications) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Health Information</Text>
            
            <InfoRow icon="credit-card" label="Microchip ID" value={pet.microchipId} />
            <InfoRow icon="local-hospital" label="Veterinarian" value={pet.vetName} />
            <InfoRow icon="phone" label="Vet Phone" value={pet.vetPhone} />
            <InfoRow icon="warning" label="Allergies" value={pet.allergies} />
            <InfoRow icon="medication" label="Medications" value={pet.medications} />
          </View>
        )}

        {/* Additional Notes */}
        {pet.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.notesText}>{pet.notes}</Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => Alert.alert('Coming Soon', 'Edit functionality will be added soon!')}
          >
            <MaterialIcons name="edit" size={20} color="#fff" />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={deletePet}
          >
            <MaterialIcons name="delete" size={20} color="#fff" />
            <Text style={styles.deleteButtonText}>Delete Pet</Text>
          </TouchableOpacity>
        </View>

        {/* Metadata */}
        <View style={styles.metadata}>
          <Text style={styles.metadataText}>
            Added on {new Date(pet.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F3FF',
  },
  content: {
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  petImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#E0D7FF',
  },
  petName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  petType: {
    flexDirection: 'row',
    gap: 16,
  },
  petTypeText: {
    fontSize: 16,
    color: '#7C83FD',
    fontWeight: '600',
  },
  petGender: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 16,
    color: '#1e293b',
  },
  notesText: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7C83FD',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ef4444',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  metadata: {
    alignItems: 'center',
    marginTop: 20,
  },
  metadataText: {
    fontSize: 12,
    color: '#94a3b8',
  },
});