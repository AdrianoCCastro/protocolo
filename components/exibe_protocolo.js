import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { API_BASE_URL } from "../config";
import { useRoute } from "@react-navigation/native"; // <- IMPORTAR ISSO

export default function ExibeProtocolo() {
  const route = useRoute();
  const { protocoloId } = route.params;

  const [protocolo, setProtocolo] = useState(null);

  const buscaProtocoloPorId = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/processo/ExibeProtocolo/${protocoloId}/`,{
        method : 'POST'
      })
      const data = await response.json();
      setProtocolo(data)
    } catch (error) {
      console.error("Erro ao buscar protocolo:", error);
    }
  };

  useEffect(() => {
    buscaProtocoloPorId();
  }, []);


  return (
    <View style={styles.container}>
      <Text>{protocolo.titulo}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "bold" },
});
