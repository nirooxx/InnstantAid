// ShiftCreationForm.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Shift, Role} from '../../types'
import { Picker } from '@react-native-picker/picker';

interface ShiftCreationFormProps {
  onShiftCreated: (shift: Shift) => void;
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
        const newShift: Shift = {
          name: shiftName,
          employeeName,
          startTime: startDateTime,
          endTime: endDateTime,
          role: selectedRole,
        };
      
        // Aufruf des Callbacks mit dem neuen Schicht-Objekt
        onShiftCreated(newShift);
      
        // Zurücksetzen des Formulars
        setShiftName('');
        setEmployeeName('');
        setStartTime(new Date());
        setEndTime(new Date());
      };
      

  return (
    <View style={styles.formContainer}>
      <TextInput
        style={styles.input}
        placeholder="Schichtname"
        value={shiftName}
        onChangeText={setShiftName}
      />
      <TextInput
        style={styles.input}
        placeholder="Angestellten Name"
        value={employeeName}
        onChangeText={setEmployeeName}
      />
         {/* DatePicker für das Datum */}
      <Button title="Datum wählen" onPress={() => setIsDatePickerVisible(true)} />
      {isDatePickerVisible && (
        <DateTimePicker
          value={startTime} // Zeit wird von startTime übernommen
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {/* TimePicker für Startzeit */}
      <Button title="Startzeit wählen" onPress={() => setIsStartTimePickerVisible(true)} />
      {isStartTimePickerVisible && (
        <DateTimePicker
          value={startTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleStartTimeChange}
        />
      )}

      {/* TimePicker für Endzeit */}
      <Button title="Endzeit wählen" onPress={() => setIsEndTimePickerVisible(true)} />
      {isEndTimePickerVisible && (
        <DateTimePicker
          value={endTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleEndTimeChange}
        />
      )}
      {/* Rollenauswahl */}
      <Picker
        selectedValue={selectedRole}
        onValueChange={(itemValue) => setSelectedRole(itemValue as Role)}
        style={styles.picker}>
        <Picker.Item label="Rezeptionist" value="receptionist" />
        <Picker.Item label="Zimmermädchen" value="maid" />
        {/* Weitere Rollen */}
      </Picker>

      
      <Button title="Schicht erstellen" onPress={handleSubmit} />
    </View>
  );
};

export default ShiftCreationForm;

const styles = StyleSheet.create({
  formContainer: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  picker: {
    marginBottom: 20,
  }
});


