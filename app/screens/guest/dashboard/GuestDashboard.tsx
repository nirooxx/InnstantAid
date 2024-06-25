import React, { useEffect } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store/store";

// Importieren der neuen EventsSection-Komponente
import EventsSection from "./eventsSection/EventsSection";
import RoomDetails from "./roomDetails/RoomDetails";
import HotelMap from "./hotelMap/HotelMap";
import slider from "./slider/SliderComponent";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fetchReservations, fetchRoomStays } from '../../../store/graphqlSlice';
import { AppDispatch } from '../../../store/store';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from "../../../routes/types"; // Import your type definitions
import { StackNavigationProp } from "@react-navigation/stack";

type GuestDashboardNavigationProp = StackNavigationProp<
  RootStackParamList
>;

const MemoizedEventsSection = React.memo(EventsSection);
const MemoizedRoomDetails = React.memo(RoomDetails);
const MemoizedHotelMap = React.memo(HotelMap);
const MemoizedSlider = React.memo(slider);

const events = [
  // Dummy-Daten für die Veranstaltungen
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
  // ... Weitere Veranstaltungen
];

const Dashboard: React.FC = () => {
  //const users = useSelector((state: RootState) => state.user);
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<GuestDashboardNavigationProp>();
 // const reservations = useSelector((state: RootState) => state.graphql.reservations);
 const user = useSelector((state: RootState) => state.user);
  const roomStays = useSelector((state: RootState) => state.graphql.roomStays);
  const loading = useSelector((state: RootState) => state.graphql.loading);
  

 //console.log(roomStays.length, roomStays[0])
  useEffect(() => {
    const todayISOString = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'

  const variables = {
    filter: {
          reservation_from: {
            le: todayISOString
          },
          reservation_to: {
            gt: todayISOString
          }
    },
    last: 100
  };
   // dispatch(fetchReservations({ first: 10 }));
    dispatch(fetchRoomStays(variables));
  }, [dispatch]);

  const handleGuestInformationCard = (stay:any) => {
    console.log(stay)
    // Übergabe der Reservierungsdaten an die BookingScreen Komponente
    navigation.navigate('GuestInformationCard',{
      guestName: stay.first_guest?.firstname + ' ' + stay.first_guest?.lastname,
            roomName: stay.roomName + '-' + stay.category?.name + '-' + stay.room_setup?.areaName,
            companyName: stay.reservation?.groupName,
            checkIn: stay.reservation_from,
            checkOut:stay.reservation_to,
            status:stay.reservation.status,
            notes:stay.guestMessage || 'No special notes',
    } );
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  const filteredRoomStays = roomStays.filter(stay => stay.roomName === user?.roomNumber);

  return (
    <SafeAreaView style={styles.container} >
      <ScrollView style={styles.contentWrapper} contentContainerStyle={{ paddingBottom: insets.bottom +70}}>
        <View style={styles.contentWrapper}>
         

          {/* Verwendung der Slider-Komponente */}
          <MemoizedSlider />
          {/* Verwendung der RoomDetails-Komponente */}
          {filteredRoomStays.map(stay => (
          <MemoizedRoomDetails
          key={stay.id}
            guestName={stay.first_guest?.firstname + ' ' + stay.first_guest?.lastname}
            roomName = {stay.roomName + '-' + stay.category?.name + '-' + stay.room_setup?.areaName}
            companyName ={stay.reservation?.groupName}
            checkIn ={stay.reservation_from}
            checkOut={stay.reservation_to}
            status={stay?.reservation?.status}
            notes={stay.guestMessage || 'No special notes'}
            onPress={() => handleGuestInformationCard(stay)}
          />
          ))}
          {/* Verwendung der HotelMap-Komponente */}

          <MemoizedHotelMap />

          {/* Verwendung der EventsSection-Komponente */}
          <MemoizedEventsSection events={events} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: "#FFFFFF", // Weißer Hintergrund
  },
  contentWrapper: {
    paddingHorizontal: wp("1%"),
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
    fontWeight: "bold"
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: hp("2%"), // 2% der Bildschirmhöhe
  },
  searchInput: {
    flex: 1,
    paddingVertical: hp("1%"), // 1% der Bildschirmhöhe
    paddingHorizontal: wp("4%"), // 4% der Bildschirmbreite
    color: "#333",
    fontSize: wp("4%"), // Dynamische Schriftgröße basierend auf der Bildschirmbreite
    backgroundColor: "#f0f0f0", // Hellgrauer Hintergrund für den Input
    borderRadius: wp("2%"), // 2% der Bildschirmbreite
  },
  backButton: {
    padding: wp("2%"), // 2% der Bildschirmbreite
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    borderWidth: 1,
    borderColor: "#D1D1D1",
    borderRadius: wp("3%"), // 3% der Bildschirmbreite
    paddingHorizontal: wp("2%"), // 2% der Bildschirmbreite
    backgroundColor: "#f0f0f0",
  },
  searchIcon: {
    marginRight: wp("2%"), // 2% der Bildschirmbreite
    color: "#333",
  },
  menuButton: {
    padding: wp("2%"), // 2% der Bildschirmbreite
  },
  reservationCard: {
    margin: 10,
    padding: 10,
    backgroundColor: '#fff',
    // Add more styling as needed for your reservation card
  },
  reservationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    // Add more styling as needed for your reservation title
  },
});

export default Dashboard