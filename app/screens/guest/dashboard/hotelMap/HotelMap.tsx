import React, { useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Text,
} from "react-native";

const hotelMapImage = require("../../../../assets/images/Gebäude_Architektur.jpg");

// Informationen zu den Bereichen des Hotels
const hotelAreas = {
  spa: {
    name: "Spa",
    details: "Entspannen Sie in unserem luxuriösen Spa-Bereich.",
    // ... weitere Details wie Öffnungszeiten, etc.
  },
  fitness: {
    name: "Fitness",
    details: "Bleiben Sie fit in unserem modernen Fitnesscenter.",
    // ... weitere Details
  },
  // ... andere Bereiche
};

const HotelMap: React.FC = () => {
  const [selectedArea, setSelectedArea] = useState<
    keyof typeof hotelAreas | null
  >(null);

  return (
    <View style={styles.container}>
      <Image source={hotelMapImage} style={styles.mapImage} />
      {Object.keys(hotelAreas).map((areaKey) => (
        <TouchableOpacity
          key={areaKey}
          style={styles.areaButton} // Positionierung je nach Bild festlegen
          onPress={() => setSelectedArea(areaKey as keyof typeof hotelAreas)}
        >
          <Text>{hotelAreas[areaKey as keyof typeof hotelAreas].name}</Text>
        </TouchableOpacity>
      ))}

      {selectedArea && (
        <Modal
          transparent
          visible={selectedArea !== null}
          onRequestClose={() => setSelectedArea(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {hotelAreas[selectedArea].name}
              </Text>
              <Text>{hotelAreas[selectedArea].details}</Text>
              <TouchableOpacity
                onPress={() => setSelectedArea(null)}
                style={styles.closeButton}
              >
                <Text>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff", // Weißer Hintergrund für die gesamte Komponente
  },
  mapImage: {
    width: "100%",
    height: 300, // Höhe an Ihr Bild anpassen
    resizeMode: "contain", // Verhindert Verzerrungen des Bildes
  },
  areaButton: {
    position: "absolute",
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 5,
    elevation: 5,
    // Beispiel für die Positionierung des SPA-Bereichs
    // Sie müssen die top und left Werte für jeden Bereich anpassen
    top: 100, // Beispielwert
    left: 50, // Beispielwert
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)", // Dunkler Hintergrund für das Modal
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    maxWidth: "80%", // Verhindert, dass das Modal zu breit wird
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#f44336", // Rote Farbe für den Schließen-Button
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FFF",
  },
});

export default HotelMap;
