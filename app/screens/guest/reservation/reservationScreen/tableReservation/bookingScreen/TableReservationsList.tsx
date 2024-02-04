import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReservations, deleteReservation } from '../../../../../../store/tableReservationSlice'; // Pfad anpassen
import { RootState, AppDispatch } from '../../../../../../store/store'; // Pfad anpassen


const TableReservationsList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { reservations, status } = useSelector((state: RootState) => state.tableReservation);
console.log(reservations)
  useEffect(() => {
    dispatch(fetchReservations());
  }, [dispatch]);

  const handleCancelReservation = async (reservationId: string) => {
    // Stornierung der Reservierung
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
                    // Handle the case where item.id is undefined
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
    backgroundColor: '#000', // Schwarzer Hintergrund
  },
  reservationItem: {
    backgroundColor: '#333', // Dunkelgrauer Hintergrund für jedes Item
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 5,
  },
  reservationText: {
    color: 'white',
    marginBottom: 5,
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  // Weitere Styles...
});

export default TableReservationsList;
