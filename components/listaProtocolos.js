import React from "react";
import { ScrollView, Button, StyleSheet } from "react-native";
import Card from "./card";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../config";
import { useNavigation, useFocusEffect, useRoute } from "@react-navigation/native";
import { View } from "react-native-animatable";

export default function App() {
  const [protocolos, setProtocolos] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const navigation = useNavigation();
  const route = useRoute();

  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.atualizar) {
        recarregar();
        navigation.setParams({ atualizar: false });
      }
    }, [route.params])
  );

  const abrirProtocolo = (protocoloId) => {

    navigation.getParent().navigate("Exibe_Protocolo", { protocoloId });
  };

  const buscarProtocolosDoUsuario = async () => {
    try {
      const usuarioSalvo = await AsyncStorage.getItem("usuario");
      const idUsuario = JSON.parse(usuarioSalvo)['id']
      if (!idUsuario) {
        console.warn("Usuário não encontrado.");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/protocolos_usuario/${idUsuario}`);
      const data = await response.json();

      setProtocolos(data);
      /* console.log("Protocolos do usuário:", data);*/
    } catch (error) {
      console.error("Erro ao buscar protocolos:", error);
    }
  };

  useEffect(() => {
    buscarProtocolosDoUsuario();
  }, [refreshKey]);

  const recarregar = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <>
      <View style={{ flex: 1, backgroundColor: "#4169E1" }}>
        <ScrollView contentContainerStyle={styles.container}>
          {protocolos.map((protocolo) => {
            const imagens = typeof protocolo.imagens === "string"
              ? JSON.parse(protocolo.imagens)
              : protocolo.imagens;

            return (
              <Card
                key={protocolo.id}
                imgSrc={
                  imagens && imagens.length > 0
                    ? `${API_BASE_URL}${imagens[0].url}`
                    : "https://via.placeholder.com/150"
                }
                titulo={protocolo.titulo}
                descricao={protocolo.descricao.split(' ').slice(0, 40).join(' ') + ' ...'}
                status={protocolo.estado}
                color={protocolo.cor}
                protocoloId={protocolo.id}
                onUpdate={recarregar}
                onPress={abrirProtocolo}
              />
            );
          })}

        </ScrollView>
      </View>

    </>

  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center",
    backgroundColor: "#4169E1",

  },
});
