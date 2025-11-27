// app/_layout.js
// Central navigation stack for the Whisk app using expo-router.

import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,        // We use our own custom headers / layouts
        animation: "slide_from_right", // Smooth navigation transitions
      }}
    />
  );
}
