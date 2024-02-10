import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface ChannelSelectorProps {
  onSelectChannel: (channelId: string) => void;
}

const channels = [
  { id: 'rezeption', name: 'Rezeption', icon: 'desk-lamp' },
  { id: 'spa', name: 'Spa', icon: 'flower-tulip' },
  { id: 'restaurant', name: 'Restaurant', icon: 'silverware-fork-knife' },
];

const ChannelSelector: React.FC<ChannelSelectorProps> = ({ onSelectChannel }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../../../assets/images/Thai-Message.webp')} //hotellobby.jpg
          style={styles.headerImage}
        />
        <View style={styles.overlay}>
          <Text style={styles.headerTitle}>Hotel-Chat</Text>
          <Text style={styles.headerSubtitle}>Direkte Kommunikation zu jedem Anliegen</Text>
        </View>
      </View>
      <View style={styles.channelsContainer}>
        {channels.map((channel) => (
          <TouchableOpacity
            key={channel.id}
            style={styles.channelButton}
            onPress={() => onSelectChannel(channel.id)}
          >
            <Icon name={channel.icon} size={22} color="#5A67D8" />
            <Text style={styles.channelText}>{channel.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 120, // Reduzierte Höhe des Headers
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#5A67D8', // oder jede andere Farbe, die das Design verlangt
  },
  headerImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.3, // Bild im Hintergrund schwächer darstellen
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20, // Verkleinerte Schriftgröße
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14, // Verkleinerte Schriftgröße
    color: '#ffffff',
    textAlign: 'center',
  },
  channelsContainer: {
    marginTop: -30, // Negative margin, um die Liste näher an den Header zu bringen
  },
  channelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#dddddd',
  },
  channelText: {
    marginLeft: 10,
    fontSize: 16, // Angepasste Schriftgröße
    color: '#333333',
  },
});

export default ChannelSelector;
