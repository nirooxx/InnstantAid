// CalendarComponent.tsx
import React from 'react';
import { Agenda,  } from 'react-native-calendars';
import { Shift, ShiftsForDay, Role, AgendaEntry,  } from '../../types'; // Pfad anpassen
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";

interface CalendarComponentProps {
  role: Role;
  shifts: ShiftsForDay;
}

const timeToString = (time: Date) => {
  return `${time.getHours()}:${time.getMinutes()}`;
};

const dateToString = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Monate beginnen bei 0
  const day = date.getDate();

  // Führende Nullen für Monat und Tag hinzufügen, falls erforderlich
  return `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
};


const transformShiftsToAgendaFormat = (role: Role, shifts: ShiftsForDay): { [date: string]: AgendaEntry[] } => {
  const agendaData: { [date: string]: AgendaEntry[] } = {};

  // Erstelle Start- und Enddatum für den betrachteten Zeitraum
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 1); // Ein Monat in die Vergangenheit
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 1); // Ein Monat in die Zukunft

  // Durchgehen aller Tage im Zeitraum
  for(let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)){
    const dateString = dateToString(d);
    // Überprüfen, ob für den aktuellen Tag Shifts vorhanden sind
    if (shifts[dateString]) {
      // Filtern der Shifts basierend auf der Rolle und Umwandeln in das Agenda-Format
      agendaData[dateString] = shifts[dateString]
        .filter(shift => shift.role === role)
        .map(shift => ({
          name: shift.name,
          employeeName: shift.employeeName,
          height: 60,
          day: dateString,
          startTime: timeToString(new Date(shift.startTime)),
          endTime: timeToString(new Date(shift.endTime)),
          id: shift.id, // Hinzufügen der Shift-ID
          role: shift.role // Hinzufügen der Rolle
        }));
    } else {
      // Keine Shifts für diesen Tag vorhanden
      agendaData[dateString] = [];
    }
  }

  return agendaData;
};


  
const CalendarComponent: React.FC<CalendarComponentProps> = ({ role, shifts }) => {
  const navigation = useNavigation();

  const handleShiftSelected = (item: any) => {
    console.log(item)
    // Stellen Sie sicher, dass item ein Shift-Objekt mit id und role ist
    if ('id' in item && 'role' in item) {
      navigation.navigate('ShiftDetailScreen', { shiftId: item.id, role: item.role });
    }
  };
  

      const renderItem = (item:any, isFirst:Boolean) => {
        const itemStyle = isFirst ? styles.firstItem : styles.item;
        return (
          <TouchableOpacity style={itemStyle} onPress={() => handleShiftSelected(item)}>
          <Text style={styles.taskTitle}>{item.name}</Text>
          <Text style={styles.priorityLabel}>{item.employeeName}</Text>
          <Text style={styles.itemText}>{`Beginn: ${item.startTime}`}</Text>
          <Text style={styles.itemText}>{`Ende: ${item.endTime}`}</Text>
        </TouchableOpacity>
        );
      };
  
    const renderEmptyDate = () => {
      return (
        <View style={styles.emptyDate}>
          <Text>Keine Schichten an diesem Tag.</Text>
        </View>
      );
    };
  
    return (
      <Agenda
        items={transformShiftsToAgendaFormat(role,shifts)}
        renderItem={renderItem}
        renderEmptyDate={renderEmptyDate}
        theme={{
          agendaDayTextColor: 'blue',
          agendaDayNumColor: 'green',
          agendaTodayColor: 'red',
          // Weitere Themeneinstellungen...
        }}
        // Weitere Anpassungen...
      />
    );
  };
  export default CalendarComponent;

    const styles = StyleSheet.create({
        itemContainer: {
          backgroundColor: 'white',
          padding: 10,
          borderRadius: 5,
          marginVertical: 5,
          // Weitere Styles...
        },
        itemText: {
          fontSize: 16,
          // Weitere Styles...
        },
        emptyDate: {
            height: 15,
            flex:1,
            paddingTop: 30,
          },
          firstItem: {
            backgroundColor: '#1A1A1A',
            borderRadius: 15,
            padding: 15,
            marginRight: 10,
            marginTop: 17,
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          },
          item: {
            backgroundColor: '#1A1A1A',
            borderRadius: 15,
            padding: 15,
            marginRight: 10,
            marginTop: 10,
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          },
          priorityLabel: {
            backgroundColor: '#00BFFF', // Passen Sie diese Farbe an die im Screenshot gezeigte Farbe an
            borderRadius: 10,
            paddingVertical: 3,
            paddingHorizontal: 10,
            color: 'white',
            fontWeight: 'bold',
            alignSelf: 'flex-start',
            shadowColor: '#000', // Schattenfarbe
            shadowOffset: { width: 0, height: 2 }, // Schattenposition
            shadowOpacity: 0.25, // Schatten Transparenz
            shadowRadius: 3.84, // Schatten Radius
            elevation: 5, // Für Android-Schatten
          },
          taskTitle: {
            color: 'white',
            fontSize: 16,
            fontWeight: 'bold',
            flexShrink: 1,
            // ...other text styles
          },
      });
      
    
   
  
 
  
