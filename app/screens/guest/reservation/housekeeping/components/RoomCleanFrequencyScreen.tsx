import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { submitRoomCleanRequest } from '../../../../../store/houseKeepingSlice';
import { AppDispatch } from '../../../../../store/store';
import { RootState } from '../../../../../store/store';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from "../../../../../routes/types";
import { StackNavigationProp } from "@react-navigation/stack";

type HousekeepingNavigationProp = StackNavigationProp<
  RootStackParamList
>;

type CleanFrequencyOption = 'NONE' | 'DAILY' | 'EVERY_2_DAYS' | 'EVERY_3_DAYS' | 'OTHER';

const RoomCleanFrequencyScreen: React.FC = () => {
  const [selectedFrequency, setSelectedFrequency] = useState<CleanFrequencyOption>('EVERY_3_DAYS');
  const [notes, setNotes] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user);
  const navigation = useNavigation<HousekeepingNavigationProp>();

  const handleSelectFrequency = (option: CleanFrequencyOption) => {
    setSelectedFrequency(option);
  };

  const handleSchedule = () => {
    dispatch(submitRoomCleanRequest({
      userId: user?.id,
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
    <ScrollView style={styles.container}>
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
    </ScrollView>
  );
};

export default RoomCleanFrequencyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F7FAFC',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#4A5568',
    textAlign: 'center',
    marginBottom: 20,
  },
  frequencyContainer: {
    marginBottom: 20,
  },
  frequencyLabel: {
    fontWeight: 'bold',
    color: '#2D3748',
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
    borderColor: '#5A67D8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  selectedCircle: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#5A67D8',
  },
  optionText: {
    fontSize: 16,
    color: '#2D3748',
  },
  notesLabel: {
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 10,
  },
  notesInput: {
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
    color: '#2D3748',
    backgroundColor: '#FFFFFF',
  },
  scheduleButton: {
    backgroundColor: '#5A67D8',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  scheduleButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
