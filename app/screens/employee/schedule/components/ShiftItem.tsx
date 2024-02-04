import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Shift } from '../../types';
import Icon from 'react-native-vector-icons/Ionicons';

interface FirestoreTimestamp {
    seconds: number;
    nanoseconds: number;
  }
  interface ShiftItemProps {
    shift: Shift;
  }
// Komponente für ein einzelnes Shift-Element
const ShiftItem: React.FC<ShiftItemProps> = ({ shift }) => {
    // Berechnung des Fortschritts basierend auf der aktuellen Zeit
   // Hilfsfunktion, um zu prüfen, ob ein Objekt ein FirestoreTimestamp ist
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
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
  };
  console.log(shift.name)
    return (
        <View style={styles.shiftItem}>
     
      <View style={styles.shiftDetails}>
        <Text style={styles.shiftTitle}>{shift.name}</Text>
        <Text style={styles.shiftDate}>
          {formatDateString(toDate(shift.startTime))} - {formatDateString(toDate(shift.endTime))}
        </Text>
        <Text style={styles.shiftEmployee}>{shift.employeeName}</Text>
      </View>
      <Icon name="ellipsis-vertical" size={20} color="#FFFFFF" style={styles.iconRight} />
    </View>
    );
  };

export default ShiftItem

const styles = StyleSheet.create({
    shiftItem: {
        backgroundColor: '#5D5DFF', // Dunkelblaue Hintergrundfarbe
        borderRadius: 20, // Abgerundete Ecken
        padding: 20, // Innenabstand
        marginHorizontal: 10, // Horizontaler Abstand zu benachbarten Elementen
        marginVertical: 10, // Vertikaler Abstand zu benachbarten Elementen
        minWidth: 250, // Minimale Breite eines Shift-Elements
        maxHeight: 150, // Maximale Höhe eines Shift-Elements
        alignItems: 'center', // Zentriert die Inhalte vertikal
        justifyContent: 'center', // Zentriert die Inhalte horizontal
        shadowColor: '#000', // Schattenfarbe
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3, // Transparenz des Schattens
        shadowRadius: 4.65, // Radius des Schattens
        elevation: 8, // Elevation für Android
        flexDirection: 'row', // Horizontale Ausrichtung der Inhalte
    },
    shiftDetails: {
      flex: 1,
      marginLeft: 10,
      justifyContent: 'space-between', // Verteilt den Raum gleichmäßig vertikal
      alignItems: 'flex-start', // Ausrichtung der Elemente am Anfang (links)
      alignSelf: 'stretch', // Streckt die Details über die volle Breite der Karte
    },
    shiftTitle: {
      color: '#FFFFFF', // Weiße Schriftfarbe
      fontSize: 22, // Schriftgröße für den Titel
      fontWeight: 'bold', // Fette Schrift
    },
    shiftDate: {
      color: '#FFFFFF', // Weiße Schriftfarbe
      fontSize: 16, // Schriftgröße für das Datum
      opacity: 0.7, // Leicht transparent für einen dezenten Look
      marginTop: 5, // Etwas Abstand zum Titel
    },
    shiftEmployee: {
      color: '#FFFFFF', // Weiße Schriftfarbe
      fontSize: 16, // Schriftgröße für den Mitarbeiter
      fontStyle: 'italic', // Kursive Schrift für den Mitarbeiternamen
      marginTop: 5, // Etwas Abstand zum Datum
    },
    icon: {
        position: 'absolute', // Absolute Positionierung
         // Abstand vom linken Rand
      },
      iconRight: {
        position: 'absolute', // Absolute Positionierung
        right: 16, // Abstand vom rechten Rand
      },
    // Fügen Sie weitere Stile hinzu, wie sie benötigt werden
  });
  
  
