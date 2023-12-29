import React, { useEffect } from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
// import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import { useDispatch } from "react-redux";
// import {useSelector, useDispatch} from 'react-redux';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
// Hook for theme change (Light/Dark Mode)
import { useTheme } from "../theme/useTheme";
// Get Value from Keyring (Encrypted token)
import { getSecureValue } from "../utils/keyChain";
// Redux slice for updating Access Token to store
import { updateToken } from "../store/userSlice";

import { RootStackParamList } from "./types";
// import {RootState} from '../store/store';
import { createStackNavigator } from "@react-navigation/stack";
// Screens

// import Login from '../screens/auth/Login';
import Chat from "../screens/chat/ChatScreen";
import Login from "../screens/auth/Login";
import Register from "../screens/auth/Register";
import Dashboard from "../screens/dashboard/Dashboard";
import Settings from "../screens/Settings";
import ReservationPage from "../screens/reservation/ReservationPage";
import BookingConfirmationPage from "../screens/reservation/components/BookingConfirmationPage";

const styles = StyleSheet.create({
  tabBar: {
    position: "relative",
    elevation: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    height: 65,
    shadowColor: "#333",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  tabButton: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 30,
    height: 30,
  },
});

// Root Navigation
// const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<RootStackParamList>();

function ReservationStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Reservations"
        component={ReservationPage}
        options={{ headerShown: false }} // Header für diesen Screen ausschalten
      />
      <Stack.Screen
        name="BookingConfirmationPage"
        component={BookingConfirmationPage}
        options={{ headerShown: false }} // Auch hier den Header ausschalten
      />
    </Stack.Navigator>
  );
}

export default function RootNavigation() {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  // const user = useSelector((state: RootState) => state.user);

  // Copy existing token from local storage to redux store
  useEffect(() => {
    async function checkIsLogined() {
      try {
        let temp = await getSecureValue("token");
        dispatch(updateToken({ token: temp }));
      } catch (e) {}
    }
    checkIsLogined();
  }, [dispatch]);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <SafeAreaView style={{ flex: 1 }}>
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
                ...styles.tabBar,
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
                  style={styles.tabButton}
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
            <Tab.Screen name="Chat" component={Chat} />
            <Tab.Screen name="Dashboard" component={Dashboard} />
            <Tab.Screen
              name="Reservations"
              component={ReservationStack}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Icon name="ios-calendar" size={size} color={color} />
                ),
              }}
            />

            <Tab.Screen name="Settings" component={Settings} />
          </Tab.Navigator>
        </SafeAreaView>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
