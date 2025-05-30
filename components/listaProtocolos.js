import React from "react";
import { ScrollView,Button, StyleSheet } from "react-native";
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
      const usuario_id = await AsyncStorage.getItem("usuario_id");
      if (!usuario_id) {
        console.warn("Usuário não encontrado.");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/processo/protocolos_por_usuario/${usuario_id}/`);
      const data = await response.json();

      setProtocolos(data);
      console.log("Protocolos do usuário:", data);
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
      <View style={{flex:1}}>
          <ScrollView contentContainerStyle={styles.container}>
            {protocolos.map((protocolo) => (
              <Card
                key={protocolo.id}
                imgSrc={
                  protocolo.imagens_urls && protocolo.imagens_urls.length > 0
                    ? `${API_BASE_URL}/` + protocolo.imagens_urls[0].imagem
                    : "https://via.placeholder.com/150"
                }
                titulo={protocolo.titulo}
                descricao={protocolo.descricao.split(' ').slice(0, 40).join(' ') + ' ...'}
                status={protocolo.estado}
                color={protocolo.cor}
                protocolo={protocolo.id}
                onUpdate={recarregar}
                onPress={abrirProtocolo}
              />
            ))}
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
