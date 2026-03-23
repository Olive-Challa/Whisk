// app/vet_locator.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';

export default function VetLocatorScreen() {
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const [location, setLocation] = useState(null);
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVet, setSelectedVet] = useState(null);

  useEffect(() => {
    getLocationAndVets();
  }, []);

  const getLocationAndVets = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to find nearby vets');
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentLocation.coords;
      setLocation({ latitude, longitude });

      await findNearbyVets(latitude, longitude);
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to get your location');
      setLoading(false);
    }
  };

  const findNearbyVets = async (lat, lng) => {
    try {
      console.log('Fetching vets for location:', lat, lng);
      const url = `https://whisk-backend-3r95.onrender.com/api/nearby-vets?lat=${lat}&lng=${lng}`;
      console.log('Fetching from:', url);
      
      const response = await fetch(url);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error('Failed to find vets');
      }

      const data = await response.json();
      console.log('Received data:', data);
      console.log('Number of vets found:', data.vets?.length || 0);
      
      setVets(data.vets || []);
    } catch (error) {
      console.error('Error finding vets:', error);
      Alert.alert('Error', 'Failed to find nearby vets');
    } finally {
      setLoading(false);
    }
  };

  const openInMaps = (vet) => {
    const lat = vet.latitude;
    const lng = vet.longitude;
    const label = encodeURIComponent(vet.name);
    
    const url = Platform.select({
      ios: `maps:0,0?q=${label}@${lat},${lng}`,
      android: `geo:0,0?q=${lat},${lng}(${label})`,
    });

    Linking.openURL(url);
  };

  const openInBrowser = (vet) => {
    const placeId = vet.place_id;
    const url = `https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${placeId}`;
    Linking.openURL(url);
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Finding nearby vets...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!location) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="location-off" size={64} color="#ef4444" />
          <Text style={[styles.errorText, { color: theme.text }]}>Unable to get your location</Text>
          <TouchableOpacity 
            style={[styles.retryButton, { backgroundColor: theme.primary }]} 
            onPress={getLocationAndVets}
          >
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.headerBg, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={theme.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Nearby Veterinarians</Text>
      </View>

      {/* Map */}
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        customMapStyle={isDark ? darkMapStyle : []}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
      >
        {vets.map((vet, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: vet.latitude,
              longitude: vet.longitude,
            }}
            title={vet.name}
            description={vet.address}
            onPress={() => setSelectedVet(vet)}
          >
            <View style={styles.markerContainer}>
              <MaterialIcons name="local-hospital" size={30} color="#ef4444" />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Selected Vet Info */}
      {selectedVet && (
        <View style={[styles.vetInfoCard, { backgroundColor: theme.card }]}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedVet(null)}
          >
            <MaterialIcons name="close" size={24} color={theme.iconSecondary} />
          </TouchableOpacity>

          <Text style={[styles.vetName, { color: theme.text }]}>{selectedVet.name}</Text>
          <Text style={[styles.vetAddress, { color: theme.textSecondary }]}>{selectedVet.address}</Text>

          {selectedVet.rating && (
            <View style={styles.ratingContainer}>
              <MaterialIcons name="star" size={16} color="#f59e0b" />
              <Text style={[styles.ratingText, { color: theme.text }]}>{selectedVet.rating}</Text>
              {selectedVet.user_ratings_total && (
                <Text style={[styles.ratingsCount, { color: theme.textSecondary }]}>({selectedVet.user_ratings_total})</Text>
              )}
            </View>
          )}

          {selectedVet.distance && (
            <Text style={[styles.distance, { color: theme.textSecondary }]}>📍 {selectedVet.distance}</Text>
          )}

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => openInMaps(selectedVet)}
            >
              <MaterialIcons name="directions" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Directions</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.infoButton]}
              onPress={() => openInBrowser(selectedVet)}
            >
              <MaterialIcons name="info" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>More Info</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Vet Count */}
      {vets.length > 0 && (
        <View style={[styles.vetCount, { backgroundColor: theme.card }]}>
          <Text style={[styles.vetCountText, { color: theme.primary }]}>{vets.length} vets nearby</Text>
        </View>
      )}

      {vets.length === 0 && !loading && (
        <View style={styles.noVetsContainer}>
          <Text style={[styles.noVetsText, { color: theme.textSecondary }]}>No vets found nearby</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

// Dark mode map style
const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  map: {
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  markerContainer: {
    backgroundColor: '#fff',
    padding: 4,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ef4444',
  },
  vetInfoCard: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  vetName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    paddingRight: 30,
  },
  vetAddress: {
    fontSize: 14,
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  ratingsCount: {
    fontSize: 12,
    marginLeft: 4,
  },
  distance: {
    fontSize: 14,
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#22c55e',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  infoButton: {
    backgroundColor: '#3b82f6',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  vetCount: {
    position: 'absolute',
    top: 80,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  vetCountText: {
    fontSize: 14,
    fontWeight: '600',
  },
  noVetsContainer: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  noVetsText: {
    fontSize: 16,
  },
});