import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

interface RoomDetailsProps {
  guestName: string;
  roomName?: string;
  companyName?: string;
  checkIn?: string;
  checkOut?: string;
  status?: string;
  notes?: string;
  onPress?: () => void;
}

const RoomDetails: React.FC<RoomDetailsProps> = ({
  guestName,
  roomName,
  companyName,
  checkIn,
  checkOut,
  status,
  notes,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.imageContainer}>
        <Icon name="person-circle" size={50} color="#5A67D8" />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.guestName}>{guestName}</Text>
        <Text style={styles.roomName}>{roomName}</Text>
        <Text style={styles.companyName}>{companyName}</Text>
        <View style={styles.dateTimeContainer}>
          <Icon name="calendar" size={20} color="#5A67D8" />
          <Text style={styles.dateTimeText}>{checkIn} - {checkOut}</Text>
        </View>
      </View>
      <Icon name="chevron-forward" size={30} color="#5A67D8" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: "center",
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    marginRight: 20,
  },
  infoContainer: {
    flex: 1,
  },
  guestName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2D3748",
    marginBottom: 5,
  },
  roomName: {
    fontSize: 18,
    color: "#4A5568",
    marginBottom: 5,
  },
  companyName: {
    fontSize: 16,
    color: "#718096",
    marginBottom: 10,
  },
  dateTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateTimeText: {
    fontSize: 16,
    color: "#4A5568",
    marginLeft: 10,
  },
});

export default RoomDetails;
