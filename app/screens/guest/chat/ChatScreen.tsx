import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  sendMessage,
  subscribeToMessages,
  selectMessages,
  resetMessages
} from '../../../store/chatSlice';
import { RootState, AppDispatch } from '../../../store/store';
import ChannelSelector from './components/ChannelSelector'; // Pfad überprüfen
// Stellen Sie sicher, dass der Pfad korrekt ist

const ChatScreen: React.FC = () => {
  const userId = useSelector((state: RootState) => state.user.id);
  const [channelId, setChannelId] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const messages = useSelector(selectMessages);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    dispatch(resetMessages());
    let unsubscribe = () => {};
    if (userId && channelId) {
      unsubscribe = dispatch(subscribeToMessages(userId, channelId));
    }
    return () => unsubscribe(); // Diese Funktion wird aufgerufen, wenn die Komponente unmountet wird oder wenn sich userId/channelId ändert.
  }, [userId, channelId, dispatch]);
  

  const onSend = (messages: any[] = []) => {
    if (userId && channelId) {
      messages.forEach((message) => {
        dispatch(sendMessage(userId, channelId, {
          _id: message._id,
          text: message.text,
          createdAt: new Date(),
          user: message.user,
        }));
      });
    }
  };

  // Funktion, um zum Kanalauswahlbildschirm zurückzukehren
  const handleChannelExit = () => {
    setChannelId(null); // Setzt channelId zurück und zeigt den Kanalauswahlbildschirm an
  };

  if (!channelId) {
    return <ChannelSelector onSelectChannel={setChannelId} />;
  }

  return (
    <View  style={styles.container}>
    <ScrollView
    contentContainerStyle={{ paddingBottom: insets.bottom + 70}} // Fügen Sie genug Padding hinzu, um die TabBar und den Button zu berücksichtigen
  >
   
       
      {channelId && (
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={handleChannelExit}>
            <Icon name="arrow-left" size={24} color="#ffffff" />
            <Text style={styles.headerButtonText}>Kanal wechseln</Text>
          </TouchableOpacity>
        </View>
      )}

      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: userId,
          name: "Gast",
        }}
        renderBubble={(props) => (
          <Bubble
            {...props}
            wrapperStyle={{
              right: {
                backgroundColor: '#0078ff',
              },
              left: {
                backgroundColor: '#f0f0f0',
              },
            }}
            textStyle={{
              right: {
                color: '#fff',
              },
              left: {
                color: '#333',
              },
            }}
          />
        )}
        renderInputToolbar={(props) => (
          <InputToolbar
            {...props}
            containerStyle={{
              borderRadius: 20,
              marginHorizontal: 8,
              marginVertical: 8,
            }}
            primaryStyle={{ alignItems: 'center' }}
          />
        )}
      />
  
 
    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e5e5e5',
  },
  header: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#0078ff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerButtonText: {
    color: '#ffffff',
    marginLeft: 6,
    fontSize: 16,
    fontWeight: '600',
  },
  // Weitere Stile können hier hinzugefügt werden
});


export default ChatScreen;
