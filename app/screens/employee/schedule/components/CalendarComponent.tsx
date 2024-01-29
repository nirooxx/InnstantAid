// CalendarComponent.tsx
import React from 'react';
import { Agenda } from 'react-native-calendars';
import { Shift, ShiftsForDay, Role, AgendaEntry } from '../../types'; // Pfad anpassen
import { View, Text, StyleSheet } from 'react-native';

interface CalendarComponentProps {
  role: Role;
  shifts: ShiftsForDay;
}

const transformShiftsToAgendaFormat = (shifts: ShiftsForDay): { [date: string]: AgendaEntry[] } => {
    const agendaData: { [date: string]: AgendaEntry[] } = {};
  
    Object.keys(shifts).forEach(date => {
      agendaData[date] = shifts[date].map(shift => ({
        name: shift.name,
        height: 60, // Standardhöhe für Agenda-Einträge
        day: date, // Datum als Zeichenkette
        startTime: shift.startTime, // Startzeit
        endTime: shift.endTime, // Endzeit
        // Hier können Sie weitere Eigenschaften hinzufügen, falls erforderlich
      }));
    });
  
    return agendaData;
  };

  
const CalendarComponent: React.FC<CalendarComponentProps> = ({ role, shifts }) => {

      const renderItem = (item:any, isFirst:Boolean) => {
        return (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{item.name}</Text>
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
  
