import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store/store';
import { Task } from '../../tasks/models/Task';
import { AppDispatch } from '../../../../store/store';
import { fetchShifts } from '../../../../store/scheduleSlice';
import { fetchTasks } from '../../../../store/taskSlice';
import { Shift, FirestoreTimestamp } from '../../types';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";

interface RouteParams {
    shiftId: string;
    role: string;
  }

  type ShiftDetailScreenRouteProp = RouteProp<{ params: { shiftId: string; role: string; } }, 'params'>;

const ShiftDetailScreen: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
  const route = useRoute<ShiftDetailScreenRouteProp>();
  const { shiftId, role } = route.params as RouteParams;
  const [loading, setLoading] = useState(true);
  const [shift, setShift] = useState<Shift | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const navigation = useNavigation();
  const shifts = useSelector((state: RootState) => state.schedule.shifts);
  const allTasks = useSelector((state: RootState) => state.task.tasks);

  const isFirestoreTimestamp = (object: any): object is FirestoreTimestamp => {
    return 'seconds' in object && 'nanoseconds' in object;
  };
  
  // Hilfsfunktion zur Umwandlung von Firestore Timestamps in JavaScript Date-Objekte
  const toDate = (timestamp: Date | FirestoreTimestamp): Date => {
    if (isFirestoreTimestamp(timestamp)) {
      // Firestore Timestamp in Date umwandeln
      return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
    } else {
      // Es ist bereits ein Date-Objekt
      return timestamp;
    }
  };
    
  const formatDateString = (date: Date): string => {
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
  };

  const formatTime = (date: Date): string => {
    // Führende Nullen für Stunden und Minuten, falls nötig
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };
  

  useEffect(() => {
    // Lade Schichten und Aufgaben
    dispatch(fetchShifts());
    dispatch(fetchTasks());
  }, [dispatch]);

  useEffect(() => {
    // Schicht mit der gegebenen ID suchen
    const foundShift = shifts.find(s => s.id === shiftId);
    if (foundShift) {
      setShift(foundShift);
    }
  }, [shifts, shiftId]);

  useEffect(() => {
    // Aufgaben filtern
    console.log(allTasks)
    const filteredTasks = allTasks.filter(task => {
      // Umwandlung des dueDate von Task in ein Date-Objekt
      const taskDueDate = new Date(task.dueDate);
      // Formatierung des taskDueDate und shift.startTime in das gleiche Format
      const formattedTaskDate = formatDateString(taskDueDate);
      const shiftStartDate = shift ? formatDateString(toDate(shift.startTime)) : null;
      
      // Vergleich der formatierten Daten und der Rollen
      return formattedTaskDate === shiftStartDate && task.roleRequired === role;
    });
    setTasks(filteredTasks);
    setLoading(false);
  }, [allTasks, shift, role]);

  if (loading || !shift) {
    return <ActivityIndicator size="large" />;
  }


  return (
    <ScrollView style={styles.container}>
         <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>
       <View style={styles.shiftDetailsContainer}>
      <Text style={styles.shiftTitle}>{shift.name}</Text>
      <Text style={styles.shiftDetail}>
        {`Datum: ${formatDateString(toDate(shift.startTime))}`}
      </Text>
      <Text style={styles.shiftDetail}>
        {`Beginn: ${formatTime(toDate(shift.startTime))}`}
      </Text>
      <Text style={styles.shiftDetail}>
        {`Ende: ${formatTime(toDate(shift.endTime))}`}
      </Text>
      <Text style={styles.shiftDetail}>{`Mitarbeiter: ${shift.employeeName}`}</Text>
    </View>
      <View style={styles.tasksContainer}>
        <Text style={styles.subtitle}>Zugehörige Aufgaben:</Text>
        {tasks.map(task => (
          <View style={styles.card}>
          <View style={styles.priorityLabel}>
            <Text style={styles.priorityText}>{task.priority}</Text>
          </View>
          <View style={styles.statusLabel}>
            <Icon name="checkmark-circle" size={14} color="#FFFFFF" />
            <Text style={styles.statusText}>{task.status}</Text>
          </View>
          <Text style={styles.title}>{task.title}</Text>
          <Text style={styles.description}>{task.description}</Text>
          <Text style={styles.dueDate}>{formatDateString(new Date(task.dueDate))}</Text>
          <View style={styles.iconsRow}>
            <Icon name="chatbox-ellipses-outline" size={20} color="#000" />
            <Text>2</Text>
            <Icon name="attach-outline" size={20} color="#000" />
            <Text>{task.assignedTo}</Text>
            {/*task.users.map((user, index) => (
              <Image key={index} source={{ uri: user.avatar }} style={styles.avatar} />
            ))*/}
          </View>
        </View>
        ))}
      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  backButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5D5DFF', // Hintergrundfarbe des Zurück-Buttons
    borderRadius: 15,
  },
  shiftDetailsContainer: {
    margin: 20,
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#5D5DFF', // Farbe entsprechend dem Screenshot
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  shiftTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  shiftDetail: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    // Weitere Styling-Optionen
  },
  tasksContainer: {
    // Weitere Styling-Optionen
  },
  taskItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
    // Weitere Styling-Optionen
  },
  taskTitle: {
    fontSize: 16,
    // Weitere Styling-Optionen
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  description: {
    fontSize: 14, // smaller than title
    color: '#333', // dark grey for better readability
    marginTop: 4, // small gap between title and description
    marginBottom: 10, // space before the next section starts
    // other styling properties
  },
  priorityLabel: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'red', // Change color based on priority level
    borderRadius: 10,
    padding: 5,
    transform: [{ rotate: '0deg' }],
  },
  priorityText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  statusLabel: {
    position: 'absolute',
    top: 10,
    left: 70, // Adjust based on the size of the priority label
    backgroundColor: 'green',
    borderRadius: 10,
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
    transform: [{ rotate: '0deg' }],
  },
  statusText: {
    color: '#FFFFFF',
    marginLeft: 5,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 30, // Adjust based on the size of the labels
  },
  dueDate: {
    fontSize: 14,
    color: '#777',
    marginBottom: 10,
  },
  iconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginLeft: 5,
  },
});

export default ShiftDetailScreen;
