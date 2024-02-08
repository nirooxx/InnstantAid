import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

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
  return (
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
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: '#8e44ad', // Hintergrund der Kanalauswahl
  },
  channelName: {
    fontSize: 16,
    color: '#fff', // Textfarbe
  },
  arrowRight: {
    fontSize: 16,
    color: '#fff', // Textfarbe des Pfeils
  },
});

export default ChannelSelector;
