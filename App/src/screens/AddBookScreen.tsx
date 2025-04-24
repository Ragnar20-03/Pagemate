// screens/AddBookScreen.tsx
import React, { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebaseConfig";

export default function AddBookScreen({ navigation }: any) {
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [pdf, setPdf] = useState<any>(null);

  const pickPdf = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
    });
    if (result.assets) {
      setPdf(result.assets[0]);
    }
  };

  const uploadBook = async () => {
    try {
      if (!pdf) return Alert.alert("No PDF selected");
      const fileRef = ref(storage, `books/${pdf.name}`);
      const response = await fetch(pdf.uri);
      const blob = await response.blob();
      await uploadBytes(fileRef, blob);
      const downloadURL = await getDownloadURL(fileRef);

      await addDoc(collection(db, "books"), {
        name,
        author,
        pdfUrl: downloadURL,
      });

      navigation.goBack();
    } catch (error: any) {
      Alert.alert("Upload Error", error.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="Book Name" value={name} onChangeText={setName} />
      <TextInput placeholder="Author" value={author} onChangeText={setAuthor} />
      <Button title="Select PDF" onPress={pickPdf} />
      <Button title="Upload Book" onPress={uploadBook} />
    </View>
  );
}
