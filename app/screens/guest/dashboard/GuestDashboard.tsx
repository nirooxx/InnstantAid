import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store/store";
import EventsSection from "./eventsSection/EventsSection";
import EventsSectionTomorrow from "./eventsSection/EventsSectionTomorrow";
import RoomDetails from "./roomDetails/RoomDetails";
import HotelMap from "./hotelMap/HotelMap";
import SliderComponent from "./slider/SliderComponent";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fetchRoomStays } from '../../../store/graphqlSlice';
import { AppDispatch } from '../../../store/store';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from "../../../routes/types";
import { StackNavigationProp } from "@react-navigation/stack";
import { Event } from "../../../routes/types"; // Assuming Event type is defined here

type GuestDashboardNavigationProp = StackNavigationProp<RootStackParamList>;

const MemoizedEventsSection = React.memo(EventsSection);
const MemoizedEventsSectionTomorrow = React.memo(EventsSectionTomorrow);
const MemoizedRoomDetails = React.memo(RoomDetails);
const MemoizedHotelMap = React.memo(HotelMap);
const MemoizedSlider = React.memo(SliderComponent);

const Dashboard: React.FC = () => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<GuestDashboardNavigationProp>();
  const user = useSelector((state: RootState) => state.user);
  const roomStays = useSelector((state: RootState) => state.graphql.roomStays);
  const loading = useSelector((state: RootState) => state.graphql.loading);

  const [events, setEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState<boolean>(true);

  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  useEffect(() => {
    const todayISOString = new Date().toISOString().split('T')[0];
    const variables = {
      filter: {
        reservation_from: { le: todayISOString },
        reservation_to: { gt: todayISOString }
      },
      last: 100
    };
    dispatch(fetchRoomStays(variables));
  }, [dispatch]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('https://app.ticketmaster.com/discovery/v2/events.json', {
          params: {
            apikey: 'kpBr5NjSRyVWnRIvJfe3eJAQUTYz2MPc',
            city: 'Cologne',
            size: 80,
            unit: 'km',
            radius: '50'
          }
        });

        const events = response.data._embedded.events;

        const detailedEvents = [];
        const eventIds = new Set();

        for (const event of events) {
          if (eventIds.has(event.id)) {
            continue;
          }
          eventIds.add(event.id);

          const eventDetails = await axios.get(`https://app.ticketmaster.com/discovery/v2/events/${event.id}.json`, {
            params: {
              apikey: 'kpBr5NjSRyVWnRIvJfe3eJAQUTYz2MPc'
            }
          });

          detailedEvents.push({
            id: event.id,
            title: event.name,
            date: event.dates.start.localDate,
            time: event.dates.start.localTime,
            location: event._embedded.venues[0].name,
            image: event.images.length > 0 ? event.images[0].url : 'https://via.placeholder.com/150',
            details: eventDetails.data
          });

          // Wait for 200 milliseconds between requests to avoid rate limits
          await delay(200);
        }

        setEvents(detailedEvents);
      } catch (error: any) {
        if (error.response) {
          console.error('Error response:', error.response.data);
        } else if (error.request) {
          console.error('Error request:', error.request);
        } else {
          console.error('Error message:', error.message);
        }
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, []);

  const handleGuestInformationCard = (stay: any) => {
    console.log(stay)
    navigation.navigate('GuestInformationCard', {
      guestName: `${stay.first_guest?.firstname} ${stay.first_guest?.lastname}`,
      roomName: `${stay.roomName} - ${stay.category?.name} - ${stay.room_setup?.areaName}`,
      companyName: stay.reservation?.groupName || 'Keine Firmendaten',
      checkIn: stay.reservation_from,
      checkOut: stay.reservation_to,
      status: stay.reservation.status,
      notes: stay.guestMessage || 'Keine speziellen Hinweise',
      telephone: stay.reservation.client.telephone || 'Keine Telefonnummer',
      email: stay.reservation.client.email || 'Keine E-Mail-Adresse',
      street: stay.reservation.client.street || 'Keine Straßenangabe',
      zipcode: stay.reservation.client.zipcode || 'Keine Postleitzahl',
      city: stay.reservation.client.city || 'Kein Ort',
      country: stay.reservation.client.country || 'Kein Land',
      totalAmount: stay.gross,
      openAmount: stay.additionalSales,
      category: stay.category?.name,
      standardOccupancy: stay.category?.standardOccupancy,
      maxOccupancy: stay.category?.maxOccupancy,
      mealNotes: stay.mealNotes || 'Keine Mahlzeitenhinweise',
      maidNotes: stay.maidNotes || 'Keine Reinigungsnotizen',
      selfcheckout_enabled: stay.selfcheckout_enabled,
      selfcheckout_url: stay.selfcheckout_url
    });
};


  if (loading) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  if (loadingEvents) {
    return <ActivityIndicator style={styles.loadingIndicator} size="large" color="#5A67D8" />;
  }

  const filteredRoomStays = roomStays.filter((stay) => stay.roomName === user?.roomNumber);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.contentWrapper} contentContainerStyle={{ paddingBottom: insets.bottom + 70 }}>
        <View style={styles.header}>
          <Text style={styles.subGreeting}>Hallo, <Text style={styles.greetingName}>{filteredRoomStays[0]?.first_guest?.firstname}!</Text></Text>
          <Text style={styles.mainGreeting}>Willkommen im Palast Hotel.</Text>
        </View>
        <View style={styles.section}>
        <MemoizedSlider />
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Zimmerdetails</Text>
          {filteredRoomStays.map(stay => (
            <MemoizedRoomDetails
              key={stay.id}
              guestName={`${stay.first_guest?.firstname} ${stay.first_guest?.lastname}`}
              roomName={`${stay.roomName} - ${stay.category?.name} - ${stay.room_setup?.areaName}`}
              companyName={stay.reservation?.groupName}
              checkIn={stay.reservation_from}
              checkOut={stay.reservation_to}
              status={stay?.reservation?.status}
              notes={stay.guestMessage || 'Keine speziellen Hinweise'}
              onPress={() => handleGuestInformationCard(stay)}
            />
          ))}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hotelkarte</Text>
          <MemoizedHotelMap />
        </View>
        <View style={styles.section}>
          <MemoizedEventsSection events={events} onViewAll={() => navigation.navigate('EventsScreen', { events })}/>
          <MemoizedEventsSectionTomorrow events={events} onViewAll={() => navigation.navigate('EventsScreen', { events })}/>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: "#F8F9FD",
  },
  header: {
    padding: 16,
  },
  subGreeting: {
    fontSize: 16,
    color: '#666',
  },
  mainGreeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  greetingName: {
    fontWeight: 'bold',
    color: '#333',
  },
  contentWrapper: {
    paddingHorizontal: 16,
  },
  loadingText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 18,
    color: '#5A67D8',
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#5A67D8',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  mapImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  noEventsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default Dashboard;
