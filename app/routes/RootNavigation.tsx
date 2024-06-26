import React, { useEffect } from "react";
import { TouchableOpacity, View, StyleSheet, SafeAreaView } from "react-native";
import { NavigationContainer, useIsFocused } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider, useSafeAreaInsets  } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../theme/useTheme";
import { getSecureValue } from "../utils/keyChain";
import { updateToken } from "../store/userSlice";
import { RootState } from "../store/store";


// Importieren Sie Ihre Bildschirmkomponenten
import LoginScreen from "../screens/pages/LoginScreen";
import RegisterScreen from "../screens/pages/RegisterScreen";
import ChatScreen from "../screens/guest/chat/ChatScreen";
import GuestDashboard from "../screens/guest/dashboard/GuestDashboard";
import SettingsScreen from "../screens/guest/settings/Settings";
import GuestInformationCard from "../screens/guest/dashboard/roomDetails/guestInformationScreen/GuestInformationCard";
import EventsScreen from "../screens/guest/dashboard/eventsSection/EventsScreen";
import EventDetail from "../screens/guest/dashboard/eventsSection/EventDetail";

import ReservationsScreen from "../screens/guest/reservation/ReservationsScreen";
import TableReservationScreen from "../screens/guest/reservation/reservationScreen/tableReservation/TableReservationScreen";
import SpaBookingScreen from "../screens/guest/reservation/spaBookingScreen/SpaBookingScreen";
import BookingScreen from "../screens/guest/reservation/reservationScreen/tableReservation/bookingScreen/BookingScreen";
import ConfirmationScreen from "../screens/guest/reservation/reservationScreen/tableReservation/bookingScreen/ConfirmationScreen";
import TableReservationsList from "../screens/guest/reservation/reservationScreen/tableReservation/bookingScreen/TableReservationsList";
import SpaServiceDetail from "../screens/guest/reservation/spaBookingScreen/components/SpaServiceDetail";
import SpaBookingsList from "../screens/guest/reservation/spaBookingScreen/components/SpaBookingsList";
import HousekeepingScreen from "../screens/guest/reservation/housekeeping/HousekeepingScreen";
import RequestRoomCleanScreen from "../screens/guest/reservation/housekeeping/components/RequestRoomCleanScreen";
import RoomCleanFrequencyScreen from "../screens/guest/reservation/housekeeping/components/RoomCleanFrequencyScreen";
import MaintenanceScreen from "../screens/guest/reservation/housekeeping/components/MaintenanceScreen";

import MenuItemDetailsScreen from "../screens/guest/reservation/reservationScreen/roomServiceOrder/MenuItemDetailsScreen";
import MenuScreen from "../screens/guest/reservation/reservationScreen/roomServiceOrder/MenuScreen";
import CartScreen from "../screens/guest/reservation/reservationScreen/roomServiceOrder/CartScreen";
import CheckoutScreen from "../screens/guest/reservation/reservationScreen/roomServiceOrder/CheckoutScreen";
import ConfirmCheckoutScreen from "../screens/guest/reservation/reservationScreen/roomServiceOrder/ConfirmCheckoutScreen"
import OrderedList from "../screens/guest/reservation/reservationScreen/roomServiceOrder/OrderedList";

import LandingPage from "../screens/employee/schedule/LandingPage";
import ReservationManagementScreen from "../screens/employee/reservations/ReservationManagementScreen";
import EmployeeSettingsScreen from "../screens/employee/settings/EmployeeSettingsScreen";
import SpaBookingManagementScreen from "../screens/employee/spabookings/SpaBookingManagementScreen";
import HousekeepingView from "../screens/employee/housekeeping/HousekeepingView";

import EmployeeDashboardScreen from "../screens/employee/dashboard/EmployeeDashboardScreen"
import ScheduleScreen from "../screens/employee/schedule/ScheduleScreen"
import TaskListScreen from "../screens/employee/tasks/TaskListScreen";
import ShiftDetailScreen from "../screens/employee/schedule/components/ShiftDetailScreen";
import EmployeeChatScreen from "../screens/employee/chat/EmployeeChatScreen";

