import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { submitOrder } from '../../../../../store/orderingSlice';
import { AppDispatch, RootState } from '../../../../../store/store';
import { useCart } from './CartContext';
import { RootStackParamList } from "../../../../../routes/types";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from '@react-navigation/native';
import { fetchRoomStays } from '../../../../../store/graphqlSlice';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ConfirmNavigationProp = StackNavigationProp<RootStackParamList, "ConfirmCheckoutScreen">;

const CheckoutScreen: React.FC = () => {
  const [note, setNote] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const { cartItems, calculateTotal } = useCart();
  const navigation = useNavigation<ConfirmNavigationProp>();
  const userId = useSelector((state: RootState) => state.user.id);
  const roomStays = useSelector((state: RootState) => state.graphql.roomStays);
  const user = useSelector((state: RootState) => state.user);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const todayISOString = new Date().toISOString().split('T')[0];
    const variables = {
      filter: {
        reservation_from: {
          le: todayISOString
        },
        reservation_to: {
          gt: todayISOString
        }
      },
      last: 100
    };
    dispatch(fetchRoomStays(variables));
  }, [dispatch]);

  const filteredRoomStays = roomStays.filter(stay => stay.roomName === user?.roomNumber);
  const guestInfo = filteredRoomStays[0] || {};

  useEffect(() => {
    if (guestInfo.first_guest) {
      setFirstName(guestInfo?.first_guest?.firstname || '');
      setLastName(guestInfo?.first_guest?.lastname || '');
    }
    if (guestInfo.reservation) {
      setAddress(guestInfo?.reservation?.groupName|| '');
    }
  }, [guestInfo]);

  const handleCheckout = () => {
    if (cartItems.length > 0 && guestInfo.roomName && firstName && lastName) {
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
        roomNumber: guestInfo.roomName || user?.roomNumber,
        firstName,
        lastName,
        address,
        note,
        userId,
        orderDate
      }));
      navigation.navigate('ConfirmCheckoutScreen', { firstName, lastName, address, note, roomNumber: user?.roomNumber || guestInfo.roomName });
    } else {
      Alert.alert('Fehler', 'Bitte füllen Sie alle erforderlichen Felder aus.');
    }
  };

  const subtotal = calculateTotal();
  const shippingFee = 0;
  const total = subtotal + shippingFee;

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 100 }} style={styles.container}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Vorname</Text>
        <TextInput
          value={firstName}
          onChangeText={setFirstName}
          style={styles.input}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nachname</Text>
        <TextInput
          value={lastName}
          onChangeText={setLastName}
          style={styles.input}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Adresse (optional)</Text>
        <TextInput
          value={address}
          onChangeText={setAddress}
          style={styles.input}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Zimmernummer</Text>
        <TextInput
          value={guestInfo.roomName || user?.roomNumber || ''}
          editable={false}
          style={styles.input}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Notiz (optional)</Text>
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="Extra-Wünsche hier eingeben"
          style={[styles.input, styles.noteInput]}
          multiline
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

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F7FAFC',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 10,
    fontSize: 16,
    color: '#2D3748',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  noteInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  summary: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 10,
  },
  summaryText: {
    marginBottom: 10,
    fontSize: 16,
    color: '#4A5568',
  },
  payButton: {
    backgroundColor: '#5A67D8',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#5A67D8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  },
  payButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default CheckoutScreen;
