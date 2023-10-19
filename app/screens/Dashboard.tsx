import React, { useEffect } from "react";
import { SafeAreaView, StyleSheet, Dimensions, Image } from "react-native";
import { Block, Text, Button, Input, theme, Card } from "galio-framework";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const { width } = Dimensions.get("screen");

export default function Dashboard() {
  const users = useSelector((state: RootState) => state.user);

  useEffect(() => {
    console.log(users);
  }, [users]);

  return (
    <SafeAreaView style={styles.container}>
      <Block flex>
        <Input
          right
          icon="zoom-in"
          family="Entypo"
          iconSize={16}
          iconColor="black"
          placeholder="What are you looking for?"
        />
        <Block row space="between" style={styles.cardsContainer}>
          <Card
            flex
            borderless
            style={styles.card}
            title="Zimmerservice"
            caption="Holen Sie sich den besten Zimmerservice auf einen Klick."
            imageStyle={styles.cardImage}
            image="https://placeimg.com/640/480/any"
            footer={<Button color="primary">Bestellen</Button>}
          />

          <Card
            flex
            borderless
            style={styles.card}
            title="Spa-Buchungen"
            caption="Erholen Sie sich mit unseren besten Spa-Dienstleistungen."
            imageStyle={styles.cardImage}
            image="https://placeimg.com/640/480/any"
            footer={<Button color="primary">Buchen</Button>}
          />

          <Card
            flex
            borderless
            style={styles.card}
            title="Reinigungsservice"
            caption="Halten Sie Ihr Zimmer sauber und ordentlich."
            imageStyle={styles.cardImage}
            image="https://placeimg.com/640/480/any"
            footer={<Button color="primary">Anfordern</Button>}
          />
        </Block>
      </Block>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingBottom: 75,
    backgroundColor: "#f5f5f5",
  },
  cardsContainer: {
    padding: theme.SIZES?.BASE,
    width: theme.SIZES?.BASE ? width - theme.SIZES?.BASE * 2 : 0,
  },
  card: {
    padding: theme.SIZES?.BASE,
    marginBottom: theme.SIZES?.BASE,
  },
  cardImage: {
    height: 200,
    borderRadius: 3,
    overflow: "hidden",
  },
});
