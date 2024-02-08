import React, { useState, useEffect, useCallback } from 'react';
import { View, Button, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { GiftedChat, IMessage  } from 'react-native-gifted-chat';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import {
  sendMessage,
  subscribeToMessages,
  resetMessages,
  updateLastVisited, 
  fetchAllGuests,
  fetchChatsForGuests // Stellen Sie sicher, dass diese Aktion importiert wird
} from '../../../store/chatSlice'; // Pfad entsprechend anpassen
import ChannelSelector from './component/ChannelSelector'; // Pfad entsprechend anpassen
import { RootState, AppDispatch } from '../../../store/store';
import { RootStackParamList } from "../../../routes/types"; // Import your type definitions
import { StackNavigationProp } from "@react-navigation/stack";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type EmplyoeeChatNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ConfirmationScreen'
>;

// Definieren Sie einen Typ, der den Firestore Timestamp repräsentiert
interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}

// Definieren Sie Ihren Message-Typ, der createdAt als Date oder FirestoreTimestamp erlaubt
interface Message {
  _id: string;
  text: string;
  createdAt: Date ;
  user: {
    _id: string;
    name: string;
  };
}



const EmployeeChatScreen: React.FC = () => {
  const userId = useSelector((state: RootState) => state.user.id);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const guestMessages = useSelector((state: RootState) => state.chat.guestMessages);
  const guests = useSelector((state: RootState) => state.chat.guests);
  const navigation = useNavigation<EmplyoeeChatNavigationProp>();
  const isFocused = useIsFocused();
  // Initialisierung eines States für die Zählung ungelesener Nachrichten pro Channel
const [unreadCounts, setUnreadCounts] = useState<{ [key: string]: number }>({});
// Beispiel für einen initialen State, wenn lastVisited im Redux Store gespeichert wird
const initialLastVisitedState = {};

const lastVisited = useSelector((state: RootState) => state.chat.lastVisited) || initialLastVisitedState


useEffect(() => {
  const newUnreadCounts: { [key: string]: number } = {};
  guests?.forEach((guest) => {
    // Nehmen Sie an, dass Sie die guestMessages für den jeweiligen Gast haben
    const guestChannelMessages = guestMessages?.find(gm => gm.guestId === guest.id)?.messages || [];
    const lastVisitedTime = lastVisited[guest.id] || 0; // Zugriff auf lastVisited mit guest.id statt channelId
    const unreadMessages = guestChannelMessages.reduce((count, message) => {
      let messageTime: number;
    
      // Ensure msg.createdAt is an object and then check for 'seconds' and 'nanoseconds'
      if (message.createdAt && typeof message.createdAt === 'object' && 'seconds' in message.createdAt && 'nanoseconds' in message.createdAt) {
        const timestamp = message.createdAt as FirestoreTimestamp; // Cast to FirestoreTimestamp
        messageTime = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000).getTime();
      } else if (message.createdAt instanceof Date) {
        messageTime = message.createdAt.getTime();
      } else {
        // Fallback, if the format is not recognized or msg.createdAt is not set
        messageTime = new Date().getTime();
      }

    
      return messageTime > lastVisitedTime ? count + 1 : count;
    }, 0);
    
    

    newUnreadCounts[guest.id] = unreadMessages; // Verwenden Sie guest.id, um die Anzahl der ungelesenen Nachrichten zu speichern
  });

  setUnreadCounts(newUnreadCounts);
}, [ lastVisited, guests]); // Fügen Sie guests zu den Abhängigkeiten hinzu -> guestMessages


  useEffect(() => {
    if (isFocused) {
      setSelectedChannel(null)
      setSelectedUserId(null)
      // Stellen Sie sicher, dass Sie zum obersten Screen navigieren, wenn dieser Tab fokussiert wird
    //  navigation.popToTop();
    }
  }, [isFocused, navigation]);

  useEffect(() => {
    if (selectedUserId && selectedChannel) {
      dispatch(resetMessages());
      const unsubscribe = dispatch(subscribeToMessages(selectedUserId, selectedChannel))();
      return unsubscribe;
    }
  }, [selectedUserId, selectedChannel, dispatch]);

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
  }, [selectedChannel]);   // -> guestMessages
  

  const handleSelectedChannelChange = React.useCallback((channelId: string | null) => {
    setSelectedChannel(channelId);
  }, []);

  // Beim Öffnen eines Chats in der EmployeeChatScreen-Komponente
