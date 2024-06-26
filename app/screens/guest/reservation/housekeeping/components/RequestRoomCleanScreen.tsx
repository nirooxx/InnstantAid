import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDispatch, useSelector } from 'react-redux'; // Import useDispatch
import { submitRoomCleanRequest } from '../../../../../store/houseKeepingSlice';
import { AppDispatch } from '../../../../../store/store';
import { RootState } from '../../../../../store/store';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from "../../../../../routes/types"; // Import your type definitions
import { StackNavigationProp } from "@react-navigation/stack";

type HousekeepingNavigationProp = StackNavigationProp<RootStackParamList>;

const RequestRoomCleanScreen: React.FC = () => {
  const [selectedTimeOption, setSelectedTimeOption] = useState<'NOW' | 'ANOTHER_TIME'>('NOW');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [notes, setNotes] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user);
  const navigation = useNavigation<HousekeepingNavigationProp>();

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(Platform.OS === 'ios');
    setTime(currentTime);
  };

  const handleTimeOptionChange = (option: 'NOW' | 'ANOTHER_TIME') => {
    setSelectedTimeOption(option);
    if (option === 'ANOTHER_TIME') {
      setShowDatePicker(true);
    }
  };

  const handleBook = () => {
    dispatch(submitRoomCleanRequest({
      userId: user?.id,
      roomNumber: user.roomNumber,
      date: selectedTimeOption === 'NOW' ? new Date().toLocaleDateString('de-DE') : date.toLocaleDateString('de-DE'),
      time: selectedTimeOption === 'NOW' ? new Date().toLocaleTimeString('de-DE') : time.toLocaleTimeString('de-DE'),
      notes,
    }))
      .unwrap()
      .then(() => {
        Alert.alert('Success', 'Room clean request submitted');
        navigation.goBack();
      })
      .catch((error) => {
        Alert.alert('Error', 'Failed to submit room clean request: ' + error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Request Room Clean</Text>
      
      <View style={styles.radioGroup}>
        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => handleTimeOptionChange('NOW')}>
          <View style={selectedTimeOption === 'NOW' ? styles.radioCircleSelected : styles.radioCircle} />
          <Text style={styles.radioText}>NOW - As soon as possible please</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => handleTimeOptionChange('ANOTHER_TIME')}>
          <View style={selectedTimeOption === 'ANOTHER_TIME' ? styles.radioCircleSelected : styles.radioCircle} />
          <Text style={styles.radioText}>ANOTHER TIME - Please Specify in Notes</Text>
        </TouchableOpacity>

        {selectedTimeOption === 'ANOTHER_TIME' && (
          <>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onDateChange}
                locale="de-DE"
              />
            )}
            <TouchableOpacity
              style={styles.datePickerToggle}
              onPress={() => setShowDatePicker(true)}>
              <Text style={styles.datePickerText}>Datum wählen: {date.toLocaleDateString('de-DE')}</Text>
            </TouchableOpacity>
            
            {showTimePicker && (
              <DateTimePicker
                value={time}
                mode="time"
                display="default"
                onChange={onTimeChange}
                locale="de-DE"
              />
            )}
            <TouchableOpacity
              style={styles.datePickerToggle}
              onPress={() => setShowTimePicker(true)}>
              <Text style={styles.datePickerText}>Zeit wählen: {time.toLocaleTimeString('de-DE')}</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <TextInput
        style={styles.notesInput}
        onChangeText={setNotes}
        value={notes}
        placeholder="Notes"
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleBook}>
        <Text style={styles.buttonText}>BOOK</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RequestRoomCleanScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F7FAFC', // Hintergrundfarbe des Screens
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
    textAlign: 'center',
    marginBottom: 24,
  },
  radioGroup: {
    marginBottom: 24,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#5A67D8',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#5A67D8',
  },
  radioText: {
    fontSize: 16,
    color: '#2D3748',
  },
  datePickerToggle: {
    backgroundColor: '#E2E8F0',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  datePickerText: {
    fontSize: 16,
    color: '#2D3748',
  },
  notesInput: {
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 24,
    color: '#2D3748',
    backgroundColor: '#FFFFFF',
  },
  button: {
    backgroundColor: '#5A67D8', // Farbe des Buchungsbuttons
    padding: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
