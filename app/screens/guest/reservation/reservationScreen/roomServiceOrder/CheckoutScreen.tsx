import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { submitOrder } from '../../../../../store/orderingSlice';
import { AppDispatch, RootState } from '../../../../../store/store';
import { useCart } from './CartContext';
import { RootStackParamList } from "../../../../../routes/types"; // Import your type definitions
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ConfirmNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ConfirmCheckoutScreen"
>;

const CheckoutScreen: React.FC = () => {
  const [roomNumber, setRoomNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState(''); 
  const dispatch = useDispatch<AppDispatch>();
  const { cartItems, calculateTotal  } = useCart();
  const navigation = useNavigation<ConfirmNavigationProp>();
  const userId = useSelector((state: RootState) => state.user.id);
  const insets = useSafeAreaInsets();

  const handleCheckout = () => {
    if (cartItems.length > 0 && roomNumber) {
      const orderDate = new Date().toLocaleString('de-DE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      dispatch(submitOrder({
        cartItems,
        roomNumber,
        firstName,
        lastName,
        address,
        note,
        userId,
        orderDate // Hinzufügen des Bestelldatums zum Bestell-Objekt
      }));
      navigation.navigate('ConfirmCheckoutScreen', { firstName, lastName, address, note, roomNumber });
    } else {
      // Fehlermeldung anzeigen
    }
  };


  

  // Angenommene Kosten für die Darstellung
  const subtotal = calculateTotal();
 const shippingFee = 0; // Angenommene Versandkosten
  const total = subtotal + shippingFee;

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom +100}}
    style={styles.container}>
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Vorname</Text>
      <TextInput
        value={firstName}
        onChangeText={(value) => setFirstName(value)}
        style={styles.input}
      />
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>Nachname</Text>
      <TextInput
        value={lastName}
        onChangeText={(value) => setLastName(value)}
        style={styles.input}
      />
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>Adresse</Text>
      <TextInput
        value={address}
        onChangeText={(value) => setAddress(value)}
        style={styles.input}
      />
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>Zimmernummer</Text>
      <TextInput
        value={roomNumber}
        onChangeText={(value) => setRoomNumber(value)}
        style={styles.input}
      />
    </View>
    <View style={styles.inputGroup}>
        <Text style={styles.label}>Notiz (optional)</Text>
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="Extra-Wünsche hier eingeben"
          style={styles.input}
          multiline // Ermöglicht mehrere Zeilen Text
        />
      </View>

    <View style={styles.summary}>
      <Text style={styles.summaryText}>Liefergebühr: {shippingFee}€</Text>
      <Text style={styles.summaryText}>Zwischensumme: {Number(subtotal).toFixed(2)}€</Text>
      <Text style={styles.summaryText}>Gesamtpreis: {Number(total).toFixed(2)}€</Text>
    </View>

    <TouchableOpacity onPress={handleCheckout} style={styles.payButton}>
      <Text style={styles.payButtonText}>Jetzt bezahlen</Text>
    </TouchableOpacity>
  </ScrollView>
  );
};

// Hier Styles hinzufügen
const styles = StyleSheet.create({
    container: {
        padding: 20,
      },
      inputGroup: {
        marginBottom: 20,
      },
      label: {
        marginBottom: 10,
      },
      input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 5,
      },
      summary: {
        marginTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        paddingTop: 10,
      },
      summaryText: {
        marginBottom: 10,
      },
      payButton: {
        backgroundColor: '#000',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
      },
      payButtonText: {
        color: '#fff',
        fontWeight: 'bold',
      },
});

export default CheckoutScreen;
