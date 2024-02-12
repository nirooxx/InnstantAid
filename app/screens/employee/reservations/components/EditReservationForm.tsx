import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, TouchableOpacity, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome5';

export interface TableReservation {
  id?: string;
  date: string;
  time: string;
  peopleCount: number;
  name: string;
  roomNumber: string;
  table: string;
  reservierung: string;
  userId: string;
}

interface EditReservationFormProps {
  reservation: TableReservation;
  onSave: (reservation: TableReservation) => void;
  onCancel: () => void;
}

const EditReservationForm: React.FC<EditReservationFormProps> = ({ reservation, onSave, onCancel }) => {
  const [editedReservation, setEditedReservation] = useState<TableReservation>(reservation);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  const handleChange = (value: string, name: keyof TableReservation) => {
    setEditedReservation({ ...editedReservation, [name]: value });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setDatePickerVisibility(false);
    if (selectedDate) {
      handleChange(selectedDate.toISOString().split('T')[0], 'date');
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setTimePickerVisibility(false);
    if (selectedTime) {
      const formattedTime = `${selectedTime.getHours()}:${selectedTime.getMinutes()}`;
      handleChange(formattedTime, 'time');
    }
  };

  return (
    <View style={styles.formContainer}>
      <TextInput
        style={styles.input}
        value={editedReservation.name}
        onChangeText={(text) => handleChange(text, 'name')}
        placeholder="Name"
      />
      <TouchableOpacity
        style={styles.datePickerButton}
        onPress={() => setDatePickerVisibility(true)}>
        <Text style={styles.datePickerText}>Datum: {editedReservation.date}</Text>
        <Icon name="calendar-alt" size={20} color="#007bff" />
      </TouchableOpacity>
      {isDatePickerVisible && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      <TouchableOpacity
        style={styles.datePickerButton}
        onPress={() => setTimePickerVisibility(true)}>
        <Text style={styles.datePickerText}>Zeit: {editedReservation.time}</Text>
        <Icon name="clock" size={20} color="#007bff" />
      </TouchableOpacity>
      {isTimePickerVisible && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={handleTimeChange}
        />
      )}
      <TextInput
        style={styles.input}
        value={editedReservation.peopleCount.toString()}
        onChangeText={(text) => handleChange(text, 'peopleCount')}
        placeholder="People Count"
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        value={editedReservation.table}
        onChangeText={(text) => handleChange(text, 'table')}
        placeholder="Table Number"
      />
      <View style={styles.buttonContainer}>
        <Button title="Speichern" onPress={() => onSave(editedReservation)} color="#007bff" />
        <Button title="Abbrechen" onPress={onCancel} color="#ff4444" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 10,
    padding: 8,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 8,
    marginBottom: 10,
  },
  datePickerText: {
    fontSize: 16,
  },
  dateTimePicker: {
    width: '100%',
    backgroundColor: '#1C1C1E',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
});

export default EditReservationForm;
