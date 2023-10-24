import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import Carousel from "react-native-snap-carousel";

const { width } = Dimensions.get("window");

// Hier berechnen wir die dynamischen Werte für sliderWidth und itemWidth
const sliderWidth = width * 0.92; // 92% des Bildschirms
const itemWidth = sliderWidth * 0.86; // 86% des sliderWidth

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

  const renderItem = ({ item, index }: RenderItemProps) => {
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
      data={sliderItems}
      renderItem={renderItem}
      sliderWidth={sliderWidth}
      itemWidth={itemWidth}
    />
  );
};

const styles = StyleSheet.create({
  slide: {
    flexDirection: "column",
    backgroundColor: "transparent",
    borderRadius: 25,
    paddingVertical: 25,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  } as ViewStyle,
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  } as TextStyle,
  description: {
    fontSize: 18,
    color: "#444",
    textAlign: "center",
    marginBottom: 15,
  } as TextStyle,
  button: {
    backgroundColor: "#333",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
  } as ViewStyle,
  buttonText: {
    color: "white",
    fontSize: 16,
  } as TextStyle,
});

export default SliderComponent;
