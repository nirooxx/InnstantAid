import React, { useState, useEffect } from 'react';
import { View, Button, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { GiftedChat } from 'react-native-gifted-chat';
import {
  sendMessage,
  subscribeToMessages,
  resetMessages,
  selectMessages, 
  fetchAllGuests,
  fetchChatsForGuests // Stellen Sie sicher, dass diese Aktion importiert wird
} from '../../../store/chatSlice'; // Pfad entsprechend anpassen
import ChannelSelector from './component/ChannelSelector'; // Pfad entsprechend anpassen
import { RootState, AppDispatch } from '../../../store/store';
import { firebase } from '@react-native-firebase/firestore';

// In EmployeeChatScreen.tsx oder in einem separaten file, z.B. types.ts
interface User {
  id: string;
  name: string;
  username: string;
  role: string;
  roomNumber: string;
}

const EmployeeChatScreen: React.FC = () => {
  const userId = useSelector((state: RootState) => state.user.id);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const messages = useSelector(selectMessages);
  const guestMessages = useSelector((state: RootState) => state.chat.guestMessages);
  const guests = useSelector((state: RootState) => state.chat.guests);

  // Nun können Sie guestMessages verwenden, um die Nachrichten im UI anzuzeigen
  


console.log(guestMessages)
  useEffect(() => {
    if (selectedUserId && selectedChannel) {
      dispatch(resetMessages());
      const unsubscribe = dispatch(subscribeToMessages(selectedUserId, selectedChannel))();
      return unsubscribe;
    }
  }, [selectedUserId, dispatch]);

  useEffect(() => {
    if (selectedChannel) {
      dispatch(fetchAllGuests()).then(actionResult => {
        if (fetchAllGuests.fulfilled.match(actionResult)) {
          const guests = actionResult.payload;
          // Jetzt, da wir die Gästeliste haben, rufen wir die Chats für diese Gäste ab
          dispatch(fetchChatsForGuests({ guests, channelId: selectedChannel }));
        }
      });
    }
  }, [selectedChannel, dispatch]);
  
  

  const handleSelectedChannelChange = React.useCallback((channelId: string | null) => {
    setSelectedChannel(channelId);
  }, []);

  const onSend = (messagesToSend: any[] = []) => {
    if (selectedChannel && selectedUserId) {
      messagesToSend.forEach((message) => {
        dispatch(sendMessage(userId, selectedChannel, {
          _id: message._id,
          text: message.text,
          createdAt: new Date(), // Verwenden Sie serverTimestamp
          user: message.user,
        }));
      });
    }
  };
  

  if (!selectedChannel) {
    return <ChannelSelector onSelectChannel={(channelId) => handleSelectedChannelChange(channelId)} />;
  }

  if (selectedChannel && !selectedUserId) {
    return (
      <ScrollView>
        {guests?.map((guest) => (
          <TouchableOpacity key={guest.id} onPress={() => setSelectedUserId(guest.id)}>
            <Text>{guest.username}</Text> 
          </TouchableOpacity>
        ))}
        <Button title="Zurück zu Kanalauswahl" onPress={() => setSelectedChannel(null)} />
      </ScrollView>
    );
}

  
  // Nachdem ein Gast ausgewählt wurde und guestMessages vorhanden sind
  const selectedGuestMessages = guestMessages?.find(gm => gm.guestId === selectedUserId)?.messages || [];
   // Konvertieren und Vorbereiten der Nachrichten für GiftedChat
   const formattedMessages = selectedGuestMessages.map(msg => {
    const createdAtValue = msg.createdAt;
    // Prüfen, ob createdAtValue ein Timestamp ist
    let createdAt;
    if (createdAtValue instanceof firebase.firestore.Timestamp) {
      createdAt = createdAtValue.toDate();
    } else if (createdAtValue) {
      // Manchmal könnte es vorkommen, dass das Objekt zwar die toDate Funktion hat, aber keine Instanz von Timestamp ist
      createdAt = new Date(createdAtValue);;
    } else {
      // Wenn createdAtValue ein Date ist oder in einem anderen Format vorliegt, das konvertiert werden muss
      createdAt = new Date(createdAtValue);
    }
  
    return {
      ...msg,
      createdAt,
      user: {
        ...msg.user,
        _id: msg.user._id || "fallbackUserId",
      },
    };
  });
  
  

  return (
    <View style={{ flex: 1 }}>
    {selectedUserId ? (
      <>
        <GiftedChat
          messages={formattedMessages}
          onSend={messagesToSend => onSend(messagesToSend)}
          user={{
            _id: userId,
          }}
        />
        <Button title="Zurück zur Gästeliste" onPress={() => setSelectedUserId(null)} />
      </>
    ) : (
      // UI für die Anzeige der Gästeliste
      <ScrollView>
        {guests?.map((guest) => (
          <TouchableOpacity key={guest.id} onPress={() => setSelectedUserId(guest.id)}>
            <Text>{guest.username}</Text>
          </TouchableOpacity>
        ))}
        <Button title="Zurück zu Kanalauswahl" onPress={() => setSelectedChannel(null)} />
      </ScrollView>
    )}
  </View>
  );
};

export default EmployeeChatScreen;
