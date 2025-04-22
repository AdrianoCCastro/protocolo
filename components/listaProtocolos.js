import React from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import Card from "./card";

export default function App() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card
        imgSrc="https://www.visa.com.br/dam/VCOM/regional/lac/brazil/Pages/Solicite-seu-cartao/porto-bank-gold-800x450.jpg"        
        titulo="Post One"
        descricao="Croque monsieur paneer cheese triangles...fgsdfgsdfgsdfgsdfgsdfgsdfgsdfgsdfgsdfg"
        status="Pendente"
        color="rgb(248, 51, 84)"
      />
      <Card
        imgSrc="https://www.visa.com.br/dam/VCOM/regional/lac/brazil/Pages/Solicite-seu-cartao/porto-bank-gold-800x450.jpg"        
        titulo="Post One"
        descricao="Croque monsieur paneer cheese triangles...fgsdfgsdfgsdfgsdfgsdfgsdfgsdfgsdfgsdfg"
        status="Aceito"
        color="orange"
      />
      <Card
        imgSrc="https://www.visa.com.br/dam/VCOM/regional/lac/brazil/Pages/Solicite-seu-cartao/porto-bank-gold-800x450.jpg"        
        titulo="Post One"
        descricao="Croque monsieur paneer cheese triangles...fgsdfgsdfgsdfgsdfgsdfgsdfgsdfgsdfgsdfg"
        status="Finalizado"
        color="green"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center",
  },
});
