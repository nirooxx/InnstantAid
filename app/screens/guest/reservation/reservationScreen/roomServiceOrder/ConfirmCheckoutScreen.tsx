import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { useCart } from './CartContext'; // Pfad anpassen
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../../store/store';
import { cancelOrder, resetOrder } from '../../../../../store/orderingSlice';
import { RootStackParamList } from "../../../../../routes/types"; // Import your type definitions
import { StackNavigationProp } from "@react-navigation/stack";

type ConfirmationCheckoutNavigationProp = StackNavigationProp<RootStackParamList, "MenuScreen">;

interface CartItem {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  quantity: number;
  category?: string;
  description?: string;
}

type ConfirmCheckoutRouteProp = RouteProp<{ params: { firstName: string; lastName: string; address: string; note: string; roomNumber: string; } }, 'params'>;

const ConfirmCheckoutScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { cartItems, resetCart } = useCart();
  const route = useRoute<ConfirmCheckoutRouteProp>();
  const navigation = useNavigation<ConfirmationCheckoutNavigationProp>();
  const { currentOrder, orderStatus, error } = useSelector((state: RootState) => state.order);
  const { firstName, lastName, address, note, roomNumber } = route.params;

  // Zustand zum Verfolgen der Stornierung
  const [isCancelling, setIsCancelling] = React.useState(false);

  const handleCancelOrder = () => {
    setIsCancelling(true);
    if (currentOrder?.id) {
      dispatch(cancelOrder(currentOrder.id));
    }
  };

  useEffect(() => {
    if (orderStatus === 'idle' && isCancelling) {
      Alert.alert("Order cancelled", "Your order has been successfully cancelled.");
      navigation.goBack();
    } else if (orderStatus === 'failed' && error) {
      Alert.alert("Error", error);
    }
  }, [orderStatus, isCancelling, currentOrder, error, navigation]);

  const handleFinishCheckout = () => {
    dispatch(resetOrder());
    resetCart();
    navigation.navigate("OrderedList");
    Alert.alert("Order finished", "Your order has been successfully completed.");
  };

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
        <Text style={styles.itemPrice}>€{item.price.toFixed(2)}</Text>
      </View>
    </View>
  );

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
        <Icon name="checkmark-circle" size={60} color="#5A67D8" style={styles.checkIcon} />
        <Text style={styles.thankYouText}>Your order is on its way, thank you!</Text>
        <FlatList
          data={consolidatedCartItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.flatList}
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
    paddingTop: 50,
  },
  addressContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  deliveryAddressLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  deliveryAddress: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  cancelOrder: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  cancelOrderText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: 'bold',
  },
  finishCheckout: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  finishCheckoutText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
  },
  flatList: {
    width: '100%',
  },
  itemContainer: {
    backgroundColor: '#F7FAFC',
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
