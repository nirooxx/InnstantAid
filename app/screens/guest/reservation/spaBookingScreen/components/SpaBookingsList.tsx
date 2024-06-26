import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { cancelSpaBooking, fetchUserSpaBookings } from '../../../../../store/SpaBookingSlice';
import { RootState } from '../../../../../store/store';
import Icon from 'react-native-vector-icons/Ionicons';
import { AppDispatch } from '../../../../../store/store';

interface SpaBooking {
  id: string;
  title: string;
  date: string;
  name: string;
  // Fügen Sie weitere Eigenschaften hinzu, die Sie benötigen
}

const SpaBookingsList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.user.id);
  const allBookings = useSelector((state: RootState) => state.spaBooking.bookings);

  useEffect(() => {
    dispatch(fetchUserSpaBookings(userId));
  }, [dispatch, userId]);

  const handleCancelBooking = (id: string) => {
    Alert.alert('Cancel Booking', 'Are you sure you want to cancel this booking?', [
      { text: 'No' },
      { text: 'Yes', onPress: () => dispatch(cancelSpaBooking(id)) },
    ], { cancelable: false });
  };

  const renderBookingItem = ({ item }: { item: any }) => (
    <View style={styles.bookingItem}>
      <Text style={styles.title}>{item.title} - {item.date}</Text>
      <View style={styles.detailsContainer}>
        <Icon name="person" size={16} color="#5A67D8" />
        <Text style={styles.details}>Name: {item.name}</Text>
      </View>
      <TouchableOpacity style={styles.cancelButton} onPress={() => handleCancelBooking(item.id)}>
        <Icon name="close-circle" size={24} color="#fff" />
        <Text style={styles.cancelButtonText}>Cancel Booking</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {allBookings.length > 0 ? (
        <FlatList
          data={allBookings}
          keyExtractor={(item, index) => item.id ? item.id : index.toString()}
          renderItem={renderBookingItem}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No bookings found</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
    paddingTop: 20,
  },
  bookingItem: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 8,
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  details: {
    fontSize: 16,
    color: '#4A5568',
    marginLeft: 8,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF4136',
    padding: 10,
    borderRadius: 20,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#A0AEC0',
  },
});

export default SpaBookingsList;
