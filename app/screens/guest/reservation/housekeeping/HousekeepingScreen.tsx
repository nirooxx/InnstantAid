import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from "../../../../routes/types";
import { StackNavigationProp } from "@react-navigation/stack";
import Icon from 'react-native-vector-icons/Ionicons';

type HousekeepingNavigationProp = StackNavigationProp<RootStackParamList>;

const HousekeepingScreen: React.FC = () => {
  const navigation = useNavigation<HousekeepingNavigationProp>();

  const handleRequestRoomCleanPress = () => {
    navigation.navigate('RequestRoomCleanScreen');
  };

  const handleSetRoomCleanFrequencyPress = () => {
    navigation.navigate('RoomCleanFrequencyScreen');
  };

  const handleMaintenancePress = () => {
    navigation.navigate('MaintenanceScreen');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity style={styles.tile} onPress={handleRequestRoomCleanPress}>
          <Icon name="water" size={50} color="#5A67D8" style={styles.icon} />
          <Text style={styles.tileText}>Request Room Clean</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tile} onPress={handleSetRoomCleanFrequencyPress}>
          <Icon name="repeat" size={50} color="#5A67D8" style={styles.icon} />
          <Text style={styles.tileText}>Set Room Clean Frequency</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity style={styles.tile} onPress={handleMaintenancePress}>
          <Icon name="hammer" size={50} color="#5A67D8" style={styles.icon} />
          <Text style={styles.tileText}>Maintenance</Text>
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

export default HousekeepingScreen;
