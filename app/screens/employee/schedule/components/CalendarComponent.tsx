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


const transformShiftsToAgendaFormat = (role: Role, shifts: ShiftsForDay): { [date: string]: AgendaEntry[] } => {
  const agendaData: { [date: string]: AgendaEntry[] } = {};

  // Erstelle Start- und Enddatum für den betrachteten Zeitraum
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 1); // Ein Monat in die Vergangenheit
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 1); // Ein Monat in die Zukunft

  // Generiere für jeden Tag im Zeitraum einen Eintrag im agendaData
  for(let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)){
    const dateString = dateToString(d);
    agendaData[dateString] = shifts[dateString] && shifts[dateString].some(shift => shift.role === role)
      ? shifts[dateString].filter(shift => shift.role === role).map(shift => ({
        name: shift.name,
        employeeName: shift.employeeName,
        height: 60,
        day: dateString,
        startTime: timeToString(shift.startTime),
        endTime: timeToString(shift.endTime),
      })) 
      : [];
  }

  return agendaData;
};

  
const CalendarComponent: React.FC<CalendarComponentProps> = ({ role, shifts }) => {
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
      });
      
    
   
  
 
  
