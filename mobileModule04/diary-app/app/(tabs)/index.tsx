import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Button,
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/auth";
import { diaryService } from "@/services/diaryService";
import { DiaryEntry, CreateDiaryEntry } from "@/types/diary";
import DiaryEntryCard from "@/components/DiaryEntryCard";
import DiaryEntryForm from "@/components/DiaryEntryForm";

export default function TabOneScreen() {
  const { user, signOut } = useAuth();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user?.email) {
      loadEntries();
    }
  }, [user?.email]);

  const loadEntries = async () => {
    try {
      setLoading(true);
      const lastEntries = await diaryService.getLastEntries(user!.email, 1000);
      setEntries(lastEntries);
    } catch (error) {
      // Don't show error alert for permission issues or empty collections
      // Just log the error and set empty entries
      console.error("Error loading entries:", error);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEntry = async (entryData: CreateDiaryEntry) => {
    try {
      setSubmitting(true);
      await diaryService.createEntry(entryData);
      setShowForm(false);
      await loadEntries(); // Reload entries after creating new one
      // Alert.alert("Success", "Diary entry created successfully!");
    } catch (error: any) {
      if (error.code === "permission-denied") {
        Alert.alert(
          "Error",
          "Permission denied. Please check your Firebase configuration."
        );
      } else {
        Alert.alert("Error", "Failed to create diary entry");
      }
      console.error("Error creating entry:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    try {
      await diaryService.deleteEntry(entryId);
      await loadEntries(); // Reload entries after deleting
      // Alert.alert("Success", "Diary entry deleted successfully!");
    } catch (error: any) {
      if (error.code === "permission-denied") {
        Alert.alert(
          "Error",
          "Permission denied. Please check your Firebase configuration."
        );
      } else {
        Alert.alert("Error", "Failed to delete diary entry");
      }
      console.error("Error deleting entry:", error);
    }
  };

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: signOut },
    ]);
  };

  if (!user?.email) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Ionicons name="person-circle" size={40} color="#007AFF" />
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Diary Entries</Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Loading entries...</Text>
          </View>
        ) : entries.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="book-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No diary entries yet</Text>
            <Text style={styles.emptySubtext}>
              Start writing about your day!
            </Text>
          </View>
        ) : (
          <ScrollView
            style={styles.entriesList}
            showsVerticalScrollIndicator={false}
          >
            {entries.map((entry) => (
              <DiaryEntryCard
                key={entry.id}
                entry={entry}
                onDelete={handleDeleteEntry}
              />
            ))}
          </ScrollView>
        )}

        {/* Add New Entry Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowForm(true)}
        >
          <Ionicons name="add" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Add New Entry</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for New Entry Form */}
      <Modal
        visible={showForm}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowForm(false)}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          <DiaryEntryForm
            onSubmit={handleCreateEntry}
            onCancel={() => setShowForm(false)}
            userEmail={user.email}
          />
          {submitting && (
            <View style={styles.submittingOverlay}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.submittingText}>Saving entry...</Text>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userEmail: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginLeft: 12,
  },
  signOutButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
  },
  entriesList: {
    flex: 1,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  closeButton: {
    padding: 8,
  },
  submittingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  submittingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
});
