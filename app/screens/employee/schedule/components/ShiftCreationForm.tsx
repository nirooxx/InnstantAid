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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

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
        <KeyboardAwareScrollView>
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
        
        </KeyboardAwareScrollView>
      </ScrollView>
      );
};

export default ShiftCreationForm;

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: '#2C2C2E',
    borderRadius: 20,
    padding: 20,
    maxHeight: '80%',
    marginHorizontal: 20,
    marginTop: 50,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#414141',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
    width: '100%',
  },
  datePickerGroup: {
    alignItems: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#999',
    borderRadius: 20,
    padding: 15,
    flex: 1,
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: '#0A84FF',
    borderRadius: 20,
    padding: 15,
    flex: 1,
  },
  buttonText: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  dateText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#333333',
    borderRadius: 10,
    fontSize: 16,
    padding: 15,
    color: '#FFFFFF',
    marginBottom: 15,
  },
  pickerContainer: {
    backgroundColor: '#333333',
    borderRadius: 10,
    marginBottom: 15,
  },
  picker: {
    backgroundColor: '#333333',
    color: '#FFFFFF',
  },
  dateTimePicker: {
    backgroundColor: '#333333',
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


