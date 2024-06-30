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
  const formatDateRange = (checkIn: any, checkOut: any) => {
    return `${new Date(checkIn).toLocaleDateString('de-DE')} - ${new Date(checkOut).toLocaleDateString('de-DE')}`;
};

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.imageContainer}>
        <Icon name="person-circle-outline" size={60} color="#5A67D8" />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.guestName}>{guestName}</Text>
        {roomName && <Text style={styles.roomName}>{roomName}</Text>}
        {companyName && <Text style={styles.companyName}>{companyName}</Text>}
        {(checkIn || checkOut) && (
          <View style={styles.dateTimeContainer}>
            <Icon name="calendar-outline" size={20} color="#5A67D8" />
            <Text style={styles.dateTimeText}>
              {formatDateRange(checkIn, checkOut)}
            </Text>
          </View>
        )}
        {status && <Text style={styles.status}>{status}</Text>}
        {notes && <Text style={styles.notes}>{notes}</Text>}
      </View>
      <View style={styles.iconContainer}>
        <Icon name="chevron-forward-outline" size={30} color="#5A67D8" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
  },
  guestName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D3748",
    marginBottom: 4,
  },
  roomName: {
    fontSize: 16,
    color: "#4A5568",
    marginBottom: 4,
  },
  companyName: {
    fontSize: 16,
    color: "#4A5568",
    marginBottom: 4,
  },
  dateTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  dateTimeText: {
    fontSize: 16,
    color: "#4A5568",
    marginLeft: 8,
  },
  status: {
    fontSize: 14,
    color: "#5A67D8",
    fontWeight: "600",
    marginBottom: 4,
  },
  notes: {
    fontSize: 14,
    color: "#4A5568",
  },
  iconContainer: {
    marginLeft: 16,
  },
});

export default RoomDetails;
