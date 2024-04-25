import React, { useState, useCallback } from 'react';
import { View, TextInput, Button, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDispatch } from 'react-redux';
import { createShift } from '../../../../store/scheduleSlice';
import { Shift, Role } from '../../types';
import { Picker } from '@react-native-picker/picker';
import { AppDispatch } from '../../../../store/store';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ShiftCreationFormProps {
  onShiftCreated: () => void; // Declares a function that returns nothing
}

const ShiftCreationForm: React.FC<ShiftCreationFormProps> = React.memo(({ onShiftCreated }) => {
    const [formState, setFormState] = useState({
        shiftName: '',
        employeeName: '',
        selectedRole: 'receptionist',
        startTime: new Date(),
        endTime: new Date(),
        isStartTimePickerVisible: false,
        isEndTimePickerVisible: false,
        isDatePickerVisible: false
    });
    const insets = useSafeAreaInsets();
    const dispatch = useDispatch<AppDispatch>();

    const handleInputChange = useCallback((field:any, value:any) => {
        setFormState(prevState => ({
            ...prevState,
            [field]: value
        }));
    }, []);

    const formatTime = (time:Date) => {
      return `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;
  };
  

    const handleOpenStartTimePicker = () => {
      setFormState(prevState => ({
          ...prevState,
          isStartTimePickerVisible: true,
          isEndTimePickerVisible: false,
          isDatePickerVisible: false
      }));
  };
  
  const handleOpenEndTimePicker = () => {
      setFormState(prevState => ({
          ...prevState,
          isEndTimePickerVisible: true,
          isStartTimePickerVisible: false,
          isDatePickerVisible: false
      }));
  };
  
  const handleOpenDatePicker = () => {
      setFormState(prevState => ({
          ...prevState,
          isDatePickerVisible: true,
          isStartTimePickerVisible: false,
          isEndTimePickerVisible: false
      }));
  };
  
  const handleCloseAllPickers = () => {
      setFormState(prevState => ({
          ...prevState,
          isDatePickerVisible: false,
          isStartTimePickerVisible: false,
          isEndTimePickerVisible: false
      }));
  };
  

    const handleSubmit = useCallback(() => {
        if (!formState.shiftName || !formState.employeeName) {
            console.error('Bitte alle Felder ausfüllen.');
            return;
        }

        if (formatTime(formState.endTime) < formatTime(formState.startTime)) {
            console.error('Das Enddatum kann nicht vor dem Startdatum liegen.');
            return;
        }

        const newShift = {
            name: formState.shiftName,
            employeeName: formState.employeeName,
            startTime: formState.startTime,
            endTime: formState.endTime,
            role: formState.selectedRole,
        };

        dispatch(createShift(newShift));
        onShiftCreated();

        setFormState({
            shiftName: '',
            employeeName: '',
            selectedRole: 'receptionist',
            startTime: new Date(),
            endTime: new Date(),
            isStartTimePickerVisible: false,
            isEndTimePickerVisible: false,
            isDatePickerVisible: false
        });
    }, [formState, dispatch]);

      return (
        <ScrollView style={styles.formContainer} contentContainerStyle={{paddingBottom: insets.bottom + 70}}>
        {/* Eingabefeld für Schichtname */}
       
          <Text style={styles.label}>Schichtname</Text>
          <TextInput
                style={styles.input}
                placeholder="Geben Sie den Schichtnamen ein"
                placeholderTextColor="#8e8e93"
                value={formState.shiftName}
                onChangeText={(text) => handleInputChange('shiftName', text)}
            />
        
  
        {/* Eingabefeld für Angestellten Namen */}
        <Text style={styles.label}>Angestellten Name</Text>
            <TextInput
                style={styles.input}
                placeholder="Geben Sie den Namen des Angestellten ein"
                placeholderTextColor="#8e8e93"
                value={formState.employeeName}
                onChangeText={(text) => handleInputChange('employeeName', text)}
            />
        <View style={styles.datePickerGroup}>
        {/* Datum auswählen */}
        <TouchableOpacity style={styles.dateButton} onPress={handleOpenDatePicker}>
    <Text style={styles.dateText}>Datum</Text>
    <Text style={styles.dateText}>{formState.startTime.toLocaleDateString()}</Text>
    <Icon name="calendar" size={20} color="#FFFFFF" />
</TouchableOpacity>
{formState.isDatePickerVisible && (
    <DateTimePicker
        value={formState.startTime}
        mode="date"
        display="default"
        onChange={(event, date) => {
            handleInputChange('startTime', date);
            handleCloseAllPickers();
        }}
    />
)}
  
  <TouchableOpacity style={styles.dateButton} onPress={handleOpenStartTimePicker}>
    <Text style={styles.dateText}>Startzeit</Text>
    <Text style={styles.dateText}>{formatTime(formState.startTime)}</Text>
    <Icon name="calendar" size={20} color="#FFFFFF" />
</TouchableOpacity>
{formState.isStartTimePickerVisible && (
    <DateTimePicker
        value={formState.startTime}
        mode="time"
        is24Hour={false}
        display="default"
        onChange={(event, date) => {
            handleInputChange('startTime', date || formState.startTime);
            handleCloseAllPickers();
        }}
    />
)}

<TouchableOpacity style={styles.dateButton} onPress={handleOpenEndTimePicker}>
    <Text style={styles.dateText}>Endzeit</Text>
    <Text style={styles.dateText}>{formatTime(formState.endTime)}</Text>
    <Icon name="calendar" size={20} color="#FFFFFF" />
</TouchableOpacity>
{formState.isEndTimePickerVisible && (
    <DateTimePicker
        value={formState.endTime}
        mode="time"
        is24Hour={false}
        display="default"
        onChange={(event, date) => {
            handleInputChange('endTime', date || formState.endTime);
            handleCloseAllPickers();
        }}
    />
)}

</View>
     
  
        {/* Rollenauswahl */}
        <Picker
                selectedValue={formState.selectedRole}
                onValueChange={(itemValue) => handleInputChange('selectedRole', itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="Rezeptionist" value="receptionist" />
                <Picker.Item label="Zimmermädchen" value="maid" />
            </Picker>
  
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
});

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


