import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux'; // Import useDispatch
import { submitRoomCleanRequest  } from '../../../../../store/houseKeepingSlice'; 
import { AppDispatch } from '../../../../../store/store';
import { RootState } from '../../../../../store/store';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from "../../../../../routes/types"; // Import your type definitions
import { StackNavigationProp } from "@react-navigation/stack";

type HosekeepingNavigationProp = StackNavigationProp<
  RootStackParamList
>;

type CleanFrequencyOption = 'NONE' | 'DAILY' | 'EVERY_2_DAYS' | 'EVERY_3_DAYS' | 'OTHER';

const RoomCleanFrequencyScreen: React.FC = () => {
  const [selectedFrequency, setSelectedFrequency] = useState<CleanFrequencyOption>('EVERY_3_DAYS');
  const [notes, setNotes] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user);
  const navigation = useNavigation<HosekeepingNavigationProp>();

  const handleSelectFrequency = (option: CleanFrequencyOption) => {
    setSelectedFrequency(option);
  };

  const handleSchedule = () => {
    // Annahme: Die ID und das Datum werden serverseitig generiert oder sind in diesem Kontext nicht erforderlich
    dispatch(submitRoomCleanRequest({
      userId: user.id,
      roomNumber: user.roomNumber,
      date: new Date().toLocaleDateString('de-DE'),
      frequency: selectedFrequency,
      notes,
    }))
    .unwrap()
    .then(() => {
      Alert.alert('Success', 'Room clean frequency set successfully');
      navigation.goBack();
    })
    .catch((error) => {
      Alert.alert('Error', `Failed to set room clean frequency: ${error.message}`);
    });

  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Room Clean Frequency</Text>
      <Text style={styles.subtitle}>
        Set your room clean frequency. If none set, your room clean will occur between 10am and 1pm daily
      </Text>

      <View style={styles.frequencyContainer}>
        <Text style={styles.frequencyLabel}>FREQUENCY</Text>
        {['NONE', 'DAILY', 'EVERY_2_DAYS', 'EVERY_3_DAYS', 'OTHER'].map((option) => (
          <TouchableOpacity
            key={option}
            style={styles.optionContainer}
            onPress={() => handleSelectFrequency(option as CleanFrequencyOption)}
          >
            <View style={styles.radioCircle}>
              {selectedFrequency === option && <View style={styles.selectedCircle} />}
            </View>
            <Text style={styles.optionText}>
              {option.replace('_', ' ')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.notesLabel}>NOTES</Text>
      <TextInput
        style={styles.notesInput}
        onChangeText={setNotes}
        value={notes}
        placeholder="Notes"
        multiline
      />

      <TouchableOpacity style={styles.scheduleButton} onPress={handleSchedule}>
        <Text style={styles.scheduleButtonText}>SCHEDULE</Text>
      </TouchableOpacity>
    </View>
  );
};


export default RoomCleanFrequencyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  frequencyContainer: {
    marginBottom: 20,
  },
  frequencyLabel: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  selectedCircle: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#000',
  },
  optionText: {
    fontSize: 18,
  },
  notesLabel: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  notesInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  scheduleButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  scheduleButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

