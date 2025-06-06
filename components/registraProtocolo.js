import React, { useEffect, useState } from "react";
import { useRoute } from '@react-navigation/native';
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { pickImage } from "./camera";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from "../config";


export function RegistraProtocolo() {

  const route = useRoute();
  const { atualizar, id, titulo_param, latitude_param, longitude_param, descricao_param } = route.params || {};

  const [images, setImages] = useState([]);
  const [location, setLocation] = useState(null);
  const [nome, setNome] = useState(null);
  const [cpf, setCpf] = useState(null);
  const [email, setEmail] = useState(null);
  const [telefone, setTelefone] = useState(null);
  const [descricao, setDescricao] = useState(null);
  const [titulo, setTitulo] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    buscarUsuario();

    if (atualizar && latitude_param && longitude_param) {
      setLocation({
        latitude: parseFloat(latitude_param),
        longitude: parseFloat(longitude_param),
      });
      setTitulo(titulo_param);
      setDescricao(descricao_param);
    } else {
      setTitulo(null);
      setDescricao(null);
    }
  }, [atualizar]);



  const buscarUsuario = async () => {
    const user = await AsyncStorage.getItem("usuario");
    if (user) {
      const userData = JSON.parse(user);

      setNome(userData.first_name);
      setCpf(userData.cpf);
      setEmail(userData.email);
      setTelefone(userData.telefone);

    }
  };



  const handlePickImage = async () => {

    if (images.length >= 5) {
      Toast.show({
        type: 'error',
        text1: 'Limite de imagens atingido!',
        text2: 'Você só pode adicionar até 5 imagens.',
      });
      return;
    }

    const uri = await pickImage();
    if (uri) {
      setImages((prev) => [...prev, { uri }]);


      if (prev.length + 1 === 5) {
        Toast.show({
          type: 'info',
          text1: 'Limite de imagens atingido!',
          text2: 'Você adicionou 5 imagens.',
        });
      }
    }
  };

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Toast.show({
        type: 'error',
        text1: 'Permissão negada',
        text2: 'Você precisa permitir o acesso à localização.',
      });
      return;
    }

    let currentLocation = await Location.getCurrentPositionAsync({});
    setLocation({
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
    });
  };

  const enviarProtocolo = async () => {

    const formData = new FormData();
    const usuarioSalvo = await AsyncStorage.getItem("usuario");
    const idUsuario = JSON.parse(usuarioSalvo)['id']

    // Adiciona os dados ao formData
    formData.append("titulo", titulo);
    formData.append("nome", nome);
    formData.append("cpf", cpf);
    formData.append("email", email);
    formData.append("telefone", telefone);
    formData.append("descricao", descricao);
    formData.append("id_usuario", idUsuario);
    formData.append("latitude", location.latitude.toString());
    formData.append("longitude", location.longitude.toString());
    images.forEach((image, index) => {
      formData.append("imagens", {
        uri: image.uri,
        name: `image_${index}.jpg`,
        type: "image/jpeg",
      });
    });

    if (atualizar) {
      try {
        const response = await fetch(`${API_BASE_URL}/protocolo/${id}`, {
          method: "PUT",
          body: formData,
          headers: {

          },
        });

        const data = await response.json();

        if (response.ok) {

          Toast.show({
            type: 'success',
            text1: 'Protocolo atualizado com sucesso!',
          });
          setTimeout(() => {
            navigation.navigate('Protocolos', { atualizar: true });
          }, 2500);

        } else {
          Toast.show({
            type: 'error',
            text1: 'Erro ao atualizar protocolo',
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


    } else {
      if (!location) {
        Toast.show({
          type: 'error',
          text1: 'Formulário sem localização',
          text2: 'Selecione a localização por favor!',
        });
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/add_protocolo/`, {
          method: "POST",
          body: formData,
          headers: {

          },
        });

        const data = await response.json();

        if (response.ok) {
          Toast.show({
            type: 'success',
            text1: 'Protocolo enviado com sucesso!',
          });
          setTimeout(() => {
            navigation.navigate('Protocolos', { atualizar: true });
          }, 2500);

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
  }
  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <TextInput placeholder="Título:" style={styles.input} value={titulo} onChangeText={setTitulo} maxLength={25} />
      <TextInput placeholder="Nome:" style={styles.input} value={nome} onChangeText={setNome} maxLength={50} />
      <TextInput placeholder="CPF:" keyboardType="phone-pad" style={styles.input} value={cpf} onChangeText={setCpf} maxLength={11} />
      <TextInput placeholder="Email:" keyboardType="email-address" style={styles.input} value={email} onChangeText={setEmail} maxLength={50} />
      <TextInput placeholder="Telefone:" keyboardType="phone-pad" style={styles.input} value={telefone} onChangeText={setTelefone} maxLength={11} />
      <TextInput
        style={styles.inputDescricao}
        multiline={true}
        numberOfLines={5}
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
        maxLength={255}
      />

      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={handlePickImage} style={styles.iconButton}>
          <Ionicons name="camera" size={32} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={getLocation} style={styles.iconButton}>
          <Ionicons name="location-outline" size={32} color="black" />
        </TouchableOpacity>
      </View>


      {images.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={true} style={{ marginBottom: 10 }}>
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
          style={styles.mapa}
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

      <View style={styles.botao}>
        <Button title={atualizar ? 'Editar Protocolo' : 'Novo Protocolo'} onPress={enviarProtocolo} />
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
  botao: {
    marginTop: 20,
    padding: 25,
  },
  mapa: {
    width: "100%",
    height: 200,
    marginTop: 10
  }
});
