import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RegistraProtocolo } from './registraProtocolo';

const Listar = () => {
  const [protocolos, setProtocolos] = useState([]);

  useEffect(() => {
    const carregarDados = async () => {
      const dadosSalvos = await AsyncStorage.getItem("protocolos");
      if (dadosSalvos) {
        try {
          const dados = JSON.parse(dadosSalvos);
          console.log("Protocolos carregados:", dados);
          setProtocolos(dados);
        } catch (error) {
          console.error("Erro ao converter os dados:", error);
        }
      }
    };

    carregarDados();
  }, []);

  return (
    <View>
      {protocolos.map((item, index) => (
        <Text key={index}>{item.Nome} - {item.Email}</Text>
      ))}
    </View>
  );
};

export default Listar;
