import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

interface RoomDetailsProps {
  guestName: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  wifiInfo: {
    ssid: string;
    password: string;
  };
  roomServiceMenu: string[];
}

const RoomDetails: React.FC<RoomDetailsProps> = ({
  guestName,
  roomNumber,
  checkIn,
  checkOut,
  wifiInfo,
  roomServiceMenu,
}) => {
  return (
    <ScrollView
      horizontal={true}
      style={styles.container}
      showsHorizontalScrollIndicator={false}
    >
      <View style={styles.card}>
        <Text style={styles.guestName}>Willkommen, {guestName}</Text>
        <Text style={styles.label}>Zimmernummer</Text>
        <Text style={styles.info}>{roomNumber}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Check-in</Text>
        <Text style={styles.info}>{checkIn}</Text>
        <Text style={styles.label}>Check-out</Text>
        <Text style={styles.info}>{checkOut}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>WLAN</Text>
        <Text style={styles.info}>SSID: {wifiInfo.ssid}</Text>
        <Text style={styles.info}>Passwort: {wifiInfo.password}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Zimmerservice-Menü</Text>
        {roomServiceMenu.map((item) => (
          <Text key={item} style={styles.menuItem}>
            {item}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 250,
    marginVertical: 10,
  },
  card: {
    backgroundColor: "#f6f6f6",
    borderRadius: 20,
    borderColor: "#d4d4d4",
    borderWidth: 1,
    width: 250,
    height: 200,
    marginHorizontal: 10,
    padding: 20,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  guestName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#888",
    marginBottom: 10,
  },
  info: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  menuItem: {
    fontSize: 14,
    color: "#777",
  },
});

export default RoomDetails;
