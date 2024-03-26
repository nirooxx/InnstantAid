// TableReservationScreen.tsx
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from "../../../../../routes/types"; // Import your type definitions
import { StackNavigationProp } from "@react-navigation/stack";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type BookingNavigationProp = StackNavigationProp<
  RootStackParamList,
  "BookingScreen"
>;

const TableReservationScreen = () => {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [peopleCount, setPeopleCount] = useState(1);
  const [name, setName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const navigation = useNavigation<BookingNavigationProp>();
  const insets = useSafeAreaInsets();
  // Diese Funktionen müssen vervollständigt werden, um die Logik für die Auswahl der Personenanzahl zu implementieren
  const increasePeopleCount = () => {
    setPeopleCount(prevCount => prevCount + 1);
  };

  const decreasePeopleCount = () => {
    setPeopleCount(prevCount => (prevCount > 1 ? prevCount - 1 : 1));
  };

   // Handler für den DatePicker
   const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirmDate = (selectedDate:any) => {
    setDate(selectedDate);
    hideDatePicker();
  };

  // Handler für den TimePicker
  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleConfirmTime = (selectedTime:any) => {
    setTime(selectedTime);
    hideTimePicker();
  };

  const handleBookTable = () => {
    // Übergabe der Reservierungsdaten an die BookingScreen Komponente
    navigation.navigate('BookingScreen', {
      date: date.toISOString().split('T')[0],
      time: `${time.getHours()}:${time.getMinutes()}`,
      peopleCount,
      name,
      roomNumber,
    });
  };

  return (
    <ScrollView  contentContainerStyle={{ paddingBottom: insets.bottom + 70}}  style={styles.container}>
      <View style={styles.landingSection}>
        <Image
          source={{ uri: 'https://cdn.dribbble.com/userupload/4824794/file/original-b86331c3f59bb5eb12844942b99e7d74.png?resize=1024x768' }} // Ersetzen Sie dies durch die URL des Restaurantbildes
          style={styles.restaurantImage}
        />
        <Text style={styles.title}>Willkommen im Restaurant XYZ</Text>
        <Text style={styles.subtitle}>Erleben Sie kulinarische Genüsse in gemütlicher Atmosphäre</Text>
      </View>

      <View >
        <Text style={styles.infoText}>
          {/* Hier können Sie weitere Informationen über das Restaurant oder Angebote hinzufügen */}
          Genießen Sie exklusive Gerichte von unserem Chefkoch und wählen Sie aus einer Vielfalt von Weinen aus.
        </Text>
      </View>

      <View style={styles.reservationSection}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Zimmernummer"
          value={roomNumber}
          onChangeText={setRoomNumber}
          keyboardType="numeric"
        />
      </View>
        <TouchableOpacity style={styles.dateTimeButton} onPress={showDatePicker}>
          <Icon name="calendar-blank" size={24} color="#000" />
          <Text style={styles.dateTimeText}>{`Datum: ${date.toISOString().split('T')[0]}`}</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirmDate}
          onCancel={hideDatePicker}
          date={date}
        />

        <TouchableOpacity style={styles.dateTimeButton} onPress={showTimePicker}>
          <Icon name="clock-outline" size={24} color="#000" />
          <Text style={styles.dateTimeText}>{`Uhrzeit: ${time.getHours()}:${time.getMinutes()}`}</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isTimePickerVisible}
          mode="time"
          onConfirm={handleConfirmTime}
          onCancel={hideTimePicker}
          date={time}
        />

        <View style={styles.peopleCounter}>
          <TouchableOpacity onPress={decreasePeopleCount}>
            <Icon name="minus-box" size={30} color="#000" />
          </TouchableOpacity>
          <Text style={styles.peopleCount}>{`${peopleCount} Person(en)`}</Text>
          <TouchableOpacity onPress={increasePeopleCount}>
            <Icon name="plus-box" size={30} color="#000" />
          </TouchableOpacity>
        </View>
        <View style={styles.bookButtonContainer}>
        <Button
          title="Reservieren"
          onPress={handleBookTable}
          color="#841584"
        />
      </View>
      </View>
     
      {/* Weitere Sektionen und Funktionalitäten */}
    </ScrollView>
  );
};

// Definieren Sie ein Farbschema für Ihre App
const colors = {
    primary: '#007bff',
    light: '#f8f9fa',
    dark: '#343a40',
    white: '#ffffff',
    grey: '#6c757d',
    // ... (Fügen Sie weitere Farben hinzu, wie benötigt)
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.light,
    },
    inputContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
      },
      input: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#cccccc',
        marginBottom: 10,
      },
    bookButtonContainer: {
        marginVertical: 20,
        paddingHorizontal: 20,
      },
    dateTimeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
      },
      dateTimeText: {
        marginLeft: 10,
        fontSize: 16,
      },
      peopleCounter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginVertical: 20,
      },
      peopleCount: {
        fontSize: 16,
      },
    landingSection: {
      padding: 20,
      backgroundColor: colors.white,
      shadowColor: colors.dark,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    restaurantImage: {
      width: '100%',
      height: 200,
      borderRadius: 10,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginTop: 20,
      color: colors.dark,
    },
    subtitle: {
      fontSize: 18,
      textAlign: 'center',
      color: colors.grey,
      marginBottom: 20,
    },
    infoText: {
      fontSize: 16,
      color: colors.dark,
      padding: 10,
    },
    reservationSection: {
      marginTop: 20,
      padding: 20,
      backgroundColor: colors.white,
      shadowColor: colors.dark,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    button: {
      backgroundColor: colors.primary,
      padding: 15,
      borderRadius: 5,
      marginTop: 10,
    },
    buttonText: {
      color: colors.white,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    // ... (Weitere Styling-Optionen)
  });

export default TableReservationScreen;
