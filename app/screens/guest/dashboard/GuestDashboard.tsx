import React, { useEffect } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store/store";
import EventsSection from "./eventsSection/EventsSection";
import RoomDetails from "./roomDetails/RoomDetails";
import HotelMap from "./hotelMap/HotelMap";
import SliderComponent from "./slider/SliderComponent";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fetchRoomStays } from '../../../store/graphqlSlice';
import { AppDispatch } from '../../../store/store';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from "../../../routes/types";
import { StackNavigationProp } from "@react-navigation/stack";

type GuestDashboardNavigationProp = StackNavigationProp<RootStackParamList>;

const MemoizedEventsSection = React.memo(EventsSection);
const MemoizedRoomDetails = React.memo(RoomDetails);
const MemoizedHotelMap = React.memo(HotelMap);
const MemoizedSlider = React.memo(SliderComponent);

const events = [
  {
    id: "1",
    title: "Michael Malarkey",
    date: "12-03-2022",
    time: "Fri, 12:30 - 11:00 pm",
    location: "Pune, Maharashtra",
    image:
      "https://images.squarespace-cdn.com/content/v1/5a02ed1990badea68d9909d7/1582116436615-GIQU2A2QXWJV8YNQNRRM/Adelaide+Hall+2.jpg?format=2500w",
  },
  {
    id: "2",
    title: "Pu Shu",
    date: "12-03-2022",
    time: "Fri, 12:30 - 11:00 pm",
    location: "Goa, Mantra",
    image:
      "https://images.squarespace-cdn.com/content/v1/5a02ed1990badea68d9909d7/1582116436615-GIQU2A2QXWJV8YNQNRRM/Adelaide+Hall+2.jpg?format=2500w",
  },
];

const Dashboard: React.FC = () => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<GuestDashboardNavigationProp>();
  const user = useSelector((state: RootState) => state.user);
  const roomStays = useSelector((state: RootState) => state.graphql.roomStays);
  const loading = useSelector((state: RootState) => state.graphql.loading);

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

  const handleGuestInformationCard = (stay: any) => {
    navigation.navigate('GuestInformationCard', {
      guestName: `${stay.first_guest?.firstname} ${stay.first_guest?.lastname}`,
      roomName: `${stay.roomName} - ${stay.category?.name} - ${stay.room_setup?.areaName}`,
      companyName: stay.reservation?.groupName,
      checkIn: stay.reservation_from,
      checkOut: stay.reservation_to,
      status: stay.reservation.status,
      notes: stay.guestMessage || 'No special notes',
    });
  };

  if (loading) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  const filteredRoomStays = roomStays.filter((stay) => stay.roomName === user?.roomNumber);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.contentWrapper} contentContainerStyle={{ paddingBottom: insets.bottom + 70 }}>
        <View style={styles.contentWrapper}>
          <MemoizedSlider />
          {filteredRoomStays.map(stay => (
            <MemoizedRoomDetails
              key={stay.id}
              guestName={`${stay.first_guest?.firstname} ${stay.first_guest?.lastname}`}
              roomName={`${stay.roomName} - ${stay.category?.name} - ${stay.room_setup?.areaName}`}
              companyName={stay.reservation?.groupName}
              checkIn={stay.reservation_from}
              checkOut={stay.reservation_to}
              status={stay?.reservation?.status}
              notes={stay.guestMessage || 'No special notes'}
              onPress={() => handleGuestInformationCard(stay)}
            />
          ))}
          <MemoizedHotelMap />
          <MemoizedEventsSection events={events} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: "#FFFFFF",
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
  roomStayCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: '#5A67D8',
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 16,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    color: "#333",
    fontSize: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  backButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    borderWidth: 1,
    borderColor: "#D1D1D1",
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: "#f0f0f0",
  },
  searchIcon: {
    marginRight: 8,
    color: "#333",
  },
  menuButton: {
    padding: 8,
  },
  reservationCard: {
    margin: 10,
    padding: 10,
    backgroundColor: '#fff',
  },
  reservationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Dashboard;
