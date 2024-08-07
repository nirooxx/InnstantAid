import React from "react";
import { Provider } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./firebase";
import { STORYBOOK_MODE } from "@env";
import { ApolloProvider } from '@apollo/client';
import client from './app/graphql/apolloClient';
import { store } from "./app/store/store";
import { ThemeProvider } from "./app/theme/useTheme";
import { NoInternetToast } from "./app/components/NoInternet";
import { CartProvider } from './app/screens/guest/reservation/reservationScreen/roomServiceOrder/CartContext';

// Navigation
import RootNavigation from "./app/routes/RootNavigation";

import StorybookUIRoot from "./.storybook";

const App = React.memo(() => {
  console.log('App component rendering');
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <ThemeProvider>
          <ApolloProvider client={client}>
            <CartProvider>
              <RootNavigation />
              <NoInternetToast />
            </CartProvider>
          </ApolloProvider>
        </ThemeProvider>
      </Provider>
    </SafeAreaProvider>
  );
});

/*
let Root;
if (STORYBOOK_MODE === "TRUE") {
  Root = React.memo(StorybookUIRoot);
} else {
  Root = App;
}*/

export default App;
