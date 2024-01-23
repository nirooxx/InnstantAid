import React, { useEffect } from "react";
import { TouchableOpacity, View, StyleSheet, SafeAreaView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../theme/useTheme";
import { getSecureValue } from "../utils/keyChain";
import { updateToken } from "../store/userSlice";
import { RootState } from "../store/store";

// Importieren Sie Ihre Bildschirmkomponenten
import LoginScreen from "../screens/pages/LoginScreen";
import RegisterScreen from "../screens/pages/RegisterScreen";
import ChatScreen from "../screens/chat/ChatScreen";
import GuestDashboard from "../screens/dashboard/Dashboard";
import SettingsScreen from "../screens/Settings";
import ReservationPage from "../screens/reservation/ReservationPage";
import BookingConfirmationPage from "../screens/reservation/components/BookingConfirmationPage";
import EmployeeDashboard from "../screens/dashboard/EmployeeDashboard";


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

  // EmployeeNavigator
const EmployeeNavigator = () => {
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
    <Tab.Screen name="Chat" component={ChatScreen} />
    <Tab.Screen name="Dashboard" component={EmployeeDashboard} />
    <Tab.Screen name="Reservation" component={ReservationPage} />
    <Tab.Screen name="Settings" component={SettingsScreen} />
  </Tab.Navigator>

  );
}

// GuestNavigator
const GuestNavigator = () => {
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
              <Tab.Screen name="Chat" component={ChatScreen} />
              <Tab.Screen name="Dashboard" component={GuestDashboard} />
              <Tab.Screen name="Reservation" component={ReservationPage} />
              <Tab.Screen name="Settings" component={SettingsScreen} />
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
              <Tab.Screen name="Chat" component={ChatScreen} />
              <Tab.Screen name="Dashboard" component={GuestDashboard} />
              <Tab.Screen name="Reservation" component={ReservationPage} />
              <Tab.Screen name="Settings" component={SettingsScreen} />
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
        <SafeAreaView style={{ flex: 1 }}>
          {!isLoggedIn ? (
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </Stack.Navigator>
          ) : (
             // Navigationsstruktur basierend auf der Benutzerrolle
             renderNavigationBasedOnRole(userRole)
          )}
        </SafeAreaView>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
