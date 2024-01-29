// ScheduleScreen.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Picker } from '@react-native-picker/picker';
import CalendarComponent from '../schedule/components/CalendarComponent'; // Pfad anpassen
import { ShiftsForDay, Role } from '../types'; // Pfad anpassen

const ScheduleScreen: React.FC = () => {
    const [selectedRole, setSelectedRole] = useState<Role>("receptionist");
  const [shifts, setShifts] = useState<ShiftsForDay>({
    // Beispiel-Daten
    '2022-05-22': [{ name: 'Frühschicht', startTime: '08:00', endTime: '16:00' }],
    // ...weitere Daten
  });

  const roles = [
    { label: "Rezeptionist", value: "rezeptionist" },
    { label: "Zimmermädchen", value: "zimmermaedchen" },
    // ...weitere Unterrollen
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Schichtplanung</Text>
      <Picker
        selectedValue={selectedRole}
        onValueChange={(itemValue) => setSelectedRole(itemValue)}
        mode="dropdown"
        style={styles.picker}
      >
        {roles.map((role) => (
          <Picker.Item key={role.value} label={role.label} value={role.value} />
        ))}
      </Picker>

      <CalendarComponent role={selectedRole} shifts={shifts} />

      {/* Weitere Komponenten hier */}
    </ScrollView>
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
