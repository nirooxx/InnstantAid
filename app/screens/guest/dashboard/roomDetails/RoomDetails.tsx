import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

interface RoomDetailsProps {
  guestName: string;
  role: string; // Diese Eigenschaft wurde hinzugefügt, um die Rolle (z. B. "General Doctor") darzustellen
  date: string; // Für das Datum
  time: string; // Für die Uhrzeit
  onPress?: () => void; // Hinzugefügt, um eine Aktion beim Klicken auszuführen
}

const RoomDetails: React.FC<RoomDetailsProps> = ({
  guestName,
  role,
  date,
  time,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.imageContainer}>
        {/* Hier könnte ein Bild platziert werden, falls erforderlich */}
        <Icon name="person-circle" size={50} color="#333" />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.guestName}>{guestName}</Text>
        <Text style={styles.role}>{role}</Text>
        <View style={styles.dateTimeContainer}>
          <Icon name="calendar" size={20} color="#333" />
          <Text style={styles.dateTimeText}>{date}</Text>
          <Icon name="time" size={20} color="#333" />
          <Text style={styles.dateTimeText}>{time}</Text>
        </View>
      </View>
      <Icon name="chevron-forward" size={30} color="#333" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "transparent", // Transparenter Hintergrund
    borderRadius: 25,
    paddingVertical: 25,
    paddingHorizontal: 20,
    alignItems: "center",
    marginVertical: 20,
    borderWidth: 1, // Hinzugefügte Borderlinie
    borderColor: "#ddd", // Farbe der Borderlinie
  },
  imageContainer: {
    marginRight: 30,
  },
  infoContainer: {
    flex: 1,
    paddingRight: 15,
  },
  guestName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  role: {
    fontSize: 18,
    color: "#444",
    marginBottom: 15,
  },
  dateTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateTimeText: {
    fontSize: 16,
    color: "#555",
    marginLeft: 10,
    marginRight: 20,
  },
});

export default RoomDetails;
