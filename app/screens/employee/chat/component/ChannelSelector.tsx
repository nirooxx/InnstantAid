import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from "../../../../routes/types"; // Import your type definitions
import { StackNavigationProp } from "@react-navigation/stack";

type ChatNavigationProp = StackNavigationProp<
  RootStackParamList
>;
interface ChannelSelectorProps {
  onSelectChannel: (channelId: string) => void;
}

const channels = [
  { id: 'rezeption', name: 'Rezeption', count: 27 },
  { id: 'spa', name: 'Spa', count: 9 },
  { id: 'restaurant', name: 'Restaurant', count: 4 },
  // Weitere Kanäle nach Bedarf
];

const ChannelSelector: React.FC<ChannelSelectorProps> = ({ onSelectChannel }) => {
  const navigation = useNavigation<ChatNavigationProp>();
  return (
    <View style={styles.wrapper}>
    <ScrollView style={styles.container}>
      {channels.map((channel) => (
        <TouchableOpacity
          key={channel.id}
          style={styles.channelItem}
          onPress={() => onSelectChannel(channel.id)}
        >
          <Text style={styles.channelName}>{channel.name}</Text>
          {/* Pfeil nach rechts für die Navigation */}
          <Text style={styles.arrowRight}>➔</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
      <TouchableOpacity
      style={styles.navigationButton}
      onPress={() => navigation.navigate('Dashboard')}
    >
      <Icon name="arrow-left" size={24} color="#ffffff" />
      <Text style={styles.navigationButtonText}>Back to Dashboard</Text>
    </TouchableOpacity>
  </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  channelItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 10,
    backgroundColor: '#5A67D8', // Hintergrund der Kanalauswahl
  },
  channelName: {
    fontSize: 16,
    color: '#fff', // Textfarbe
  },
  arrowRight: {
    fontSize: 16,
    color: '#fff', // Textfarbe des Pfeils
  },
  navigationButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#5A67D8',
    height: 60,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  navigationButtonText: {
    color: '#ffffff',
    fontSize: 18,
    marginLeft: 10,
  },
});

export default ChannelSelector;
