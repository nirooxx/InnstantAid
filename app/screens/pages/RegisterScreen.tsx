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
  registrationStarted,
  registrationSucceeded,
  registrationFailed,
} from "../../store/userSlice";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import auth from "@react-native-firebase/auth";
import { RootState } from "../../store/store";
import { RootStackParamList } from "../../routes/types";

const RegisterScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loading = useSelector(
    (state: RootState) => state.user.isLoading === true
  );
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleRegister = async () => {
    dispatch(registrationStarted());
    try {
      const response = await auth().createUserWithEmailAndPassword(
        email,
        password
      );
      const token = await response.user.getIdToken();
      dispatch(registrationSucceeded({ username: email, token }));
      Alert.alert("Registrierung erfolgreich!", "Sie sind nun registriert.");
    } catch (error: any) {
      dispatch(registrationFailed(error.message));
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
