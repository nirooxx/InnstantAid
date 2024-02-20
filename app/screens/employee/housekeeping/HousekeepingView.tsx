import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRoomCleanRequests, fetchMaintenanceRequests } from '../../../store/houseKeepingSlice'; // Passe den Importpfad an deinen Store an
import { AppDispatch } from '../../../store/store';
import { RootState } from '../../../store/store';

const HousekeepingView: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const roomCleanRequests = useSelector((state: RootState) => state.houseKeeping.roomCleanRequests);
  const maintenanceRequests = useSelector((state: RootState) => state.houseKeeping.maintenanceRequests);

  useEffect(() => {
    dispatch(fetchRoomCleanRequests());
    dispatch(fetchMaintenanceRequests());
  }, [dispatch]);

  return (
    <ScrollView style={styles.container}>
    <Text style={styles.header}>Room Clean Requests</Text>
    {roomCleanRequests.map((request, index) => (
      <View key={`clean-${index}`} style={styles.requestItem}>
        <Text style={styles.requestDetail}>Room Number: {request.roomNumber}</Text>
        <Text style={styles.requestDetail}>Frequency: {request.frequency}</Text>
        {request.date && <Text style={styles.requestDetail}>Date: {request.date}</Text>}
        {request.time && <Text style={styles.requestDetail}>Time: {request.time}</Text>}
        <Text style={styles.requestDetail}>Notes: {request.notes}</Text>
      </View>
    ))}

    <Text style={styles.header}>Maintenance Requests</Text>
    {maintenanceRequests.map((request, index) => (
      <View key={`maintenance-${index}`} style={styles.requestItem}>
        <Text style={styles.requestDetail}>Room Number: {request.roomNumber}</Text>
        <Text style={styles.requestDetail}>Description: {request.description}</Text>
        {request.imageUri && <Image source={{ uri: request.imageUri }} style={styles.image} />}
        <Text style={styles.requestDetail}>Notes: {request.notes}</Text>
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
