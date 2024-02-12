import React from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Switch,
  Image,
  TouchableOpacity,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../../../store/userSlice";
import { removeSecureValue } from "../../../utils/keyChain";
import { useTheme } from "../../../theme/useTheme";
import { useNavigation } from "@react-navigation/native";
import Layout from "../../../components/Layout";
import Card from "../../../components/Card";
import MenuItem from "../../../components/MenuItem";
import { RootState } from "../../../store/store";
import type { RootStackParamList } from "../../../routes/types";
import type { StackNavigationProp } from "@react-navigation/stack";

const avatar = require("../../../assets/images/avatar.png");

const EmployeeSettingsScreen = () => {
  const { theme, toggleTheme } = useTheme();
  const userState = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  type navigationProp = StackNavigationProp<RootStackParamList, "Settings">;
  const navigation = useNavigation<navigationProp>();

  const handleLogout = () => {
    removeSecureValue("token");
    dispatch(clearUser());
    // Navigate to login screen after logout
    navigation.navigate("Login");
  };

  const handleLoginOrRegister = () => {
    // Check if user is logged in
    if (userState.token) {
      handleLogout();
    } else {
      // Navigate to login screen if not logged in
      navigation.navigate("Login");
    }
  };

  const handleReservations = () => {
    // Navigiere zur TableReservationsList Komponente
    navigation.navigate("ReservationManagementScreen");
  };

  const handleOrders = () => {
    // Navigiere zur TableReservationsList Komponente
    navigation.navigate("OrderedList");
  };

  const handleSpaBookings = () => {
    // Navigiere zur TableReservationsList Komponente
    navigation.navigate("SpaBookingsList");
  };

  return (
    <Layout>
      <ScrollView
        style={[styles.contentContainer, { backgroundColor: theme.layoutBg }]}
      >
        <Card style={{ backgroundColor: theme.cardBg }}>
          <View style={styles.avatarRow}>
            <Image source={avatar} style={styles.avatar} />
            <View>
              <Text style={{ color: theme.color }}>
                {userState.name || "Gast"}
              </Text>
              <Text style={{ color: theme.color }}>
                {userState.username || "Bitte einloggen"}
              </Text>
            </View>
          </View>
          <MenuItem
            label="Reservierungen"
            onPress={handleReservations}
          />
           <MenuItem
            label="Bestellungen"
            onPress={handleOrders}
          />
            <MenuItem
            label="Buchungen"
            onPress={handleSpaBookings}
          />
          <MenuItem
            label={userState.token ? "Logout" : "Login / Register"}
            onPress={handleLoginOrRegister}
          />
          {/* ... other menu items ... */}
          <MenuItem
            label="Dark Mode"
            onPress={() => toggleTheme(theme.name !== "dark")}
            rightItem={
              <Switch
                value={theme.name === "dark"}
                onValueChange={() => toggleTheme(theme.name !== "dark")}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={theme.name === "dark" ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
              />
            }
          />
          {/* ... other menu items ... */}
        </Card>
      </ScrollView>
    </Layout>
  );
};

export default EmployeeSettingsScreen;

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
  },
  header: {
    paddingLeft: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  btnHamburger: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: 'transparent',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  menuItemText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  switch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 16,
  },
});
