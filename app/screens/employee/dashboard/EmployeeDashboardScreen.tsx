import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../routes/types"; // Import your type definitions
import { StackNavigationProp } from "@react-navigation/stack";
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type ReservationDetailNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ScheduleScreen"
>;



const EmployeeDashboardScreen: React.FC = () => {
  const navigation = useNavigation<ReservationDetailNavigationProp>();

 
  const metrics = [
    { key: 'kalendar', number: 112, label: 'Kalendar', icon: 'view-grid-plus-outline', screen: 'ScheduleScreen' },
    { key: 'aufgaben', number: 48, label: 'Aufgaben', icon: 'account-cash-outline', screen: 'TaskListScreen' },
    { key: 'employees', number: 70, label: 'Employees', icon: 'account-group-outline', screen: 'ChatScreen' },
    { key: 'invoices', number: 60, label: 'Invoices', icon: 'file-document-outline', screen: 'CalendarScreen' }
  ];

  return (
    <View style={styles.container}>
    <View style={styles.header}>
      <Image source={require('../../../assets/images/Thai-Message.webp')} style={styles.logo} />
      <Text style={styles.headerTitle}>Smart HR</Text>
    </View>
    <View style={styles.cardContainer}>
      {metrics.map((metric:any) => (
        <TouchableOpacity key={metric.key} onPress={() => navigation.navigate(metric.screen)} style={styles.touchableArea}>
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <Icon name={metric.icon} size={36} style={styles.icon} />
              <Text style={styles.number}>{metric.number}</Text>
              <Text style={styles.label}>{metric.label}</Text>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      ))}
    </View>
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3f51b5', // Deep blue background
  },
  header: {
    paddingTop: 30,
    paddingBottom: 10,
    alignItems: 'center',
    backgroundColor: '#283593', // Slightly darker blue for header background
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
  },
  touchableArea: {
    width: '45%', // Reduced width for better margins
    aspectRatio: 1, // Makes each card square
    marginBottom: 20, // Adds bottom margin for spacing
  },
  card: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10, // More pronounced rounded corners
    elevation: 3, // Slightly higher elevation for better shadow effect
    backgroundColor: 'white', // Maintains a clean white card background
  },
  cardContent: {
    alignItems: 'center',
  },
  icon: {
    marginBottom: 8,
    color: '#1976D2', // A more vibrant blue for icons
  },
  number: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#424242', // Dark grey for numbers, for better contrast
  },
  label: {
    fontSize: 14,
    color: '#424242', // Matching dark grey for text
  }

});


export default EmployeeDashboardScreen;
