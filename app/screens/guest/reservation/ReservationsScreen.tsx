import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from "../../../routes/types"; // Import your type definitions
import { StackNavigationProp } from "@react-navigation/stack";

type ReservationsNavigationProp = StackNavigationProp<
  RootStackParamList
>;

const ReservationsScreen: React.FC = () => {
  const navigation = useNavigation<ReservationsNavigationProp>();

  const handleSpaBookingPress = () => {
    navigation.navigate('SpaBookingScreen');
  };

  const handleTableReservationPress = () => {
    navigation.navigate('TableReservationScreen');
  };

  const handleRoomServiceOrderPress = () => {
    navigation.navigate('MenuScreen');
  };

  const handleHouseKeepingPress = () => {
    navigation.navigate('HousekeepingScreen');
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity style={styles.tile} onPress={handleTableReservationPress}>
          <Image source={require('../../../assets/images/avatar.png')} style={styles.image} />
          <Text style={styles.tileText}>Tischreservierung</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tile} onPress={handleSpaBookingPress}>
          <Image source={require('../../../assets/images/avatar.png')} style={styles.image} />
          <Text style={styles.tileText}>Spa-Buchung</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity style={styles.tile} onPress={handleRoomServiceOrderPress}>
          <Image source={require('../../../assets/images/avatar.png')} style={styles.image} />
          <Text style={styles.tileText}>Zimmerservice-Bestellung</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tile} onPress={handleHouseKeepingPress}>
          <Image source={require('../../../assets/images/avatar.png')} style={styles.image} />
          <Text style={styles.tileText}>Housekeeping</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F7FAFC',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  tile: {
    backgroundColor: '#FFFFFF',
    width: '48%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    padding: 10,
  },
  image: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  tileText: {
    color: '#2D3748',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ReservationsScreen;
