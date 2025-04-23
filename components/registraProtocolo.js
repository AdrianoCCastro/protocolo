import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { pickImage } from "./camera";
import axios from "axios";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from "../config";


export function RegistraProtocolo() {
  const [images, setImages] = useState([]);
  const [location, setLocation] = useState(null);
  const [nome, setNome] = useState(null);
  const [cpf, setCpf] = useState(null);
  const [email, setEmail] = useState(null);
  const [telefone, setTelefone] = useState(null);
  const [descricao, setDescricao] = useState(null);
  const [usuarioId, setUsuarioId] = useState(null);
  const [titulo, setTitulo] = useState(null);
  const navigation = useNavigation();
 

  useEffect(() => {
    const buscarUsuario = async () => {
      const user = await AsyncStorage.getItem("usuario");
      if (user) {
        const userData = JSON.parse(user);
        setUsuarioId(userData.id);
      }
    };
    buscarUsuario();
  }, []);

  const handlePickImage = async () => {
    const uri = await pickImage();
    if (uri) {
      setImages((prev) => [...prev, { uri }]);
    }
  };

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permissão para acessar a localização foi negada");
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location.coords);
    
  };

  const enviarProtocolo = async () => {

    const formData = new FormData();    
    const usuarioId = await AsyncStorage.getItem('usuario_id');

    if (!usuarioId) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Usuário não identificado. Faça login novamente.',
      });
      return;
    }
    
    // Adiciona os dados ao formData
    formData.append("titulo", titulo);
    formData.append("nome", nome);
    formData.append("cpf", cpf);
    formData.append("email", email);
    formData.append("telefone", telefone);
    formData.append("descricao", descricao);
    formData.append("id_usuario", usuarioId);
    formData.append("latitude", location.latitude.toString());
    formData.append("longitude", location.longitude.toString());

  
    try {
      const response = await fetch(`${API_BASE_URL}/processo/registrar_protocolo/`, {
        method: "POST",
        body: formData,
        headers: {
         
        },
      });

      const data = await response.json();
      console.log("Resposta:", data);

      if (response.ok) {
        setTimeout(() => {
          navigation.navigate('Protocolos');
        }, 2000);
        Toast.show({
          type: 'success',
          text1: 'Protocolo enviado com sucesso!',

          
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Erro ao enviar protocolo',
          text2: data.error || 'Tente novamente mais tarde.',
        });
      }
    } catch (error) {
      console.log("Erro:", error);
      Toast.show({
        type: 'error',
        text1: 'Erro de rede',
        text2: error.message,
      });
    }
  };

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <TextInput placeholder="Título:" style={styles.input} value={titulo} onChangeText={setTitulo} />
      <TextInput placeholder="Nome:" style={styles.input} value={nome} onChangeText={setNome} />
      <TextInput placeholder="CPF:" keyboardType="phone-pad" style={styles.input} value={cpf} onChangeText={setCpf} />
      <TextInput placeholder="Email:" keyboardType="email-address" style={styles.input} value={email} onChangeText={setEmail} />
      <TextInput placeholder="Telefone:" keyboardType="phone-pad" style={styles.input} value={telefone} onChangeText={setTelefone} />
      <TextInput
        style={styles.inputDescricao}
        multiline={true}
        numberOfLines={5}
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
      />

      <Toast position="center" />

      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={handlePickImage} style={styles.iconButton}>
          <Ionicons name="camera" size={32} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={getLocation} style={styles.iconButton}>
          <Ionicons name="location-outline" size={32} color="black" />
        </TouchableOpacity>
      </View>

      
      {images.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
          {images.map((img, index) => (
            <Image
              key={index}
              source={{ uri: img.uri }}
              style={{ width: 100, height: 100, marginRight: 10, borderRadius: 8 }}
            />
          ))}
        </ScrollView>
      )}

      {location && (
        <MapView
          style={{ width: "100%", height: 200, marginTop: 10 }}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} />
        </MapView>
      )}

      <View style={{ marginTop: 20 }}>
        <Button title="Salvar" onPress={enviarProtocolo} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 1,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  inputDescricao: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    height: 150,
    textAlignVertical: "top",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: 10,
  },
  iconButton: {
    padding: 10,
  },
});
