import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../../routes/types"; // Stellen Sie sicher, dass der Pfad korrekt ist

interface BookingConfirmationProps {
  route: RouteProp<RootStackParamList, "BookingConfirmationPage">;
}

const BookingConfirmationPage: React.FC<BookingConfirmationProps> = ({
  route,
}) => {
  const { title, date, time, price } = route.params;
  const [guestName, setGuestName] = useState("");
  const [guestContact, setGuestContact] = useState("");

  const handleConfirmBooking = () => {
    if (!guestName || !guestContact) {
      Alert.alert("Fehler", "Bitte füllen Sie alle Felder aus.");
      return;
    }
    Alert.alert("Bestätigung", "Ihre Reservierung wurde erfolgreich gebucht.");
    // Hier würde die Logik stehen, um die Buchung zu verarbeiten
  };

  return (
    <SafeAreaView style={styles.container} edges={["right", "bottom", "left"]}>
      <ScrollView>
        <View style={styles.detailContainer}>
          <Text style={styles.header}>Ihre Reservierung</Text>
          <Text style={styles.detail}>{title}</Text>
          <Text style={styles.detail}>
            {date} um {time}
          </Text>
          <Text style={styles.detail}>Preis: {price}</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Ihr Name"
          value={guestName}
          onChangeText={setGuestName}
        />
        <TextInput
          style={styles.input}
          placeholder="Ihre Kontaktinformationen"
          value={guestContact}
          onChangeText={setGuestContact}
        />
        <TouchableOpacity style={styles.button} onPress={handleConfirmBooking}>
          <Text style={styles.buttonText}>Bestätigen</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// Hier würden Sie Ihre Styles definieren
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f7f7f7",
  },
  detailContainer: {
    marginBottom: 32,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  detail: {
    fontSize: 18,
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#5C6BC0",
    padding: 16,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  // Andere Styles...
});

export default BookingConfirmationPage;
