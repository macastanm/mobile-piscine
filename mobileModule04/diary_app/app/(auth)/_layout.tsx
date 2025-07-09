import { useAuth } from "@/hooks/useAuth";
import { Redirect, Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

export default function AuthLayout() {
    const { isLoading, isAuthenticated } = useAuth();

  if (!isLoading) {
    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 500);
  }

//   if (isAuthenticated) {
//     return <Redirect href="/drinks" />;
//   }

  return <Slot />;
}
