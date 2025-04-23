import React from "react";
import { ScrollView,Text, StyleSheet } from "react-native";
import Card from "./card";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../config"; // ou ajuste o caminho

export default function App() {
  const [protocolos, setProtocolos] = useState([]);

  useEffect(() => {
    const buscarProtocolosDoUsuario = async () => {
      try {
        const usuario_id = await AsyncStorage.getItem("usuario_id");
        if (!usuario_id) {
          console.warn("Usuário não encontrado.");
          return;
        }

        const response = await fetch(`${API_BASE_URL}/processo/protocolos_por_usuario/${usuario_id}/`);
        const data = await response.json();

        
        setProtocolos(data); // salva os protocolos no estado
        console.log("Protocolos do usuário:", data);
      } catch (error) {
        console.error("Erro ao buscar protocolos:", error);
      }
    };

    buscarProtocolosDoUsuario();
  }, []);
  
  return (
    
    <>
    <ScrollView contentContainerStyle={styles.container}>
      {protocolos.map((protocolo, index) => (        
              
      <Card
        key={protocolo.id}
        
        imgSrc={
          protocolo.imagens_urls && protocolo.imagens_urls.length > 0
            ? `${API_BASE_URL}/` + protocolo.imagens_urls[0].imagem
            : "https://via.placeholder.com/150"
        }
        titulo={protocolo.titulo}
        descricao={protocolo.descricao}
        status="Pendente"
        color="rgb(248, 51, 84)"
      />
      ))}
      console.log(protocolo.imagens_urls[0].imagem) 
      </ScrollView>
    </>
    
  );

  /* return (
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
  );*/
} 

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center",
  },
});
