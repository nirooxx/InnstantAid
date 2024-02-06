import React from 'react';
import { View, StyleSheet, Image, ScrollView, Text, TouchableOpacity } from 'react-native';
import { Card, Title } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const categories = [
  { title: 'Body', image: require('../../../../assets/images/Gebäude_Architektur.jpg') },
  { title: 'Mind', image: require('../../../../assets/images/Gebäude_Architektur.jpg') },
  { title: 'Nutrition', image: require('../../../../assets/images/Gebäude_Architektur.jpg') },
  { title: 'Experiences', image: require('../../../../assets/images/Gebäude_Architektur.jpg') },
];

const SpaBookingScreen = () => {
  return (
    <ScrollView style={styles.container}>
    <View style={styles.topSection}>
      <Text style={styles.heading}>Connect with experts instantaneously, no matter where you are.</Text>
      <Text style={styles.subheading}>Which one would you like to focus on?</Text>
    </View>
    <View style={styles.cardContainer}>
      {categories.map((category, index) => (
        <TouchableOpacity key={index} style={styles.card}>
          <Image source={category.image} style={styles.cardImage} />
          <View style={styles.cardTitleContainer}>
            <Text style={styles.cardTitle}>{category.title}</Text>
            <Icon name="chevron-right" size={24} color="#000" />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topSection: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#f0f0f0',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  subheading: {
    fontSize: 16,
    color: '#000',
  },
  cardContainer: {
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 10,
    elevation: 4, // for Android shadow
    shadowColor: '#000', // for iOS shadow
    shadowOffset: { width: 0, height: 2 }, // for iOS shadow
    shadowOpacity: 0.1, // for iOS shadow
    shadowRadius: 4, // for iOS shadow
  },
  cardImage: {
    height: 150,
    width: '100%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.02)', // slight overlay
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default SpaBookingScreen;
