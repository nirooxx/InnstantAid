// TableReservationScreen.tsx
import React, { useState, useCallback, useMemo  } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from "../../../../../routes/types"; // Import your type definitions
import { StackNavigationProp } from "@react-navigation/stack";
//import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from "react-redux";
import { RootState } from "../../../../../store/store";
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';


type BookingNavigationProp = StackNavigationProp<
  RootStackParamList,
  "BookingScreen"
>;

const TableReservationScreen = () => {
  const [date, setDate] = useState(dayjs());
  const memoizedDate = useMemo(() => date.toDate(), [date]);
  const [peopleCount, setPeopleCount] = useState(1);
  const user = useSelector((state: RootState) => state.user);
  const navigation = useNavigation<BookingNavigationProp>();
 // const insets = useSafeAreaInsets();

  const increasePeopleCount = useCallback(() => {
    setPeopleCount(prevCount => prevCount + 1);
  }, []);

  const decreasePeopleCount = useCallback(() => {
    setPeopleCount(prevCount => (prevCount > 1 ? prevCount - 1 : 1));
  }, []);

  const handleDateChange = useCallback((params:any) => {
    setDate(dayjs(params.date));
  }, []);

  const handleBookTable = useCallback(() => {
    if (!date.format) {
      console.error('Date is not a Day.js object:', date);
      return;
    }
  
    navigation.navigate('BookingScreen', {
      date: date.format('DD.MM.YYYY'),
      time: date.format('HH:mm'),
      peopleCount,
      name: 'Test',
      roomNumber: user?.roomNumber,
    });
  }, [date, peopleCount, user]);
  


  return (

      <View style={styles.reservationSection}>
        <DateTimePicker
          mode="single"
          date={memoizedDate}
          onChange={handleDateChange}
          locale='DE'
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
            Ausgewählte Uhrzeit: {date.format('HH:mm')} Uhr
          </Text>
        </View>
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
    calendarText: {
      color: '#333',
      fontSize: 16,
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
    dateDisplaySection: {
      marginTop: 10,
      alignItems: 'center',
    },
    dateDisplayText: {
      fontSize: 16,
      color: '#333',
      marginVertical: 4,
    },
  });

export default TableReservationScreen;
