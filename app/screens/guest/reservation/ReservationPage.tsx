import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import ReservationsList from "./components/ReservationsList";
import ReservationDetail from "./components/ReservationDetail";
import { SafeAreaView } from "react-native-safe-area-context";

const reservationData = [
  {
    id: "1",
    title: "Luxury Spa",
    description: "A relaxing spa experience to rejuvenate your senses.",
    imageUri:
      "https://images.livemint.com/rf/Image-621x414/LiveMint/Period2/2019/01/12/Photos/Processed/uri1-U20573096666kjH--621x414@LiveMint.jpg",
    category: "Spa",
    price: "$200",
  },
  {
    id: "2",
    title: "Restaurant",
    description: "Book a table in our fantastic Restaurant",
    imageUri:
      "https://images.livemint.com/rf/Image-621x414/LiveMint/Period2/2019/01/12/Photos/Processed/uri1-U20573096666kjH--621x414@LiveMint.jpg",
    category: "Restaurant",
    price: "$500",
  },
  // ... add more reservations
];

const ReservationPage: React.FC = () => {
  const [selectedReservationId, setSelectedReservationId] = useState<
    string | null
  >(null);

  const handleBackToList = () => {
    setSelectedReservationId(null);
  };

  const handleItemSelect = (id: string) => {
    setSelectedReservationId(id);
  };

  const selectedReservation = selectedReservationId
    ? reservationData.find(
        (reservation) => reservation.id === selectedReservationId
      )
    : null;

  return (
    <SafeAreaView style={styles.container} edges={["right", "bottom", "left"]}>
      <View>
        {selectedReservationId && (
          <TouchableOpacity
            onPress={handleBackToList}
            style={styles.backButton}
          >
            <Icon name="chevron-back-outline" size={30} color="#000" />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>
          {selectedReservationId ? selectedReservation?.title : ""}
        </Text>
      </View>
      {selectedReservation ? (
        <ReservationDetail
          {...selectedReservation}
          id={selectedReservation.id}
          title={selectedReservation.title}
          imageUri={selectedReservation.imageUri}
          details={selectedReservation.description}
          category={selectedReservation.category}
          price={selectedReservation.price}
        />
      ) : (
        <ReservationsList
          data={reservationData}
          onItemSelect={handleItemSelect}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    textAlign: "center",
  },
  backButton: {
    // Hinzufügen von Stilen für bessere Touch-Feedback-Erfahrung
    padding: 10,
  },
  searchIcon: {
    // Hinzufügen von Stilen für bessere Touch-Feedback-Erfahrung
    padding: 10,
  },
});

export default ReservationPage;
