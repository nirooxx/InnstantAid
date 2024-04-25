import React, { useState } from 'react';
import { useDispatch, useSelector  } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView,Alert,  } from 'react-native';
import { RootStackParamList } from "../../../../../routes/types"; // Import your type definitions
import { StackNavigationProp } from "@react-navigation/stack";
import { RootState } from '../../../../../store/store';
import { addSpaBooking } from '../../../../../store/SpaBookingSlice';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { AppDispatch } from '../../../../../store/store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';

type SpaBookingNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ConfirmationScreen'
>;

type SpaBookingScreenRouteProp = RouteProp<{ params: { title: string; image: string;  price: string; duration: string;} }, 'params'>;



//Zeit wird nicht richtig gepsoeichert
const SpaServiceDetail: React.FC = () => {
  const navigation = useNavigation<SpaBookingNavigationProp>();
  const route = useRoute<SpaBookingScreenRouteProp>();
  const { title, price, duration } = route.params;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const userRoomNumber = useSelector((state: RootState) => state.user.roomNumber);
  const userId = useSelector((state: RootState) => state.user.id);
  const [date, setDate] = useState(dayjs());

  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();


  const handleBooking = () => {
    const formattedTime = date.format('HH:mm');
   
    // Formatierung des Datums und der Uhrzeit für die Anzeige
    const bookingDate = date.format('DD.MM.YYYY');
  
    // Erstellung des Buchungsdetails String
    const bookingDetails = `Service: ${title}\nPreis: ${price}\nDauer: ${duration}\nDatum: ${bookingDate}\nZeit: ${formattedTime}Uhr\nName: ${name}\nEmail: ${email}`;

    // Anzeigen des Bestätigungsdialoges
    Alert.alert(
      "Buchung bestätigen",
      bookingDetails,
      [
        {
          text: "Abbrechen",
          onPress: () => console.log("Buchung abgebrochen"),
          style: "cancel"
        },
        { 
          text: "Bestätigen", 
          onPress: () => confirmBooking()
        }
      ]
    );
  };
  
  const handleConfirmDateTime = (selectedDate: dayjs.Dayjs) => {
    setDate(selectedDate); // Aktualisiere das Datum und die Uhrzeit gemeinsam mit dayjs
  };

  const confirmBooking = () => {
    // Verwendung der formatDate Funktion für das Datum
    const formattedDate = date.format('DD.MM.YYYY');
    const formattedTime = date.format('HH:mm');
  
    const newBooking = {
      title,
      price,
      duration,
      date: formattedDate, // Nutze das korrekt formatierte Datum
      time: formattedTime,
      name,
      email,
      userId,
      userRoomNumber
    };
  
    try {
      dispatch(addSpaBooking(newBooking));
      Alert.alert("Buchung erfolgreich!", "Deine Buchung wurde bestätigt.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Fehler beim Erstellen der Buchung: " + error);
    }
  };
  


  
// Wenn du `title` verwendest, stelle sicher, dass es ein gültiger Schlüssel ist oder verwende einen Fallback

  return (
  
    <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 70}} // Fügen Sie genug Padding hinzu, um die TabBar und den Button zu berücksichtigen
      style={styles.container}>
    <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSub7i7li7OKf9SdCEc-YKUVrvTH_FGYQgjNRJxj7riwokoXB30b-9yMkv0_XYqwGCAAwc&usqp=CAU' }} style={styles.image} />
    <View style={styles.detailsContainer}>
      <View style={styles.titlePriceContainer}>
        <Icon name="calendar" size={28} color="#5A67D8" style={styles.icon} />
        <View style={styles.titlePriceTextContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.price}>{price} - {duration}</Text>
        </View>
      </View>
      <Text style={styles.description}>Genießen Sie ein vollkommen entspannendes Erlebnis mit unserer Signature Thai Massage, die Stress abbaut und die Durchblutung verbessert.</Text>

      {/* TextInput fields */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setName}
          value={name}
          placeholder="Ihr Name"
          placeholderTextColor="#ccc"
        />
        <TextInput
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
          placeholder="Ihre E-Mail"
          placeholderTextColor="#ccc"
        />
  <DateTimePicker
    mode="single"
    date={date}
    onChange={(params: any) => handleConfirmDateTime(dayjs(params.date))}
    locale="de"
    calendarTextStyle={styles.calendarText}
    selectedItemColor="#0047FF"
    timePicker={true}
    minDate={dayjs().startOf('day').toDate()} 
  />
  <View style={styles.dateDisplaySection}>
    <Text style={styles.dateDisplayText}>
      Ausgewähltes Datum: {date.format('DD.MM.YYYY')}
    </Text>
    <Text style={styles.dateDisplayText}>
      Ausgewählte Uhrzeit: {date.format('HH:mm')}
    </Text>
  </View>
         </View>
        {/* Buchen Button */}
        <TouchableOpacity style={styles.button} onPress={handleBooking} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Buchung bestätigen</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
 
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  container: {
    flex: 1,
  },
  dateDisplaySection: {
    marginTop: 10,
    alignItems: 'center',
  },
  dateDisplayText: {
    fontSize: 16,
    color: '#333',
    marginVertical: 4,
  },
  calendarText: {
    // Deine Styling-Präferenzen für den Kalendertext
  },
  titlePriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8EAF6', // Leichter Hintergrund für das Button
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 10,
    shadowColor: '#5A67D8', // Schattenfarbe entspricht der Hauptfarbe
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dateTimeText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  icon: {
    marginRight: 8,
  },
  titlePriceTextContainer: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 24,
  },
  image: {
    width: '100%',
    height: 300,
  },
  button: {
    backgroundColor: '#5A67D8',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: '#5A67D8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  detailsContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  price: {
    fontSize: 20,
    marginBottom: 10,
  },
 
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  input: {
    height: 40,
    marginBottom: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    borderColor: '#5A67D8',
  },
});

export default SpaServiceDetail;
