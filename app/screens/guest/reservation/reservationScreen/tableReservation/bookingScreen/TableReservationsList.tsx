import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGuestReservations, deleteReservation } from '../../../../../../store/tableReservationSlice';
import { RootState, AppDispatch } from '../../../../../../store/store';

const TableReservationsList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { reservations, status } = useSelector((state: RootState) => state.tableReservation);
  const userId = useSelector((state: RootState) => state.user.id);

  useEffect(() => {
    if (userId) {
      dispatch(fetchGuestReservations(userId));
    }
  }, [dispatch, userId]);

  const handleCancelReservation = async (reservationId: string) => {
    const resultAction = await dispatch(deleteReservation(reservationId));
    if (deleteReservation.fulfilled.match(resultAction)) {
      Alert.alert('Stornierung', 'Die Reservierung wurde erfolgreich storniert.');
    } else {
      Alert.alert('Fehler', 'Die Stornierung ist fehlgeschlagen.');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={reservations}
        keyExtractor={(item, index) => item.id ? item.id : index.toString()}
        renderItem={({ item }) => (
          <View style={styles.reservationItem}>
            <Text style={styles.reservationText}>Name: {item.name}</Text>
            <Text style={styles.reservationText}>Zimmernummer: {item.roomNumber}</Text>
            <Text style={styles.reservationText}>Datum: {item.date}</Text>
            <Text style={styles.reservationText}>Zeit: {item.time}</Text>
            <Text style={styles.reservationText}>Personen: {item.peopleCount}</Text>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                if (item.id) {
                  handleCancelReservation(item.id);
                } else {
                  console.error("Fehler: Die Reservierungs-ID ist undefiniert.");
                  Alert.alert("Fehler", "Die Reservierungs-ID ist undefiniert. Die Stornierung kann nicht durchgeführt werden.");
                }
              }}
            >
              <Text style={styles.cancelButtonText}>Stornieren</Text>
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
    backgroundColor: '#F7FAFC',
    padding: 16,
  },
  reservationItem: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  reservationText: {
    color: '#2D3748',
    marginBottom: 5,
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#E53E3E',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default TableReservationsList;
