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
import { clearUser } from "../store/userSlice";
import { removeSecureValue } from "../utils/keyChain";
import { useTheme } from "../theme/useTheme";
import { useNavigation } from "@react-navigation/native";
import Layout from "../components/Layout";
import Card from "../components/Card";
import MenuItem from "../components/MenuItem";
import { RootState } from "../store/store";
import type { RootStackParamList } from "../routes/types";
import type { StackNavigationProp } from "@react-navigation/stack";

const avatar = require("../assets/images/avatar.png");

const Settings = () => {
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
          {/* ... other menu items ... */}
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

export default Settings;

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  header: {
    paddingLeft: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 40,
  },
  btnHamburger: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  avatarRow: {
    flexDirection: "row",
    marginBottom: 20,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    marginRight: 10,
  },
});
