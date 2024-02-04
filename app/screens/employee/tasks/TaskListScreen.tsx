import React, { useState, useEffect } from 'react';
import { View, Modal, StyleSheet, TouchableOpacity, Text, TextInput, FlatList, Image  } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchShifts } from '../../../store/scheduleSlice';
import { fetchTasks, createTask } from '../../../store/taskSlice';
import { RootState } from '../../../store/store'; // Pfad anpassen
import { AppDispatch } from '../../../store/store';
import { Task } from './models/Task';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import TaskItem from './components/TaskList';
import ShiftItem from '../schedule/components/ShiftItem';


const TaskListScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading, error } = useSelector((state: RootState) => state.task);
  const shiftsFromStore = useSelector((state: RootState) => state.schedule.shifts);
  const [modalVisible, setModalVisible] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [title, setTitle] = useState<string>('');
const [description, setDescription] = useState<string>('');
const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('low');
const [dueDate, setDueDate] = useState<string>(new Date().toISOString());
const [status, setStatus] = useState<'new' | 'in progress' | 'completed'>('new');
const [assignedTo, setAssignedTo] = useState<string>('');
const [roleRequired, setRoleRequired] = useState<string>('receptionist');
const [notes, setNotes] = useState<string[]>([]);

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || dueDate;
    setIsDatePickerVisible(false);
    setDueDate(currentDate.toString() );
  };

  // Funktion zum Verstecken des Modal
  const closeModal = () => {

    setModalVisible(false);
  };

  useEffect(() => {
    dispatch(fetchShifts());
  }, [dispatch]);
  
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleCreateTask = () => {
    const createNewTask: Task = {
      id: '', // Die ID wird von Firestore automatisch generiert
      title,
      description,
      priority, // Hier wird nun garantiert, dass priority nur 'low', 'medium' oder 'high' sein kann
      dueDate,
      status,
      assignedTo,
      roleRequired,
      notes,
    };
    dispatch(createTask(createNewTask));
    closeModal();
  };

  
  console.log(shiftsFromStore)
  return (
    <View style={{ flex: 1 }}>
      
      <View style={styles.container}>
      {loading && <Text>Loading...</Text>}
      {error && <Text>Error: {error}</Text>}
      <FlatList
        data={shiftsFromStore}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ShiftItem shift={item} />}
        horizontal={true} // Ermöglicht das horizontale Scrollen
        showsHorizontalScrollIndicator={false} // Versteckt die horizontale Scrollleiste
      />
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TaskItem task={item} />}
      />
    </View>
         {/* Floating Action Button */}
         <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Icon name="add" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Modal für das Erstellen einer neuen Aufgabe */}
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
    
        <View style={styles.modalView}>
        <KeyboardAwareScrollView
  >
          <TextInput
            placeholder="Titel der Aufgabe"
            value={title}
            onChangeText={(text) => setTitle( text )}
            style={styles.input}
          />
          <TextInput
            placeholder="Beschreibung der neuen Aufgabe"
            value={description}
            onChangeText={(text) => setDescription( text )}
            style={styles.input}
          />
          <Picker
            selectedValue={priority}
            onValueChange={(itemValue) => setPriority(itemValue )}
            style={styles.picker}
          >
            <Picker.Item label="High" value="high" />
            <Picker.Item label="Medium" value="medium" />
            <Picker.Item label="Low" value="low" />
          </Picker>
          
             {/* Datum auswählen */}
             <TouchableOpacity style={styles.dateButton} onPress={() => setIsDatePickerVisible(true)}>
        <Text style={styles.dateText}>Datum</Text>
        {/* Hier sollten Sie das Datum formatieren, um es anzuzeigen */}
        <Text style={styles.dateText}>{dueDate.split('T')[0]}</Text>
        <Icon name="calendar" size={20} color="#FFFFFF" />
      </TouchableOpacity>
      {isDatePickerVisible && (
        <DateTimePicker
          value={new Date(dueDate)}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
          <Picker
            selectedValue={status}
            onValueChange={(itemValue) => setStatus(itemValue )}
            style={styles.picker}
          >
            <Picker.Item label="New" value="new" />
            <Picker.Item label="In Progress" value="in progress" />
            <Picker.Item label="Completed" value="completed" />
          </Picker>
          <TextInput
            placeholder="Zugewiesen an"
            value={assignedTo}
            onChangeText={(text) => setAssignedTo( text )}
            style={styles.input}
          />
          <Picker
            selectedValue={roleRequired}
            onValueChange={(itemValue) => setRoleRequired( itemValue )}
            style={styles.picker}
          >
            <Picker.Item label="Rezeptionist" value="receptionist" />
            <Picker.Item label="Zimmermädchen" value="maid" />
          </Picker>
          {/* Hier könnten Sie eine Liste für Notizen implementieren */}
          <TouchableOpacity
            style={styles.createTaskButton}
            onPress={handleCreateTask}
          >
            <Text style={styles.buttonText}>Aufgabe erstellen</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={closeModal}
          >
            <Text style={styles.buttonText}>Abbrechen</Text>
          </TouchableOpacity>
          </KeyboardAwareScrollView>
        </View>
       
      </Modal>
     
    </View>
  );
};

export default TaskListScreen;

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'grey',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,

  },
  modalContent: {
    backgroundColor: '#2C2C2E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    alignItems: 'stretch',
    marginHorizontal: 20, // Fügt horizontalen Abstand hinzu
  },
  input: {
    backgroundColor: '#404040',
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
    color: '#FFFFFF',
    fontSize: 16,
    marginHorizontal: 10, // Fügt horizontalen Abstand hinzu
  },
  picker: {
    backgroundColor: '#404040',
    borderRadius: 5,
    marginBottom: 15,
    color: '#FFFFFF',
    marginHorizontal: 10, // Fügt horizontalen Abstand hinzu
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#404040',
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
    marginHorizontal: 10, // Fügt horizontalen Abstand hinzu
  },
  dateText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  createTaskButton: {
    backgroundColor: '#0A84FF',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginHorizontal: 10, // Fügt horizontalen Abstand hinzu
  },
  cancelButton: {
    backgroundColor: '#757575',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginHorizontal: 10, // Fügt horizontalen Abstand hinzu
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#03A9F4',
    borderRadius: 28,
    elevation: 8,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  taskDetails: {
    marginLeft: 10,
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  taskDate: {
    fontSize: 14,
    color: '#666666',
  },
});


