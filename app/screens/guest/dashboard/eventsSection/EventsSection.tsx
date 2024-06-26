import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
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
    marginVertical: 0,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: hp("2.5%"),
    fontWeight: "bold",
    color: "#333",
  },
  viewAll: {
    color: "#5A67D8",
    fontSize: hp("2%"),
  },
  eventCard: {
    marginRight: wp("2.5%"),
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: hp("0.25%") },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  eventImage: {
    width: wp("50%"),
    height: hp("15%"),
  },
  eventOverlay: {
    position: "absolute",
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    width: "100%",
    padding: wp("1.25%"),
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  eventTitle: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: hp("2%"),
    marginBottom: 2,
  },
  eventDate: {
    color: "#ffffff",
    fontSize: hp("1.75%"),
  },
  eventTime: {
    color: "#ffffff",
    fontSize: hp("1.75%"),
  },
  eventLocation: {
    color: "#ffffff",
    fontSize: hp("1.75%"),
  },
});

export default EventsSection;
