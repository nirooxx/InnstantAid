import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, Modal, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  fetchReservations,
  deleteReservation,
  TableReservation,
  updateReservation
} from '../../../store/tableReservationSlice';
import { RootState, AppDispatch } from '../../../store/store';
import EditReservationForm from './components/EditReservationForm';

const ReservationManagementScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { reservations, status, error } = useSelector((state: RootState) => state.tableReservation);
  const insets = useSafeAreaInsets();
   // Zustände für die Bearbeitung
   const [isEditModalVisible, setIsEditModalVisible] = useState(false);
   const [currentReservation, setCurrentReservation] = useState<TableReservation | null>(null);
 
   const handleEditPress = (reservation: TableReservation) => {
     setCurrentReservation(reservation);
     setIsEditModalVisible(true);
   };
 
   const handleSaveEdit = (reservation: TableReservation) => {
     // Hier würden Sie Ihren Redux-Thunk aufrufen, um die Änderungen zu speichern
     dispatch(updateReservation(reservation));
     setIsEditModalVisible(false);
   };
 
   const handleCancelEdit = () => {
     // Schließen Sie das Bearbeitungsformular, ohne Änderungen vorzunehmen
     setIsEditModalVisible(false);
   };

 

  useEffect(() => {
    dispatch(fetchReservations());
  }, [dispatch]);

  // Filter reservations into past, today, and upcoming
  const now = moment();
  const sortedReservations = [...reservations].sort((a, b) => moment(a.date).diff(moment(b.date)));
  const pastReservations = sortedReservations.filter(r => moment(r.date).isBefore(now, 'day'));
  const todayReservations = sortedReservations.filter(r => moment(r.date).isSame(now, 'day'));
  const upcomingReservations = sortedReservations.filter(r => moment(r.date).isAfter(now, 'day'));

  const handleDeleteReservation = (id: string) => {
    Alert.alert('Reservation Delete', 'Are you sure you want to delete this reservation?', [
      { text: 'Cancel' },
      { text: 'Delete', onPress: () => dispatch(deleteReservation(id)) },
    ]);
  };



  const renderReservationItem = ({ item }: { item: any }) => (
    <View style={styles.reservationItem}>
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.detailText}>Date: {item.date}</Text>
      <Text style={styles.detailText}>Time: {item.time}</Text>
      <Text style={styles.detailText}>People: {item.peopleCount}</Text>
      <Button icon="delete" mode="contained" onPress={() => handleDeleteReservation(item.id)} style={styles.deleteButton}>
        Delete
      </Button>
      <Button icon="pencil" mode="contained" onPress={() => handleEditPress(item)} style={styles.editButton}>
      Edit
    </Button>
    </View>
  );

  const renderEmptySection = (title: string) => (
    <View style={styles.emptySection}>
      <Text style={styles.emptyText}>Keine {title} Reservierungen.</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}
    contentContainerStyle={{ paddingBottom: insets.bottom +70}}>
      <View style={styles.introSection}>
        <Text style={styles.introTitle}>Reservierungsverwaltung</Text>
        <Text style={styles.introText}>Verwalten Sie alle Reservierungen für das hoteleigene Restaurant. Unten finden Sie eine Aufteilung nach heutigen, zukünftigen und vergangenen Reservierungen.</Text>
      </View>
   {/* Bearbeitungsmodal */}
   <Modal
        visible={isEditModalVisible}
        animationType="slide"
        onRequestClose={handleCancelEdit}
      >
        <EditReservationForm
          reservation={currentReservation!}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      </Modal>
      {status === 'loading' ? (
        <Text style={styles.loadingText}>Lädt...</Text>
      ) : error ? (
        <Text style={styles.errorText}>Fehler: {error}</Text>
      ) : (
        <>
          <Text style={styles.sectionTitle}>Heute</Text>
          {todayReservations.length > 0 ? (
            <FlatList data={todayReservations} renderItem={renderReservationItem} keyExtractor={(item:any) => item.id} />
          ) : (
            renderEmptySection("heutigen")
          )}

          <Text style={styles.sectionTitle}>Bevorstehend</Text>
          {upcomingReservations.length > 0 ? (
            <FlatList data={upcomingReservations} renderItem={renderReservationItem} keyExtractor={(item:any) => item.id} />
          ) : (
            renderEmptySection("bevorstehenden")
          )}

          <Text style={styles.sectionTitle}>Vergangen</Text>
          {pastReservations.length > 0 ? (
            <FlatList data={pastReservations} renderItem={renderReservationItem} keyExtractor={(item:any) => item.id} />
          ) : (
            renderEmptySection("vergangenen")
          )}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  introSection: {
    padding: 20,
    backgroundColor: '#6200ee', // Ein dunkleres Lila als Hintergrund
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  introTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  introText: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    marginTop: 20,
    marginBottom: 10,
    color: '#6200ee', // Wiederholung der Intro-Farbe für Konsistenz
  },
  reservationItem: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 10,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
  },
  editButton:{
    marginTop: 10,
    backgroundColor: 'blue',
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: '#db4437', // Rot für Löschaktionen
  },
  emptySection: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#999999',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#db4437',
    marginTop: 20,
  },
});

export default ReservationManagementScreen;
