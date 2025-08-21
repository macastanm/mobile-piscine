import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { DiaryEntry, CreateDiaryEntry } from "@/types/diary";

const DIARY_COLLECTION = "diary_entries";

export const diaryService = {
  // Create a new diary entry
  async createEntry(entry: CreateDiaryEntry): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, DIARY_COLLECTION), {
        ...entry,
        createdAt: new Date(),
      });
      return docRef.id;
    } catch (error: any) {
      console.error("Error creating diary entry:", error);
      throw error;
    }
  },

  // Get the last 3 entries for a user
  async getLastEntries(
    email: string,
    limitCount: number = 3
  ): Promise<DiaryEntry[]> {
    try {
      const q = query(
        collection(db, DIARY_COLLECTION),
        where("email", "==", email),
        orderBy("createdAt", "desc"),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const entries: DiaryEntry[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        entries.push({
          id: doc.id,
          email: data.email,
          date: data.date,
          title: data.title,
          icon: data.icon,
          text: data.text,
          createdAt: data.createdAt.toDate(),
        });
      });

      return entries;
    } catch (error: any) {
      // If it's a permission error or collection doesn't exist, return empty array
      // This is normal for new users
      if (error.code === "permission-denied" || error.code === "unavailable") {
        console.log("No diary entries found or collection doesn't exist yet");
        return [];
      }
      console.error("Error getting diary entries:", error);
      throw error;
    }
  },

  // Delete a diary entry
  async deleteEntry(entryId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, DIARY_COLLECTION, entryId));
    } catch (error: any) {
      console.error("Error deleting diary entry:", error);
      throw error;
    }
  },

  // Get all entries for a user (for future use)
  async getAllEntries(email: string): Promise<DiaryEntry[]> {
    try {
      const q = query(
        collection(db, DIARY_COLLECTION),
        where("email", "==", email),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const entries: DiaryEntry[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        entries.push({
          id: doc.id,
          email: data.email,
          date: data.date,
          title: data.title,
          icon: data.icon,
          text: data.text,
          createdAt: data.createdAt.toDate(),
        });
      });

      return entries;
    } catch (error: any) {
      console.error("Error getting all diary entries:", error);
      throw error;
    }
  },
};
