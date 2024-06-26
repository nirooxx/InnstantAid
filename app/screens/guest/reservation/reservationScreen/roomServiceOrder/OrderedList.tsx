import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../../../store/store';
import { fetchGuestOrders, cancelOrder } from '../../../../../store/orderingSlice';

interface CartItem {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  quantity: number;
  category?: string;
  description?: string;
}

interface Order {
  id: string;
  cartItems: CartItem[];
  roomNumber: string;
  firstName: string;
  lastName: string;
  address: string;
  note: string;
  userId: string;
  orderDate: string;
}

const OrderedList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.user.id);

  useEffect(() => {
    dispatch(fetchGuestOrders(userId)).then((action) => {
      if (fetchGuestOrders.fulfilled.match(action)) {
        setOrders(action.payload);
      }
    });
  }, [dispatch, userId]);

  const handleCancelOrder = (orderId: string) => {
    Alert.alert(
      'Bestellung stornieren',
      'Sind Sie sicher, dass Sie diese Bestellung stornieren möchten?',
      [
        { text: 'Nein', style: 'cancel' },
        { text: 'Ja', onPress: () => confirmCancelOrder(orderId) },
      ],
      { cancelable: false }
    );
  };

  const confirmCancelOrder = (orderId: string) => {
    dispatch(cancelOrder(orderId)).then((action) => {
      if (cancelOrder.fulfilled.match(action)) {
        setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
      } else if (cancelOrder.rejected.match(action)) {
        Alert.alert('Fehler', 'Die Stornierung ist fehlgeschlagen. Bitte versuchen Sie es erneut.');
      }
    });
  };

  const renderItem = ({ item: cartItem }: { item: CartItem }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: cartItem.imageUrl }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle}>{`${cartItem.quantity}x ${cartItem.title}`}</Text>
        {cartItem.description ? <Text style={styles.itemDescription}>{cartItem.description}</Text> : null}
        <Text style={styles.itemPrice}>€{cartItem.price.toFixed(2)}</Text>
      </View>
    </View>
  );

  const renderOrder = ({ item }: { item: Order }) => (
    <View style={styles.orderContainer}>
      <Text style={styles.orderHeader}>{item.roomNumber} - {item.firstName} {item.lastName} - Bestellt am: {item.orderDate}</Text>
      <FlatList
        data={item.cartItems}
        renderItem={renderItem}
        keyExtractor={(cartItem) => cartItem.id}
      />
      <TouchableOpacity style={styles.cancelButton} onPress={() => handleCancelOrder(item.id)}>
        <Text style={styles.cancelButtonText}>Bestellung stornieren</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={orders}
      renderItem={renderOrder}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 10,
  },
  orderContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  orderHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5A67D8',
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: '#FF6347',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 10,
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
    paddingHorizontal: 10,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  itemDescription: {
    fontSize: 14,
    color: '#4A5568',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5A67D8',
  },
});

export default OrderedList;
