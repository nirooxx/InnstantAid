import React, { useEffect } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

// Importieren der neuen EventsSection-Komponente
import EventsSection from "./eventsSection/EventsSection";
import RoomDetails from "./roomDetails/RoomDetails";

const MemoizedEventsSection = React.memo(EventsSection);
const MemoizedRoomDetails = React.memo(RoomDetails);

export default function Dashboard() {
  const users = useSelector((state: RootState) => state.user);

  useEffect(() => {
    console.log(users);
  }, [users]);

  const events = [
    // Dummy-Daten für die Veranstaltungen
    {
      id: "1",
      title: "Michael Malarkey",
      date: "12-03-2022",
      time: "Fri, 12:30 - 11:00 pm",
      location: "Pune, Maharashtra",
      image:
        "https://images.squarespace-cdn.com/content/v1/5a02ed1990badea68d9909d7/1582116436615-GIQU2A2QXWJV8YNQNRRM/Adelaide+Hall+2.jpg?format=2500w",
    },
    {
      id: "2",
      title: "Pu Shu",
      date: "12-03-2022",
      time: "Fri, 12:30 - 11:00 pm",
      location: "Goa, Mantra",
      image:
        "https://images.squarespace-cdn.com/content/v1/5a02ed1990badea68d9909d7/1582116436615-GIQU2A2QXWJV8YNQNRRM/Adelaide+Hall+2.jpg?format=2500w",
    },
    // ... Weitere Veranstaltungen
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <View style={styles.searchContainer}>
            <Icon
              name="search"
              size={24}
              color="black"
              style={styles.searchIcon}
            />
            <TextInput placeholder="Search" style={styles.searchInput} />
          </View>
          <TouchableOpacity style={styles.menuButton}>
            <Icon name="ellipsis-vertical" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <MemoizedRoomDetails
          guestName="Gerd Müller"
          roomNumber="205"
          checkIn="15.10.2023, 14:00 Uhr"
          checkOut="20.10.2023, 11:00 Uhr"
          wifiInfo={{ ssid: "Hotel_WiFi", password: "password123" }}
          roomServiceMenu={["Frühstück", "Mittagessen", "Abendessen", "Snacks"]}
        />

        {/* Verwendung der EventsSection-Komponente */}
        <MemoizedEventsSection events={events} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF", // Weißer Hintergrund
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 16,
  },
  searchInput: {
    flex: 1,
    padding: 8,
    color: "#333",
    fontSize: 16,
    backgroundColor: "#f0f0f0", // Hellgrauer Hintergrund für den Input
    borderRadius: 8,
  },

  backButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    borderWidth: 1,
    borderColor: "#D1D1D1",
    borderRadius: 12,
    paddingHorizontal: 8,
    backgroundColor: "#f0f0f0",
  },
  searchIcon: {
    marginRight: 8,
    color: "#333",
  },
  menuButton: {
    padding: 8,
  },
});
