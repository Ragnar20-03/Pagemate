import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ImageBackground,
} from "react-native";
import { auth } from "../../firebaseConfig";

export default function HomeScreen({ navigation }: any) {
  const username = auth.currentUser?.displayName || "Reader";
  const firstName = username.split(" ")[0];

  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.heroContainer}>
        <ImageBackground
          source={{
            uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxLVPC36qtwAVgMoIc3jOi5dXzTrIlyp6Nha3IJc9H1_3p0aD04Q&s=10&ec=72940545",
          }}
          style={styles.heroBg}
          resizeMode="cover"
        >
          <View style={styles.heroOverlay}>
            <Text style={styles.greeting}>Hello, {firstName}</Text>
            <Text style={styles.heroTitle}>
              Discover Your Next Favorite Book
            </Text>
            <Text style={styles.heroSubtitle}>
              Explore thousands of books to read, share, and enjoy
            </Text>
            <TouchableOpacity
              style={styles.heroButton}
              onPress={() => navigation.navigate("Books")}
            >
              <Text style={styles.heroButtonText}>Explore Books</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>

      {/* Featured Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Featured Collections</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredScrollContent}
        >
          <TouchableOpacity style={styles.featuredItem}>
            <Image
              source={{
                uri: "https://img.freepik.com/free-photo/turn-page-collage_23-2149876327.jpg?semt=ais_hybrid&w=740",
              }}
              style={styles.featuredImage}
            />
            <Text style={styles.featuredTitle}>Fiction</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.featuredItem}>
            <Image
              source={{
                uri: "https://img.freepik.com/free-photo/turn-page-collage_23-2149876327.jpg?semt=ais_hybrid&w=740",
              }}
              style={styles.featuredImage}
            />
            <Text style={styles.featuredTitle}>Non-Fiction</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.featuredItem}>
            <Image
              source={{
                uri: "https://img.freepik.com/free-photo/turn-page-collage_23-2149876327.jpg?semt=ais_hybrid&w=740",
              }}
              style={styles.featuredImage}
            />
            <Text style={styles.featuredTitle}>Sci-Fi</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.featuredItem}>
            <Image
              //   source={require("../assets/mystery.jpg")}
              source={{
                uri: "https://img.freepik.com/free-photo/turn-page-collage_23-2149876327.jpg?semt=ais_hybrid&w=740",
              }}
              style={styles.featuredImage}
            />
            <Text style={styles.featuredTitle}>Mystery</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("Books")}
        >
          <Text style={styles.actionButtonText}>View All Books</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={() => navigation.navigate("Profile")}
        >
          <Text style={styles.secondaryButtonText}>My Profile</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  heroContainer: {
    height: 400,
    width: "100%",
  },
  heroBg: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 24,
    justifyContent: "center",
  },
  greeting: {
    fontSize: 16,
    color: "#e2e8f0",
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#e2e8f0",
    marginBottom: 24,
    lineHeight: 24,
  },
  heroButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  heroButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  sectionContainer: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 16,
  },
  featuredScrollContent: {
    paddingBottom: 8,
    paddingRight: 16,
  },
  featuredItem: {
    width: 140,
    marginRight: 16,
  },
  featuredImage: {
    width: 140,
    height: 180,
    borderRadius: 8,
    marginBottom: 8,
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1e293b",
    textAlign: "center",
  },
  actionsContainer: {
    padding: 24,
    paddingTop: 0,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#3b82f6",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 12,
  },
  actionButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#3b82f6",
    marginRight: 0,
    marginLeft: 12,
  },
  secondaryButtonText: {
    color: "#3b82f6",
    fontSize: 16,
    fontWeight: "600",
  },
});
