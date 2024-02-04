// ConfirmationScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { deleteReservation } from '../../../../../../store/tableReservationSlice'; // Pfad anpassen
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { AppDispatch } from '../../../../../../store/store';
import { RootStackParamList } from "../../../../../../routes/types"; // Import your type definitions
import { StackNavigationProp } from "@react-navigation/stack";

type ConfirmationNavigationProp = StackNavigationProp<
  RootStackParamList,
  "TableReservationsList"
>;

type ConfirmScreenRouteProp = RouteProp<{ params: { reservationId: string;} }, 'params'>;
// Typdefinitionen und Props entsprechend anpassen
const ConfirmationScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<ConfirmationNavigationProp>();
  const route = useRoute<ConfirmScreenRouteProp>();

  // Hier wäre die ID der Reservierung, die du zum Stornieren brauchst
  const { reservationId } = route.params;
console.log(reservationId)

const handleCancelBooking = async () => {
    const resultAction = await dispatch(deleteReservation(reservationId));
    if (deleteReservation.fulfilled.match(resultAction)) {
      navigation.goBack();
    } else {
      if (resultAction.payload) {
        // Fehlerbehandlung, z.B. ein Alert anzeigen
        console.log('Fehler', 'Die Stornierung ist fehlgeschlagen.');
      }
    }
  };

  return (
    <View style={styles.container}>
    <Text style={styles.confirmationText}>Ihre Buchung wurde erfolgreich vorgenommen!</Text>
    <TouchableOpacity style={styles.viewBookingButton} onPress={() => navigation.navigate('TableReservationsList')}>
  <Text style={styles.viewBookingButtonText}>Buchung ansehen</Text>
</TouchableOpacity>
    <TouchableOpacity style={styles.cancelButton} onPress={handleCancelBooking}>
      <Text style={styles.cancelButtonText}>Buchung stornieren</Text>
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
      },
      confirmationText: {
        fontSize: 18,
        marginBottom: 20,
      },
      viewBookingButton: {
        backgroundColor: '#000', // Schwarze Hintergrundfarbe für den Button
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
      },
      viewBookingButtonText: {
        color: 'white',
        fontSize: 16,
      },
      cancelButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
      },
      cancelButtonText: {
        color: 'white',
        fontSize: 16,
      },
  // Weitere Styles...
});

export default ConfirmationScreen;
