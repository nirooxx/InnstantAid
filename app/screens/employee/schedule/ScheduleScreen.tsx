// ScheduleScreen.tsx
import React, { useState } from "react";
import { View, StyleSheet, Button } from "react-native";
import ShiftCreationForm from '../schedule/components/ShiftCreationForm';
import CalendarComponent from '../schedule/components/CalendarComponent'; // Pfad anpassen
import { Shift, ShiftsForDay, Role } from '../types'; // Pfad anpassen

const ScheduleScreen: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<Role>('receptionist');
  const [shifts, setShifts] = useState<ShiftsForDay>({});
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleShiftCreated = (newShift: Shift) => {
    setShifts(prevShifts => {
      // Das Datum als Schlüssel im Format 'YYYY-MM-DD' extrahieren
      const shiftDate = dateToString(newShift.startTime);
      
      // Die Schichten für das Datum extrahieren oder ein leeres Array initialisieren
      const shiftsForDate = prevShifts[shiftDate] || [];
  
      // Die neue Schicht zum Array hinzufügen
      shiftsForDate.push(newShift);
  
      // Das aktualisierte Array zurück in das Gesamtobjekt einfügen
      return { ...prevShifts, [shiftDate]: shiftsForDate };
    });
  
    setIsFormVisible(false);
  };
  
  // Hilfsfunktion, um das Datum im Format 'YYYY-MM-DD' zu extrahieren
  const dateToString = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Monate beginnen bei 0
    const day = date.getDate();
    
    // Führende Nullen für Monat und Tag hinzufügen, falls erforderlich
    return `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
  };
  

  return (
    <View style={styles.container}>
      <Button 
        title={isFormVisible ? "Schichtformular verbergen" : "Schicht erstellen"}
        onPress={() => setIsFormVisible(!isFormVisible)} 
      />
      {isFormVisible && <ShiftCreationForm onShiftCreated={handleShiftCreated} role={selectedRole} />}

      <CalendarComponent role={selectedRole} shifts={shifts} />
    </View>
  );
};


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

export default ScheduleScreen;
