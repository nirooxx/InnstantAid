import React from 'react';
import { View, Button, StyleSheet, ScrollView } from 'react-native';

interface ChannelSelectorProps {
  onSelectChannel: (channelId: string) => void;
}

const channels = [
  { id: 'rezeption', name: 'Rezeption' },
  { id: 'spa', name: 'Spa' },
  { id: 'restaurant', name: 'Restaurant' },
  // Weitere Kanäle nach Bedarf
];

const ChannelSelector: React.FC<ChannelSelectorProps> = ({ onSelectChannel }) => {
  return (
    <ScrollView style={styles.container}>
      {channels.map((channel) => (
        <Button key={channel.id} title={channel.name} onPress={() => onSelectChannel(channel.id)} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});

export default ChannelSelector;
