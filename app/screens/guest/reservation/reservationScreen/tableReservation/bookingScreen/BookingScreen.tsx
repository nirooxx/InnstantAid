import React, {useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
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
  const { date, time, peopleCount, name, roomNumber } = route.params;
 


  const handleConfirmBooking = async () => {
    const reservationDetails = {
      date,
      time,
      peopleCount,
      name,
      roomNumber,
      reservierung: 'Tischreservierung',
      table: 'T4'
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
      <TouchableOpacity style={styles.editButton} onPress={() => navigation.goBack()}>
        <Icon name="pencil" size={30} color="#000" />
      </TouchableOpacity>
      
      <View style={styles.bookingCard}>
        {/* Dummy image for illustration */}
        <Image
          source={require('../../../../../../assets/images/avatar.png')}
          style={styles.tableIcon}
        />
        <View style={styles.bookingDetails}>
        <Text style={styles.bookingText}>{name}</Text>
        <Text style={styles.bookingText}>Zimmernummer: {roomNumber}</Text>
          <Text style={styles.bookingText}>Number of people</Text>
          <Text style={styles.bookingCount}>{peopleCount}</Text>
          <Text style={styles.bookingText}>Date and Time</Text>
          <Text style={styles.bookingDateTime}>{date}</Text>
          <Text style={styles.bookingTime}>{time}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.confirmButton} onPress={() => handleConfirmBooking()}>
        <Text style={styles.confirmButtonText}>Book</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  editButton: {
    position: 'absolute',
    top: 40, // Adjust as per your header's height
    right: 20,
    zIndex: 10,
  },
  bookingCard: {
    margin: 20,
    backgroundColor: '#F2F2F2', // A light background color
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tableIcon: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  bookingDetails: {
    marginTop: 20,
  },
  bookingText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  bookingCount: {
    fontSize: 30,
    color: '#000',
    marginVertical: 10,
  },
  bookingDateTime: {
    fontSize: 18,
    color: '#666',
  },
  bookingTime: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: '#FF6347', // A nice red color for the button
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
    marginTop: 30,
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  // Add more styles as required
});

export default BookingScreen;
