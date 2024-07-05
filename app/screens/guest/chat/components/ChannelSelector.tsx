import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from "../../../../routes/types";
import { StackNavigationProp } from "@react-navigation/stack";

type ChatNavigationProp = StackNavigationProp<RootStackParamList>;
interface ChannelSelectorProps {
  onSelectChannel: (channelId: string) => void;
}

const channels = [
  { id: 'rezeption', name: 'Rezeption', icon: 'paper-plane' },
  { id: 'spa', name: 'Spa', icon: 'thermometer' },
  { id: 'restaurant', name: 'Restaurant', icon: 'restaurant' },
];

const ChannelSelector: React.FC<ChannelSelectorProps> = ({ onSelectChannel }) => {
  const navigation = useNavigation<ChatNavigationProp>();

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require('../../../../assets/images/Thai-Message.webp')}
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
              <Icon name={channel.icon} size={24} color="#5A67D8" />
              <Text style={styles.channelText}>{channel.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.navigationButton}
        onPress={() => navigation.navigate('Dashboard')}
      >
        <Icon name="caret-back" size={24} color="#ffffff" />
        <Text style={styles.navigationButtonText}>Back to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F7FAFC', // Light background color for the whole screen
  },
  container: {
    flex: 1,
  },
  header: {
    height: 180, // Increased header height for better visuals
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5A67D8', // Main color
  },
  headerImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    opacity: 0.3, // Make the background image less prominent
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24, // Adjusted font size for title
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16, // Adjusted font size for subtitle
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 4,
  },
  channelsContainer: {
    paddingVertical: 20, // Add padding for better spacing
  },
  channelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#dddddd',
  },
  channelText: {
    marginLeft: 12,
    fontSize: 18, // Adjusted font size for channel text
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
