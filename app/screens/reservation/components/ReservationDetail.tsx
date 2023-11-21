// ReservationDetail.tsx
import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { useNavigation } from "@react-navigation/native";

interface ReservationDetailProps {
  id: string;
  title: string;
  imageUri: string;
  details: string;
  category: string;
  price: string;
  onBook: () => void;
}

const ReservationDetail: React.FC<ReservationDetailProps> = ({
  title,
  imageUri,
  details,
  category,
  price,
  onBook,
}) => {
  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: imageUri }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.details}>{details}</Text>
        <View style={styles.metaContainer}>
          <Text style={styles.category}>{category}</Text>
          <Text style={styles.price}>{price}</Text>
        </View>
        <TouchableOpacity onPress={onBook} style={styles.button}>
          <Text style={styles.buttonText}>Reservieren</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  details: {
    fontSize: 16,
    marginBottom: 10,
    color: "#666",
  },
  metaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  category: {
    fontSize: 16,
    color: "#666",
  },
  price: {
    fontSize: 16,
    color: "#666",
  },
  button: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ReservationDetail;
