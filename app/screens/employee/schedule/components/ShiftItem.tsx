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
    backgroundColor: '#5D5DFF', // Ein hellerer Farbton könnte ansprechender sein
    borderRadius: 12, // Subtile Rundungen wirken moderner
    padding: 16, // Passende Polsterung für Inhalte
    marginHorizontal: 12, // Gleichmäßiger horizontaler Abstand
    marginVertical: 8, // Gleichmäßiger vertikaler Abstand
    minWidth: 250, // Minimale Breite eines Shift-Elements
    flexDirection: 'row', // Horizontale Ausrichtung der Inhalte
    alignItems: 'center', // Zentriert die Inhalte vertikal
    justifyContent: 'space-between', // Platz zwischen den Elementen
    shadowColor: '#000', // Schattenfarbe
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, // Weicher Schatten
    shadowRadius: 8, // Größerer Schattenradius
    elevation: 6, // Elevation für Android
  },
  shiftDetails: {
    flex: 1,
  },
  shiftTitle: {
    color: '#FFFFFF', // Weiße Schriftfarbe
    fontSize: 18, // Angepasste Schriftgröße
    fontWeight: '600', // Halbfett statt fett für eine feinere Darstellung
  },
  shiftDate: {
    color: '#E6E6FF', // Ein helleres Weiß für das Datum könnte besser lesbar sein
    fontSize: 14, // Angepasste Schriftgröße
    marginTop: 4, // Reduzierter Abstand zum Titel
  },
  shiftEmployee: {
    color: '#E6E6FF', // Ein helleres Weiß für den Mitarbeiter
    fontSize: 14, // Angepasste Schriftgröße
    fontStyle: 'normal', // Weg von Kursivschrift, um eine klarere Darstellung zu erreichen
    marginTop: 4, // Reduzierter Abstand zum Datum
  },
  iconRight: {
    color: '#FFFFFF', // Weiße Farbe für das Icon
    marginRight: 12, // Angepasster rechter Rand
  },
    
  icon: {
      position: 'absolute', // Absolute Positionierung
        // Abstand vom linken Rand
    },

  });
  
  
