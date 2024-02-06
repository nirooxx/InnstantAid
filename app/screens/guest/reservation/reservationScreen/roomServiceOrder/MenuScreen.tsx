import React, { useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, SafeAreaView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../../../routes/types'; // Importiere deine Typendefinitionen
import { useNavigation } from '@react-navigation/native';
import { useCart } from './CartContext';
import Icon from 'react-native-vector-icons/Ionicons';

interface MenuItem {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  description?: string; // Optional
  ingredients?: string[]; // Optional
  category: string;
}

type MenuScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MenuItemDetailsScreen'>;


interface RenderMenuItemProps {
  item: MenuItem;
}

const MenuScreen: React.FC = () => {
    const { cartItems, addToCart } = useCart();
    const navigation = useNavigation<MenuScreenNavigationProp>();

    const [activeCategory, setActiveCategory] = React.useState<string>('Food');

    // Kategorien für die Menüleiste
    const categories = ['Food', 'Snacks', 'Drinks', 'Dessert'];

  // Beispiel-Daten, ersetze dies durch deine echten Daten
  const menuItems: MenuItem[] = [
    {
      id: '1',
      title: 'Margherita Pizza',
      price: 8.99,
      imageUrl: 'https://img.freepik.com/free-vector/flat-design-ui-ux-background-illustrated_23-2149054879.jpg?size=626&ext=jpg&ga=GA1.1.1431687763.1706920305&semt=ais',
      category: 'Food',
      description: 'akshdkahsdkfahsdkflaksjdlfjalsdjfklasdjflasd'
    },
    {
        id: '2',
        title: 'Fungi Pizza',
        price: 5.89,
        imageUrl: 'https://img.freepik.com/free-vector/isometric-ui-ux-background_23-2149047259.jpg?size=626&ext=jpg&ga=GA1.1.1431687763.1706920305&semt=ais',
        category: 'Food',
        description: 'akshdkahsdkfahsdkflaksjdlfjalsdjfklasdjflasd'
      },
    // Weitere Menüpunkte...
  ];

   // Setze die Optionen für den Navigations-Header
   useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('CartScreen')} style={styles.cartButton}>
          <Icon name="cart" size={24} color="black" />
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</Text>
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation, cartItems]);

   // Filter die Menüpunkte basierend auf der aktiven Kategorie
  const filteredItems = menuItems.filter(
    (item) => item.category === activeCategory
  );

  // renderItem für FlatList
  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.menuItem}>
      <Image source={{ uri: item.imageUrl }} style={styles.menuItemImage} />
      <Text style={styles.menuItemTitle}>{item.title}</Text>
      <Text style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>
      <Text style={styles.menuItemDescription}>{item.description}</Text>
      <TouchableOpacity 
      style={styles.menuItem} 
      onPress={() => navigation.navigate('MenuItemDetailsScreen',  item )}
    >
      <Text>Ansehen</Text>
    </TouchableOpacity>
      <TouchableOpacity style={styles.addToCartButton}>
        <Text onPress={() => addToCart(item)} style={styles.addToCartText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
    {/* Kategorienleiste */}
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

    {/* Menü-Items Grid */}
    <FlatList
      data={filteredItems}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={2}
      style={styles.menuGrid}
    />
  </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFA500', // Hintergrundfarbe des gesamten Bildschirms
      },
      categoryBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#FFF',
        paddingVertical: 10,
      },
      categoryButton: {
        padding: 10,
      },
      categoryButtonText: {
        color: '#000',
        fontSize: 16,
      },
      categoryButtonActive: {
        borderBottomWidth: 2,
        borderBottomColor: '#FFA500',
      },
      categoryButtonTextActive: {
        color: '#FFA500',
      },
      menuGrid: {
        margin: 8,
      },
      menuItem: {
        backgroundColor: '#FFF',
        margin: 8,
        flex: 1,
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
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
        marginBottom: 4,
      },
      menuItemPrice: {
        fontSize: 16,
        color: '#666',
        marginBottom: 4,
      },
      menuItemDescription: {
        textAlign: 'center',
        marginBottom: 8,
      },
      addToCartButton: {
        backgroundColor: '#FFA500',
        padding: 8,
        borderRadius: 5,
      },
      addToCartText: {
        color: '#FFF',
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
        width: 12,
        height: 12,
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
