import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  sendMessage,
  subscribeToMessages,
  selectMessages,
  resetMessages,
} from '../../../store/chatSlice';
import { RootState, AppDispatch } from '../../../store/store';
import ChannelSelector from './components/ChannelSelector'; // Pfad überprüfen

const ChatScreen: React.FC = () => {
  const userId = useSelector((state: RootState) => state.user.id);
  const [channelId, setChannelId] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const rawMessages = useSelector(selectMessages);
  const [messages, setMessages] = useState<any>([]);

  useEffect(() => {
    if (!userId || !channelId) return;

    dispatch(resetMessages());
    const unsubscribe = dispatch(subscribeToMessages(userId, channelId));

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [userId, channelId, dispatch]);

  useEffect(() => {
    const convertedMessages = rawMessages.map((msg: any) => ({
      ...msg,
      createdAt: new Date(msg.createdAt),
    }));
    setMessages(convertedMessages);
  }, [rawMessages]);

  const onSend = useCallback(
    (newMessages = []) => {
      if (!userId || !channelId) return;

      newMessages.forEach((message: any) => {
        dispatch(sendMessage(userId, channelId, {
          _id: message._id,
          text: message.text,
          createdAt: new Date(),
          user: message.user,
        }));
      });
    },
    [userId, channelId, dispatch]
  );

  const handleChannelExit = () => {
    setChannelId(null);
  };

  if (!channelId) {
    return <ChannelSelector onSelectChannel={setChannelId} />;
  }

  return (
    <View style={[styles.container]}>
      {channelId && (
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={handleChannelExit}>
            <Icon name="caret-back" size={24} color="#ffffff" />
            <Text style={styles.headerButtonText}>Kanal wechseln</Text>
          </TouchableOpacity>
        </View>
      )}

      <GiftedChat
        messages={messages}
        onSend={(msg: any) => onSend(msg)}
        user={{ _id: userId || '', name: 'Gast' }}
        renderBubble={(props) => (
          <Bubble
            {...props}
            wrapperStyle={{
              right: { backgroundColor: '#5A67D8' },
              left: { backgroundColor: '#f0f0f0' },
            }}
            textStyle={{
              right: { color: '#fff' },
              left: { color: '#333' },
            }}
          />
        )}
        renderInputToolbar={(props) => (
          <InputToolbar
            {...props}
            containerStyle={{
              borderRadius: 20,
              margin: 2.5,
            }}
            primaryStyle={{ alignItems: 'center' }}
          />
        )}
        placeholder="Nachricht eingeben..."
        alwaysShowSend
        scrollToBottom
        scrollToBottomComponent={() => (
          <Icon name="chevron-double-down" size={24} color="#5A67D8" />
        )}
        minComposerHeight={40}
        maxComposerHeight={120}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  header: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#5A67D8',
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
