import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, Button, Image, TouchableOpacity, Alert } from "react-native";
import { pickImage } from "./camera";
import { Ionicons } from "@expo/vector-icons";
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from '@react-navigation/native';


export function Cadastrar() {
    const [images, setImages] = useState([]);
    const [nome, setNome] = useState('');
    const [sobreNome, setSobreNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [telefone, setTelefone] = useState('');
    const navigation = useNavigation();


    

    const Salvar = async () => {
      const formData = new FormData();
    
      formData.append("first_name", nome);
      formData.append("last_name", sobreNome);
      formData.append("email", email);
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
        const response = await axios.post("http://192.168.0.101:8000/usuario/add/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
    
        Toast.show({
          type: 'success',
          text1: 'Cadastro realizado!',
          text2: response.data.message,
        });

        setTimeout(() => {
          navigation.navigate('Login');
        }, 2000);
      } catch (error) {
        console.error(error.response.data);
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
            <Text style={styles.title}>Cadastro</Text>
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
             <Toast position='center' />
        </View>
        
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        backgroundColor: "#fff"
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
        marginTop: 10,
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
      },
});
