// ConfirmationScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Button } from 'react-native-elements';
import { useDispatch } from 'react-redux';
import { deleteReservation } from '../../../../../../store/tableReservationSlice'; // Pfad anpassen
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { AppDispatch } from '../../../../../../store/store';
import { RootStackParamList } from "../../../../../../routes/types"; // Import your type definitions
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Icon
          name="check-circle-outline"
          size={72}
          color="green"
          style={styles.checkIcon}
        />
        <Text style={styles.confirmationText}>Ihre Buchung wurde erfolgreich vorgenommen!</Text>
        
        <Button
          buttonStyle={styles.button}
          titleStyle={styles.buttonTitle}
          title="Buchung ansehen"
          onPress={() => navigation.navigate('TableReservationsList')}
          icon={<Icon name="eye-outline" size={20} color="white" />}
          iconRight
        />

        <Button
          buttonStyle={[styles.button, styles.cancelButton]}
          titleStyle={styles.buttonTitle}
          title="Buchung stornieren"
          onPress={handleCancelBooking}
          icon={<Icon name="close-circle-outline" size={20} color="white" />}
          iconRight
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  checkIcon: {
    marginBottom: 20,
  },
  confirmationText: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#2089dc',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginVertical: 10,
    minWidth: 200,
    elevation: 2,
  },
  cancelButton: {
    backgroundColor: 'red',
  },
  buttonTitle: {
    marginHorizontal: 10,
  },
});

export default ConfirmationScreen;
