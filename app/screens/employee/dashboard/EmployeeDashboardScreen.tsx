// EmployeeDashboardScreen.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../routes/types"; // Importieren Sie Ihre Typdefinitionen
import { StackNavigationProp } from "@react-navigation/stack";

type ReservationDetailNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ScheduleScreen"
>;

const EmployeeDashboardScreen: React.FC = () => {
  const navigation = useNavigation<ReservationDetailNavigationProp>();

  const openScheduleScreen = () => {
    navigation.navigate("ScheduleScreen"); // Navigieren zur ScheduleScreen
  };

  return (
    <View style={styles.container}>
      {/* Kachel für Schichtplanung */}
      <TouchableOpacity onPress={openScheduleScreen} style={styles.card}>
        <Text style={styles.cardText}>Schichtplanung</Text>
      </TouchableOpacity>

      {/* Weitere Kacheln und Inhalte */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Stile für Container
  },
  card: {
    // Stile für die Kachel
  },
  cardText: {
    // Stile für den Text in der Kachel
  },
  // Weitere Stile
});

export default EmployeeDashboardScreen;