import { RootStackParamList } from './types';
// Styles für die Tab Bar
const tabBarStyles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,  // Setzen Sie bottom auf 0, um sicherzustellen, dass keine Lücke besteht.
    left: 0,
    right: 0,
    elevation: 0,
    backgroundColor: '#ffffff',
    borderRadius: 0,  // Entfernen Sie den borderRadius, wenn Sie wollen, dass die TabBar bis zum Bildschirmrand geht.
    height: 60, // oder jede andere Höhe für Ihre TabBar
    shadowColor: '#333',
    shadowOffset: { width: 0, height: -1 }, // Negative Y-Offset, um den Schatten oben zu zeichnen
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 30,
    height: 30,
  },
  label: {
    fontSize: 12,
    marginBottom: 5, // Abstand von Icon zu Label
  },
});

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function RootNavigation() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const { theme } = useTheme();
  const userRole = user?.role;

  useEffect(() => {
    async function checkIsLoggedIn() {
      const token = await getSecureValue("token");
      dispatch(updateToken({ token: token || "" }));
    }
    checkIsLoggedIn();
  }, [dispatch]);

  const isLoggedIn = Boolean(user?.token);

  function ReservationStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Reservations"
          component={ReservationsScreen}
         
        />
        <Stack.Screen
          name="SpaBookingScreen"
          component={SpaBookingScreen}
        
        />
         <Stack.Screen
          name="SpaServiceDetail"
          component={SpaServiceDetail}
         
        />
        <Stack.Screen
          name="TableReservationScreen"
          component={TableReservationScreen}
         
        />
         <Stack.Screen
          name="MenuItemDetailsScreen"
          component={MenuItemDetailsScreen}
          options={{ title: 'Menu' }}
        />
        <Stack.Screen
          name="MenuScreen"
          component={MenuScreen}
          options={{ title: 'Menu' }}
        />
        <Stack.Screen
          name="CartScreen"
          component={CartScreen}
          options={{ title: 'Cart' }}
        />
         <Stack.Screen
          name="CheckoutScreen"
          component={CheckoutScreen}
          options={{ title: 'Checkout' }}
        />
         <Stack.Screen
          name="ConfirmCheckoutScreen"
          component={ConfirmCheckoutScreen}
         
          initialParams={{ firstName: '', lastName: '', address: '', note: '', roomNumber:'' }}
        />
         <Stack.Screen
          name="OrderedList"
          component={OrderedList}
         
          
        />
           <Stack.Screen
          name="SpaBookingsList"
          component={SpaBookingsList}
         
          
        />
         <Stack.Screen
          name="BookingScreen"
          component={BookingScreen}
         
          initialParams={{ date: '', time: '', peopleCount: 1, name: '', roomNumber:'' }}
        />
         <Stack.Screen
          name="ConfirmationScreen"
          component={ConfirmationScreen}
         
          initialParams={{ reservationId: '' }}
        />
         <Stack.Screen
          name="TableReservationsList"
          component={TableReservationsList}
         
          
        />
         <Stack.Screen
          name="HousekeepingScreen"
          component={HousekeepingScreen}
        />
         <Stack.Screen
          name="RequestRoomCleanScreen"
          component={RequestRoomCleanScreen}
        />
        
         <Stack.Screen
          name="RoomCleanFrequencyScreen"
          component={RoomCleanFrequencyScreen}
        />
         <Stack.Screen
          name="MaintenanceScreen"
          component={MaintenanceScreen}
        />
      </Stack.Navigator>
    );
  }

  function GuestDashboardStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="GuestDashboard" component={GuestDashboard} options={{ headerShown: false }}/>
        <Stack.Screen
        name="EventsScreen"
        component={EventsScreen}
      />
       <Stack.Screen name="EventDetail" component={EventDetail} />
        <Stack.Screen name="GuestInformationCard" component={GuestInformationCard}   
        initialParams={{    guestName:'string',
          roomName:'string',
          companyName:'string',
          checkIn:'string',
          checkOut:'string',
          status:'string',
          notes:'string', }}/>
    
      </Stack.Navigator>
    );
  }

  function EmployeeStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Angestellten Dashboard" component={EmployeeDashboardScreen}  options={{ headerShown: false }}/>
        <Stack.Screen name="ScheduleScreen" component={ScheduleScreen}  options={{ headerShown: false }}/>
        <Stack.Screen name="TaskListScreen" component={TaskListScreen}  options={{ headerShown: false }}/>
        <Stack.Screen name="ReservationManagementScreen" component={ReservationManagementScreen}  options={{ headerShown: false }}/>
        <Stack.Screen name="SpaBookingManagementScreen" component={SpaBookingManagementScreen}  options={{ headerShown: false }}/>
        <Stack.Screen name="ShiftDetailScreen" component={ShiftDetailScreen} initialParams={{ shiftId: '', role: '' }}  options={{ headerShown: false }}/>
        <Stack.Screen name="HousekeepingView" component={HousekeepingView}  options={{ headerShown: false }}/>

      </Stack.Navigator>
    );
  }

  function GuestChatStack() {
    return (
      <Stack.Navigator>

        <Stack.Screen name="ChatGuest" component={ChatScreen}  options={{ headerShown: false }}/>
        <Stack.Screen name="GuestDashboard" component={GuestDashboard}  options={{ headerShown: false }}/>

      </Stack.Navigator>
    );
  }

  function EmployeeScheduleStack() {
    return (
      <Stack.Navigator>
       <Stack.Screen name="Organisation" component={LandingPage}  options={{ headerShown: false }}/>
        <Stack.Screen name="ScheduleScreen" component={ScheduleScreen}  />
        <Stack.Screen name="TaskListScreen" component={TaskListScreen}  />
        <Stack.Screen name="ShiftDetailScreen" component={ShiftDetailScreen} initialParams={{ shiftId: '', role: '' }}  />
        {/* Weitere Bildschirme */}
      </Stack.Navigator>
    );
  }
  

  // EmployeeNavigator
