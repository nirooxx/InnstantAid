import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import Carousel from "react-native-snap-carousel";

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
  const dimensions = useWindowDimensions();

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
      <View style={[styles.slide, { width: itemWidth }]}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <TouchableOpacity style={styles.button} onPress={item.onPress}>
          <Text style={styles.buttonText}>{item.buttonText}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
    <Carousel
      data={sliderItems}
      renderItem={renderItem}
      sliderWidth={sliderWidth} // Verwenden Sie die gesamte Breite
      itemWidth={itemWidth} // Abzüglich der Gesamtpolsterung
      activeSlideAlignment="center"
      containerCustomStyle={styles.carouselContainer}
      contentContainerCustomStyle={styles.carouselContentContainer}
    />
     </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
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
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
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
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default SliderComponent;
