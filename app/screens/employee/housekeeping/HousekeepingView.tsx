import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Alert, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { deleteRoomCleanRequest, deleteMaintenanceRequest, fetchRoomCleanRequests, fetchMaintenanceRequests } from '../../../store/houseKeepingSlice';
import { AppDispatch, RootState } from '../../../store/store';

// Typdefinitionen (falls noch nicht definiert)
interface RoomCleanRequest {

  roomNumber: string;
  userId: string;
  description?: string;
  frequency: string; // Anpassung an tatsächliche Typen erforderlich
  date?: string;
  time?: string;
  imageUri?: string;
  notes: string;
}

interface MaintenanceRequest {

  roomNumber: string;
  userId: string;
  description: string;
  date?: string;
  imageUri?: string;
  notes: string;
}

const HousekeepingView: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const roomCleanRequests = useSelector((state: RootState) => state.houseKeeping.roomCleanRequests);
  const maintenanceRequests = useSelector((state: RootState) => state.houseKeeping.maintenanceRequests);

  useEffect(() => {
    dispatch(fetchRoomCleanRequests());
    dispatch(fetchMaintenanceRequests());
  }, [dispatch]);

  // Funktion zum Anzeigen des Lösch-Bestätigungsdialogs
  const confirmDelete = (type: 'clean' | 'maintenance', id: string) => {
    Alert.alert("Delete Request", "Are you sure you want to delete this request?", [
      { text: "Cancel", style: "cancel" },
      { text: "OK", onPress: () => type === 'clean' ? dispatch(deleteRoomCleanRequest(id)) : dispatch(deleteMaintenanceRequest(id)) }
    ]);
  };

  // Funktion zum Sortieren der Anfragen nach Datum
  const sortRequestsByDate = (requests: (any)[]) => {
    return requests.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateA - dateB;
    });
  };

  // Vorbereitete sortierte Anfragen
  const sortedRoomCleanRequests = sortRequestsByDate(roomCleanRequests);
  const sortedMaintenanceRequests = sortRequestsByDate(maintenanceRequests);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Room Clean Requests</Text>
      {sortedRoomCleanRequests.map((request, index) => (
        <View key={index} style={styles.requestItem}>
          <Text>Room Number: {request.roomNumber}</Text>
          <Text>Date: {request.date || 'N/A'}</Text>
          <Text>Time: {request.time || 'N/A'}</Text>
          <Text>Notes: {request.notes}</Text>
          <Button title="Delete" onPress={() => confirmDelete('clean', request.id)} />
        </View>
      ))}

      <Text style={styles.header}>Maintenance Requests</Text>
      {sortedMaintenanceRequests.map((request, index) => (
        <View key={index} style={styles.requestItem}>
          <Text>Room Number: {request.roomNumber}</Text>
          <Text>Description: {request.description}</Text>
          <Text>Date: {request.date || 'N/A'}</Text>
          {request.imageUri && <Image source={{ uri: request.imageUri }} style={styles.image} />}
          <Text>Notes: {request.notes}</Text>
          <Button title="Delete" onPress={() => confirmDelete('maintenance', request.id)} />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
    },
    header: {
      fontSize: 22,
      fontWeight: 'bold',
      marginTop: 20,
      marginBottom: 10,
    },
    requestItem: {
      marginTop: 10,
      padding: 15,
      backgroundColor: '#f9f9f9',
      borderRadius: 8,
      elevation: 2, // Adds shadow for Android
      shadowColor: '#000', // Adds shadow for iOS
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 1.5,
    },
    requestDetail: {
      fontSize: 16,
      marginBottom: 5,
    },
    image: {
      width: '100%',
      height: 200,
      borderRadius: 5,
      marginTop: 10,
      marginBottom: 10,
    },
  });

export default HousekeepingView;
