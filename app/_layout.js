// app/_layout.js
// Central navigation stack for the Whisk app using expo-router.

import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    />
  );
}
