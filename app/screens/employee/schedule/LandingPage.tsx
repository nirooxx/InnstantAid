import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from "../../../routes/types"; // Import your type definitions
import { StackNavigationProp } from "@react-navigation/stack";

type ReservationsNavigationProp = StackNavigationProp<
  RootStackParamList
>;

const LandingPage: React.FC = () => {
    const navigation = useNavigation<ReservationsNavigationProp>();

    const handleSpaBookingPress = () => {
      navigation.navigate('ScheduleScreen');
    };
  
    const handleTableReservationPress = () => {
      navigation.navigate('TaskListScreen');
    };

    const handleHouseKeepingPress = () => {
      navigation.navigate('HousekeepingView');
    };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Willkommen</Text>
        <Text style={styles.headerSubtitle}>Organisieren Sie Ihre Schichten und Aufgaben</Text>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem} onPress={handleSpaBookingPress}>
          <Icon name="calendar" size={24} color="#fff" />
          <Text style={styles.menuItemText}>Schichten</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleTableReservationPress}>
          <Icon name="list" size={24} color="#fff" />
          <Text style={styles.menuItemText}>Aufgaben</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleHouseKeepingPress}>
          <Icon name="list" size={24} color="#fff" />
          <Text style={styles.menuItemText}>Housekeeping anfragen</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 18,
    color: '#666',
  },
  menu: {
    width: '100%',
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  menuItemText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 10,
  },
});

export default LandingPage;
