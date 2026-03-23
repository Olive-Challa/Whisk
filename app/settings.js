// app/settings.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import Header from '../components/Header';

export default function SettingsScreen() {
  const router = useRouter();
  const { theme, isDark, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [feedingReminders, setFeedingReminders] = useState(true);
  const [vetReminders, setVetReminders] = useState(true);

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all your saved pets and settings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement clearing Firebase data
            Alert.alert('Success', 'All data has been cleared');
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            router.replace('/');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="Settings" />
      
      <ScrollView contentContainerStyle={styles.content}>
        {/* Account Section */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Account</Text>
          
          <TouchableOpacity style={[styles.settingItem, { borderBottomColor: theme.borderLight }]}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="person" size={24} color={theme.primary} />
              <Text style={[styles.settingText, { color: theme.text }]}>Profile</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={theme.iconSecondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.settingItem, { borderBottomColor: theme.borderLight }]}
            onPress={handleLogout}
          >
            <View style={styles.settingLeft}>
              <MaterialIcons name="logout" size={24} color="#ef4444" />
              <Text style={[styles.settingText, { color: '#ef4444' }]}>Sign Out</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={theme.iconSecondary} />
          </TouchableOpacity>
        </View>

        {/* Notifications Section */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Notifications</Text>
          
          <View style={[styles.settingItem, { borderBottomColor: theme.borderLight }]}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="notifications" size={24} color={theme.primary} />
              <Text style={[styles.settingText, { color: theme.text }]}>Push Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#cbd5e1', true: '#A3C4F3' }}
              thumbColor={notifications ? theme.primary : '#f4f4f5'}
            />
          </View>

          <View style={[styles.settingItem, { borderBottomColor: theme.borderLight }]}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="restaurant" size={24} color={theme.primary} />
              <Text style={[styles.settingText, { color: theme.text }]}>Feeding Reminders</Text>
            </View>
            <Switch
              value={feedingReminders}
              onValueChange={setFeedingReminders}
              trackColor={{ false: '#cbd5e1', true: '#A3C4F3' }}
              thumbColor={feedingReminders ? theme.primary : '#f4f4f5'}
            />
          </View>

          <View style={[styles.settingItem, { borderBottomColor: theme.borderLight }]}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="local-hospital" size={24} color={theme.primary} />
              <Text style={[styles.settingText, { color: theme.text }]}>Vet Appointment Reminders</Text>
            </View>
            <Switch
              value={vetReminders}
              onValueChange={setVetReminders}
              trackColor={{ false: '#cbd5e1', true: '#A3C4F3' }}
              thumbColor={vetReminders ? theme.primary : '#f4f4f5'}
            />
          </View>
        </View>

        {/* Appearance Section */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Appearance</Text>
          
          <View style={[styles.settingItem, { borderBottomColor: theme.borderLight }]}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="dark-mode" size={24} color={theme.primary} />
              <Text style={[styles.settingText, { color: theme.text }]}>Dark Mode</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#cbd5e1', true: '#A3C4F3' }}
              thumbColor={isDark ? theme.primary : '#f4f4f5'}
            />
          </View>
        </View>

        {/* Data & Privacy Section */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Data & Privacy</Text>
          
          <TouchableOpacity style={[styles.settingItem, { borderBottomColor: theme.borderLight }]}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="privacy-tip" size={24} color={theme.primary} />
              <Text style={[styles.settingText, { color: theme.text }]}>Privacy Policy</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={theme.iconSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingItem, { borderBottomColor: theme.borderLight }]}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="description" size={24} color={theme.primary} />
              <Text style={[styles.settingText, { color: theme.text }]}>Terms of Service</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={theme.iconSecondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.settingItem, { borderBottomColor: theme.borderLight }]}
            onPress={handleClearData}
          >
            <View style={styles.settingLeft}>
              <MaterialIcons name="delete-forever" size={24} color="#ef4444" />
              <Text style={[styles.settingText, { color: '#ef4444' }]}>Clear All Data</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={theme.iconSecondary} />
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={[styles.appInfoText, { color: theme.textSecondary }]}>Whisk v1.0.0</Text>
          <Text style={[styles.appInfoSubtext, { color: theme.textTertiary }]}>Made with 🐾 for pet lovers</Text>
        </View>
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
  section: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingText: {
    fontSize: 16,
  },
  appInfo: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  appInfoText: {
    fontSize: 14,
    marginBottom: 4,
  },
  appInfoSubtext: {
    fontSize: 12,
  },
});