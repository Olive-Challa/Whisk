// app/about.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import Header from '../components/Header';

export default function AboutScreen() {
  const { theme } = useTheme();

  const openLink = (url) => {
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="About Whisk" />
      
      <ScrollView contentContainerStyle={styles.content}>
        {/* Logo Section */}
        <View style={[styles.logoSection, { backgroundColor: theme.card }]}>
          <Image
            source={require('../assets/whisk-logo.jpg')}
            style={styles.logo}
          />
          <Text style={[styles.appName, { color: theme.primary }]}>Whisk</Text>
          <Text style={[styles.tagline, { color: theme.textSecondary }]}>AI-Powered Pet Care Assistant</Text>
          <Text style={[styles.version, { color: theme.textTertiary }]}>Version 1.0.0</Text>
        </View>

        {/* Mission Section */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="favorite" size={24} color={theme.primary} />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Our Mission</Text>
          </View>
          <Text style={[styles.sectionText, { color: theme.textSecondary }]}>
            Whisk is dedicated to helping pet owners provide the best possible care 
            for their furry companions. Using cutting-edge AI technology, we make 
            professional pet care guidance accessible to everyone.
          </Text>
        </View>

        {/* Features Section */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="star" size={24} color={theme.primary} />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Features</Text>
          </View>
          
          <View style={styles.featureItem}>
            <MaterialIcons name="pets" size={20} color={theme.primary} />
            <Text style={[styles.featureText, { color: theme.textSecondary }]}>
              AI-powered breed detection with 95%+ accuracy
            </Text>
          </View>

          <View style={styles.featureItem}>
            <MaterialIcons name="health-and-safety" size={20} color={theme.primary} />
            <Text style={[styles.featureText, { color: theme.textSecondary }]}>
              Comprehensive health and care recommendations
            </Text>
          </View>

          <View style={styles.featureItem}>
            <MaterialIcons name="local-hospital" size={20} color={theme.primary} />
            <Text style={[styles.featureText, { color: theme.textSecondary }]}>
              Find nearby veterinary clinics instantly
            </Text>
          </View>

          <View style={styles.featureItem}>
            <MaterialIcons name="bookmark" size={20} color={theme.primary} />
            <Text style={[styles.featureText, { color: theme.textSecondary }]}>
              Save and manage multiple pet profiles
            </Text>
          </View>

          <View style={styles.featureItem}>
            <MaterialIcons name="notifications" size={20} color={theme.primary} />
            <Text style={[styles.featureText, { color: theme.textSecondary }]}>
              Feeding and vaccination reminders
            </Text>
          </View>
        </View>

        {/* Technology Section */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="code" size={24} color={theme.primary} />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Powered By</Text>
          </View>
          <Text style={[styles.sectionText, { color: theme.textSecondary }]}>
            • OpenAI GPT-4o for intelligent breed detection{'\n'}
            • Google Places API for vet location services{'\n'}
            • Firebase for secure cloud storage{'\n'}
            • React Native & Expo for seamless mobile experience
          </Text>
        </View>

        {/* Contact Section */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="contact-support" size={24} color={theme.primary} />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Contact & Support</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => openLink('mailto:support@whiskapp.com')}
          >
            <MaterialIcons name="email" size={20} color={theme.primary} />
            <Text style={[styles.contactText, { color: theme.primary }]}>support@whiskapp.com</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => openLink('https://whiskapp.com')}
          >
            <MaterialIcons name="language" size={20} color={theme.primary} />
            <Text style={[styles.contactText, { color: theme.primary }]}>www.whiskapp.com</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => openLink('https://twitter.com/whiskapp')}
          >
            <MaterialIcons name="chat" size={20} color={theme.primary} />
            <Text style={[styles.contactText, { color: theme.primary }]}>@whiskapp</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={[styles.footer, { borderTopColor: theme.border }]}>
          <Text style={[styles.footerText, { color: theme.textSecondary }]}>
            Made with ❤️ for pet lovers everywhere
          </Text>
          <Text style={[styles.copyright, { color: theme.textTertiary }]}>
            © 2026 Whisk. All rights reserved.
          </Text>
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
    paddingBottom: 40,
  },
  logoSection: {
    alignItems: 'center',
    paddingVertical: 30,
    marginBottom: 16,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tagline: {
    fontSize: 16,
    marginBottom: 8,
  },
  version: {
    fontSize: 14,
  },
  section: {
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionText: {
    fontSize: 15,
    lineHeight: 22,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 10,
  },
  featureText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  contactText: {
    fontSize: 15,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
  },
  footerText: {
    fontSize: 14,
    marginBottom: 8,
  },
  copyright: {
    fontSize: 12,
  },
});