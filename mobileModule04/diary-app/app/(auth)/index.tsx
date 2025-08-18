import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Alert,
  useColorScheme,
} from "react-native";
import { router } from "expo-router";
import { Text, View } from "@/components/Themed";
import { FontAwesome as Icon } from "@expo/vector-icons";

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

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to Diary</Text>
          <Text style={styles.subtitle}>
            Your personal space for thoughts and memories
          </Text>
        </View>

        <Icon.Button
          name="link"
          color={currentTheme === "dark" ? "white" : "black"}
          backgroundColor="transparent"
          size={30}
          onPress={() => {
            handleLogin();
          }}
          disabled={isLoading}
        >
          <Text style={{ fontSize: 17, fontWeight: "500" }}>
            {isLoading ? "Signing in..." : "Sign In Here"}
          </Text>
        </Icon.Button>
      </View>
    </View>
  );
}

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
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.7,
    lineHeight: 24,
  },
  buttonContainer: {
    width: "100%",
  },
  loginButton: {
    width: "100%",
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
