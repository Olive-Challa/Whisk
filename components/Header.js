import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';

export default function Header({ title, showMenu = true }) {
  const router = useRouter();
  const { theme } = useTheme();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const menuItems = [
    { title: 'Home', icon: 'home', route: '/home' },
    { title: 'Breed Detector', icon: 'pets', route: '/upload' },
    { title: 'My Pets', icon: 'favorite', route: '/my_pets' },
    { title: 'Find Vets', icon: 'local-hospital', route: '/vet_locator' },
    { title: 'Feeding Reminders', icon: 'restaurant', route: '/feeding_reminders' },
    { title: 'Settings', icon: 'settings', route: '/settings' },
    { title: 'About', icon: 'info', route: '/about' },
  ];

  return (
    <>
      <View style={[styles.header, { backgroundColor: theme.headerBg, borderBottomColor: theme.border }]}>
        {showMenu && (
          <TouchableOpacity
            onPress={() => setMenuOpen(!menuOpen)}
            style={styles.menuButton}
          >
            <MaterialIcons name="menu" size={28} color={theme.primary} />
          </TouchableOpacity>
        )}
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
        <View style={styles.placeholder} />
      </View>

      {menuOpen && (
        <>
          <TouchableOpacity
            style={styles.overlay}
            activeOpacity={1}
            onPress={() => setMenuOpen(false)}
          />
          <View style={[styles.menu, { backgroundColor: theme.card }]}>
            <View style={[styles.menuHeader, { borderBottomColor: theme.border }]}>
              <Text style={[styles.menuTitle, { color: theme.primary }]}>Whisk Menu</Text>
              <TouchableOpacity onPress={() => setMenuOpen(false)}>
                <MaterialIcons name="close" size={24} color={theme.iconSecondary} />
              </TouchableOpacity>
            </View>

            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => {
                  setMenuOpen(false);
                  router.push(item.route);
                }}
              >
                <MaterialIcons name={item.icon} size={24} color={theme.primary} />
                <Text style={[styles.menuItemText, { color: theme.text }]}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  menuButton: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 36,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 998,
  },
  menu: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '80%',
    height: '100%',
    zIndex: 999,
    paddingTop: 60,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
  },
  menuItemText: {
    fontSize: 18,
  },
});