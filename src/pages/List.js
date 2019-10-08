import React, { useState, useEffect } from "react";
import socketio from "socket.io-client";

import {
  SafeAreaView,
  ScrollView,
  Image,
  StyleSheet,
  AsyncStorage,
  Alert,
  TouchableHighlight,
} from "react-native";

import SpotList from "../components/SpotList";

import logo from "../assets/logo.png";

export default function List({ navigation }) {
  const [techs, setTechs] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem("user").then(user_id => {
      const socket = socketio("https://d3m-aircnc-backend.herokuapp.com", {
        query: { user_id },
      });

      socket.on("booking_response", booking => {
        Alert.alert(
          `Sua reserva em ${booking.spot.company} em ${booking.date} foi ${
            booking.approved == true ? "APROVADA" : "REJEITADA"
          }`
        );
      });
    });
  }, []);

  useEffect(() => {
    if (AsyncStorage.getItem("techs") != null) {
      AsyncStorage.getItem("techs").then(storageTechs => {
        if (storageTechs != null) {
          const techsArray = storageTechs.split(",").map(tech => tech.trim());

          setTechs(techsArray);
        }
      });
    }
  }, []);

  async function login() {
    await AsyncStorage.clear();
    AsyncStorage.getItem("user").then(r => console.log(r));
    navigation.navigate("Login");
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableHighlight onPress={() => login()}>
        <Image source={logo} style={styles.logo} />
      </TouchableHighlight>

      <ScrollView>
        {techs.map(tech => (
          <SpotList key={tech} tech={tech} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  logo: {
    height: 32,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: 30,
  },
});
