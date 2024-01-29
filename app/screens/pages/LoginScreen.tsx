import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  loginStarted,
  loginSucceeded,
  loginFailed,
} from "../../store/userSlice";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import {
  db,
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "../../../firebase";
import { RootState } from "../../store/store";
import { RootStackParamList } from "../../routes/types";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loading = useSelector((state: RootState) => state.user.isLoading);
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleLogin = async () => {
    dispatch(loginStarted());
    
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      const userId = response.user.uid;
      const token = await response.user.getIdToken();
      const userDocRef = doc(db, 'users', userId);
      const userDocSnap = await getDoc(userDocRef);
  
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const role = userData?.role || 'guest';
        dispatch(loginSucceeded({ username: email, token, role }));
        Alert.alert("Login erfolgreich!", "Willkommen zurück!");
      } else {
        dispatch(loginFailed('Benutzerdokument nicht gefunden'));
        console.log('Benutzerdokument nicht gefunden');
        // Geeignete Fehlerbehandlung hier
      }
    } catch (error: any) {
      dispatch(loginFailed(error.message));
      console.log(error.message);
      Alert.alert("Login fehlgeschlagen", error.message);
    }
  };

  const navigateToRegister = () => {
    navigation.navigate("Register"); // Navigiert zur Registrierungsseite
  };

  return (
    <View>
      <Text>Login</Text>
      <TextInput value={email} onChangeText={setEmail} placeholder="E-Mail" />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Passwort"
        secureTextEntry
      />
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Button title="Einloggen" onPress={handleLogin} />
      )}
      <Button title="Zum Registrieren" onPress={navigateToRegister} />
    </View>
  );
};

export default LoginScreen;
