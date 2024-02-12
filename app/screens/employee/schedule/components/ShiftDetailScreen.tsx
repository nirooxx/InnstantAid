import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store/store';
import { Task } from '../../tasks/models/Task';
import { AppDispatch } from '../../../../store/store';
import { fetchShifts } from '../../../../store/scheduleSlice';
import { fetchTasks } from '../../../../store/taskSlice';
import { Shift, FirestoreTimestamp } from '../../types';
import Icon from 'react-native-vector-icons/Ionicons';


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
    console.log(date)
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
  
    const filteredTasks = allTasks.filter((task) => {
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
     {/* Aufgaben */}
      <View style={styles.tasksContainer}>
        <Text style={styles.subtitle}>Zugehörige Aufgaben:</Text>
        {
          tasks.length > 0 ? (
        tasks.map(task => (
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
        ))) : (
          <Text style={styles.noTasksMessage}>Keine Aufgaben an diesem Tag.</Text>
        )}
      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7', // Sanfter Hintergrund, der die Lesbarkeit verbessert
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  priorityLabel: {
    position: 'absolute',
    top: -10, // leicht außerhalb der Karte, um eine "Tag"-Ästhetik zu schaffen
    left: 20,
    backgroundColor: 'red', // Farbe entsprechend der Priorität
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    zIndex: 1, // Stellen Sie sicher, dass das Label über anderen Elementen liegt
  },
  priorityText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  statusLabel: {
    position: 'absolute',
    top: -10,
    left: 110, // genug Platz, damit es nicht das priorityLabel überlappt
    backgroundColor: '#00C851', // Farbe entsprechend dem Status
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    zIndex: 1,
  },
  statusText: {
    color: '#FFFFFF',
    marginLeft: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 30, // genug Platz für das priorityLabel und statusLabel
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    marginBottom: 10,
  },
  dueDate: {
    fontSize: 14,
    color: '#777',
    marginBottom: 10,
  },
  iconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10, // Platz am Ende der Karte
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginLeft: 5,
  },
  noTasksMessage: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
  backButton: {
    margin: 16, // Mehr Platz um den Button
    width: 40, // Größere Touch-Zone
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5D5DFF', // Einheitliche Farbe für die App
    borderRadius: 20, // Rundere Ecken
    elevation: 5, // Hervorhebung auf Android
    shadowOpacity: 0.1, // Leichter Schatten
  },
  shiftDetailsContainer: {
    backgroundColor: '#ffffff', // Helle Karte für Details
    borderRadius: 12, // Moderne, subtile Rundung
    padding: 20, // Ausreichend Platz im Inneren
    margin: 16, // Gleichmäßiger Rand um die Karte
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, // Dezentere Schatten
    shadowRadius: 6,
    elevation: 3, // Weniger Elevation für einen flacheren Look
  },
  shiftTitle: {
    fontSize: 22, // Etwas kleinere Schrift für den Titel
    fontWeight: '600', // Weniger intensiv als 'bold'
    color: '#333', // Dunkelgrau für den Text
    marginBottom: 8, // Weniger Abstand
  },
  shiftDetail: {
    fontSize: 16, // Standard Schriftgröße
    color: '#555', // Dunkelgrau, aber leichter als der Titel
    marginBottom: 4, // Reduzierter Abstand
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333', // Einheitliche Farbe für Überschriften
    padding: 16, // Platz um den Untertitel
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
 
  

});

export default ShiftDetailScreen;
