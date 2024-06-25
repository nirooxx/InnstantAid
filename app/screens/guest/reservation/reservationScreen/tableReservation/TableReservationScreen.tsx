import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from "../../../../../routes/types"; // Import your type definitions
import { StackNavigationProp } from "@react-navigation/stack";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../store/store";
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';

type BookingNavigationProp = StackNavigationProp<
  RootStackParamList,
  "BookingScreen"
>;

const TableReservationScreen = () => {
  const [date, setDate] = useState(dayjs());
  const memoizedDate = useMemo(() => date.toDate(), [date]);
  const [peopleCount, setPeopleCount] = useState(1);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const user = useSelector((state: RootState) => state.user);
  const navigation = useNavigation<BookingNavigationProp>();

  const increasePeopleCount = useCallback(() => {
    setPeopleCount(prevCount => prevCount + 1);
  }, []);

  const decreasePeopleCount = useCallback(() => {
    setPeopleCount(prevCount => (prevCount > 1 ? prevCount - 1 : 1));
  }, []);

  const handleDateChange = useCallback((params: any) => {
    const selectedDate = params.date;
    setDate(dayjs(selectedDate));
  }, []);

  const handleTimeChange = useCallback((event: any, selectedTime?: Date) => {
    const currentDate = selectedTime || memoizedDate;
    setShowTimePicker(Platform.OS === 'ios');
    setDate(dayjs(currentDate));
  }, [memoizedDate]);

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
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} nestedScrollEnabled>
        <View style={styles.reservationSection}>
          <View style={styles.dateTimePickerWrapper}>
            <DatePicker
              mode="single"
              date={memoizedDate}
              onChange={handleDateChange}
              locale='DE'
              calendarTextStyle={styles.calendarText}
              selectedItemColor="#0047FF"
              minDate={dayjs().startOf('day').toDate()}
            />
            {showTimePicker && (
              <DateTimePicker
                value={memoizedDate}
                mode="time"
                display="default"
                onChange={handleTimeChange}
              />
            )}
            <TouchableOpacity onPress={() => setShowTimePicker(true)}>
              <Text style={styles.dateDisplayText}>
                Uhrzeit auswählen: {date.format('HH:mm')}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dateDisplaySection}>
            <Text style={styles.dateDisplayText}>
              Ausgewähltes Datum: {date.format('DD.MM.YYYY')}
            </Text>
          </View>
          <View style={styles.peopleCounter}>
            <TouchableOpacity onPress={decreasePeopleCount}>
              <Icon name="minus" type="material-community" size={30} color="#000" />
            </TouchableOpacity>
            <Text style={styles.peopleCount}>{`${peopleCount} Person(en)`}</Text>
            <TouchableOpacity onPress={increasePeopleCount}>
              <Icon name="plus" type="material-community" size={30} color="#000" />
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
      </ScrollView>
    </View>
  );
};

const colors = {
  primary: '#007bff',
  light: '#f8f9fa',
  dark: '#343a40',
  white: '#ffffff',
  grey: '#6c757d',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  calendarText: {
    color: '#333',
    fontSize: 16,
  },
  bookButtonContainer: {
    marginVertical: 20,
    paddingHorizontal: 20,
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
  reservationSection: {
    padding: 20,
    backgroundColor: colors.white,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderRadius: 8,
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
  dateTimePickerWrapper: {
    zIndex: 1,
    alignItems: 'center',
  },
});

export default TableReservationScreen;
