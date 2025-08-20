import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Alert,
  useColorScheme,
  Dimensions,
  Image,
} from "react-native";
import { router } from "expo-router";
import { Text, View } from "@/components/Themed";
import { FontAwesome as Icon } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const currentTheme = useColorScheme();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);

    try {
      router.replace("/signIn");
    } catch (error) {
      Alert.alert("Error", "Failed to navigate. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
    },
    content: {
      width: "100%",
      maxWidth: 400,
      alignItems: "center",
    },
    header: {
      alignItems: "center",
      marginBottom: 60,
    },
    logo: {
      width: 120,
      height: 120,
      marginBottom: 20,
      resizeMode: "contain",
    },
    title: {
      fontSize: 36,
      fontWeight: "bold",
      marginBottom: 8,
      textAlign: "center",
    },
    subtitle: {
      fontSize: 16,
      textAlign: "center",
      opacity: 0.7,
      lineHeight: 22,
    },
    buttonContainer: {
      width: width - 40,
      marginBottom: 16,
    },
    button: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 12,
      borderWidth: 1,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    loginButton: {
      backgroundColor: currentTheme === "dark" ? "#24292e" : "#ffffff",
      borderColor: currentTheme === "dark" ? "#444" : "#e1e5e9",
    },
    buttonText: {
      fontSize: 16,
      fontWeight: "600",
      marginLeft: 12,
      color: currentTheme === "dark" ? "#ffffff" : "#24292e",
    },
    icon: {
      fontSize: 20,
      color: currentTheme === "dark" ? "#ffffff" : "#24292e",
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Image
            source={require("../../assets/images/diary-app.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>Welcome to your Diary</Text>
          <Text style={styles.subtitle}>
            Your personal space for thoughts and memories
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.loginButton]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Icon name="user" style={styles.icon} />
            <Text style={styles.buttonText}>
              {isLoading ? "Signing in..." : "Sign In Here"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
