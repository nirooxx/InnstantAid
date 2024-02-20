import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from "../../../../routes/types"; // Import your type definitions
import { StackNavigationProp } from "@react-navigation/stack";

type HosekeepingNavigationProp = StackNavigationProp<
  RootStackParamList
>;

const HousekeepingScreen = () => {
  const navigation = useNavigation<HosekeepingNavigationProp>();
  
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Housekeeping</Text>

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
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200, // or whatever size you need
    resizeMode: 'cover',
  },
});

export default HousekeepingScreen;
