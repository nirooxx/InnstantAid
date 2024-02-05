import React, {useState} from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Button } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../../../routes/types';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons'; // Stelle sicher, dass diese Bibliothek installiert ist
import { StackNavigationProp } from "@react-navigation/stack";
import { useCart } from './CartContext';

type MenuItemDetailsScreenRouteProp = RouteProp<RootStackParamList, 'MenuItemDetailsScreen'>;
type MenuItemDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MenuItemDetailsScreen'>


const MenuItemDetailsScreen: React.FC = () => {
    const route = useRoute<MenuItemDetailsScreenRouteProp>();
    const navigation = useNavigation<MenuItemDetailsScreenNavigationProp>();
  const item = route.params;
  const [quantity, setQuantity] = useState(1);
  const { addToCart, cartItems} = useCart();

  const handleAddToCart = () => {
    // Hier würde das Artikelobjekt um die Eigenschaft `quantity` ergänzt
    const cartItem = {
        ...item,
         quantity, // oder die gewählte Anzahl, wenn Sie eine Auswahl implementieren
      };
  
      // Füge den Artikel zum Warenkorb hinzu
      addToCart(cartItem);
      // Optional: Zeige eine Bestätigungsnachricht

      console.log(`${item.title} wurde zum Warenkorb hinzugefügt.`);
      navigation.goBack();
    };

    const increaseQuantity = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
      };
    
      const decreaseQuantity = () => {
        setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
      };

  return (
    <ScrollView contentContainerStyle={styles.container}>
    <Image source={{ uri: item.imageUrl }} style={styles.image} />
    <Text style={styles.title}>{item.title}</Text>
    <Text style={styles.price}>${item.price.toFixed(2)}</Text>
    <Text style={styles.description}>{item.description}</Text>
    <View style={styles.quantitySection}>
      <TouchableOpacity onPress={decreaseQuantity} style={styles.quantityButton}>
        <Icon name="remove-circle-outline" size={30} color="#000" />
      </TouchableOpacity>
      <Text style={styles.quantity}>{quantity}</Text>
      <TouchableOpacity onPress={increaseQuantity} style={styles.quantityButton}>
        <Icon name="add-circle-outline" size={30} color="#000" />
      </TouchableOpacity>
    </View>
    <TouchableOpacity onPress={handleAddToCart} style={styles.orderButton}>
      <Text style={styles.orderButtonText}>Add to Cart</Text>
      <Icon name="chevron-forward-outline" size={20} color="#FFF" />
    </TouchableOpacity>
  </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#FFF8E1',
      },
      image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 20,
      },
      title: {
        fontWeight: 'bold',
        fontSize: 24,
        color: '#333',
        marginBottom: 5,
      },
      price: {
        color: '#FFA000',
        fontSize: 18,
        marginBottom: 20,
      },
      description: {
        textAlign: 'center',
        marginBottom: 20,
        color: '#555',
      },
      quantitySection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
        borderWidth: 1,
        borderColor: '#DDD',
        padding: 10,
        borderRadius: 10,
      },
      quantityButton: {
        padding: 10,
      },
      quantity: {
        fontSize: 24,
        marginHorizontal: 20,
        fontWeight: 'bold',
        color: '#333',
      },
      totalPrice: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
      },
      orderButton: {
        flexDirection: 'row',
        backgroundColor: '#FFA000',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignItems: 'center',
        marginBottom: 20,
        width: '80%',
        justifyContent: 'center',
      },
      orderButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        marginRight: 10,
      },
});

export default MenuItemDetailsScreen;
