// ScheduleScreen.tsx
import React, { useState, useEffect } from "react";
import { View, StyleSheet, Button } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { fetchShifts } from '../../../store/scheduleSlice';
import ShiftCreationForm from '../schedule/components/ShiftCreationForm';
import CalendarComponent from '../schedule/components/CalendarComponent'; // Pfad anpassen
import { RootState } from '../../../store/store'; 
import { Shift, ShiftsForDay, Role } from '../types'; // Pfad anpassen
import { Picker } from '@react-native-picker/picker';
import { AppDispatch } from '../../../store/store';

const ScheduleScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const shiftsFromStore = useSelector((state: RootState) => state.schedule.shifts);
  const [selectedRole, setSelectedRole] = useState<Role>('receptionist');
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchShifts());
  }, [dispatch]);

  const handleShiftCreated = (newShift: Shift) => {
  
    setIsFormVisible(false);
  };
  
  // Umwandlung des Shift-Arrays in ein ShiftsForDay-Objekt
  const shiftsForCalendar: ShiftsForDay = shiftsFromStore.reduce((acc, shift) => {
    const shiftDate = shift?.startTime?.toISOString()?.split('T')[0]; // Extrahiert das Datum im Format 'YYYY-MM-DD'
    
    // Stellen Sie sicher, dass der Typ von 'acc' als 'ShiftsForDay' erkannt wird
    const accumulator: ShiftsForDay = acc;
  
    if (!accumulator[shiftDate]) {
      accumulator[shiftDate] = [];
    }
    accumulator[shiftDate].push(shift);
    return accumulator;
  }, {} as ShiftsForDay); 
  

  return (
    <View style={styles.container}>
    {/* Rollen-Auswahl */}
    <Picker
      selectedValue={selectedRole}
      onValueChange={(itemValue) => setSelectedRole(itemValue as Role)}
      style={styles.picker}>
      <Picker.Item label="Rezeptionist" value="receptionist" />
      <Picker.Item label="Zimmermädchen" value="maid" />
      {/* Weitere Rollen */}
    </Picker>

    <Button 
      title={isFormVisible ? "Schichtformular verbergen" : "Schicht erstellen"}
      onPress={() => setIsFormVisible(!isFormVisible)} 
    />

    {isFormVisible && <ShiftCreationForm onShiftCreated={handleShiftCreated} />}

    <CalendarComponent role={selectedRole} shifts={shiftsForCalendar} />
  </View>
  );
};
export default ScheduleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  picker: {
    width: "100%",
    marginBottom: 20,
  },
  // ...weitere Stile
});


