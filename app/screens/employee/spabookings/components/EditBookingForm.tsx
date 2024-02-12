import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, TouchableOpacity, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome5';

export interface SpaBooking {
  id?: string;
  userId: string;
  title: string;
  price: string;
  duration: string;
  time:string;
  date: string;
  name: string;
  email: string;
  userRoomNumber: string;
}

interface EditBookingFormProps {
  booking: SpaBooking;
  onSave: (booking: SpaBooking) => void;
  onCancel: () => void;
}

const EditBookingForm: React.FC<EditBookingFormProps> = ({ booking, onSave, onCancel }) => {
  const [editedBooking, setEditedBooking] = useState<SpaBooking>(booking);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const handleChange = (value: string, name: keyof SpaBooking) => {
    setEditedBooking({ ...editedBooking, [name]: value });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setDatePickerVisibility(false);
    if (selectedDate) {
      handleChange(selectedDate.toISOString().split('T')[0], 'date');
    }
  };

  return (
    <View style={styles.formContainer}>
      <TextInput
        style={styles.input}
        value={editedBooking.title}
        onChangeText={(text) => handleChange(text, 'title')}
        placeholder="Titel"
      />
      <TextInput
        style={styles.input}
        value={editedBooking.price}
        onChangeText={(text) => handleChange(text, 'price')}
        placeholder="Preis"
      />
      <TextInput
        style={styles.input}
        value={editedBooking.duration}
        onChangeText={(text) => handleChange(text, 'duration')}
        placeholder="Dauer"
      />
      <TextInput
        style={styles.input}
        value={editedBooking.name}
        onChangeText={(text) => handleChange(text, 'name')}
        placeholder="Name"
      />
      <TextInput
        style={styles.input}
        value={editedBooking.email}
        onChangeText={(text) => handleChange(text, 'email')}
        placeholder="E-Mail"
      />
      <TouchableOpacity
        style={styles.datePickerButton}
        onPress={() => setDatePickerVisibility(true)}>
        <Text style={styles.datePickerText}>Datum: {editedBooking.date}</Text>
        <Icon name="calendar-alt" size={20} color="#007bff" />
      </TouchableOpacity>
      {isDatePickerVisible && (
        <DateTimePicker
          value={new Date(editedBooking.date)}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      <View style={styles.buttonContainer}>
        <Button title="Speichern" onPress={() => onSave(editedBooking)} color="#007bff" />
        <Button title="Abbrechen" onPress={onCancel} color="#ff4444" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  datePickerText: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
});

export default EditBookingForm;