const EmployeeNavigator = () => {
  
  return (
 


    <Tab.Navigator
    screenOptions={({ route }) => ({
      keyboardHidesTabBar: false,
      tabBarIcon: ({ color, size }) => {
        let iconName;
        if (route.name === "Chat") {
          iconName = "ios-list-sharp";
        } else if (route.name === "Dashboard") {
          iconName = "ios-home-sharp";
        } else if (route.name === "Settings") {
          iconName = "ios-settings-sharp";
        }
        return (
          <Icon
            name={iconName ? iconName : "ios-list-sharp"}
            size={size}
            color={color}
          />
        ); // Verwenden Sie die iconName Variable hier
      },
      tabBarStyle: {
        display: route.name === 'Chat' && useIsFocused() ? 'none' : 'flex',
        height: 65, // Setzen Sie die Höhe der TabBar
      },
      tabBarActiveTintColor: "#4B76E4",
      tabBarInactiveTintColor: "#A5A5A5",
      tabBarLabelStyle: {
        fontSize: 12,
      },
      tabBarButton: (props: any) => (
        <TouchableOpacity
          style={tabBarStyles.tabButton}
          onPress={() => {
            if (props.onPress) {
              props.onPress();
            }
          }}
        >
          {props.children}
        </TouchableOpacity>
      ),

      tabBarShowLabel: false,
      // Entfernen Sie headerMode, da es nicht zu BottomTabNavigationOptions gehört
    })}
  >
      <Tab.Screen name="Dashboard" options={{ headerShown: false }} component={EmployeeStack} />
    <Tab.Screen name="Chat" options={{ headerShown: false }} component={EmployeeChatScreen} />
    <Tab.Screen name="Reservation" options={{ headerShown: false }} component={EmployeeScheduleStack} />
    <Tab.Screen name="Settings" options={{ headerShown: false }} component={EmployeeSettingsScreen} />
  </Tab.Navigator>

 

  );
}

