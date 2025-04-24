import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";
import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
} from "firebase/firestore";

import * as DocumentPicker from "expo-document-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import BookCard from "../components/BookCard";
import { Book } from "../types/books";
import { Ionicons } from "@expo/vector-icons";
import { auth, db, storage } from "../../firebaseConfig";

export default function BooksScreen({ navigation }: any) {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [pdf, setPdf] = useState<any>(null);
  const [coverImage, setCoverImage] = useState<any>(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  async function fetchBooks() {
    try {
      setLoading(true);
      const booksQuery = query(collection(db, "books"), orderBy("name"));
      const querySnapshot = await getDocs(booksQuery);
      setBooks(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Book))
      );
    } catch (error: any) {
      Alert.alert("Error", "Failed to load books");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const pickPdf = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });
      if (result.assets && result.assets.length > 0) {
        setPdf(result.assets[0]);
      }
    } catch (error) {
      console.error("Error picking PDF:", error);
    }
  };

  const pickCoverImage = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*",
      });
      if (result.assets && result.assets.length > 0) {
        setCoverImage(result.assets[0]);
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const uploadBook = async () => {
    try {
      if (!name || !author || !pdf) {
        return Alert.alert(
          "Error",
          "Book name, author and PDF file are required"
        );
      }

      setUploading(true);

      // Upload PDF
      const fileRef = ref(storage, `books/${Date.now()}_${pdf.name}`);
      const pdfResponse = await fetch(pdf.uri);
      const pdfBlob = await pdfResponse.blob();
      await uploadBytes(fileRef, pdfBlob);
      const pdfDownloadURL = await getDownloadURL(fileRef);

      // Upload cover image if available
      let coverUrl = "";
      if (coverImage) {
        const coverRef = ref(
          storage,
          `covers/${Date.now()}_${coverImage.name}`
        );
        const coverResponse = await fetch(coverImage.uri);
        const coverBlob = await coverResponse.blob();
        await uploadBytes(coverRef, coverBlob);
        coverUrl = await getDownloadURL(coverRef);
      }

      // Add book to Firestore
      await addDoc(collection(db, "books"), {
        name,
        author,
        description,
        pdfUrl: pdfDownloadURL,
        coverUrl,
        addedAt: new Date(),
      });

      setAddModalVisible(false);
      resetForm();
      Alert.alert("Success", "Book added successfully");
      fetchBooks();
    } catch (error: any) {
      Alert.alert("Upload Error", error.message);
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setAuthor("");
    setDescription("");
    setPdf(null);
    setCoverImage(null);
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Image
        source={{
          uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCaMKlAxUZuLmCbIXvXd3aAh2UCTLaxCVPnaNYzrOdu9xLweSQiw&s=10&ec=72940545",
        }}
        style={styles.emptyImage}
      />
      <Text style={styles.emptyText}>No books found</Text>
      <Text style={styles.emptySubtext}>
        Add your first book to get started
      </Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setAddModalVisible(true)}
      >
        <Text style={styles.addButtonText}>Add Book</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Book Collection</Text>
        <TouchableOpacity
          style={styles.addIconButton}
          onPress={() => setAddModalVisible(true)}
        >
          <Ionicons name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Books List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Loading books...</Text>
        </View>
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <BookCard book={item} onPress={setSelectedBook} />
          )}
          numColumns={2}
          columnWrapperStyle={styles.bookRow}
          contentContainerStyle={styles.booksList}
          ListEmptyComponent={renderEmptyList}
        />
      )}

      {/* Book Detail Modal */}
      {selectedBook && (
        <Modal visible transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedBook.name}</Text>
                <TouchableOpacity onPress={() => setSelectedBook(null)}>
                  <Ionicons name="close" size={24} color="#64748b" />
                </TouchableOpacity>
              </View>

              <View style={styles.bookDetails}>
                {selectedBook.coverUrl ? (
                  <Image
                    source={{ uri: selectedBook.coverUrl }}
                    style={styles.bookCover}
                  />
                ) : (
                  <View style={styles.noCover}>
                    <Ionicons name="book-outline" size={48} color="#94a3b8" />
                  </View>
                )}

                <View style={styles.bookInfo}>
                  <Text style={styles.bookAuthor}>
                    by {selectedBook.author}
                  </Text>

                  {selectedBook.description ? (
                    <Text style={styles.bookDescription}>
                      {selectedBook.description}
                    </Text>
                  ) : (
                    <Text style={styles.noDescription}>
                      No description available
                    </Text>
                  )}
                </View>
              </View>

              <TouchableOpacity
                style={styles.readButton}
                onPress={() => {
                  setSelectedBook(null);
                  navigation.navigate("Reader", {
                    pdfUrl: selectedBook.pdfUrl,
                    bookName: selectedBook.name,
                  });
                }}
              >
                <Text style={styles.readButtonText}>Read Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Add Book Modal */}
      <Modal visible={addModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.addModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Book</Text>
              <TouchableOpacity
                onPress={() => {
                  setAddModalVisible(false);
                  resetForm();
                }}
              >
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Book Title</Text>
                <TextInput
                  placeholder="Enter book title"
                  value={name}
                  onChangeText={setName}
                  style={styles.textInput}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Author</Text>
                <TextInput
                  placeholder="Enter author name"
                  value={author}
                  onChangeText={setAuthor}
                  style={styles.textInput}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Description (optional)</Text>
                <TextInput
                  placeholder="Enter book description"
                  value={description}
                  onChangeText={setDescription}
                  style={[styles.textInput, styles.textArea]}
                  multiline
                  numberOfLines={4}
                />
              </View>

              <View style={styles.fileSelectors}>
                <TouchableOpacity
                  style={styles.fileButton}
                  onPress={pickCoverImage}
                >
                  <Ionicons name="image-outline" size={20} color="#3b82f6" />
                  <Text style={styles.fileButtonText}>
                    {coverImage ? "Cover Selected" : "Select Cover"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.fileButton} onPress={pickPdf}>
                  <Ionicons name="document-outline" size={20} color="#3b82f6" />
                  <Text style={styles.fileButtonText}>
                    {pdf ? "PDF Selected" : "Select PDF"}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[
                  styles.uploadButton,
                  (uploading || !name || !author || !pdf) &&
                    styles.disabledButton,
                ]}
                onPress={uploadBook}
                disabled={uploading || !name || !author || !pdf}
              >
                {uploading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.uploadButtonText}>Upload Book</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
  },
  addIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
  },
  booksList: {
    padding: 16,
    paddingBottom: 80,
  },
  bookRow: {
    justifyContent: "space-between",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#64748b",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyImage: {
    width: 150,
    height: 150,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 24,
    textAlign: "center",
  },
  addButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    maxHeight: "80%",
  },
  addModalContent: {
    width: "90%",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
  },
  bookDetails: {
    alignItems: "center",
    marginBottom: 20,
  },
  bookCover: {
    width: 150,
    height: 220,
    borderRadius: 8,
    marginBottom: 16,
  },
  noCover: {
    width: 150,
    height: 220,
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  bookInfo: {
    width: "100%",
  },
  bookAuthor: {
    fontSize: 16,
    color: "#64748b",
    marginBottom: 12,
    textAlign: "center",
  },
  bookDescription: {
    fontSize: 14,
    color: "#334155",
    lineHeight: 22,
  },
  noDescription: {
    fontSize: 14,
    color: "#94a3b8",
    fontStyle: "italic",
    textAlign: "center",
  },
  readButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  readButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  formContainer: {
    marginTop: 8,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#475569",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: "#1e293b",
    backgroundColor: "#f8fafc",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  fileSelectors: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  fileButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#3b82f6",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    width: "48%",
  },
  fileButtonText: {
    color: "#3b82f6",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
  },
  uploadButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  uploadButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    backgroundColor: "#94a3b8",
  },
});
