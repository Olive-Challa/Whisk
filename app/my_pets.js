// app/my_pets.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useTheme } from '../contexts/ThemeContext';
import Header from '../components/Header';

export default function MyPetsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      loadPets();
    }, [])
  );

  const loadPets = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'pets'));
      const petsList = [];
      
      querySnapshot.forEach((doc) => {
        petsList.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      petsList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setPets(petsList);
    } catch (error) {
      console.error('Error loading pets:', error);
      Alert.alert('Error', 'Failed to load your pets');
    } finally {
      setLoading(false);
    }
  };

  const deletePet = async (petId, petName) => {
    Alert.alert(
      'Delete Pet',
      `Are you sure you want to delete ${petName}'s profile?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'pets', petId));
              setPets(pets.filter(p => p.id !== petId));
              Alert.alert('Success', `${petName}'s profile has been deleted`);
            } catch (error) {
              console.error('Error deleting pet:', error);
              Alert.alert('Error', 'Failed to delete pet profile');
            }
          },
        },
      ]
    );
  };

  const viewPetDetails = (pet) => {
    router.push({
      pathname: '/pet_profile',
      params: {
        petId: pet.id,
        petData: JSON.stringify(pet),
      },
    });
  };

  const renderPetCard = ({ item }) => (
    <TouchableOpacity
      style={[styles.petCard, { backgroundColor: theme.card }]}
      onPress={() => viewPetDetails(item)}
    >
      <Image
        source={{ uri: item.imageUri }}
        style={styles.petImage}
      />
      
      <View style={styles.petInfo}>
        <View style={styles.petHeader}>
          <Text style={[styles.petName, { color: theme.text }]}>{item.name}</Text>
          <TouchableOpacity
            onPress={() => deletePet(item.id, item.name)}
            style={styles.deleteButton}
          >
            <MaterialIcons name="delete" size={24} color="#ef4444" />
          </TouchableOpacity>
        </View>

        <View style={styles.petDetails}>
          <Text style={[styles.breed, { color: theme.textSecondary }]}>
            {item.animal === 'dog' ? '🐕' : '🐱'} {item.breed}
          </Text>
          {item.gender && (
            <Text style={[styles.petGender, { color: theme.textSecondary }]}>
              {item.gender === 'male' ? '♂️' : '♀️'} {item.gender}
            </Text>
          )}
        </View>

        <Text style={[styles.savedDate, { color: theme.textTertiary }]}>
          Added {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <Header title="My Pets" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Loading your pets...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="My Pets" />
      
      {pets.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="pets" size={80} color={theme.iconSecondary} />
          <Text style={[styles.emptyTitle, { color: theme.text }]}>No pets yet</Text>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            Create a profile for your pet to keep track of their health and care!
          </Text>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: theme.primary }]}
            onPress={() => router.push('/add_pet')}
          >
            <MaterialIcons name="add" size={24} color="#fff" />
            <Text style={styles.addButtonText}>Add Your First Pet</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={pets}
          renderItem={renderPetCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.primary }]}
        onPress={() => router.push('/add_pet')}
      >
        <MaterialIcons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  petCard: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  petImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  petInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  petHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  petName: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  deleteButton: {
    padding: 4,
  },
  petDetails: {
    flex: 1,
  },
  breed: {
    fontSize: 16,
    marginBottom: 4,
  },
  petGender: {
    fontSize: 14,
    textTransform: 'capitalize',
  },
  savedDate: {
    fontSize: 12,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});