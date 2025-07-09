import { useAuth } from "@/hooks/useAuth";
import { Redirect, Stack } from "expo-router";
import React from "react";

export default function ProtectedLayout() {
  const { isAuthenticated } = useAuth();

//   if (!isAuthenticated) {
//     return <Redirect href="/(auth)" />;
//   }

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
