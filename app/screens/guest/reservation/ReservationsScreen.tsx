import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
    navigation.navigate('RoomServiceOrderScreen');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleTableReservationPress}>
        <Text style={styles.buttonText}>Tischreservierung</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleSpaBookingPress}>
        <Text style={styles.buttonText}>Spa-Buchung</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleRoomServiceOrderPress}>
        <Text style={styles.buttonText}>Zimmerservice-Bestellung</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  // Weitere Styles...
});

export default ReservationsScreen;
