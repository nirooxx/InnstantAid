// ShiftCreationForm.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet,TouchableOpacity, Text, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDispatch } from 'react-redux';
import { createShift } from '../../../../store/scheduleSlice';
import {Shift, Role} from '../../types'
import { Picker } from '@react-native-picker/picker';
import { AppDispatch } from '../../../../store/store';
import Icon from 'react-native-vector-icons/FontAwesome'; 

interface ShiftCreationFormProps {
  onShiftCreated: () => void;
}

const ShiftCreationForm: React.FC<ShiftCreationFormProps> = ({ onShiftCreated }) => {
    const [shiftName, setShiftName] = useState('');
    const [employeeName, setEmployeeName] = useState('');
    const [selectedRole, setSelectedRole] = useState<Role>('receptionist');
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [isStartTimePickerVisible, setIsStartTimePickerVisible] = useState(false);
    const [isEndTimePickerVisible, setIsEndTimePickerVisible] = useState(false);
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
    const dispatch = useDispatch<AppDispatch>();


    const handleStartTimeChange = (event: any, selectedDate: Date | undefined) => {
        setIsStartTimePickerVisible(false);
        if (selectedDate) {
          setStartTime(selectedDate);
        }
      };
    
      const handleEndTimeChange = (event: any, selectedDate: Date | undefined) => {
        setIsEndTimePickerVisible(false);
        if (selectedDate) {
          setEndTime(selectedDate);
        }
      };

      const handleDateChange = (event: any, selectedDate: Date | undefined) => {
        // Setzen der Startzeit und Endzeit auf das ausgewählte Datum
        // Uhrzeit bleibt unverändert
        setIsDatePickerVisible(false)
        if (selectedDate) {
          setStartTime(new Date(selectedDate.setHours(startTime.getHours(), startTime.getMinutes())));
          setEndTime(new Date(selectedDate.setHours(endTime.getHours(), endTime.getMinutes())));
        }
      };

      const handleSubmit = () => {
        // Vergewissern Sie sich, dass alle Felder ausgefüllt sind
        if (!shiftName || !employeeName) {
          console.error('Bitte alle Felder ausfüllen.');
          return;
        }
      
        // Vergewissern Sie sich, dass das Enddatum nicht vor dem Startdatum liegt
        const startDateTime = new Date(startTime);
        const endDateTime = new Date(endTime);
      
        if (endDateTime < startDateTime) {
          console.error('Das Enddatum kann nicht vor dem Startdatum liegen.');
          return;
        }
      
        // Erstellen des Schicht-Objekts
        const newShift: Omit<Shift, 'id'> = {
          name: shiftName,
          employeeName,
          startTime: startDateTime,
          endTime: endDateTime,
          role: selectedRole,
        };
        dispatch(createShift(newShift));
        // Aufruf des Callbacks mit dem neuen Schicht-Objekt
        onShiftCreated();
      
        // Zurücksetzen des Formulars
        setShiftName('');
        setEmployeeName('');
        setStartTime(new Date());
        setEndTime(new Date());
      };
      
      // Format function
  const formatDate = (date:Date) => {
    return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;
  };

  const formatTime = (time: Date) => {
    return `${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`;
  };

      return (
        <ScrollView style={styles.formContainer} contentContainerStyle={styles.contentContainer}>
        {/* Eingabefeld für Schichtname */}
       
          <Text style={styles.label}>Schichtname</Text>
          <TextInput
            style={styles.input}
            placeholder="Geben Sie den Schichtnamen ein"
            placeholderTextColor="#8e8e93"
            value={shiftName}
            onChangeText={setShiftName}
          />
        
  
        {/* Eingabefeld für Angestellten Namen */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Angestellten Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Geben Sie den Namen des Angestellten ein"
            placeholderTextColor="#8e8e93"
            value={employeeName}
            onChangeText={setEmployeeName}
          />
        </View>
        <View style={styles.datePickerGroup}>
        {/* Datum auswählen */}
        <TouchableOpacity style={styles.dateButton} onPress={() => setIsDatePickerVisible(true)}>
        <Text style={styles.dateText}>Datum</Text>
        <Text style={styles.dateText}>{formatDate(startTime)}</Text>
        <Icon name="calendar" size={20} color="#FFFFFF" />
      </TouchableOpacity>
      {isDatePickerVisible && (
        <DateTimePicker
          value={startTime}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
  
        {/* Startzeit auswählen */}
        <TouchableOpacity style={styles.dateButton} onPress={() => setIsStartTimePickerVisible(true)}>
        <Text style={styles.dateText}>Startzeit</Text>
        <Text style={styles.dateText}>{formatTime(startTime)}</Text>
        <Icon name="calendar" size={20} color="#FFFFFF" />
      </TouchableOpacity>
          {isStartTimePickerVisible && (
            <DateTimePicker
              value={startTime}
              mode="time"
              is24Hour={false}
              display="default"
              onChange={handleStartTimeChange}
              style={styles.dateTimePicker}
            />
          )}
       
  
        {/* Endzeit auswählen */}
        <TouchableOpacity style={styles.dateButton} onPress={() => setIsEndTimePickerVisible(true)}>
        <Text style={styles.dateText}>Endzeit </Text>
        <Text style={styles.dateText}>{formatTime(endTime)}</Text>
        <Icon name="calendar" size={20} color="#FFFFFF" />
      </TouchableOpacity>
          {isEndTimePickerVisible && (
            <DateTimePicker
              value={endTime}
              mode="time"
              is24Hour={false}
              display="default"
              onChange={handleEndTimeChange}
              style={styles.dateTimePicker}
            />
          )}

</View>
     
  
        {/* Rollenauswahl */}
        <Text style={styles.label}>Rolle</Text>
      <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedRole}
            onValueChange={(itemValue) => setSelectedRole(itemValue as Role)}
            style={styles.picker}
          >
            <Picker.Item label="Rezeptionist" value="receptionist" />
            <Picker.Item label="Zimmermädchen" value="maid" />
            {/* Weitere Rollen */}
          </Picker>
        </View>
  
        {/* Button-Bereich */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.cancelButton} onPress={onShiftCreated}>
          <Text style={styles.buttonText}>Abbrechen</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Schicht erstellen</Text>
        </TouchableOpacity>
        </View>
      </ScrollView>
      );
};

export default ShiftCreationForm;

const styles = StyleSheet.create({
 
  formContainer: {
    flex: 1,
 
    backgroundColor: '#2C2C2E',
    borderRadius: 20,
    padding: 20,
    maxHeight: '80%', // Adjust this to control how much of the screen the form should take up
  },
  dateButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333333',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 15,
    width: '80%', // Stellen Sie sicher, dass die Breite zu Ihrem Design passt
  },
  datePickerGroup: {
    // Stellen Sie sicher, dass diese Gruppe alle DatePicker-Felder umfasst
    width: '100%',
    alignItems: 'center', // Zentriert die Kinder horizontal
  },
  buttonGroup: {

    flexDirection: 'row',
    justifyContent: 'flex-start', // Erzeugt Platz zwischen den Buttons
    width: '100%', // Nimmt die volle Breite des Elternelements ein
    paddingVertical: 10,
  },
  cancelButton: {
    backgroundColor: '#999', // Graue Farbe für den Abbrechen-Button
    borderRadius: 20,
    padding: 15,
    flexGrow: 1,
    marginRight: 10, // Fügt einen rechten Rand hinzu, um Platz zum Submit-Button zu schaffen
  },
  submitButton: {
    backgroundColor: '#0A84FF', // Blaue Farbe für den Submit-Button
    borderRadius: 20,
    padding: 15,
    flexGrow: 1,
  },
  buttonText: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateText: {
    color: '#FFFFFF',
    marginRight: 10,
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  label: {
    alignSelf: 'flex-start',
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    width: '100%',
    backgroundColor: '#1C1C1E',
    color: '#FFFFFF',
    borderRadius: 10,
    fontSize: 16,
    padding: 15,
    marginBottom: 15,
  },
  pickerContainer: {
    width: '100%',
    borderRadius: 10,
    marginBottom: 15,
  },
  picker: {
    width: '100%',
    color: '#FFFFFF',
  },
  dateTimePicker: {
    width: '100%',
    backgroundColor: '#1C1C1E',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },

  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputGroup: {
    marginBottom: 20,
  },
});


