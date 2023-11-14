import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Layout from "../../../components/Layout";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

type Event = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  image: string;
};

type EventsSectionProps = {
  events: Event[];
};

const EventsSection: React.FC<EventsSectionProps> = ({ events }) => {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Today's Events</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={events}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.eventCard}>
            <Image source={{ uri: item.image }} style={styles.eventImage} />
            <View style={styles.eventOverlay}>
              <Text style={styles.eventTitle}>{item.title}</Text>
              <Text style={styles.eventDate}>{item.date}</Text>
              <Text style={styles.eventTime}>{item.time}</Text>
              <Text style={styles.eventLocation}>{item.location}</Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginVertical: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: hp("2.5%"), // 2.5% der Bildschirmhöhe
    fontWeight: "bold",
    color: "#333",
  },
  viewAll: {
    color: "#0077ff", // Leuchtendes Blau
    fontSize: hp("2%"), // 2% der Bildschirmhöhe
  },
  eventCard: {
    marginRight: wp("2.5%"), // 2.5% der Bildschirmbreite
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: hp("0.25%") },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  eventImage: {
    width: wp("50%"), // 50% der Bildschirmbreite
    height: hp("15%"), // 15% der Bildschirmhöhe
  },
  eventOverlay: {
    position: "absolute",
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    width: "100%",
    padding: wp("1.25%"), // 1.25% der Bildschirmbreite
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  eventTitle: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  eventDate: {
    color: "#ffffff",
  },
  eventTime: {
    color: "#ffffff",
  },
  eventLocation: {
    color: "#ffffff",
  },
});

export default EventsSection;
