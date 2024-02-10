import React from 'react';
import { View, StyleSheet, Image, ScrollView, Text, TouchableOpacity } from 'react-native';
import { Card, Title } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from "../../../../routes/types"; // Import your type definitions
import { StackNavigationProp } from "@react-navigation/stack";

type SpaBookingNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SpaServiceDetail"
>;

const spaServices = [
  { title: 'Thai Massage', image: require('../../../../assets/images/Thai-Message.webp'), price: '99€', duration: '60 min' },
  { title: 'Swedish Massage', image: require('../../../../assets/images/Thai-Message.webp'), price: '89€', duration: '60 min' },
  { title: 'Hot Stone Massage', image: require('../../../../assets/images/Thai-Message.webp'), price: '109€', duration: '75 min' },
  { title: 'Aromatherapy Massage', image: require('../../../../assets/images/Thai-Message.webp'), price: '79€', duration: '60 min' },
];

const SpaBookingScreen = () => {
  const navigation = useNavigation<SpaBookingNavigationProp>();
  

  const handleSpaBooking = (service:any) => {
    // Übergabe der Reservierungsdaten an die BookingScreen Komponente
    navigation.navigate('SpaServiceDetail',{
      title: service.title,
      image: service.image,
      price: service.price,
      duration: service.duration,
    } );
  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.topSection}>
        <Image source={require('../../../../assets/images/Thai-Message.webp')} style={styles.backgroundImage} />
        <View style={styles.overlay}>
          <Text style={styles.heading}>Indulge in Serenity</Text>
          <Text style={styles.subheading}>Select your preferred treatment and relax</Text>
        </View>
      </View>
      <View style={styles.cardContainer}>
        {spaServices.map((service, index) => (
         <TouchableOpacity key={index} onPress={() => handleSpaBooking(service)}>
         <Card style={styles.card}>
           <Card.Cover source={service.image} style={styles.cardImage} />
           <Card.Content style={styles.cardContent}>
             <Title style={styles.cardTitle}>{service.title}</Title>
             <Text style={styles.cardPrice}>{service.price} - {service.duration}</Text>
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
    backgroundColor: '#000',
  },
  topSection: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    height: 250,
    paddingHorizontal: 20,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 8,
    padding: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subheading: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
  },
  cardContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  card: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 4,
  },
  cardImage: {
    height: 150,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  cardPrice: {
    fontSize: 16,
    color: '#666',
    paddingTop: 8,
  },
});

export default SpaBookingScreen;
