import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from "../../../../routes/types"; // Import your type definitions
import { StackNavigationProp } from "@react-navigation/stack";

type ChatNavigationProp = StackNavigationProp<
  RootStackParamList
>;
interface ChannelSelectorProps {
  onSelectChannel: (channelId: string) => void;
}

const channels = [
  { id: 'rezeption', name: 'Rezeption', icon: 'desk-lamp' },
  { id: 'spa', name: 'Spa', icon: 'flower-tulip' },
  { id: 'restaurant', name: 'Restaurant', icon: 'silverware-fork-knife' },
];

const ChannelSelector: React.FC<ChannelSelectorProps> = ({ onSelectChannel }) => {
  const navigation = useNavigation<ChatNavigationProp>();

  return (
    <View style={styles.wrapper}>
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
    flex: 1,
  },
  header: {
    height: 120, // Reduced header height
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#5A67D8', // Or any other color as per design
  },
  headerImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.3, // Make the background image less prominent
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20, // Reduced font size
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14, // Reduced font size
    color: '#ffffff',
    textAlign: 'center',
  },
  channelsContainer: {
    marginTop: -30, // Negative margin to bring the list closer to the header
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
    fontSize: 16, // Adjusted font size
    color: '#333333',
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
