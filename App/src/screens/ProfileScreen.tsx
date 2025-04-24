import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";

import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { Book } from "../types/books";
import { auth, db } from "../../firebaseConfig";

export default function ProfileScreen({ navigation }: any) {
  const [profile, setProfile] = useState<any>({});
  const [myBooks, setMyBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
    fetchMyBooks();
  }, []);

  const fetchProfile = async () => {
    try {
      if (!auth.currentUser?.uid) return;

      const userRef = doc(db, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setProfile(userSnap.data());
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchMyBooks = async () => {
    try {
      setLoading(true);
      if (!auth.currentUser?.uid) return;

      // This is a placeholder - in a real app, you'd have a relationship between users and books
      // For now, we'll just fetch the first 5 books as an example
      const booksQuery = query(collection(db, "books"));
      const querySnapshot = await getDocs(booksQuery);

      const books = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() } as Book))
        .slice(0, 5);

      setMyBooks(books);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error: any) {
      Alert.alert("Logout Error", error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImage}>
            <Text style={styles.profileInitial}>
              {profile.firstName ? profile.firstName[0].toUpperCase() : "U"}
            </Text>
          </View>
        </View>

        <Text style={styles.name}>
          {profile.firstName} {profile.lastName}
        </Text>
        <Text style={styles.email}>{auth.currentUser?.email}</Text>

        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{myBooks.length}</Text>
          <Text style={styles.statLabel}>Books</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Reading</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Books</Text>

        {loading ? (
          <ActivityIndicator
            size="small"
            color="#3b82f6"
            style={styles.loader}
          />
        ) : myBooks.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.booksScrollContent}
          >
            {myBooks.map((book) => (
              <TouchableOpacity
                key={book.id}
                style={styles.bookItem}
                onPress={() => navigation.navigate("Books")}
              >
                <Image
                  source={{
                    uri:
                      book.coverUrl ||
                      "https://via.placeholder.com/120x160?text=No+Cover",
                  }}
                  style={styles.bookCover}
                />
                <Text style={styles.bookTitle} numberOfLines={2}>
                  {book.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyBooks}>
            <Text style={styles.emptyText}>
              You haven't added any books yet
            </Text>
            <TouchableOpacity
              style={styles.addBookButton}
              onPress={() => navigation.navigate("Books")}
            >
              <Text style={styles.addBookButtonText}>Browse Books</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.optionItem}>
          <Ionicons name="settings-outline" size={24} color="#475569" />
          <Text style={styles.optionText}>Settings</Text>
          <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionItem}>
          <Ionicons name="help-circle-outline" size={24} color="#475569" />
          <Text style={styles.optionText}>Help & Support</Text>
          <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionItem}>
          <Ionicons
            name="information-circle-outline"
            size={24}
            color="#475569"
          />
          <Text style={styles.optionText}>About</Text>
          <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionItem, styles.logoutOption]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={24} color="#ef4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    backgroundColor: "#ffffff",
    padding: 24,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  profileImageContainer: {
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
  },
  profileInitial: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#ffffff",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: "#64748b",
    marginBottom: 16,
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#3b82f6",
    borderRadius: 20,
  },
  editButtonText: {
    color: "#3b82f6",
    fontSize: 14,
    fontWeight: "500",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    paddingVertical: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#64748b",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#e2e8f0",
  },
  section: {
    backgroundColor: "#ffffff",
    padding: 16,
    marginBottom: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e2e8f0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 16,
  },
  loader: {
    marginVertical: 20,
  },
  booksScrollContent: {
    paddingBottom: 8,
  },
  bookItem: {
    width: 120,
    marginRight: 16,
  },
  bookCover: {
    width: 120,
    height: 160,
    borderRadius: 8,
    marginBottom: 8,
  },
  bookTitle: {
    fontSize: 14,
    color: "#1e293b",
    textAlign: "center",
  },
  emptyBooks: {
    alignItems: "center",
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 12,
  },
  addBookButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#3b82f6",
    borderRadius: 20,
  },
  addBookButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
  },
  optionsContainer: {
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 24,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: "#1e293b",
    marginLeft: 12,
  },
  logoutOption: {
    borderBottomWidth: 0,
  },
  logoutText: {
    flex: 1,
    fontSize: 16,
    color: "#ef4444",
    marginLeft: 12,
  },
});
