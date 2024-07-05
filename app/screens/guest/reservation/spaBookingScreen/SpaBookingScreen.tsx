import React from 'react';
import { View, StyleSheet, Image, ScrollView, Text, TouchableOpacity } from 'react-native';
import { Card, Title } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from "../../../../routes/types"; // Import your type definitions
import { StackNavigationProp } from "@react-navigation/stack";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type SpaBookingNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SpaServiceDetail"
>;

const spaServices = [
  { title: 'Thai Massage', image: require('../../../../assets/images/Thai.webp'), price: '99€', duration: '60 Min.' },
  { title: 'Swedish Massage', image: require('../../../../assets/images/swedish.webp'), price: '89€', duration: '60 Min.' },
  { title: 'Hot Stone Massage', image: require('../../../../assets/images/hotStone.webp'), price: '109€', duration: '75 Min.' },
  { title: 'Aromatherapy Massage', image: require('../../../../assets/images/aroma.webp'), price: '79€', duration: '60 Min.' },
];

const SpaBookingScreen: React.FC = () => {
  const navigation = useNavigation<SpaBookingNavigationProp>();
  const insets = useSafeAreaInsets();

  const handleSpaBooking = (service: any) => {
    navigation.navigate('SpaServiceDetail', {
      title: service.title,
      image: service.image,
      price: service.price,
      duration: service.duration,
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: insets.bottom + 20,
        flexGrow: 1,
        justifyContent: 'center',
      }}
    >
    <View style={styles.topSection}>
  <Image source={require('../../../../assets/images/Thai-Message.webp')} style={styles.backgroundImage} />
  <View style={styles.overlay}>
    <View style={styles.textContainer}>
      <Text style={styles.heading}>Entspannen Sie sich</Text>
      <Text style={styles.subheading}>Wählen Sie Ihre bevorzugte Behandlung und entspannen Sie</Text>
    </View>
    <TouchableOpacity style={styles.exploreButton}>
      <Text style={styles.exploreButtonText}>Mehr erfahren</Text>
    </TouchableOpacity>
  </View>
</View>

      <View style={styles.cardContainer}>
        {spaServices.map((service, index) => (
          <TouchableOpacity key={index} onPress={() => handleSpaBooking(service)} style={styles.cardWrapper}>
            <Card style={styles.card}>
              <Card.Cover source={service.image} style={styles.cardImage} />
              <Card.Content style={styles.cardContent}>
                <Title style={styles.cardTitle}>{service.title}</Title>
                <Text style={styles.cardPrice}>{service.duration}</Text>
                <Text style={styles.cardPrice}>{service.price}</Text>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  topSection: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 20,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 20,
    padding: 20,
  },
  textContainer: {
    alignItems: 'center',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subheading: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  exploreButton: {
    backgroundColor: '#5A67D8',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  exploreButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  cardWrapper: {
    width: '48%',
    marginBottom: 20,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    backgroundColor: '#fff',
  },
  cardImage: {
    height: 120,
  },
  cardContent: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  cardPrice: {
    fontSize: 14,
    color: '#5A67D8',
    marginTop: 4,
  },
});

export default SpaBookingScreen;
