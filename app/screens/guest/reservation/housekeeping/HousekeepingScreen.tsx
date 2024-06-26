import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from "../../../../routes/types"; // Import your type definitions
import { StackNavigationProp } from "@react-navigation/stack";

type HousekeepingNavigationProp = StackNavigationProp<
  RootStackParamList
>;

const { width } = Dimensions.get('window');

const HousekeepingScreen = () => {
  const navigation = useNavigation<HousekeepingNavigationProp>();
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

      {/* Request Room Clean */}
      <TouchableOpacity style={styles.section} onPress={() => navigation.navigate('RequestRoomCleanScreen')}>
        <Text style={styles.sectionTitle}>Request Room Clean</Text>
        <Image source={require('../../../../assets/images/housekeeping.webp')} style={styles.image} />
      </TouchableOpacity>

      {/* Set Room Clean Frequency */}
      <TouchableOpacity style={styles.section} onPress={() => navigation.navigate('RoomCleanFrequencyScreen')}>
        <Text style={styles.sectionTitle}>Set Room Clean Frequency</Text>
        <Image source={require('../../../../assets/images/housekeeping.webp')} style={styles.image} />
      </TouchableOpacity>

      {/* Maintenance */}
      <TouchableOpacity style={styles.section} onPress={() => navigation.navigate('MaintenanceScreen')}>
        <Text style={styles.sectionTitle}>Maintenance</Text>
        <Image source={require('../../../../assets/images/housekeeping.webp')} style={styles.image} />
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
    width: width - 40,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
    padding: 15,
    backgroundColor: '#5A67D8',
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
});

export default HousekeepingScreen;