// GuestNavigator
const GuestNavigator = () => {
  return (
 
  
    <Tab.Navigator
     
              screenOptions={({ route }) => ({
                tabBarHideOnKeyboard: true,
                tabBarIcon: ({ color, size }) => {
                  let iconName;
                  if (route.name === "Chat") {
                    iconName = "ios-list-sharp";
                  } else if (route.name === "Dashboard") {
                    iconName = "ios-home-sharp";
                  } else if (route.name === "Settings") {
                    iconName = "ios-settings-sharp";
                  }
                  return (
                    <Icon
                      name={iconName ? iconName : "ios-list-sharp"}
                      size={size}
                      color={color}
                    />
                  ); // Verwenden Sie die iconName Variable hier
                },
                tabBarStyle: {
                  height: 65,
                  display: route.name === 'Chat' && useIsFocused() ? 'none' : 'flex', // Conditionally hide the tab bar
                },
                tabBarActiveTintColor: "#4B76E4",
                tabBarInactiveTintColor: "#A5A5A5",
                tabBarLabelStyle: {
                  fontSize: 12,
                },
                tabBarButton: (props: any) => (
                  <TouchableOpacity
                    style={tabBarStyles.tabButton}
                    onPress={() => {
                      if (props.onPress) {
                        props.onPress();
                      }
                    }}
                  >
                    {props.children}
                  </TouchableOpacity>
                ),

                tabBarShowLabel: false,
                // Entfernen Sie headerMode, da es nicht zu BottomTabNavigationOptions gehört
              })}
              
            >
               <Tab.Screen name="Dashboard" options={{ headerShown: false }} component={GuestDashboardStack} />
               <Tab.Screen name="Reservation" options={{ headerShown: false }} component={ReservationStack} />
               <Tab.Screen name="Chat" options={{ headerShown: false }} component={GuestChatStack} />
           
              <Tab.Screen name="Settings" options={{ headerShown: false }} component={SettingsScreen} />
            </Tab.Navigator>
           

          
  );
}

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                  let iconName;
                  if (route.name === "Chat") {
                    iconName = "ios-list-sharp";
                  } else if (route.name === "Dashboard") {
                    iconName = "ios-home-sharp";
                  } else if (route.name === "Settings") {
                    iconName = "ios-settings-sharp";
                  }
                  return (
                    <Icon
                      name={iconName ? iconName : "ios-list-sharp"}
                      size={size}
                      color={color}
                    />
                  ); // Verwenden Sie die iconName Variable hier
                },
                tabBarStyle: {
                  ...tabBarStyles.tabBar,
                  // Entfernen Sie bottom: 10 und fügen Sie die SafeArea-Unterstützung hinzu
                  height: 65, // Setzen Sie die Höhe der TabBar
                },
                tabBarActiveTintColor: "#4B76E4",
                tabBarInactiveTintColor: "#A5A5A5",
                tabBarLabelStyle: {
                  fontSize: 12,
                },
                tabBarButton: (props: any) => (
                  <TouchableOpacity
                    style={tabBarStyles.tabButton}
                    onPress={() => {
                      if (props.onPress) {
                        props.onPress();
                      }
                    }}
                  >
                    {props.children}
                  </TouchableOpacity>
                ),

                tabBarShowLabel: false,
                // Entfernen Sie headerMode, da es nicht zu BottomTabNavigationOptions gehört
              })}
            >
              <Tab.Screen name="Dashboard" options={{ headerShown: false }} component={GuestDashboardStack} />
              <Tab.Screen name="Chat" options={{ headerShown: false }} component={ChatScreen} />
              <Tab.Screen name="Reservation" options={{ headerShown: false }} component={ReservationStack} />
              <Tab.Screen name="Settings" options={{ headerShown: false }} component={SettingsScreen} />
            </Tab.Navigator>
  );
}




  // Funktion zur Auswahl der korrekten Navigationsstruktur basierend auf der Rolle
  const renderNavigationBasedOnRole = (role:String) => {
    switch (role) {
      case 'employee':
        return <EmployeeNavigator />;
      case 'guest':
        return <GuestNavigator />;
      // ... weitere Fälle
      default:
        return <MainTabNavigator />;
    }
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>

          {!isLoggedIn ? (
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </Stack.Navigator>
          ) : (
          
             // Navigationsstruktur basierend auf der Benutzerrolle
             renderNavigationBasedOnRole(userRole)
          
          )}
  
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
