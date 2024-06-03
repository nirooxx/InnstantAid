import React, { useState, useEffect, useCallback } from 'react';
import { View, Button, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { GiftedChat, IMessage, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import {
  sendMessage,
  subscribeToMessages,
  resetMessages,
  updateLastVisited,
  fetchAllGuests,
  fetchChatsForGuests,
} from '../../../store/chatSlice';
import ChannelSelector from './component/ChannelSelector';
import { RootState, AppDispatch } from '../../../store/store';
import { RootStackParamList } from "../../../routes/types";
import { StackNavigationProp } from "@react-navigation/stack";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type EmployeeChatNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ConfirmationScreen'
>;

interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}

interface Message {
  _id: string;
  text: string;
  createdAt: Date;
  user: {
    _id: string;
    name: string;
  };
}

const EmployeeChatScreen: React.FC = () => {
  const userId = useSelector((state: RootState) => state.user.id);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [localGuestMessages, setLocalGuestMessages] = useState<{ guestId: string; messages: Message[] }[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const guestMessages = useSelector((state: RootState) => state.chat.guestMessages);
  const guests = useSelector((state: RootState) => state.chat.guests);
  const navigation = useNavigation<EmployeeChatNavigationProp>();
  const isFocused = useIsFocused();

  const initialLastVisitedState = {};

  const lastVisited = useSelector((state: RootState) => state.chat.lastVisited) || initialLastVisitedState;

  useEffect(() => {
    if (isFocused) {
      setSelectedChannel(null);
      setSelectedUserId(null);
    }
  }, [isFocused, navigation]);

  useEffect(() => {
    if (selectedUserId && selectedChannel) {
      dispatch(resetMessages());
      const unsubscribe = dispatch(subscribeToMessages(selectedUserId, selectedChannel));
      return () => {
        if (unsubscribe) unsubscribe();
      };
    }
  }, [selectedUserId, selectedChannel, dispatch]);

  useEffect(() => {
    if (selectedChannel) {
      dispatch(fetchAllGuests()).then(actionResult => {
        if (fetchAllGuests.fulfilled.match(actionResult)) {
          const guests = actionResult.payload;
          dispatch(fetchChatsForGuests({ guests, channelId: selectedChannel }));
        }
      });
    }
  }, [selectedChannel, dispatch]);

  useEffect(() => {
    setLocalGuestMessages(guestMessages);
  }, [guestMessages]);

  const handleSelectedChannelChange = useCallback((channelId: string | null) => {
    setSelectedChannel(channelId);
  }, []);

  const handleOpenChat = (guestId: string, channelId: string) => {
    const timestamp = Date.now();
    dispatch(updateLastVisited({ channelId, timestamp }));
    setSelectedUserId(guestId);
  };

  const onSend = useCallback(async (messagesToSend: IMessage[] = []) => {
    const updatedMessages:any = [];
    for (const message of messagesToSend) {
      const createdAtDate = new Date();

      const messageToSend = {
        ...message,
        createdAt: createdAtDate,
        user: {
          _id: userId.toString(),
          name: "Benutzername",
        },
        _id: message._id.toString(),
      };

      if (selectedUserId && selectedChannel) {
        await dispatch(sendMessage(selectedUserId, selectedChannel, messageToSend as Message));
        updatedMessages.push(messageToSend);

          // Update last visited when sending a message
          const timestamp = Date.now();
          dispatch(updateLastVisited({ channelId: selectedChannel, timestamp }));
      }
    }

    // Update the local state with the new messages
    setLocalGuestMessages(prevMessages => {
      const newMessages = prevMessages.map(guest => {
        if (guest.guestId === selectedUserId) {
          return {
            ...guest,
            messages: [...guest.messages, ...updatedMessages],
          };
        }
        return guest;
      });

      return newMessages;
    });
  }, [dispatch, selectedUserId, selectedChannel, userId]);

  if (!selectedChannel) {
    return (
      <ChannelSelector
        onSelectChannel={(channelId: any) => handleSelectedChannelChange(channelId)}
      />
    );
  }

  const isFirestoreTimestamp = (object: any): object is FirestoreTimestamp => {
    return object && typeof object === 'object' && 'seconds' in object && 'nanoseconds' in object;
  };

  if (selectedChannel && !selectedUserId) {
    return (
      <View>
        <View style={styles.backButtonContainer}>
          <TouchableOpacity onPress={() => setSelectedChannel(null)} style={styles.backButton}>
            <Icon name="arrow-left" size={20} color="#fff" />
            <Text style={styles.backButtonText}>Zurück zu Kanalauswahl</Text>
          </TouchableOpacity>
        </View>
        {guests?.map((guest) => {
          const guestChannelMessages = localGuestMessages.find(gm => gm.guestId === guest.id)?.messages || [];
          const lastVisitedTime = lastVisited[selectedChannel] || 0;

          const sortedMessages = [...guestChannelMessages].sort((a, b) => {
            let dateA = new Date();
            let dateB = new Date();
            if (isFirestoreTimestamp(a.createdAt)) {
              dateA = new Date(a.createdAt.seconds * 1000 + a.createdAt.nanoseconds / 1000000);
            } else if (a.createdAt instanceof Date) {
              dateA = a.createdAt;
            } else {
              dateA = new Date(a.createdAt);
            }

            if (isFirestoreTimestamp(b.createdAt)) {
              dateB = new Date(b.createdAt.seconds * 1000 + b.createdAt.nanoseconds / 1000000);
            } else if (b.createdAt instanceof Date) {
              dateB = b.createdAt;
            } else {
              dateB = new Date(b.createdAt);
            }

            return dateB.getTime() - dateA.getTime();
          });

          let lastMessageTime = "";
          if (sortedMessages[0]) {
            if (isFirestoreTimestamp(sortedMessages[0].createdAt)) {
              const timestamp = sortedMessages[0].createdAt as FirestoreTimestamp;
              lastMessageTime = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            } else if (sortedMessages[0].createdAt instanceof Date) {
              lastMessageTime = sortedMessages[0].createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            } else {
              lastMessageTime = new Date(sortedMessages[0].createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }
          }

          const hasUnreadMessages = guestChannelMessages.some(message => {
            let messageTime: number;
            if (typeof message.createdAt === 'number') {
              messageTime = message.createdAt;
            } else if (isFirestoreTimestamp(message.createdAt)) {
              messageTime = new Date(message.createdAt.seconds * 1000 + message.createdAt.nanoseconds / 1000000).getTime();
            } else {
              messageTime = new Date(message.createdAt).getTime();
            }
            return messageTime > lastVisitedTime;
          });

          return (
            <TouchableOpacity key={`${guest.id}-${Math.random()}`} onPress={() => handleOpenChat(guest.id, selectedChannel)} style={styles.chatItem}>
              <Image source={{ uri: "https://w7.pngwing.com/pngs/109/919/png-transparent-cdr-name-icon-cdr-number-base64-thumbnail.png" }} style={styles.avatar} />
              <View style={styles.textContainer}>
                <Text style={styles.username}>{guest.username}</Text>
                <Text style={styles.lastMessage}>{sortedMessages.length > 0 ? sortedMessages[0].text : 'Keine Nachrichten'}</Text>
              </View>
              <Text style={styles.time}>{lastMessageTime}</Text>
              {hasUnreadMessages && <View style={styles.unreadIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  const selectedGuestMessages = localGuestMessages.find(gm => gm.guestId === selectedUserId)?.messages || [];
  const formattedMessages = selectedGuestMessages.map((msg): IMessage => {
    let createdAtDate: Date;
    if (typeof msg.createdAt === 'number') {
      createdAtDate = new Date(msg.createdAt);
    } else if (msg.createdAt && typeof msg.createdAt === 'object' && 'seconds' in msg.createdAt && 'nanoseconds' in msg.createdAt) {
      const timestamp = msg.createdAt as FirestoreTimestamp;
      createdAtDate = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
    } else {
      createdAtDate = new Date(msg.createdAt);
    }
    return {
      ...msg,
      createdAt: createdAtDate,
      user: {
        ...msg.user,
        _id: msg.user._id || "fallbackUserId",
      },
      _id: `${msg._id}-${Math.random()}`, // Ensure unique key by appending a random number
    };
  }).sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <View style={[styles.container]}>
      {selectedUserId ? (
        <>
         
          <TouchableOpacity onPress={() => setSelectedUserId(null)} style={styles.backButtonContainer}> 
           <Text>Zurück zur Gästeliste</Text>
           </TouchableOpacity>
        
          <GiftedChat
            messages={formattedMessages}
            onSend={messagesToSend => onSend(messagesToSend)}
            user={{
              _id: userId,
              name: "Rezeption",
            }}
            renderBubble={(props) => (
              <Bubble
                {...props}
                wrapperStyle={{
                  right: { backgroundColor: '#0078ff' },
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
                  borderRadius: 50,
               
                }}
                primaryStyle={{ alignItems: 'center' }}
              />
            )}
            placeholder="Schreibe eine Nachricht"
          alwaysShowSend
          scrollToBottom
          scrollToBottomComponent={() => (
            <Icon name="chevron-double-down" size={24} color="#0078ff" />
          )}
          minComposerHeight={40}
          maxComposerHeight={120}
          />
        </>
      ) : (
        <ScrollView>
          {guests?.map((guest) => (
            <TouchableOpacity key={`${guest.id}-${Math.random()}`} onPress={() => setSelectedUserId(guest.id)} style={styles.chatItem}>
              <Text>{guest.username}</Text>
            </TouchableOpacity>
          ))}
          <Button title="Zurück zu Kanalauswahl" onPress={() => setSelectedChannel(null)} />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButtonContainer: {
    marginVertical: 20,
    marginHorizontal: 20,
    backgroundColor: '#5A67D8',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
  unreadIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});

export default EmployeeChatScreen;
