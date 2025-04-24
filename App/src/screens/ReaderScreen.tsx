import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";
import Pdf from "react-native-pdf";
import { Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ReaderScreen({ route, navigation }: any) {
  const { pdfUrl, bookName } = route.params;
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Set the header title
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: bookName || "PDF Reader",
    });
  }, [navigation, bookName]);

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Loading PDF...</Text>
        </View>
      )}

      <Pdf
        source={{ uri: pdfUrl }}
        style={styles.pdf}
        onLoadComplete={(numberOfPages, filePath) => {
          setLoading(false);
          setTotalPages(numberOfPages);
        }}
        onPageChanged={(page) => {
          setPageNumber(page);
        }}
        onError={(error) => {
          console.log(error);
          setLoading(false);
        }}
      />

      <View style={styles.controls}>
        <Text style={styles.pageInfo}>
          Page {pageNumber} of {totalPages}
        </Text>

        <View style={styles.navigationButtons}>
          <TouchableOpacity style={styles.navButton}>
            <Ionicons name="chevron-back" size={24} color="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.navButton}>
            <Ionicons name="chevron-forward" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    zIndex: 1,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#64748b",
  },
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  controls: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(30, 41, 59, 0.8)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  pageInfo: {
    color: "#ffffff",
    fontSize: 14,
  },
  navigationButtons: {
    flexDirection: "row",
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(59, 130, 246, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
});
