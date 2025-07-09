import React from "react";
import { StyleSheet, TouchableOpacity, Alert, Image } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useAuth } from "@/hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";

export function UserProfile() {
  const colorScheme = useColorScheme();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
          } catch (error) {
            Alert.alert("Error", "Failed to sign out. Please try again.");
          }
        },
      },
    ]);
  };

  if (!user) {
    return null;
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.userInfo}>
        {user.photoURL ? (
          <Image source={{ uri: user.photoURL }} style={styles.avatar} />
        ) : (
          <ThemedView style={styles.avatarPlaceholder}>
            <Ionicons
              name="person"
              size={24}
              color={Colors[colorScheme ?? "light"].text}
            />
          </ThemedView>
        )}
        <ThemedView style={styles.userDetails}>
          <ThemedText style={styles.userName}>
            {user.displayName || "User"}
          </ThemedText>
          <ThemedText style={styles.userEmail}>{user.email}</ThemedText>
          <ThemedText style={styles.provider}>
            Signed in with{" "}
            {user.providerId === "google.com" ? "Google" : "GitHub"}
          </ThemedText>
        </ThemedView>
      </ThemedView>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons
          name="log-out-outline"
          size={20}
          color={Colors[colorScheme ?? "light"].text}
        />
        <ThemedText style={styles.logoutText}>Sign Out</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 2,
  },
  provider: {
    fontSize: 12,
    opacity: 0.5,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
  },
  logoutText: {
    marginLeft: 4,
    fontSize: 14,
  },
});
