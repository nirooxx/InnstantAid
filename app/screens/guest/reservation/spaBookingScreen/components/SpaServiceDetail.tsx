import React, { useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert, Modal, Button } from 'react-native';
import { RootStackParamList } from "../../../../../routes/types";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootState } from '../../../../../store/store';
import { addSpaBooking } from '../../../../../store/SpaBookingSlice';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { AppDispatch } from '../../../../../store/store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';

type SpaBookingNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ConfirmationScreen'
>;

type SpaBookingScreenRouteProp = RouteProp<{ params: { title: string; image: string; price: string; duration: string; } }, 'params'>;

const SpaServiceDetail: React.FC = () => {
  const navigation = useNavigation<SpaBookingNavigationProp>();
  const route = useRoute<SpaBookingScreenRouteProp>();
  const { title, price, duration } = route.params;
  const userRoomNumber = useSelector((state: RootState) => state.user.roomNumber);
  const userId = useSelector((state: RootState) => state.user.id);
  const [date, setDate] = useState(dayjs());
  const [isPickerShow, setIsPickerShow] = useState(false);
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();

  const memoizedDate = useMemo(() => date.toDate(), [date]);

  const handleBooking = useCallback(() => {
    const bookingDetails = `Service: ${title}\nPreis: ${price}\nDauer: ${duration}\nDatum: ${date.format('DD.MM.YYYY')}\nZeit: ${date.format('HH:mm')} Uhr\nName: ${'name'}\nEmail: ${'email'}`;

    Alert.alert("Buchung bestätigen", bookingDetails, [
      { text: "Abbrechen", onPress: () => console.log("Buchung abgebrochen"), style: "cancel" },
      { text: "Bestätigen", onPress: confirmBooking }
    ]);
  }, [title, price, duration, date]);

  const confirmBooking = useCallback(() => {
    const newBooking = {
      title,
      price,
      duration,
      date: date.format('DD.MM.YYYY'),
      time: date.format('HH:mm'),
      name: 'Test',
      email: 'test@gmail.com',
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
  }, [title, price, duration, date, userId, userRoomNumber, dispatch, navigation]);

  const handleConfirmDateTime = useCallback((params: any) => {
    setDate(dayjs(params.date));
  }, []);

  const togglePicker = () => {
    setIsPickerShow(!isPickerShow);
  };

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 70 }} style={styles.container}>
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
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.dateTimeButton} onPress={togglePicker}>
            <Icon name="calendar" size={28} color="#5A67D8" style={styles.icon} />
            <Text style={styles.dateTimeText}>Datum und Zeit wählen</Text>
          </TouchableOpacity>
          <Text style={styles.dateDisplayText}>
            Ausgewähltes Datum: {date.format('DD.MM.YYYY')}
          </Text>
          <Text style={styles.dateDisplayText}>
            Ausgewählte Uhrzeit: {date.format('HH:mm')}
          </Text>
          <Modal visible={isPickerShow} transparent={false} animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <DateTimePicker
                  mode="single"
                  date={memoizedDate}
                  onChange={handleConfirmDateTime}
                  locale="de"
                  calendarTextStyle={styles.calendarText}
                  selectedItemColor="#5A67D8"
                  timePicker={true}
                  minDate={dayjs().startOf('day').toDate()}
                />
                <Button title="Schließen" onPress={() => setIsPickerShow(false)} />
              </View>
            </View>
          </Modal>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleBooking} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Buchung bestätigen</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  detailsContainer: {
    padding: 20,
  },
  titlePriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  titlePriceTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  price: {
    fontSize: 20,
    color: '#2D3748',
  },
  description: {
    fontSize: 16,
    color: '#4A5568',
    marginBottom: 20,
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8EAF6',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 10,
    shadowColor: '#5A67D8',
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
  inputContainer: {
    marginBottom: 24,
  },
  dateDisplayText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginVertical: 4,
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '80%',
  },
  calendarText: {
    color: '#2D3748',
  },
});

export default SpaServiceDetail;
