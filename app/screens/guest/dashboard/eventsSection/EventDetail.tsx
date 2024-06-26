import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Linking, Dimensions } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Event, RootStackParamList } from '../../../../routes/types';

type EventDetailRouteProp = RouteProp<RootStackParamList, 'EventDetail'>;

const EventDetail: React.FC = () => {
  const route = useRoute<EventDetailRouteProp>();
  const { event } = route.params;

  const { name, dates, images, url, priceRanges, seatmap, _embedded, classifications } = event.details;
  const mainImage = images.find((img) => img.ratio === '16_9' && img.width >= 1024) || images[0];
  const venue = _embedded.venues[0];
  const genre = classifications && classifications.length > 0 ? classifications[0].genre.name : 'N/A';

  // Format the date, time, and price for German locale
  const formattedDate = new Date(dates.start.localDate).toLocaleDateString('de-DE');
  const formattedTime = new Date(`1970-01-01T${dates.start.localTime}`).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  const formattedPriceRange = priceRanges ? `${priceRanges[0].min.toLocaleString('de-DE', { style: 'currency', currency: priceRanges[0].currency })} - ${priceRanges[0].max.toLocaleString('de-DE', { style: 'currency', currency: priceRanges[0].currency })}` : 'N/A';

  return (
    <ScrollView style={styles.container}>
      {mainImage && <Image source={{ uri: mainImage.url }} style={styles.image} />}
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.genre}>{genre}</Text>
        <Text style={styles.date}>Datum: {formattedDate}</Text>
        <Text style={styles.time}>Uhrzeit: {formattedTime} Uhr</Text>
        <Text style={styles.location}>Ort: {venue.name}, {venue.city.name}, {venue.country.name}</Text>
        <Text style={styles.address}>Adresse: {venue.address.line1}, {venue.postalCode}</Text>
        <Text style={styles.coordinates}>Koordinaten: {venue.location.latitude}, {venue.location.longitude}</Text>
        <Text style={styles.priceRange}>Preisspanne: {formattedPriceRange}</Text>
        {seatmap && <Image source={{ uri: seatmap.staticUrl }} style={styles.seatmap} />}
        <TouchableOpacity style={styles.button} onPress={() => Linking.openURL(url)}>
          <Text style={styles.buttonText}>Tickets kaufen</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FD',
  },
  image: {
    width: '100%',
    height: Dimensions.get('window').width * 0.56, // 16:9 ratio
    marginBottom: 16,
  },
  detailsContainer: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#5A67D8',
    marginBottom: 12,
  },
  genre: {
    fontSize: 20,
    fontStyle: 'italic',
    color: '#6B7280',
    marginBottom: 12,
  },
  date: {
    fontSize: 18,
    color: '#4B5563',
    marginBottom: 8,
  },
  time: {
    fontSize: 18,
    color: '#4B5563',
    marginBottom: 8,
  },
  location: {
    fontSize: 18,
    color: '#4B5563',
    marginBottom: 8,
  },
  address: {
    fontSize: 18,
    color: '#4B5563',
    marginBottom: 8,
  },
  coordinates: {
    fontSize: 18,
    color: '#4B5563',
    marginBottom: 8,
  },
  priceRange: {
    fontSize: 18,
    color: '#1F2937',
    fontWeight: '600',
    marginBottom: 16,
  },
  seatmap: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 16,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#5A67D8',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  urlLink: {
    color: '#5A67D8',
    textDecorationLine: 'underline',
    marginTop: 16,
    fontSize: 18,
    textAlign: 'center',
  },
});

export default EventDetail;
