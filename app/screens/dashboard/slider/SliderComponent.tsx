import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Carousel from "react-native-snap-carousel";

const initialWidth = Dimensions.get("window").width;

interface SliderItem {
  title: string;
  description: string;
  buttonText: string;
  onPress: () => void;
}

interface RenderItemProps {
  item: SliderItem;
  index: number;
}

const SliderComponent: React.FC = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get("window"));
  const [orientationKey, setOrientationKey] = useState("portrait"); // Zusätzlicher State für die Bildschirmorientierung

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setDimensions(window);
      const orientation =
        window.height > window.width ? "portrait" : "landscape";
      setOrientationKey(orientation); // Aktualisieren des Keys bei Drehung
    });

    // Cleanup subscription on unmount
    return () => subscription?.remove();
  }, []);

  // Berechnen Sie die Größen basierend auf den aktuellen Dimensionen
  const sliderWidth = dimensions.width;
  const itemWidth = dimensions.width - 60; // Berücksichtigen Sie den gewünschten Abstand

  const sliderItems: SliderItem[] = [
    {
      title: "Restaurant",
      description: "Entdecken Sie unsere exquisite Küche.",
      buttonText: "Mehr erfahren",
      onPress: () => {
        // Hier navigieren oder Aktion ausführen
      },
    },
    {
      title: "Spa",
      description:
        "Entspannen Sie sich und genießen Sie unsere Spa-Behandlungen.",
      buttonText: "Mehr erfahren",
      onPress: () => {
        // Hier navigieren oder Aktion ausführen
      },
    },
    {
      title: "Fitness",
      description: "Halten Sie sich mit unserem Fitnesscenter in Form.",
      buttonText: "Mehr erfahren",
      onPress: () => {
        // Hier navigieren oder Aktion ausführen
      },
    },
  ];

  const renderItem = ({ item }: RenderItemProps) => {
    return (
      <View style={styles.slide}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <TouchableOpacity style={styles.button} onPress={item.onPress}>
          <Text style={styles.buttonText}>{item.buttonText}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Carousel
      key={orientationKey} // Fügen Sie den Key hinzu, der sich bei Drehung ändert
      data={sliderItems}
      renderItem={renderItem}
      sliderWidth={sliderWidth} // Verwenden Sie die gesamte Breite
      itemWidth={itemWidth} // Abzüglich der Gesamtpolsterung
      activeSlideAlignment="center"
      containerCustomStyle={styles.carouselContainer}
      contentContainerCustomStyle={styles.carouselContentContainer}
    />
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    flexGrow: 0, // Verhindert, dass der Container über die Größe der Kinder hinauswächst
  },
  carouselContentContainer: {
    alignItems: "center", // Zentriert die Slides im Carousel, wenn diese kleiner als der Bildschirm sind
  },
  slide: {
    backgroundColor: "white", // oder ein anderer gewünschter Hintergrund
    borderRadius: 20,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    // marginHorizontal: 30, // Gibt dem Slide etwas Abstand von den Rändern
    width: initialWidth - 60, // Abzüglich der Gesamtpolsterung
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#333",
    borderRadius: 10,
    padding: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default SliderComponent;
