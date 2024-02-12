// ScheduleScreen.tsx
import React, { useState, useEffect } from "react";
import { View, StyleSheet,ScrollView, Modal, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { fetchShifts } from '../../../store/scheduleSlice';
import ShiftCreationForm from '../schedule/components/ShiftCreationForm';
import CalendarComponent from '../schedule/components/CalendarComponent'; // Pfad anpassen
import { RootState } from '../../../store/store'; 
import { Shift, ShiftsForDay, Role, FirestoreTimestamp } from '../types'; // Pfad anpassen
import { Picker } from '@react-native-picker/picker';
import { AppDispatch } from '../../../store/store';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const ScheduleScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const shiftsFromStore = useSelector((state: RootState) => state.schedule.shifts);
  const [selectedRole, setSelectedRole] = useState<Role>('receptionist');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    dispatch(fetchShifts());
  }, [dispatch]);

 

  const toggleFormModal = () => {
    setIsFormVisible(!isFormVisible);
  };

  function convertFirestoreTimestampToDate(timestamp: FirestoreTimestamp | Date): Date {
    if (timestamp instanceof Date) {
      return timestamp; // Ist bereits ein Date-Objekt
    } else if ('seconds' in timestamp) {
      return new Date(timestamp.seconds * 1000); // Umwandlung von Firestore Timestamp
    }
    return new Date(); // Rückgabe des aktuellen Datums als Fallback
  }
  
  // Umwandlung des Shift-Arrays in ein ShiftsForDay-Objekt
  const shiftsForCalendar: ShiftsForDay = shiftsFromStore.reduce((acc, shift) => {
    const startTime = convertFirestoreTimestampToDate(shift.startTime);
    const endTime = convertFirestoreTimestampToDate(shift.endTime);
  
    if (startTime) {
      const shiftDate = startTime.toISOString().split('T')[0];
  
      if (!acc[shiftDate]) {
        acc[shiftDate] = [];
      }
  
      acc[shiftDate].push({ ...shift, startTime, endTime });
    } else {
      console.error('Ungültiges oder fehlendes Startdatum für Schicht:', shift);
    }
    return acc;
  }, {} as ShiftsForDay);

  return (
    <>
      <View style={styles.container}>
    <ScrollView
      contentContainerStyle={{ paddingBottom: insets.bottom }} // Fügen Sie genug Padding hinzu, um die TabBar und den Button zu berücksichtigen
      style={styles.scrollView}
    >
    
        {/* Role Selection */}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedRole}
            onValueChange={(itemValue) => setSelectedRole(itemValue as Role)}
            style={styles.picker}
          >
            <Picker.Item label="Rezeptionist" value="receptionist" />
            <Picker.Item label="Zimmermädchen" value="maid" />
            {/* Weitere Rollenoptionen... */}
          </Picker>
        </View>

        {/* Calendar Component */}
        <CalendarComponent role={selectedRole} shifts={shiftsForCalendar} />
        </ScrollView>
   


    {/* "Hinzufügen"-Button */}
    <TouchableOpacity
      style={[styles.addButton, { bottom: insets.bottom + 80 }]}  // Positionieren Sie den Button über der TabBar
      onPress={toggleFormModal}
    >
      <Icon name="add" size={24} color="#fff" />
    </TouchableOpacity>
    </View>
    {/* Shift Creation Form Modal */}
    <Modal
      animationType="slide"
      transparent={true}
      visible={isFormVisible}
      onRequestClose={toggleFormModal}
    >
      <View style={styles.centeredView}>
        <ShiftCreationForm onShiftCreated={toggleFormModal} />
      </View>
    </Modal>
  </>
  );
};
export default ScheduleScreen;

const styles = StyleSheet.create({container: {
  flex: 1,
  backgroundColor: '#f7f7f7',
},
scrollView: {
  padding: 20,
},
pickerContainer: {
  backgroundColor: '#fff',
  borderRadius: 10,
  marginBottom: 20,
  borderWidth: 1,
  borderColor: '#ddd',
  overflow: 'hidden',
},
picker: {
  color: '#444',
},
addButton: {
  position: 'absolute',
  right: 20,
  backgroundColor: '#5e60ce',
  width: 60,
  height: 60,
  borderRadius: 30,
  justifyContent: 'center',
  alignItems: 'center',
  shadowColor: '#5e60ce',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 4.65,
  elevation: 8,
},
centeredView: {
  justifyContent: 'flex-end',
  flex: 1,
},
modalView: {
  backgroundColor: 'white',
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  paddingVertical: 35,
  paddingHorizontal: 20,
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2
  },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5,
},

 
  header: {
    paddingTop: 50, // This accounts for the status bar height on some devices
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: 'grey', // Slightly lighter black for header background
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dateContainer: {
    backgroundColor: 'grey', // Slightly lighter black for calendar background
    borderRadius: 20,
    marginHorizontal: 10,
    marginTop: 10,
    padding: 10,
    // If the calendar has its own padding, you might not need this
  },
  taskList: {
    flex: 1, // Take up all available space
    marginTop: 20, // Space from the header or date container
  },
 
  addIcon: {
    fontSize: 30,
    color: 'white',
  },
  addButtonText: {
    fontSize: 30,
    color: 'white',
  },

  pickerItem: {
    color: 'white', // White color for the picker items
  },
 
  closeButton: {
    position: 'absolute',
    right: 25,
    bottom: 25,
    backgroundColor: '#2ecc71', // Green background for the add button
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  closeButtonText: {
    fontSize: 30,
    color: 'white',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  // Additional styling for calendar items will go here
  // You will need to adjust the styles based on your CalendarComponent's structure
});



