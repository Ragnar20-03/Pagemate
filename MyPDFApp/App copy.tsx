import React from "react";
import { View, StyleSheet, Text, SafeAreaView } from "react-native";
import { WebView } from "react-native-webview";

const App: React.FC = () => {
  const pdfUrl =
    "https://res.cloudinary.com/dpisj0lfy/raw/upload/v1743652866/books/book_1743652863306";

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>📖 Book Preview</Text>
      <View style={styles.card}>
        <WebView
          source={{
            uri: `https://docs.google.com/gview?embedded=true&url=${pdfUrl}`,
          }}
          style={styles.webview}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  webview: {
    flex: 1,
    borderRadius: 10,
  },
});

export default App;
