import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Button } from 'react-native-elements';
import { useDispatch } from 'react-redux';
import { deleteReservation } from '../../../../../../store/tableReservationSlice'; // Pfad anpassen
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { AppDispatch } from '../../../../../../store/store';
import { RootStackParamList } from "../../../../../../routes/types"; // Import your type definitions
import Icon from 'react-native-vector-icons/Ionicons';
import { StackNavigationProp } from "@react-navigation/stack";

type ConfirmationNavigationProp = StackNavigationProp<
  RootStackParamList,
  "TableReservationsList"
>;

type ConfirmScreenRouteProp = RouteProp<{ params: { reservationId: string;} }, 'params'>;

const ConfirmationScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<ConfirmationNavigationProp>();
  const route = useRoute<ConfirmScreenRouteProp>();

  const { reservationId } = route.params;

  const handleCancelBooking = async () => {
    const resultAction = await dispatch(deleteReservation(reservationId));
    if (deleteReservation.fulfilled.match(resultAction)) {
      navigation.goBack();
    } else {
      if (resultAction.payload) {
        console.log('Fehler', 'Die Stornierung ist fehlgeschlagen.');
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Icon
          name="checkmark-circle"
          size={72}
          color="#5A67D8"
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
    backgroundColor: '#F7FAFC',
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
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: '#2D3748',
  },
  button: {
    backgroundColor: '#5A67D8',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginVertical: 10,
    minWidth: 200,
    elevation: 2,
  },
  cancelButton: {
    backgroundColor: '#E53E3E',
  },
  buttonTitle: {
    marginHorizontal: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ConfirmationScreen;
