import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  ActivityIndicator,
  Alert, 
} from "react-native";
import { Picker } from '@react-native-picker/picker';
import { useDispatch, useSelector } from "react-redux";
import {
  registrationStarted,
  registrationSucceeded,
  registrationFailed,
} from "../../store/userSlice";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import {
  db,
  auth,
  createUserWithEmailAndPassword,
} from "../../../firebase";
import { doc, setDoc } from "firebase/firestore";

import { RootState } from "../../store/store";
import { RootStackParamList } from "../../routes/types";

const RegisterScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roomNumber, setRoomNumber] = useState('');
  const [role, setRole] = useState("guest");
  const loading = useSelector(
    (state: RootState) => state.user.isLoading === true
  );
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleRegister = async () => {
    dispatch(registrationStarted());
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userId = response.user.uid;
      const token = await response.user.getIdToken();
      // Erstellen Sie ein neues Benutzerdokument in Firestore
      await setDoc(doc(db, 'users', userId), { username: email, token, role, id: userId, roomNumber });

      dispatch(registrationSucceeded({ username: email, token, role, roomNumber, id: userId }));
      Alert.alert("Registrierung erfolgreich!", "Sie sind nun registriert.");
    } catch (error: any) {
      dispatch(registrationFailed(error.message));
      console.log(error.message);
      Alert.alert("Registrierung fehlgeschlagen", error.message);
    }
  };

  const navigateToLogin = () => {
    navigation.navigate("Login"); // Navigiert zur Login-Seite
  };

  return (
    <View>
      <Text>Registrieren Sie sich für Ihren Aufenthalt</Text>
      <TextInput value={email} onChangeText={setEmail} placeholder="E-Mail" />
     
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Passwort"
        secureTextEntry
      />


<Text>Rolle:</Text>
      <Picker
        selectedValue={role}
        onValueChange={(itemValue:any) =>
          setRole(itemValue)
        }>
        <Picker.Item label="Gast" value="guest" />
        <Picker.Item label="Angestellter" value="employee" />
        <Picker.Item label="Manager" value="manager" />
        {/* Weitere Rollen können hier hinzugefügt werden */}
      </Picker>

     {role === 'guest' ? <TextInput
        value={roomNumber}
        onChangeText={(text) => setRoomNumber(text)}
        placeholder="Zimmernummer"
        keyboardType="numeric"
      /> : ''}


      {loading ? (
        <ActivityIndicator />
      ) : (
        <Button title="Registrieren" onPress={handleRegister} />
      )}
      <Button
        title="Bereits registriert? Einloggen"
        onPress={navigateToLogin}
      />
    </View>
  );
};

export default RegisterScreen;