const handleOpenChat = (guestId:string, channelId: string) => {
  // Aktuellen Unix-Zeitstempel in Millisekunden setzen

  const timestamp = Date.now();
  dispatch(updateLastVisited({ channelId, timestamp }));
 setSelectedUserId(guestId);
};


  const onSend = useCallback((messagesToSend: IMessage[] = []) => {
    messagesToSend.forEach((message) => {
      const messageToSend = {
        ...message,
        // Erstellen Sie ein neues Date-Objekt für createdAt
        createdAt: new Date(),
        user: {
          _id: userId.toString(), // Stellen Sie sicher, dass _id ein String ist
          name: "Benutzername", // Oder den tatsächlichen Namen des Benutzers
        },
        _id: message._id.toString(), // Konvertieren Sie _id in einen String, falls erforderlich
        // Stellen Sie sicher, dass alle optionalen Felder korrekt behandelt werden
      };
  
      if (selectedUserId && selectedChannel) {
        dispatch(sendMessage(selectedUserId, selectedChannel, messageToSend));
      }
    });
  }, [dispatch, selectedUserId, selectedChannel, userId]);
  
  
  
 
  if (!selectedChannel) {
    // Bereiten Sie das hasUnreadMessages Objekt für ChannelSelector vor

  
    return (
      <ChannelSelector
        onSelectChannel={(channelId) => handleSelectedChannelChange(channelId)}

      />
    );
  }
  

  if (selectedChannel && !selectedUserId) {
    return (
      <ScrollView>
        {guests?.map((guest) => {
          // Finden der Nachrichten für den jeweiligen Gast
          const guestChannelMessages = guestMessages?.find(gm => gm.guestId === guest.id)?.messages || [];
          const lastVisitedTime = lastVisited[selectedChannel] || 0;
          // Sortieren der Nachrichten, um die neueste zu finden
          const sortedMessages = [...guestChannelMessages].sort((a: any, b: any) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateB - dateA;
          });
    
          const lastMessage = sortedMessages[0]?.text || 'Keine Nachrichten';
          const lastMessageTime = sortedMessages[0] ? new Date(sortedMessages[0].createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '';
console.log(lastMessageTime)
          // Prüfen, ob es ungelesene Nachrichten gibt
          const hasUnreadMessages = guestChannelMessages.some(message => new Date(message.createdAt).getTime() > lastVisitedTime);

          return (
            <TouchableOpacity key={guest.id} onPress={() => handleOpenChat(guest.id, selectedChannel)} style={styles.chatItem}>
              <Image source={{ uri: "data:image/jpeg;base64,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" }} style={styles.avatar} />
              <View style={styles.textContainer}>
                <Text style={styles.username}>{guest.username}</Text>
                <Text style={styles.lastMessage}>{lastMessage}</Text>
              </View>
              <Text style={styles.time}>{lastMessageTime}</Text>
              {hasUnreadMessages && <View style={styles.unreadIndicator} />}
            </TouchableOpacity>
          );
        })}
        <Button title="Zurück zu Kanalauswahl" onPress={() => setSelectedChannel(null)} />
      </ScrollView>
    );
  }


  
  // Nachdem ein Gast ausgewählt wurde und guestMessages vorhanden sind
  const selectedGuestMessages = guestMessages?.find(gm => gm.guestId === selectedUserId)?.messages || [];
   // Konvertieren und Vorbereiten der Nachrichten für GiftedChat
   const formattedMessages = selectedGuestMessages.map((msg): Message => {
    let createdAtDate: Date;
  
    // Ensure msg.createdAt is an object and then check for 'seconds' and 'nanoseconds'
    if (msg.createdAt && typeof msg.createdAt === 'object' && 'seconds' in msg.createdAt && 'nanoseconds' in msg.createdAt) {
      const timestamp = msg.createdAt as FirestoreTimestamp; // Cast to FirestoreTimestamp
      createdAtDate = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
    } else if (msg.createdAt instanceof Date) {
      createdAtDate = msg.createdAt;
    } else {
      // Fallback, if the format is not recognized or msg.createdAt is not set
      createdAtDate = new Date();
    }
  
    return {
      ...msg,
      createdAt: createdAtDate,
      user: {
        ...msg.user,
        _id: msg.user._id || "fallbackUserId",
      },
    };
  }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  
  
  
  
  
  
  
  

  return (
    <View style={{ flex: 1 }}>
    {selectedUserId ? (
      <>
        <GiftedChat
          messages={formattedMessages}
          onSend={messagesToSend => onSend(messagesToSend)}
          user={{
            _id: userId,
            name: "Rezeption",
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

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
    backgroundColor: '#ffffff', // oder jede andere Farbe, die das Design verlangt
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
