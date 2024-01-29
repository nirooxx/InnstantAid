// CalendarComponent.tsx
import React from 'react';
import { Agenda } from 'react-native-calendars';
import { Shift, ShiftsForDay, Role, AgendaEntry } from '../../types'; // Pfad anpassen
import { View, Text, StyleSheet } from 'react-native';

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


const transformShiftsToAgendaFormat = (shifts: ShiftsForDay): { [date: string]: AgendaEntry[] } => {
  const agendaData: { [date: string]: AgendaEntry[] } = {};

  Object.keys(shifts).forEach(date => {
    agendaData[date] = shifts[date].map(shift => ({
      name: shift.name,
      employeeName: shift.employeeName,
      height: 60, // Standardhöhe für Agenda-Einträge
      day: dateToString(shift.startTime), // Datum als Zeichenkette
      startTime: timeToString(shift.startTime), // Startzeit als String
      endTime: timeToString(shift.endTime), // Endzeit als String
      // Hier können Sie weitere Eigenschaften hinzufügen, falls erforderlich
    }));
  });

  return agendaData;
};

  
const CalendarComponent: React.FC<CalendarComponentProps> = ({ role, shifts }) => {
console.log(transformShiftsToAgendaFormat(shifts))
console.log(shifts)
      const renderItem = (item:any, isFirst:Boolean) => {
        return (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{item.name}</Text>
            <Text style={styles.itemText}>{item.employeeName}</Text>
            <Text style={styles.itemText}>{`Beginn: ${item.startTime}`}</Text>
            <Text style={styles.itemText}>{`Ende: ${item.endTime}`}</Text>
          </View>
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
        items={transformShiftsToAgendaFormat(shifts)}
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
      });
      
    
   
  
  export default CalendarComponent;
  
