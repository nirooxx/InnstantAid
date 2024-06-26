import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../../../routes/types';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { StackNavigationProp } from "@react-navigation/stack";
import { useCart } from './CartContext';

type MenuItemDetailsScreenRouteProp = RouteProp<RootStackParamList, 'MenuItemDetailsScreen'>;
type MenuItemDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MenuItemDetailsScreen'>;

const MenuItemDetailsScreen: React.FC = () => {
  const route = useRoute<MenuItemDetailsScreenRouteProp>();
  const navigation = useNavigation<MenuItemDetailsScreenNavigationProp>();
  const item = route.params;
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    const cartItem = {
      ...item,
      quantity,
    };

    addToCart(cartItem);
    Alert.alert("Erfolg", `${item.title} wurde zum Warenkorb hinzugefügt.`);
    navigation.goBack();
  };

  const increaseQuantity = () => setQuantity(prevQuantity => prevQuantity + 1);
  const decreaseQuantity = () => setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.price}>${item.price.toFixed(2)}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <View style={styles.quantitySection}>
        <TouchableOpacity onPress={decreaseQuantity} style={styles.quantityButton}>
          <Icon name="remove-circle-outline" size={30} color="#5A67D8" />
        </TouchableOpacity>
        <Text style={styles.quantity}>{quantity}</Text>
        <TouchableOpacity onPress={increaseQuantity} style={styles.quantityButton}>
          <Icon name="add-circle-outline" size={30} color="#5A67D8" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={handleAddToCart} style={styles.orderButton}>
        <Text style={styles.orderButtonText}>In den Warenkorb</Text>
        <Icon name="chevron-forward-outline" size={20} color="#FFF" />
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    color: '#2D3748',
    marginBottom: 5,
    textAlign: 'center',
  },
  price: {
    color: '#5A67D8',
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#4A5568',
    textAlign: 'center',
    marginBottom: 20,
  },
  quantitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#DDD',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#FFF',
  },
  quantityButton: {
    padding: 10,
  },
  quantity: {
    fontSize: 24,
    marginHorizontal: 20,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  orderButton: {
    flexDirection: 'row',
    backgroundColor: '#5A67D8',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
    width: '80%',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  orderButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    marginRight: 10,
    fontSize: 18,
  },
});

export default MenuItemDetailsScreen;
