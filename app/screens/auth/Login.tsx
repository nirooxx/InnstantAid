import React, { useState } from "react";
import { StyleSheet, View, Button, Image, ScrollView } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";

import Layout from "../../components/Layout";
import Card from "../../components/Card";
import { Input } from "../../components/Form";
const AppIcon = require("../../assets/images//appicon.png");

import { useDispatch } from "react-redux";
import { updateUser } from "../../store/userSlice";

import { login } from "../../services";
import { setSecureValue } from "../../utils/keyChain";
import { transformToFormikErrors } from "../../utils/form";
import { RootState } from "../../store/store";
import {
  loginStarted,
  loginSucceeded,
  loginFailed,
} from "../../store/userSlice";
import { useSelector } from "react-redux";
import { ActivityIndicator, Text } from "react-native";

interface ValuesType {
  username: string;
  password: string;
}

const initialValues: ValuesType = { username: "", password: "" };

const LoginSchema = Yup.object().shape({
  username: Yup.string().min(5, "Too Short!").required("Required"),
  password: Yup.string().min(5, "Too Short!").required("Required"),
});

const Login = () => {
  const [error, setError] = useState("");
  const loginStatus = useSelector((state: RootState) => state.user.loginStatus);
  const dispatch = useDispatch();

  const handleLogin = (values: ValuesType, { setErrors }: any) => {
    let reqObj: any = Object.assign({}, values, { grant_type: "password" });
    dispatch(loginStarted());
    console.log("33");
    login(new URLSearchParams(reqObj))
      .then((res: any) => {
        console.log(res);
        if (res.data?.user?.access_token) {
          const { name, username, access_token, refresh_token } = res.data.user;
          dispatch(loginSucceeded({ name, username, token: access_token }));
          setSecureValue("token", access_token);
          setSecureValue("refresh_token", refresh_token);
        }
      })
      .catch((e: any) => {
        console.log(e);
        dispatch(loginFailed());
        setError(e.response?.data?.message || e.message);
        if (e.response?.data?.errors) {
          let result = transformToFormikErrors(e.response.data.errors);
          setErrors(result);
        }
      });
  };

  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.scrollview}>
        <View style={styles.container}>
          <Card style={styles.formWrapper}>
            <Formik
              initialValues={initialValues}
              validationSchema={LoginSchema}
              onSubmit={handleLogin}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <>
                  <View style={styles.iconWrapper}>
                    <Image source={AppIcon} style={styles.appIcon} />
                  </View>
                  <Input
                    testID="Login.Username"
                    placeholder="Username/Email"
                    onChangeText={handleChange("username")}
                    onBlur={handleBlur("username")}
                    value={values.username}
                    keyboardType="email-address"
                    error={
                      errors.username && touched.username ? errors.username : ""
                    }
                  />
                  <Input
                    testID="Login.Password"
                    placeholder="Password"
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    value={values.password}
                    secureTextEntry
                    error={
                      errors.password && touched.password ? errors.password : ""
                    }
                  />
                  <Button
                    title="Login"
                    onPress={handleSubmit}
                    testID="Login.Button"
                  />
                </>
              )}
            </Formik>
          </Card>
        </View>
        {loginStatus === "loading" && (
          <ActivityIndicator size="large" color="#0000ff" />
        )}
        {error && <Text>{error}</Text>}
      </ScrollView>
    </Layout>
  );
};

export default Login;

const styles = StyleSheet.create({
  scrollview: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  formWrapper: {
    width: "90%",
  },
  iconWrapper: {
    alignItems: "center",
    marginBottom: 20,
  },
  appIcon: {
    width: 50,
    height: 50,
  },
});
