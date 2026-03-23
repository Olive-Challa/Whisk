// app/_layout.js
import { Stack } from 'expo-router';
import { ThemeProvider } from '../contexts/ThemeContext';

export default function Layout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="home" />
        <Stack.Screen name="upload" />
        <Stack.Screen name="results" />
        <Stack.Screen name="my_pets" />
        <Stack.Screen name="add-pet" />
        <Stack.Screen name="pet_profile" />
        <Stack.Screen name="vet_locator" />
        <Stack.Screen name="feeding_reminders" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="about" />
      </Stack>
    </ThemeProvider>
  );
}