import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { WebView } from "react-native-webview";

interface Message {
  id: string;
  text: string;
  sender: "user" | "system";
  timestamp: Date;
}

const App: React.FC = () => {
  const pdfUrl =
    "https://res.cloudinary.com/dpisj0lfy/raw/upload/v1743652866/books/book_1743652863306";

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Welcome to Book Chat! Ask any questions about the book.",
      sender: "system",
      timestamp: new Date(),
    },
  ]);

  const flatListRef = useRef<FlatList>(null);
  const webViewRef = useRef<WebView>(null);

  const handleSend = () => {
    if (message.trim() === "") return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setMessage("");

    // Simulate response after 1 second
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thanks for your question! I'll help you understand this part of the book.",
        sender: "system",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, response]);

      // Scroll to bottom
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 1000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>📚 Book Reader</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.bookContainer}>
            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6c5ce7" />
                <Text style={styles.loadingText}>Loading your book...</Text>
              </View>
            )}
            <WebView
              ref={webViewRef}
              source={{
                uri: `https://docs.google.com/gview?embedded=true&url=${pdfUrl}`,
              }}
              style={styles.webview}
              onLoad={() => setLoading(false)}
            />
          </View>

          <View style={styles.chatContainer}>
            <View style={styles.chatHeader}>
              <Text style={styles.chatTitle}>Book Chat</Text>
            </View>

            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item.id}
              style={styles.messageList}
              onContentSizeChange={() =>
                flatListRef.current?.scrollToEnd({ animated: true })
              }
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.messageBubble,
                    item.sender === "user"
                      ? styles.userMessage
                      : styles.systemMessage,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      item.sender === "user"
                        ? styles.userMessageText
                        : styles.systemMessageText,
                    ]}
                  >
                    {item.text}
                  </Text>
                  <Text style={styles.timestamp}>
                    {formatTime(item.timestamp)}
                  </Text>
                </View>
              )}
            />

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Ask about the book..."
                value={message}
                onChangeText={setMessage}
                multiline
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  message.trim() === ""
                    ? styles.sendButtonDisabled
                    : styles.sendButtonActive,
                ]}
                onPress={handleSend}
                disabled={message.trim() === ""}
              >
                <Text style={styles.sendButtonText}>→</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#6c5ce7",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  content: {
    flex: 1,
    padding: 15,
  },
  bookContainer: {
    flex: 3,
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    zIndex: 10,
  },
  loadingText: {
    marginTop: 10,
    color: "#6c5ce7",
    fontSize: 16,
  },
  webview: {
    flex: 1,
  },
  chatContainer: {
    flex: 2,
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chatHeader: {
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  messageList: {
    flex: 1,
    padding: 10,
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 18,
    marginBottom: 10,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#6c5ce7",
    borderTopRightRadius: 4,
  },
  systemMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#f1f3f6",
    borderTopLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
  },
  userMessageText: {
    color: "#fff",
  },
  systemMessageText: {
    color: "#333",
  },
  timestamp: {
    fontSize: 11,
    color: "#999",
    alignSelf: "flex-end",
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#f1f3f6",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
  },
  sendButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  sendButtonActive: {
    backgroundColor: "#6c5ce7",
  },
  sendButtonDisabled: {
    backgroundColor: "#d1d1d1",
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default App;
