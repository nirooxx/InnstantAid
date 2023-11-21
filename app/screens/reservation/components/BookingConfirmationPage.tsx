// BookingConfirmationPage.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  ScrollView,
} from "react-native";

interface BookingDetails {
  title: string;
  date: string;
  time: string;
  numberOfGuests: number;
}

interface BookingConfirmationPageProps {
  reservationDetail: BookingDetails;
  onCompleteBooking: () => void;
}

const BookingConfirmationPage: React.FC<BookingConfirmationPageProps> = ({
  reservationDetail,
  onCompleteBooking,
}) => {
  const [guestName, setGuestName] = useState("");
  const [guestContact, setGuestContact] = useState("");

  const handleConfirmBooking = () => {
    // Validate input fields
    if (!guestName || !guestContact) {
      Alert.alert("Bitte füllen Sie alle Felder aus.");
      return;
    }
    // Implement booking logic here, e.g., send data to server
    // ...
    Alert.alert(
      "Reservierung bestätigt",
      "Ihre Reservierung wurde erfolgreich vorgenommen."
    );
    onCompleteBooking(); // Callback to reset state or navigate to another screen
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Reservierung bestätigen</Text>
      <Text style={styles.detailText}>
        {reservationDetail.title} am {reservationDetail.date} um{" "}
        {reservationDetail.time}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={guestName}
        onChangeText={setGuestName}
      />
      <TextInput
        style={styles.input}
        placeholder="Kontaktinformationen"
        value={guestContact}
        onChangeText={setGuestContact}
      />
      <Button title="Reservierung bestätigen" onPress={handleConfirmBooking} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  // ... Weitere Styles
});

export default BookingConfirmationPage;
