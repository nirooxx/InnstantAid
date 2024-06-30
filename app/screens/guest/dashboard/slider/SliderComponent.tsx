import React, { useRef, useEffect } from "react";
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
  const carouselRef = useRef<Carousel<SliderItem>>(null);

  const sliderWidth = dimensions.width;
  const itemWidth = dimensions.width - 40;

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
      description: "Entspannen Sie sich und genießen Sie unsere Spa-Behandlungen.",
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

  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        const currentIndex = carouselRef.current.currentIndex;
        const nextIndex = (currentIndex + 1) % sliderItems.length;
        carouselRef.current.snapToItem(nextIndex);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [sliderItems.length]);

  const renderItem = ({ item }: RenderItemProps) => (
    <View style={[styles.slide, { width: itemWidth }]}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <TouchableOpacity style={styles.button} onPress={item.onPress}>
        <Text style={styles.buttonText}>{item.buttonText}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Carousel
        ref={carouselRef}
        data={sliderItems}
        renderItem={renderItem}
        sliderWidth={sliderWidth}
        itemWidth={itemWidth}
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
    backgroundColor: "#F0F4F8",
  },
  carouselContainer: {
    flexGrow: 0,
  },
  carouselContentContainer: {
    alignItems: "center",
  },
  slide: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#5A67D8",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#4A5568",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#5A67D8",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default SliderComponent;
