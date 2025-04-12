import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import RegistraProtocolo from './registraProtocolo'

export function ListaProtocolos() {
  const [protocolos, setProtocolos] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregarProtocolos = async () => {
    setLoading(true);
    const dadosSalvos = await AsyncStorage.getItem("protocolos");
    const lista = JSON.parse(dadosSalvos) || [];
    setProtocolos(lista);
    setLoading(false);
  };

  const excluirProtocolo = async (index) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir este protocolo?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            const novosProtocolos = [...protocolos];
            novosProtocolos.splice(index, 1);
            setProtocolos(novosProtocolos);
            await AsyncStorage.setItem("protocolos", JSON.stringify(novosProtocolos));
          },
        },
      ]
    );
  };

  useEffect(() => {
    carregarProtocolos();
  }, []);

  const renderItem = ({ item, index }) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Protocolo #{index + 1}</Text>
        <TouchableOpacity onPress={() => excluirProtocolo(index)}>
          <Ionicons name="trash" size={24} color="red" />
        </TouchableOpacity>
      </View>
      <Text><Text style={styles.label}>Nome:</Text> {item.Nome}</Text>
      <Text><Text style={styles.label}>CPF:</Text> {item.CPF}</Text>
      <Text><Text style={styles.label}>Email:</Text> {item.Email}</Text>
      <Text><Text style={styles.label}>Telefone:</Text> {item.Telefone}</Text>
      <Text><Text style={styles.label}>Descrição:</Text> {item.Descricao}</Text>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  return (
    <View style={styles.container}>
      {protocolos.length === 0 ? (
        <Text style={styles.msgVazio}>Nenhum protocolo salvo.</Text>
      ) : (
        <FlatList
          data={protocolos}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "#fff",
  },
  card: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  titulo: {
    fontWeight: "bold",
    fontSize: 16,
  },
  label: {
    fontWeight: "bold",
  },
  msgVazio: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#888",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
});