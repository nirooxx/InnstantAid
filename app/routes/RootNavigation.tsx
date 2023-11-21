import React, { useEffect } from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
// import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import { useDispatch } from "react-redux";
// import {useSelector, useDispatch} from 'react-redux';

// Hook for theme change (Light/Dark Mode)
import { useTheme } from "../theme/useTheme";
// Get Value from Keyring (Encrypted token)
import { getSecureValue } from "../utils/keyChain";
// Redux slice for updating Access Token to store
import { updateToken } from "../store/userSlice";

// import {RootState} from '../store/store';

// Screens
// import Login from '../screens/auth/Login';
import Tasks from "../screens/Tasks";
import Login from "../screens/auth/Login";
import Register from "../screens/auth/Register";
import Dashboard from "../screens/dashboard/Dashboard";
import Settings from "../screens/Settings";
import ReservationPage from "../screens/reservation/ReservationPage";

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 10,
    left: 20,
    right: 20,
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
    flex: 1,
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
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === "Tasks") {
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
          tabBarStyle: styles.tabBar,
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
        <Tab.Screen name="Tasks" component={Tasks} />
        <Tab.Screen name="Dashboard" component={Dashboard} />
        <Tab.Screen
          name="Reservations"
          component={ReservationPage}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="ios-calendar" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen name="Settings" component={Settings} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
