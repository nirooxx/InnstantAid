import React, { useState } from "react";
import { Image, View, TouchableOpacity, StyleSheet, Text } from "react-native";

interface Props {
  onAreaPress: (area: string) => void;
}

const HotelMap: React.FC<Props> = ({ onAreaPress }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  const handleAreaPress = (area: string) => {
    setSelectedArea(area);
    setModalVisible(true);
    onAreaPress(area); // Ruft die übergeordnete Funktion auf
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/images/Gebäude_Architektur.jpg")}
        style={styles.floorPlan}
      />
      {/* Die Linie, die vom SPA-Button zum Gebäude zeigt */}
      <View style={styles.spaLine} />
      <TouchableOpacity
        style={styles.spaArea}
        onPress={() => handleAreaPress("spa")}
      >
        <Text style={styles.spaAreaText}>SPA</Text>
      </TouchableOpacity>
      {/* Weitere Bereiche hier hinzufügen */}

      {modalVisible && (
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Informationen für {selectedArea}
            </Text>
            <Text style={styles.modalDescription}>
              Hier können Sie spezifische Informationen über {selectedArea}{" "}
              hinzufügen.
            </Text>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Schließen</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  floorPlan: {
    width: 300,
    height: 200,
    resizeMode: "contain",
  },
  spaArea: {
    position: "absolute",
    top: "0%",
    left: "30%",
    width: "10%",
    height: "10%",
    borderColor: "#000",
    borderWidth: 2,
    borderRadius: 10,
    opacity: 0.5,
    justifyContent: "center", // Ausrichtung des Textes vertikal in der Mitte
    alignItems: "center",
  },
  spaAreaText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
  },
  modalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent background
  },
  modalContent: {
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent white
    padding: 20,
    borderRadius: 20,
    width: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#A567FF",
    borderRadius: 15,
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
  },
  spaLine: {
    position: "absolute",
    top: "10%", // Einstellen, um die Position der Linie zu bestimmen
    left: "35%", // Einstellen, um die Position der Linie zu bestimmen
    width: 2, // Dicke der Linie
    height: "25%", // Länge der Linie
    backgroundColor: "#000",
  },
});

export default HotelMap;
