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
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  const handleChange = (value: string, name: keyof SpaBooking) => {
    setEditedBooking({ ...editedBooking, [name]: value });
  };

  const formatDate = (date:Date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    // Monate in JavaScript beginnen bei 0, deshalb +1
    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    return [year, month, day].join('-');
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setDatePickerVisibility(false);
    if (selectedDate) {
      handleChange(formatDate(selectedDate), 'date');
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setTimePickerVisibility(false);
    if (selectedTime) {
      const formattedTime = `${selectedTime.getHours().toString().padStart(2, '0')}:${selectedTime.getMinutes().toString().padStart(2, '0')}`; // Zeit im HH:MM Format
      handleChange(formattedTime, 'time');
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
      <TouchableOpacity style={styles.button} onPress={() => setDatePickerVisibility(true)}>
        <Icon name="calendar" size={16} color="#ffffff" />
        <Text style={styles.buttonText}>Datum: {editedBooking.date}</Text>
      </TouchableOpacity>
      {isDatePickerVisible && (
        <DateTimePicker
          value={new Date(editedBooking.date)}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      <TouchableOpacity style={styles.button} onPress={() => setTimePickerVisibility(true)}>
        <Icon name="clock" size={16} color="#ffffff" />
        <Text style={styles.buttonText}>Zeit: {editedBooking.time}</Text>
      </TouchableOpacity>
      {isTimePickerVisible && (
        <DateTimePicker
          value={new Date()} // Sie müssen eventuell die Logik anpassen, um die aktuelle Zeit korrekt zu initialisieren
          mode="time"
          is24Hour={true} // 24-Stunden Format, falls gewünscht
          display="default"
          onChange={handleTimeChange}
        />
      )}
    {/* Speichern und Abbrechen Buttons */}
    <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={() => onSave(editedBooking)}>
          <Text style={styles.buttonText}>Speichern</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.buttonText}>Abbrechen</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.1,
    elevation: 4,
  },
  input: {
    backgroundColor: '#ffffff',
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 12,
    paddingHorizontal: 12,
    fontSize: 16,
    height: 48,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#007bff',
    borderRadius: 4,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    marginLeft: 8,
    color: '#ffffff',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: '#28a745',
    borderRadius: 4,
    padding: 12,
    flexGrow: 1,
    marginRight: 8,
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    borderRadius: 4,
    padding: 12,
    flexGrow: 1,
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
});

export default EditBookingForm;
