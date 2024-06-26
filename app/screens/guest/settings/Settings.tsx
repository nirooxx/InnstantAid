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

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const userState = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  type navigationProp = StackNavigationProp<RootStackParamList, "Settings">;
  const navigation = useNavigation<navigationProp>();

  const handleLogout = () => {
    removeSecureValue("token");
    dispatch(clearUser());
    navigation.navigate("Login");
  };

  const handleLoginOrRegister = () => {
    if (userState.token) {
      handleLogout();
    } else {
      navigation.navigate("Login");
    }
  };

  const handleReservations = () => {
    navigation.navigate("TableReservationsList");
  };

  const handleOrders = () => {
    navigation.navigate("OrderedList");
  };

  const handleSpaBookings = () => {
    navigation.navigate("SpaBookingsList");
  };

  return (
    <Layout>
      <ScrollView
        style={[styles.contentContainer, { backgroundColor: theme.layoutBg }]}
        contentContainerStyle={styles.scrollContainer}
      >
        <Card style={[styles.card, { backgroundColor: theme.cardBg }]}>
          <View style={styles.avatarRow}>
            <Image source={avatar} style={styles.avatar} />
            <View>
              <Text style={[styles.text, { color: theme.color }]}>
                {userState.name || "Gast"}
              </Text>
              <Text style={[styles.text, { color: theme.color }]}>
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
                style={styles.switch}
              />
            }
          />
        </Card>
      </ScrollView>
    </Layout>
  );
};

export default Settings;

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#F7FAFC',
  },
  scrollContainer: {
    paddingBottom: 16,
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
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
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
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
  switch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 16,
  },
});
