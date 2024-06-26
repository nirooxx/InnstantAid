import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { Event, RootStackParamList } from '../../../../routes/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';

// Define screen dimensions
const { width } = Dimensions.get('window');

type EventsScreenRouteProp = RouteProp<RootStackParamList, 'EventsScreen'>;
type EventDetailNavigationProp = StackNavigationProp<RootStackParamList, 'EventDetail'>;

const EventsScreen: React.FC = () => {
  const route = useRoute<EventsScreenRouteProp>();
  const navigation = useNavigation<EventDetailNavigationProp>();
  const { events } = route.params;

  if (!events || events.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>All Events</Text>
        <Text style={styles.noEventsText}>No events found.</Text>
      </SafeAreaView>
    );
  }

  const handleEventPress = (event: Event) => {
    navigation.navigate('EventDetail', { event });
  };

  const renderItem = ({ item }: { item: Event }) => {
    const formattedDate = new Date(item.date).toLocaleDateString('de-DE');
    const formattedTime = new Date(`1970-01-01T${item.time}`).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    const formattedPriceRange = item.details.priceRanges
      ? `${item.details.priceRanges[0].min.toLocaleString('de-DE', { style: 'currency', currency: item.details.priceRanges[0].currency })} - ${item.details.priceRanges[0].max.toLocaleString('de-DE', { style: 'currency', currency: item.details.priceRanges[0].currency })}`
      : 'Preis nicht verfügbar';

    return (
      <TouchableOpacity onPress={() => handleEventPress(item)} style={styles.eventCard}>
        <Image source={{ uri: item.image }} style={styles.eventImage} />
        <View style={styles.eventDetails}>
          <Text style={styles.eventTitle}>{item.title}</Text>
          <Text style={styles.eventDate}>Datum: {formattedDate}</Text>
          <Text style={styles.eventTime}>Uhrzeit: {formattedTime} Uhr</Text>
          <Text style={styles.eventLocation}>Ort: {item.details._embedded.venues[0].name}, {item.details._embedded.venues[0].city.name}, {item.details._embedded.venues[0].country.name}</Text>
          <Text style={styles.eventGenre}>{item.details.classifications[0]?.genre.name}</Text>
          <Text style={styles.eventPriceRange}>{formattedPriceRange}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const categorizeEvents = (events: Event[]) => {
    const today = new Date().toISOString().split('T')[0];
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() + 7);
    const thisWeekString = thisWeek.toISOString().split('T')[0];

    const allEvents = events;
    const todayEvents = events.filter(event => event.date === today);
    const thisWeekEvents = events.filter(event => event.date > today && event.date <= thisWeekString);

    return { allEvents, todayEvents, thisWeekEvents };
  };

  const { allEvents, todayEvents, thisWeekEvents } = categorizeEvents(events);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.header}>Alle Veranstaltungen</Text>
          <FlatList
            data={allEvents}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.flatListContainer}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.header}>Veranstaltungen heute</Text>
          <FlatList
            data={todayEvents}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.flatListContainer}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.header}>Veranstaltungen diese Woche</Text>
          <FlatList
            data={thisWeekEvents}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.flatListContainer}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fd',
  },
  scrollContainer: {
    paddingVertical: 16,
  },
  section: {
    marginBottom: 24,
  },
  header: {
    fontSize: 26,
    fontWeight: '700',
    color: '#5A67D8',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  flatListContainer: {
    paddingHorizontal: 16,
  },
  noEventsText: {
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
    marginTop: 20,
  },
  eventCard: {
    width: width * 0.8,
    marginRight: 16,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  eventImage: {
    width: '100%',
    height: width * 0.5,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  eventDetails: {
    padding: 16,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
  },
  eventDate: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 4,
  },
  eventTime: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 8,
  },
  eventGenre: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 8,
  },
  eventPriceRange: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5A67D8',
  },
});

export default EventsScreen;
