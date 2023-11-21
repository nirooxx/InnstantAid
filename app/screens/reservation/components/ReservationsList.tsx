// ReservationsList.tsx
import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";

interface ReservationItemProps {
  id: string;
  title: string;
  description: string;
  imageUri: string;
  onSelect: () => void;
}

const ReservationItem: React.FC<ReservationItemProps> = ({
  title,
  description,
  imageUri,
  onSelect,
}) => {
  return (
    <TouchableOpacity onPress={onSelect} style={styles.itemContainer}>
      <Image source={{ uri: imageUri }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
};

interface ReservationsListProps {
  data: Array<{
    id: string;
    title: string;
    description: string;
    imageUri: string;
  }>;
  onItemSelect: (id: string) => void;
}

const ReservationsList: React.FC<ReservationsListProps> = ({
  data,
  onItemSelect,
}) => {
  return (
    <FlatList
      data={data}
      renderItem={({ item }) => (
        <ReservationItem
          id={item.id}
          title={item.title}
          description={item.description}
          imageUri={item.imageUri}
          onSelect={() => onItemSelect(item.id)}
        />
      )}
      keyExtractor={(item) => item.id}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 20,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  description: {
    fontSize: 14,
    color: "#666",
  },
});

export default ReservationsList;
