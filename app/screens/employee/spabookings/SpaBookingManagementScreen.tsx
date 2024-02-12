import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import 'moment/locale/de'; // Importieren der deutschen Lokalisierung
import {
  fetchAllSpaBookings,
  cancelSpaBooking,
  SpaBooking,
  updateSpaBooking
} from '../../../store/SpaBookingSlice';
import EditBookingForm from './components/EditBookingForm'; // Pfad ggf. anpassen
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 
import moment from 'moment'; // Stellen Sie sicher, dass Sie moment.js installiert haben

const SpaBookingManagementScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { bookings, status, error } = useSelector((state: RootState) => state.spaBooking);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<SpaBooking | null>(null);
  moment.locale('de'); // Setzen der Lokalisierung auf Deutsch

  useEffect(() => {
    dispatch(fetchAllSpaBookings());
  }, [dispatch]);

  // Filter bookings by date
  const now = moment();
  const pastBookings = bookings.filter(booking => moment(booking.date).isBefore(now, 'day'));
  const todayBookings = bookings.filter(booking => moment(booking.date).isSame(now, 'day'));
  const futureBookings = bookings.filter(booking => moment(booking.date).isAfter(now, 'day'));

  const handleCancelBooking = (bookingId: string) => {
    Alert.alert('Cancel Booking', 'Are you sure?', [
      { text: 'No' },
      { text: 'Yes', onPress: () => dispatch(cancelSpaBooking(bookingId)) },
    ]);
  };

  const handleEditBooking = (booking: SpaBooking) => {
    setCurrentBooking(booking);
    setIsEditModalVisible(true);
  };

  const handleSaveEdit = (editedBooking: SpaBooking) => {
    dispatch(updateSpaBooking(editedBooking));
    setIsEditModalVisible(false);
  };

  const handleCancelEdit = () => {
    setIsEditModalVisible(false);
  };

  const renderBookingItem = ({ item }: { item: SpaBooking }) => (
    <TouchableOpacity style={styles.bookingItem} onPress={() => handleEditBooking(item)}>
      <View>
        <Text style={styles.bookingDetailTitle}>{item.title}</Text>
        <Text>Date: {moment(item.date).locale('de').format('LL')}</Text>
        {/**Zei wird nicht richtig geliefert */}
        <Text>Time: {moment(item.time, 'HH:mm').format('HH:mm')} Uhr</Text>
        <Text>Duration: {item.duration} mins</Text>
        <Text>Price: ${item.price}</Text>
        <Text>Name: {item.name}</Text>
        <Text>Email: {item.email}</Text>
        <Text>Room: {item.userRoomNumber}</Text>
      </View>
      <View style={styles.icons}>
        <Icon name="pencil-outline" size={24} color="#5D5DFF" onPress={() => handleEditBooking(item)} />
      </View>
      <View style={styles.icons}>
        <Icon name="delete-outline" size={24} color="#FF5252" onPress={() => handleCancelBooking(item.id!)} />
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        onRequestClose={handleCancelEdit}>
        <EditBookingForm
          booking={currentBooking!}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      </Modal>
      {status === 'loading' ? <Text>Loading...</Text> : error ? <Text>Error: {error}</Text> : null}
      <Text style={styles.sectionTitle}>Heutige Buchungen</Text>
      <FlatList data={todayBookings} renderItem={renderBookingItem} keyExtractor={(item) => item.id!} />
      <Text style={styles.sectionTitle}>Kommende Buchungen</Text>
      <FlatList data={futureBookings} renderItem={renderBookingItem} keyExtractor={(item) => item.id!} />
      <Text style={styles.sectionTitle}>Vergangene Buchungen</Text>
      <FlatList data={pastBookings} renderItem={renderBookingItem} keyExtractor={(item) => item.id!} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f4f4f8', // Leichter Hintergrund für den gesamten Screen
      },
      bookingItem: {
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 12,
        marginVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 4,
      },
      bookingDetail: {
        flex: 1,
        marginLeft: 12,
      },
      bookingDetailTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 4,
      },
      detailText: {
        fontSize: 14,
        color: '#666666',
        marginTop: 2,
      },
      icons: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      iconButton: {
        marginLeft: 12,
      },
      sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 24,
        marginBottom: 16,
        color: '#333333',
      },
      // Button-Styling, falls benötigt
      buttonText: {
        color: '#5D5DFF',
        fontWeight: 'bold',
      },
      deleteButton: {
        backgroundColor: '#FF5252', // Rotes Design für den Löschen-Button
        borderRadius: 8,
        padding: 6,
        marginLeft: 10,
      },
      editButton: {
        backgroundColor: '#5D5DFF', // Blaues Design für den Bearbeiten-Button
        borderRadius: 8,
        padding: 6,
      },
      // Modal-Design-Anpassungen
      modalContent: {
        flex: 1,
        borderRadius: 20,
        padding: 20,
        backgroundColor: '#ffffff',
        marginHorizontal: 10,
        marginTop: 50, // Abstand von oben, um das Modal zentrierter erscheinen zu lassen
        marginBottom: 50, // Abstand von unten
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
  bookingTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  buttonGroup: {
    flexDirection: 'row',
  },
  button: {
    marginLeft: 10,
    padding: 6,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'red',
  },
});

export default SpaBookingManagementScreen;
