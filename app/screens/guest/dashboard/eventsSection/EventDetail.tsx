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

  const formattedDate = new Date(dates.start.localDate).toLocaleDateString('de-DE');
  const formattedTime = new Date(`1970-01-01T${dates.start.localTime}`).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  const formattedPriceRange = priceRanges ? `${priceRanges[0].min.toLocaleString('de-DE', { style: 'currency', currency: priceRanges[0].currency })} - ${priceRanges[0].max.toLocaleString('de-DE', { style: 'currency', currency: priceRanges[0].currency })}` : 'N/A';

  return (
    <ScrollView style={styles.container}>
      {mainImage && <Image source={{ uri: mainImage.url }} style={styles.image} />}
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.genre}>{genre}</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Datum:</Text>
          <Text style={styles.value}>{formattedDate}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Uhrzeit:</Text>
          <Text style={styles.value}>{formattedTime} Uhr</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Ort:</Text>
          <Text style={styles.value}>{venue.name}, {venue.city.name}, {venue.country.name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Adresse:</Text>
          <Text style={styles.value}>{venue.address.line1}, {venue.postalCode}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Koordinaten:</Text>
          <Text style={styles.value}>{venue.location.latitude}, {venue.location.longitude}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Preisspanne:</Text>
          <Text style={styles.value}>{formattedPriceRange}</Text>
        </View>
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
    backgroundColor: '#FFFFFF',
  },
  image: {
    width: '100%',
    height: Dimensions.get('window').width * 0.56,
    marginBottom: 16,
    borderRadius: 10,
  },
  detailsContainer: {
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  genre: {
    fontSize: 20,
    fontStyle: 'italic',
    color: '#555555',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 18,
    color: '#777777',
  },
  value: {
    fontSize: 18,
    color: '#333333',
  },
  seatmap: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 16,
    borderRadius: 10,
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
});

export default EventDetail;
