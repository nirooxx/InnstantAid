import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from "../../../routes/types";
import { StackNavigationProp } from "@react-navigation/stack";
import Icon from 'react-native-vector-icons/Ionicons';

type ReservationsNavigationProp = StackNavigationProp<RootStackParamList>;

const ReservationsScreen: React.FC = () => {
  const navigation = useNavigation<ReservationsNavigationProp>();

  const handleSpaBookingPress = () => {
    navigation.navigate('SpaBookingScreen');
  };

  const handleTableReservationPress = () => {
    navigation.navigate('TableReservationScreen');
  };

  const handleRoomServiceOrderPress = () => {
    navigation.navigate('MenuScreen');
  };

  const handleHouseKeepingPress = () => {
    navigation.navigate('HousekeepingScreen');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity style={styles.tile} onPress={handleTableReservationPress}>
          <Icon name="restaurant" size={50} color="#5A67D8" style={styles.icon} />
          <Text style={styles.tileText}>Tischreservierung</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tile} onPress={handleSpaBookingPress}>
          <Icon name="battery-charging" size={50} color="#5A67D8" style={styles.icon} />
          <Text style={styles.tileText}>Spa-Buchung</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity style={styles.tile} onPress={handleRoomServiceOrderPress}>
          <Icon name="fast-food" size={50} color="#5A67D8" style={styles.icon} />
          <Text style={styles.tileText}>Zimmerservice</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tile} onPress={handleHouseKeepingPress}>
          <Icon name="infinite" size={50} color="#5A67D8" style={styles.icon} />
          <Text style={styles.tileText}>Housekeeping</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity style={styles.tile} onPress={handleRoomServiceOrderPress}>
          <Icon name="barbell" size={50} color="#5A67D8" style={styles.icon} />
          <Text style={styles.tileText}>Fitness</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tile} onPress={handleHouseKeepingPress}>
          <Icon name="information" size={50} color="#5A67D8" style={styles.icon} />
          <Text style={styles.tileText}>Info</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F0F4F8',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  tile: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    marginBottom: 8,
  },
  tileText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5A67D8',
    textAlign: 'center',
  },
});

export default ReservationsScreen;
