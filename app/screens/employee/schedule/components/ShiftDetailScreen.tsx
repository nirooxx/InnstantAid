import React, { useState, useEffect, useMemo } from 'react';
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
import dayjs from 'dayjs';

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
  const shifts = useSelector((state: RootState) => state.schedule.shifts);
  const allTasks = useSelector((state: RootState) => state.task.tasks);

  const toDateFormat = (timestamp:any) => {
    if (!timestamp || typeof timestamp.seconds !== 'number') {
      return new Date();
    }
    // Firestore Timestamp in Millisekunden umrechnen
    return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
  };

  const shift = useMemo(() => shifts.find(s => s.id === shiftId), [shifts, shiftId]);
  const tasks = useMemo(() => {
    return allTasks.filter(task => {
        // Sicherstellen, dass die Daten gültig sind, bevor sie weiterverarbeitet werden
        const taskDueDate = dayjs(task.dueDate);
        const shiftStartDate = shift ? dayjs(toDateFormat(shift?.startTime)) : null;
        // Prüfen Sie, ob das Datum gültig ist, bevor Sie fortfahren
        if (!taskDueDate.isValid() || (shiftStartDate && !shiftStartDate.isValid())) {
            console.error('Ungültiges Datum gefunden');
            return false;
        }

        // Vergleich der formatierten Daten
        return taskDueDate.format('YYYY-MM-DD') === shiftStartDate?.format('YYYY-MM-DD') && task.roleRequired === role;
    });
}, [allTasks, shift, role]);
 
  const toDate = (timestamp: Date | FirestoreTimestamp): Date => {
    try {
      if (typeof timestamp === 'object' && 'seconds' in timestamp) {
        return new Date(timestamp.seconds * 1000);
      } else if (timestamp instanceof Date) {
        return timestamp;
      } else {
        throw new Error('Invalid date object');
      }
    } catch (error) {
      console.error('Date conversion error:', error);
      return new Date(); // Rückgabe des aktuellen Datums als Fallback
    }
  };

  
  useEffect(() => {
    dispatch(fetchShifts());
    dispatch(fetchTasks());
  }, [dispatch]);

  useEffect(() => {
    setLoading(!shift || !allTasks.length);
  }, [shift, allTasks]);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  const formattedStartDate = shift?.startTime ? toDate(shift?.startTime).toLocaleDateString() : 'N/A';
const formattedStartTime = shift?.startTime ? toDate(shift?.startTime).toLocaleTimeString() : 'N/A';
const formattedEndDate = shift?.endTime ? toDate(shift?.endTime).toLocaleTimeString() : 'N/A';

  return (
<ScrollView style={styles.container}>
      <View style={styles.shiftDetailsContainer}>
        <Text style={styles.shiftTitle}>{shift?.name}</Text>
        <Text style={styles.shiftDetail}>
          {`Datum: ${formattedStartDate}`}
        </Text>
        <Text style={styles.shiftDetail}>
          {`Beginn: ${formattedStartTime}`}
        </Text>
        <Text style={styles.shiftDetail}>
          {`Ende: ${formattedEndDate}`}
        </Text>
        <Text style={styles.shiftDetail}>{`Mitarbeiter: ${shift?.employeeName}`}</Text>
      </View>
      <View style={styles.tasksContainer}>
        <Text style={styles.subtitle}>Zugehörige Aufgaben:</Text>
        {tasks.length > 0 ? tasks.map(task => (
          <View key={task.id} style={styles.card}>
            <Text style={styles.title}>{task.title}</Text>
            <Text style={styles.description}>{task.description}</Text>
            <Text style={styles.dueDate}>{task.dueDate}</Text>
          </View>
        )) : <Text style={styles.noTasksMessage}>Keine Aufgaben an diesem Tag.</Text>}
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
