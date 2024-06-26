import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../../../routes/types';
import { useNavigation } from '@react-navigation/native';
import { useCart } from './CartContext';
import Icon from 'react-native-vector-icons/Ionicons';

interface MenuItem {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  description?: string;
  ingredients?: string[];
  category: string;
}

type MenuScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MenuItemDetailsScreen'>;

const MenuScreen: React.FC = () => {
  const { cartItems, addToCart } = useCart();
  const navigation = useNavigation<MenuScreenNavigationProp>();
  const [activeCategory, setActiveCategory] = React.useState<string>('Food');

  const categories = ['Food', 'Snacks', 'Drinks', 'Dessert'];

  const menuItems: MenuItem[] = [
    {
      id: '1',
      title: 'Margherita Pizza',
      price: 8.99,
      imageUrl: 'https://img.freepik.com/free-vector/flat-design-ui-ux-background-illustrated_23-2149054879.jpg?size=626&ext=jpg&ga=GA1.1.1431687763.1706920305&semt=ais',
      category: 'Food',
      description: 'Classic margherita pizza with fresh basil and mozzarella.',
    },
    {
      id: '2',
      title: 'Fungi Pizza',
      price: 5.89,
      imageUrl: 'https://img.freepik.com/free-vector/isometric-ui-ux-background_23-2149047259.jpg?size=626&ext=jpg&ga=GA1.1.1431687763.1706920305&semt=ais',
      category: 'Food',
      description: 'Delicious fungi pizza with mushrooms and cheese.',
    },
  ];

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('CartScreen')} style={styles.cartButton}>
          <Icon name="cart" size={24} color="#fff" />
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</Text>
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation, cartItems]);

  const filteredItems = menuItems.filter((item) => item.category === activeCategory);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.menuItem}>
      <Image source={{ uri: item.imageUrl }} style={styles.menuItemImage} />
      <Text style={styles.menuItemTitle}>{item.title}</Text>
      <Text style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>
      <Text style={styles.menuItemDescription}>{item.description}</Text>
      <TouchableOpacity
        style={styles.viewDetailsButton}
        onPress={() => navigation.navigate('MenuItemDetailsScreen', { 
           id: item.id,
          title: item.title,
          price: item.price,
          imageUrl: item.imageUrl,
          description: item.description,
          ingredients: item.ingredients,
          category:item.category
        })}
      >
        <Text style={styles.viewDetailsText}>Ansehen</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.addToCartButton} onPress={() => addToCart(item)}>
        <Text style={styles.addToCartText}>In den Warenkorb</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.categoryBar}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              activeCategory === category && styles.categoryButtonActive,
            ]}
            onPress={() => setActiveCategory(category)}
          >
            <Text
              style={[
                styles.categoryButtonText,
                activeCategory === category && styles.categoryButtonTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        style={styles.menuGrid}
        columnWrapperStyle={styles.columnWrapper}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  categoryBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  categoryButton: {
    padding: 10,
  },
  categoryButtonText: {
    color: '#2D3748',
    fontSize: 16,
  },
  categoryButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#5A67D8',
  },
  categoryButtonTextActive: {
    color: '#5A67D8',
  },
  menuGrid: {
    paddingHorizontal: 8,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  menuItem: {
    backgroundColor: '#FFFFFF',
    margin: 8,
    flex: 1,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  menuItemImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginBottom: 8,
  },
  menuItemTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#2D3748',
    marginBottom: 4,
    textAlign: 'center',
  },
  menuItemPrice: {
    fontSize: 16,
    color: '#5A67D8',
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#4A5568',
    textAlign: 'center',
    marginBottom: 8,
  },
  viewDetailsButton: {
    marginTop: 10,
    backgroundColor: '#EDF2F7',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  viewDetailsText: {
    color: '#5A67D8',
    fontWeight: '600',
  },
  addToCartButton: {
    marginTop: 10,
    backgroundColor: '#5A67D8',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  addToCartText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cartButton: {
    marginRight: 15,
  },
  cartBadge: {
    position: 'absolute',
    right: -6,
    top: -3,
    backgroundColor: 'red',
    borderRadius: 6,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default MenuScreen;
