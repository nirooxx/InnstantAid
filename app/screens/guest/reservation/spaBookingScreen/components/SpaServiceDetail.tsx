import React, { useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Alert, Modal, Button } from 'react-native';
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
  const { title, price, duration, image } = route.params;
  const userRoomNumber = useSelector((state: RootState) => state.user.roomNumber);
  const userId = useSelector((state: RootState) => state.user.id);
  const [date, setDate] = useState(dayjs());
  const [isPickerShow, setIsPickerShow] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();

  const memoizedDate = useMemo(() => date.toDate(), [date]);

  const handleBooking = useCallback(() => {
    setIsModalVisible(true);
  }, [setIsModalVisible]);

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
      <Image source={require(image)} style={styles.image} />
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
          <Modal visible={isPickerShow} transparent={true} animationType="slide">
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
                
                <Button color='#5A67D8' title="Schließen" onPress={() => setIsPickerShow(false)} />
              </View>
            </View>
          </Modal>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleBooking} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Buchung bestätigen</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.confirmModalOverlay}>
          <View style={styles.confirmModalContent}>
            <Text style={styles.confirmTitle}>Buchung bestätigen</Text>
            <Text style={styles.confirmText}>Service: {title}</Text>
            <Text style={styles.confirmText}>Preis: {price}</Text>
            <Text style={styles.confirmText}>Dauer: {duration}</Text>
            <Text style={styles.confirmText}>Datum: {date.format('DD.MM.YYYY')}</Text>
            <Text style={styles.confirmText}>Zeit: {date.format('HH:mm')} Uhr</Text>
            <View style={styles.confirmButtonContainer}>
              <TouchableOpacity style={styles.confirmButton} onPress={() => setIsModalVisible(false)}>
                <Text style={styles.confirmButtonText}>Abbrechen</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={confirmBooking}>
                <Text style={styles.confirmButtonText}>Bestätigen</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  detailsContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  titlePriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  titlePriceTextContainer: {
    marginLeft: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  price: {
    fontSize: 18,
    color: '#4A5568',
    marginTop: 4,
  },
  description: {
    fontSize: 16,
    color: '#718096',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#E2E8F0',
    borderRadius: 8,
    marginBottom: 8,
  },
  dateTimeText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#5A67D8',
  },
  dateDisplayText: {
    fontSize: 16,
    color: '#4A5568',
    marginBottom: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
  },
  calendarText: {
    fontSize: 16,
    color: '#4A5568',
  },
  button: {
    backgroundColor: '#5A67D8',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  icon: {
    marginRight: 8,
  },
  confirmModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  confirmModalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
  },
  confirmTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 16,
  },
  confirmText: {
    fontSize: 16,
    color: '#4A5568',
    marginBottom: 8,
  },
  confirmButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  confirmButton: {
    backgroundColor: '#5A67D8',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    width: '45%',
  },
  confirmButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SpaServiceDetail;
