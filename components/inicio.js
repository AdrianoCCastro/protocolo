import React from "react";
import { View, Text, StyleSheet } from "react-native";

export function Inicio() {
  
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style = {styles.text}>Bem vindo ao app de processos.</Text>
      <Text>Vá ao menu Registrar para criar sua solicitação!</Text>
    </View>
  );
}
const styles = StyleSheet.create({
text: {
  padding: 20,
  fontSize: 23,
  fontWeight: 'bold'
}
})