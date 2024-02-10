import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {  cancelSpaBooking, selectUserBookings } from '../../../../../store/SpaBookingSlice';
import { RootState } from '../../../../../store/store';
import Icon from 'react-native-vector-icons/Ionicons';

const SpaBookingsList: React.FC = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.user.id);
  const allBookings = useSelector((state: RootState) => selectUserBookings(state, userId)); 

  const handleCancelBooking = (id: string) => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No' },
        { text: 'Yes', onPress: () => dispatch(cancelSpaBooking(id)) },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={allBookings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.bookingItem}>
            <Text style={styles.title}>{item.title} - {item.date}</Text>
            <Text style={styles.details}>Name: {item.name}</Text>
            <Text style={styles.details}>Email: {item.email}</Text>
            <Text style={styles.details}>Room: {item.userRoomNumber}</Text>
            <Text style={styles.details}>Price: {item.price}</Text>
            <Text style={styles.details}>Duration: {item.duration}</Text>
            <TouchableOpacity style={styles.cancelButton} onPress={() => handleCancelBooking(item.id)}>
              <Icon name="cancel" size={24} color="#fff" />
              <Text style={styles.cancelButtonText}>Cancel Booking</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
      },
      bookingItem: {
        backgroundColor: '#fff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
      },
      title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
      },
      details: {
        fontSize: 16,
        marginBottom: 5,
        color: '#555',
      },
      cancelButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF4136',
        padding: 10,
        borderRadius: 20,
        justifyContent: 'center',
        marginTop: 10,
      },
      cancelButtonText: {
        color: '#fff',
        marginLeft: 8,
        fontWeight: '600',
        fontSize: 16,
      },
});

export default SpaBookingsList;
