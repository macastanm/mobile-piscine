import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CreateDiaryEntry } from "@/types/diary";

interface DiaryEntryFormProps {
  onSubmit: (entry: CreateDiaryEntry) => void;
  onCancel: () => void;
  userEmail: string;
}

const feelingIcons = [
  { icon: "😊", label: "Happy" },
  { icon: "😢", label: "Sad" },
  { icon: "😡", label: "Angry" },
  { icon: "😴", label: "Tired" },
  { icon: "🤔", label: "Thoughtful" },
  { icon: "😍", label: "Excited" },
  { icon: "😰", label: "Anxious" },
  { icon: "😌", label: "Peaceful" },
];

export default function DiaryEntryForm({
  onSubmit,
  onCancel,
  userEmail,
}: DiaryEntryFormProps) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("😊");
  const date = new Date().toISOString().split("T")[0];

  const handleSubmit = () => {
    if (!title.trim() || !text.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const entry: CreateDiaryEntry = {
      email: userEmail,
      date,
      title: title.trim(),
      icon: selectedIcon,
      text: text.trim(),
    };

    onSubmit(entry);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>New Diary Entry</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Date</Text>
        <TextInput
          style={[styles.input, styles.readOnlyInput]}
          value={date}
          editable={false}
          placeholder="YYYY-MM-DD"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="What's on your mind today?"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>How are you feeling?</Text>
        <View style={styles.iconContainer}>
          {feelingIcons.map((feeling) => (
            <TouchableOpacity
              key={feeling.icon}
              style={[
                styles.iconButton,
                selectedIcon === feeling.icon && styles.selectedIcon,
              ]}
              onPress={() => setSelectedIcon(feeling.icon)}
            >
              <Text style={styles.iconText}>{feeling.icon}</Text>
              <Text style={styles.iconLabel}>{feeling.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Your thoughts</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={text}
          onChangeText={setText}
          placeholder="Write about your day..."
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Save Entry</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  readOnlyInput: {
    backgroundColor: "#f0f0f0",
    color: "#666",
  },
  textArea: {
    height: 120,
  },
  iconContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  iconButton: {
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f9f9f9",
    width: "48%",
    marginBottom: 8,
  },
  selectedIcon: {
    borderColor: "#007AFF",
    backgroundColor: "#E3F2FD",
  },
  iconText: {
    fontSize: 24,
    marginBottom: 4,
  },
  iconLabel: {
    fontSize: 12,
    color: "#666",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 10,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  submitButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#007AFF",
    marginLeft: 10,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
