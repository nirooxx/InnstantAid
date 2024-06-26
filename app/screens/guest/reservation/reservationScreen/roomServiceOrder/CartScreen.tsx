import React from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useCart } from './CartContext'; // Stelle sicher, dass der Pfad korrekt ist
import { RootStackParamList } from "../../../../../routes/types"; // Import your type definitions
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type CartNavigationProp = StackNavigationProp<RootStackParamList, "CheckoutScreen">;

const CartScreen: React.FC = () => {
  const { cartItems, removeFromCart, updateCartItem } = useCart();
  const navigation = useNavigation<CartNavigationProp>();
  const insets = useSafeAreaInsets();

  const incrementQuantity = (id: string) => {
    updateCartItem(id, 1);
  };

  const decrementQuantity = (id: string) => {
    updateCartItem(id, -1);
  };

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const handleRemoveFromCart = (id: string) => {
    Alert.alert(
      'Bestätigung',
      'Möchten Sie diesen Artikel wirklich aus dem Warenkorb entfernen?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        { text: 'Entfernen', onPress: () => removeFromCart(id) },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 70 }}
      >
        <FlatList
          data={cartItems}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity onPress={() => decrementQuantity(item.id)}>
                    <Icon name="remove-circle-outline" size={24} color="#5A67D8" />
                  </TouchableOpacity>
                  <Text style={styles.quantity}>{item.quantity}</Text>
                  <TouchableOpacity onPress={() => incrementQuantity(item.id)}>
                    <Icon name="add-circle-outline" size={24} color="#5A67D8" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.itemPrice}>€{item.price.toFixed(2)}</Text>
              </View>
              <TouchableOpacity onPress={() => handleRemoveFromCart(item.id)} style={styles.removeButton}>
                <Icon name="close-circle-outline" size={24} color="red" />
              </TouchableOpacity>
            </View>
          )}
        />
        <View style={styles.totalContainer}>
          <Text style={styles.total}>Gesamt: €{calculateTotal().toFixed(2)}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('CheckoutScreen')} style={styles.checkoutButton}>
            <Text style={styles.checkoutButtonText}>Zur Kasse</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  itemImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#2D3748',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    padding: 10,
  },
  quantity: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5A67D8',
  },
  removeButton: {
    padding: 6,
  },
  totalContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#fff',
  },
  checkoutButton: {
    backgroundColor: '#5A67D8',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#5A67D8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  },
  checkoutButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
  },
});

export default CartScreen;
