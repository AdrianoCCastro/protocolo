import React, { useState } from "react";
import {StyleSheet,View,Text,TextInput,Button,Image,TouchableOpacity,Alert,ScrollView} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { pickImage } from "./camera";
import Toast from 'react-native-toast-message';

export function RegistraProtocolo() {

  const [images, setImages] = useState([]);
  const [location, setLocation] = useState(null);
  const [nome,setNome]= useState(null);
  const [cpf,setCpf]= useState(null);
  const [email,setEmail]= useState(null);
  const [telefone,setTelefone]= useState(null);
  const [descricao,setDescricao]= useState(null);  

  const handlePickImage = async () => {
    const uri = await pickImage();
    if (uri) {
      setImages((prev) => [...prev, uri]); 
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

  const Salvar = () => {

      let dados = {
          "Nome": nome ,
          "Email" : email,
          "Telefone" : telefone,
          "CPF": cpf,
          "Descricao": descricao,
      }
      Toast.show({
        type: 'success',
        text1: 'Registro enviado!',
        text2: 'Registrado com sucesso 👌',
        visibilityTime: 5000,
      });
  };

  return (
    <ScrollView vertical style={{ flex: 1, padding: 20 }}>
      <TextInput placeholder="Nome" style={styles.input} value={nome} onChangeText={setNome}/>
      <TextInput placeholder="CPF" keyboardType="numeric" style={styles.input} value={cpf} onChangeText={setCpf} />
      <TextInput placeholder="Email" keyboardType="email" style={styles.input} value={email} onChangeText={setEmail} />
      <TextInput placeholder="Telefone" keyboardType="numeric" style={styles.input} value={telefone} onChangeText={setTelefone} />
      <TextInput
        style={styles.inputDescricao}
        multiline={true}
        numberOfLines={5}
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
      />
      <Toast position='center' />

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
          {images.map((uri, index) => (
            <Image
              key={index}
              source={{ uri }}
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

      <View style={{ flex: 0, justifyContent: "flex-end", marginBottom : 40 }}>
        <Button title="Salvar" onPress={Salvar} style={styles.btn_Salvar} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  btn_Salvar: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignSelf: "center",
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
  inputDescricao: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    height: 150,
    textAlignVertical: "top",
  },
});
