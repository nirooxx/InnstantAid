import React, {useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { Card, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useDispatch, useSelector  } from 'react-redux';
import { addReservation, fetchReservations  } from '../../../../../../store/tableReservationSlice'; 
import { AppDispatch } from '../../../../../../store/store';
import { RootState } from '../../../../../../store/store';
import { RootStackParamList } from "../../../../../../routes/types"; // Import your type definitions
import { StackNavigationProp } from "@react-navigation/stack";

type BookingNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ConfirmationScreen'
>;

type BookingScreenRouteProp = RouteProp<{ params: { date: string; time: string; peopleCount: number; name: string, roomNumber: string} }, 'params'>;

const BookingScreen: React.FC = () => {
  const navigation = useNavigation<BookingNavigationProp>();
  const route = useRoute<BookingScreenRouteProp>();
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.user.id);

  const { date, time, peopleCount, name, roomNumber } = route.params;

  const handleConfirmBooking = async () => {
    const reservationDetails = {
      date,
      time,
      peopleCount,
      name,
      roomNumber,
      reservierung: 'Tischreservierung',
      table: 'T4',
      userId
      // hier könntest du noch weitere Details hinzufügen, wie z.B. die Tischnummer
    };
  
    // Dispatch die addReservation Methode mit den Reservierungsdetails EINMAL
    try {
      const reservation = await dispatch(addReservation(reservationDetails)).unwrap();
      // Navigation zur Bestätigungsseite mit der ID der neu erstellten Reservierung
      navigation.navigate('ConfirmationScreen', { reservationId: reservation.id });
    } catch (error) {
      Alert.alert("Fehler beim Erstellen der Reservierung: " + error);
      // Hier könntest du eine Fehlermeldung anzeigen
    }
  };
  useEffect(() => {
    dispatch(fetchReservations());
  }, [dispatch]);

 

  return (
    <View style={styles.container}>
    <Text style={styles.header}>Reservierungsübersicht</Text>
    <Card style={styles.bookingCard}>
      <Card.Title
        title={`Reservierung für ${name}`}
        subtitle={`Raum Nr. ${roomNumber}`}
        left={(props) => <Icon {...props} name="book-outline" />}
        leftStyle={styles.cardLeftIcon}
      />
      <Card.Content>
        <Text style={styles.bookingText}>Anzahl Personen: {peopleCount}</Text>
        <Text style={styles.bookingText}>Datum & Zeit: {date} {time}</Text>
      </Card.Content>
    </Card>

    <Button
      icon="check-bold"
      mode="contained"
      onPress={handleConfirmBooking}
      style={styles.confirmButton}
    >
      Jetzt Buchen
    </Button>
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  bookingCard: {
    elevation: 4,
    borderRadius: 8,
    marginTop: 20,
  },
  cardLeftIcon: {
    marginRight: 10,
  },
  bookingText: {
    marginTop: 10,
    fontSize: 16,
    lineHeight: 24,
  },
  confirmButton: {
    marginTop: 20,
    paddingVertical: 8,
  },
  editButton: {
    alignSelf: 'flex-end',
    margin: 16,
  },

});

export default BookingScreen;
