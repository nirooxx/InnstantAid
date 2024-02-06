import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { useCart } from './CartContext'; // Pfad anpassen
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useDispatch, useSelector  } from 'react-redux';
import { AppDispatch, RootState  } from '../../../../../store/store';
import { cancelOrder, resetOrder  } from '../../../../../store/orderingSlice'; 
import { RootStackParamList } from "../../../../../routes/types"; // Import your type definitions
import { StackNavigationProp } from "@react-navigation/stack";

type ConfirmationCheckoutNavigationProp = StackNavigationProp<
  RootStackParamList,
  "MenuScreen"
>;

interface CartItem {
    id: string;
    title: string;
    price: number;
    imageUrl: string;
    quantity: number;
    category?: string;
    description?: string;
  }

  type ConfirmCheckoutRouteProp = RouteProp<{ params: { firstName: string; lastName: string; address: number; note: string, roomNumber: string} }, 'params'>;

const ConfirmCheckoutScreen: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
  const { cartItems, resetCart  } = useCart(); // Hier verwenden wir einen Kontext oder Store, um die Warenkorbdaten abzurufen
  const route = useRoute<ConfirmCheckoutRouteProp>();
  const navigation = useNavigation<ConfirmationCheckoutNavigationProp>();
  const { currentOrder, orderStatus, error } = useSelector((state: RootState) => state.order);
  const { firstName, lastName, address, note, roomNumber } = route.params;
  console.log( currentOrder, orderStatus, error)
  // Dies würde die Bestellung stornieren und den Benutzer zurück navigieren
  const handleCancelOrder = () => {
    if (currentOrder?.id) {
      dispatch(cancelOrder(currentOrder.id));
    }
  };

  React.useEffect(() => {
    if (orderStatus === 'idle' && !currentOrder) {
      Alert.alert("Order cancelled", "Your order has been successfully cancelled.");
      navigation.goBack();
      // Navigation zurück oder andere Logik hier...
    } else if (orderStatus === 'failed' && error) {
      Alert.alert("Error", error);
    }
  }, [orderStatus, currentOrder, error]);

  // Dies würde den Checkout-Prozess als fertig markieren
  const handleFinishCheckout = () => {
    dispatch(resetOrder()); // Setzt den Bestellungsstatus in Redux zurück
    resetCart(); // Setzt den Warenkorb zurück (Sie müssen diese Methode in Ihrem CartContext implementieren)
    navigation.navigate("MenuScreen")
    console.log('Checkout finished');
  };

  // Konsolidiere cartItems, sodass gleiche Artikel zusammengefasst werden
  const consolidatedCartItems = cartItems.reduce<CartItem[]>((acc, item) => {
    const existingItem = acc.find((i) => i.id === item.id);
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      acc.push({ ...item });
    }
    return acc;
  }, []);

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.itemContainer}>
    <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
    <View style={styles.itemDetails}>
      <Text style={styles.itemTitle}>{`${item.quantity}x ${item.title}`}</Text>
      <Text style={styles.itemDescription}>{item.description}</Text>
      <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
    </View>
  </View>
  );
console.log(consolidatedCartItems)
  return (
    <View style={styles.container}>
    <View style={styles.header}>
      <TouchableOpacity onPress={handleCancelOrder} style={styles.cancelOrder}>
        <Text style={styles.cancelOrderText}>Cancel order</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleFinishCheckout} style={styles.finishCheckout}>
        <Text style={styles.finishCheckoutText}>Finish</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.content}>
      <Icon name="checkmark-circle" size={60} color="#FFA500" style={styles.checkIcon} />
      <Text style={styles.thankYouText}>Your order is on its way, thank you!</Text>
      <FlatList
        data={consolidatedCartItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.flatList} // Stellt sicher, dass die FlatList genügend Platz hat
      />
      <View style={styles.addressContainer}>
      <Text style={styles.deliveryAddressLabel}>DELIVERY ROOM:</Text>
      <Text style={styles.deliveryAddress}>{roomNumber}</Text>
      <Text style={styles.deliveryAddress}>{firstName} {lastName}</Text>
      <Text style={styles.deliveryAddress}>{address}</Text>
      <Text style={styles.deliveryAddress}>{note}</Text>
    </View>
    </View>
  </View>
  );
};

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50, // Berücksichtigt die Statusbar-Höhe
  },
  addressContainer: {
    position: 'absolute', // Positionierung relativ zum Elternelement
    bottom: 20,          // Abstand vom unteren Rand
    left: 0,             // Am linken Rand beginnen
    right: 0,            // Am rechten Rand enden
    alignItems: 'center' // Zentrieren der Inhalte
  },
  deliveryAddressLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center', // Text zentrieren
  },
  deliveryAddress: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center', // Text zentrieren
  },
  cancelOrder: {
    position: 'absolute',
    top: 40, // Adjust according to your header's height
    left: 20,
  },
  cancelOrderText: {
    color: '#FF3B30', // Red color for the cancel text
    fontSize: 16,
    fontWeight: 'bold',
  },
  finishCheckout: {
    position: 'absolute',
    top: 40, // Adjust according to your header's height
    right: 20,
  },
  finishCheckoutText: {
    color: '#007AFF', // Blue color for the finish text
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1, // Sorgt dafür, dass der Content den verbleibenden Raum einnimmt
    justifyContent: 'flex-start', // Inhalte oben beginnen lassen
    alignItems: 'center', // Zentrieren der Inhalte
    padding: 20,
  },
  flatList: {
    width: '100%',
  },
  itemContainer: {
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
  },
  itemPrice: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  thankYouText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 20,
    textAlign: 'center',
  },

  checkIcon: {
    marginBottom: 20,
  },
  });
  
  export default ConfirmCheckoutScreen;