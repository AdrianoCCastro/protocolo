import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, Button, Image, TouchableOpacity, ScrollView } from "react-native";
import { pickImage } from "./camera";
import { Ionicons } from "@expo/vector-icons";
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from "../config";


export function Cadastrar() {
  const [images, setImages] = useState([]);
  const [nome, setNome] = useState('');
  const [sobreNome, setSobreNome] = useState('');
  const [CPF, setCPF] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [telefone, setTelefone] = useState('');
  const navigation = useNavigation();

  const Salvar = async () => {
    const formData = new FormData();

    formData.append("first_name", nome);
    formData.append("last_name", sobreNome);
    formData.append("email", email);
    formData.append("CPF", CPF);
    formData.append("telefone", telefone);
    formData.append("password", senha);
    formData.append("username", email);

    if (images.length > 0) {
      formData.append("foto", {
        uri: images[0],
        type: "image/jpeg",
        name: "profile.jpg"
      });
    }

    try {
      const response = await fetch(`${API_BASE_URL}/usuarios`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log("Erro no backend:", errorData);
        throw new Error("Erro na requisição");
      }

      const data = await response.json();

      Toast.show({
        type: 'success',
        text1: 'Cadastro realizado!',
        text2: data.message || 'Usuário cadastrado com sucesso!',
      });

      setTimeout(() => {
        navigation.navigate('Login');
      }, 2000);
    } catch (error) {
      console.error("Erro no cadastro:", error.message);
      Toast.show({
        type: 'error',
        text1: 'Erro no cadastro',
        text2: 'Verifique os dados e tente novamente',
      });
    }
  };


  const handlePickImage = async () => {
    const uri = await pickImage();
    if (uri) {
      setImages([uri]);
    }
  };


  return (

    <View style={styles.container}>
      <Toast position='center' />
      <ScrollView style={styles.containerProtocolo}>
        <TouchableOpacity onPress={handlePickImage}>
          <Image
            source={
              images.length > 0
                ? { uri: images[0] }
                : require("../assets/images/perfil.png")
            }
            style={styles.image}
          />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Nome:"
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          style={styles.input}
          placeholder="Sobrenome:"
          value={sobreNome}
          onChangeText={setSobreNome}
        />
        <TextInput
          style={styles.input}
          placeholder="CPF:"
          value={CPF}
          onChangeText={setCPF}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Email:"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha:"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Telefone:"
          value={telefone}
          onChangeText={setTelefone}
          keyboardType="phone-pad"
        />


        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={handlePickImage} style={styles.iconButton}>
            <Ionicons name="camera" size={32} color="black" />
          </TouchableOpacity>

          <TouchableOpacity onPress={Salvar} style={styles.iconButton}>
            <Ionicons name="save-outline" size={32} color="black" />
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>


  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
    backgroundColor: "#4169E1",
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 50,
    marginBottom: 15,
    alignSelf: 'center',
    borderRadius: 100,
    borderWidth: 7,
    borderColor: '#000',
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: 10,
    padding: 20
  },
  containerProtocolo: {
    backgroundColor: '#FFF',
    paddingBottom: 30,
    width: '100%',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    paddingStart: '5%',
    paddingEnd: '5%',
  },
});
