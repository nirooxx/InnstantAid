import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import ReservationsList from "./components/ReservationsList";
import ReservationDetail from "./components/ReservationDetail";

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

const getReservationDetails = (id: any) => {
  return reservationData.find((reservation) => reservation.id === id);
};

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

  const handleBook = () => {
    console.log("Booking confirmed for reservation id:", selectedReservationId);
  };

  const selectedReservation = selectedReservationId
    ? getReservationDetails(selectedReservationId)
    : null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
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
        {!selectedReservationId && (
          <Icon
            name="search-outline"
            size={30}
            color="#000"
            style={styles.searchIcon}
          />
        )}
      </View>
      {selectedReservation ? (
        <ReservationDetail
          id={selectedReservation.id}
          title={selectedReservation.title}
          imageUri={selectedReservation.imageUri}
          details={selectedReservation.description}
          category={selectedReservation.category}
          price={selectedReservation.price}
          onBook={handleBook}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#ffffff", // Weißer Hintergrund für den Header
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
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
