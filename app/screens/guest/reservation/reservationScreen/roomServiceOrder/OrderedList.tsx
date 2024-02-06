// OrderedList.tsx
import React, {useEffect} from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../../../store/store';
import { fetchGuestOrders, cancelOrder  } from '../../../../../store/orderingSlice';

interface CartItem {
    id: string;
    title: string;
    price: number;
    imageUrl: string;
    quantity: number;
    category?: string;
    description?: string;
    // Weitere Eigenschaften von CartItem...
  }
  
  interface Order {
    id:string
    cartItems: CartItem[];
    roomNumber: string;
    firstName: string;
    lastName: string;
    address: string;
    note:string;
    userId:string;
    orderDate: string;
    // Weitere Eigenschaften von Order...
  }

const OrderedList: React.FC = () => {
  const { guestOrders } = useSelector((state: RootState) => state.order);
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.user.id); // Hole die userId aus dem Benutzerzustand

  useEffect(() => {
   
    dispatch(fetchGuestOrders(userId));
    
  }, [dispatch, guestOrders]);

  const handleCancelOrder = (orderId: string) => {
    dispatch(cancelOrder(orderId));
    // Weitere Logik für die Handhabung nach dem Stornieren der Bestellung
  };


  const renderItem = ({ item: cartItem }: { item: CartItem }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: cartItem.imageUrl }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle}>{`${cartItem.quantity}x ${cartItem.title}`}</Text>
        <Text style={styles.itemDescription}>{cartItem.description}</Text>
        <Text style={styles.itemPrice}>${cartItem.price.toFixed(2)}</Text>
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
      data={guestOrders}
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
        // Stile für den Header der Bestellung
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#f2f2f2',
      },
      headerText: {
        // Stile für den Bestellungstext
      },
      cancelButton: {
        backgroundColor: 'red', // Farbe des Buttons
        padding: 15, // Polsterung für den Button
        justifyContent: 'center', // Zentrieren des Textes im Button
        alignItems: 'center', // Zentrieren des Textes im Button
      },
      cancelButtonText: {
        color: 'white', // Textfarbe
        fontWeight: 'bold', // Schriftgewicht
      },
      cancelText: {
        // Stile für den Stornierungstext
        color: '#FF6347',
        marginRight: 8,
      },
      itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
        borderRadius: 8,
        padding: 10,
        marginVertical: 5,
      },
      itemImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
      },
      itemDetails: {
        flex: 1,
        paddingHorizontal: 10,
      },
      itemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
      },
      itemDescription: {
        fontSize: 14,
        color: '#666',
      },
      itemPrice: {
        fontSize: 16,
        fontWeight: 'bold',
      },
      
      itemsList: {
        marginTop: 10,
      },
});

export default OrderedList;
