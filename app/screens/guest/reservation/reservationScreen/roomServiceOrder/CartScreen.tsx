import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useCart } from './CartContext'; // Stelle sicher, dass der Pfad korrekt ist
import { RootStackParamList } from "../../../../../routes/types"; // Import your type definitions
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from '@react-navigation/native';

type CartNavigationProp = StackNavigationProp<
  RootStackParamList,
  "CheckoutScreen"
>;

const CartScreen: React.FC = () => {
    const { cartItems, removeFromCart, updateCartItem } = useCart();
    const navigation = useNavigation<CartNavigationProp>();
  // Funktion zum Erhöhen der Anzahl eines Artikels im Warenkorb
  const incrementQuantity = (id: string) => {
    updateCartItem(id, 1);
  };

  // Funktion zum Verringern der Anzahl eines Artikels im Warenkorb
  const decrementQuantity = (id: string) => {
    updateCartItem(id, -1);
  };

  // Berechnet die Gesamtsumme der Artikel im Warenkorb
  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

    return (
        <View style={styles.container}>
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
                    <Icon name="remove-circle-outline" size={24} color="#000" />
                  </TouchableOpacity>
                  <Text style={styles.quantity}>{item.quantity}</Text>
                  <TouchableOpacity onPress={() => incrementQuantity(item.id)}>
                    <Icon name="add-circle-outline" size={24} color="#000" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.itemPrice}>€{item.price.toFixed(2)}</Text>
              </View>
              <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.removeButton}>
                <Icon name="close-circle-outline" size={24} color="red" />
              </TouchableOpacity>
            </View>
          )}
        />
        <View style={styles.totalContainer}>
          <Text style={styles.total}>Total: €{calculateTotal().toFixed(2)}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('CheckoutScreen')} style={styles.checkoutButton}>
            <Text style={styles.checkoutButtonText}>Checkout</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
      },
      itemDetails: {
        flex: 1,
        justifyContent: 'space-between',
      },
      quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      // ... füge alle anderen notwendigen Styles hinzu ...
      totalContainer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#EEE',
      },
      checkoutButton: {
        backgroundColor: '#FFA000',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
      },
      checkoutButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
      },
      itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
      },
      itemImage: {
        width: 64,
        height: 64,
        borderRadius: 32,
        marginRight: 10,
      },
      itemDetail: {
        flex: 1,
      },
      itemTitle: {
        fontWeight: 'bold',
        fontSize: 16,
      },
     
      quantity: {
        marginHorizontal: 10,
        fontSize: 16,
      },
      itemPrice: {
        fontSize: 16,
        fontWeight: 'bold',
      },
      removeButton: {
        padding: 6,
      },
      checkoutContainer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#EEE',
      },
      voucherButton: {
        backgroundColor: '#EEE',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
      },
      voucherText: {
        textAlign: 'center',
      },
      total: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
      },
   
});

export default CartScreen;
