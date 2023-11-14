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
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

// Importieren der neuen EventsSection-Komponente
import EventsSection from "./eventsSection/EventsSection";
import RoomDetails from "./roomDetails/RoomDetails";
import HotelMap from "./hotelMap/HotelMap";
import slider from "./slider/SliderComponent";
import Layout from "../../components/Layout";

const MemoizedEventsSection = React.memo(EventsSection);
const MemoizedRoomDetails = React.memo(RoomDetails);
const MemoizedHotelMap = React.memo(HotelMap);
const MemoizedSlider = React.memo(slider);

export default function Dashboard() {
  const users = useSelector((state: RootState) => state.user);

  const handleAreaPress = (area: string) => {
    // Hier können Sie Aktionen oder Navigationen für den jeweiligen Bereich hinzufügen
    console.log(`Sie haben den Bereich ${area} ausgewählt.`);
  };

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
        <View style={styles.contentWrapper}>
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

          {/* Verwendung der Slider-Komponente */}
          <MemoizedSlider />

          {/* Verwendung der RoomDetails-Komponente */}
          <MemoizedRoomDetails
            guestName="Gerd Müller"
            role="General Doctor"
            date="15.10.2023"
            time="14:00 Uhr"
            onPress={() => {
              console.log("change Screen");
            }}
          />

          {/* Verwendung der HotelMap-Komponente */}

          <MemoizedHotelMap onAreaPress={handleAreaPress} />

          {/* Verwendung der EventsSection-Komponente */}
          <MemoizedEventsSection events={events} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF", // Weißer Hintergrund
    paddingHorizontal: wp(4), // 4% der Bildschirmbreite
    justifyContent: "center",
    alignItems: "center",
    // paddingBottom: 80,
  },
  contentWrapper: {
    paddingBottom: hp(10), // 10% der Bildschirmhöhe
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: hp(2), // 2% der Bildschirmhöhe
  },
  searchInput: {
    flex: 1,
    padding: wp(2), // 2% der Bildschirmbreite
    color: "#333",
    fontSize: hp(2), // 2% der Bildschirmhöhe
    backgroundColor: "#f0f0f0", // Hellgrauer Hintergrund für den Input
    borderRadius: wp(2), // 2% der Bildschirmbreite
  },

  backButton: {
    padding: wp(2), // 2% der Bildschirmbreite
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    borderWidth: 1,
    borderColor: "#D1D1D1",
    borderRadius: wp(3), // 3% der Bildschirmbreite
    paddingHorizontal: wp(2), // 2% der Bildschirmbreite
    backgroundColor: "#f0f0f0",
  },
  searchIcon: {
    marginRight: wp(2), // 2% der Bildschirmbreite
    color: "#333",
  },
  menuButton: {
    padding: wp(2), // 2% der Bildschirmbreite
  },
});
