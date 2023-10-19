import React, { useState } from "react";
import { Button, TextInput, View } from "react-native";
import { Formik, FormikProps } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import {
  registrationStarted,
  registrationSucceeded,
  registrationFailed,
} from "../../store/userSlice";

import { db, auth } from "../../../firebase";
import { addDoc, collection } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import { ActivityIndicator, Text } from "react-native";
// Define the shape of our form values
interface FormValues {
  email: string;
  password: string;
}

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Required"),
});

const Register: React.FC = () => {
  const [error, setError] = useState("");
  const registrationStatus = useSelector(
    (state: RootState) => state.user.registrationStatus
  );
  const dispatch = useDispatch();

  const registerUser = async (values: FormValues) => {
    try {
      dispatch(registrationStarted());
      console.log("123");
      const response = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      console.log("312");
      // Get the refresh token
      const refreshToken = await response.user.getIdToken(true);

      // Add user data to firebase database
      const docRef = await addDoc(collection(db, "users"), {
        username: values.email,
        token: refreshToken,
      });

      console.log("User added to database with ID: ", docRef.id);

      dispatch(
        registrationSucceeded({ username: values.email, token: refreshToken })
      );
    } catch (error: any) {
      dispatch(registrationFailed());
      setError(error.message);
    }
  };

  return (
    <View>
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={registerUser}
        validationSchema={validationSchema}
      >
        {(props: FormikProps<FormValues>) => (
          <View>
            <TextInput
              onChangeText={props.handleChange("email")}
              onBlur={props.handleBlur("email")}
              value={props.values.email}
              placeholder="Email"
            />
            <TextInput
              onChangeText={props.handleChange("password")}
              onBlur={props.handleBlur("password")}
              value={props.values.password}
              placeholder="Password"
              secureTextEntry
            />
            {registrationStatus === "loading" && (
              <ActivityIndicator size="large" color="#0000ff" />
            )}
            {error && <Text>{error}</Text>}
            <Button onPress={props.handleSubmit} title="Register" />
          </View>
        )}
      </Formik>
    </View>
  );
};

export default Register;
