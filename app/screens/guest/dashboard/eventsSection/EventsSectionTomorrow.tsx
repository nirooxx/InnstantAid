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
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Event, RootStackParamList } from '../../../../routes/types';

type EventsSectionTomorrowProps = {
  events: Event[];
  onViewAll: () => void;
};

type EventsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EventDetail'>;

const EventsSectionTomorrow: React.FC<EventsSectionTomorrowProps> = ({ events, onViewAll }) => {
  const navigation = useNavigation<EventsScreenNavigationProp>();

  const handleEventPress = (event: Event) => {
    navigation.navigate('EventDetail', { event });
  };

  // Calculate the date for tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDate = tomorrow.toISOString().split('T')[0];

  // Filter events to show only tomorrow's events
  const tomorrowsEvents = events.filter(event => event.date === tomorrowDate);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Veranstaltungen morgen</Text>
        <TouchableOpacity onPress={onViewAll}>
          <Text style={styles.viewAll}>Alle anzeigen</Text>
        </TouchableOpacity>
      </View>
      {tomorrowsEvents.length === 0 ? (
        <Text style={styles.noEventsText}>Keine Veranstaltungen für morgen gefunden.</Text>
      ) : (
        <FlatList
          data={tomorrowsEvents}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => {
            const formattedDate = new Date(item.date).toLocaleDateString('de-DE');
            const formattedTime = new Date(`1970-01-01T${item.time}`).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
            const formattedPriceRange = item.details.priceRanges
              ? `${item.details.priceRanges[0].min.toLocaleString('de-DE', { style: 'currency', currency: item.details.priceRanges[0].currency })} - ${item.details.priceRanges[0].max.toLocaleString('de-DE', { style: 'currency', currency: item.details.priceRanges[0].currency })}`
              : 'Preis nicht verfügbar';

            return (
              <TouchableOpacity onPress={() => handleEventPress(item)}>
                <View style={styles.eventCard}>
                  <Image source={{ uri: item.image }} style={styles.eventImage} />
                  <View style={styles.eventOverlay}>
                    <Text style={styles.eventTitle}>{item.title}</Text>
                    <Text style={styles.eventDate}>{item.details.classifications[0]?.genre.name}</Text>
                    <Text style={styles.eventTime}>Uhrzeit: {formattedTime} Uhr</Text>
                    <Text style={styles.eventLocation}>{item.location}</Text>
                    <Text style={styles.eventPriceRange}>{formattedPriceRange}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item) => item.id}
        />
      )}
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
    fontSize: hp("2.5%"),
    fontWeight: "bold",
    color: "#333",
  },
  viewAll: {
    color: "#5A67D8",
    fontSize: hp("2%"),
  },
  noEventsText: {
    fontSize: hp("2%"),
    color: "#666666",
    textAlign: 'center',
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
  eventPriceRange: {
    color: "#ffffff",
    fontSize: hp("1.75%"),
    marginTop: 4,
  },
});

export default EventsSectionTomorrow;
