import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, Button, Image, TouchableOpacity, Alert } from "react-native";
import { pickImage } from "./camera";
import { Ionicons } from "@expo/vector-icons";
import Toast from 'react-native-toast-message';


export function Cadastrar() {
    const [images, setImages] = useState([]);
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [telefone, setTelefone] = useState('');


    const Salvar = () => {
       
        let dados = {
            "Nome": nome ,
            "Email" : email,
            "Telefone" : telefone,
            "senha": senha,
        }
        Toast.show({
            type: 'success',
            text1: 'Cadastro enviado!',
            text2: 'Usuário cadastrado com sucesso 👌',
            visibilityTime: 5000, // 5 segundos
          });
        console.log(dados);
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
                placeholder="Nome completo:"
                value={nome}
                onChangeText={setNome}
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
                <TouchableOpacity onPress={pickImage} style={styles.iconButton}>
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
        borderRadius: 30,
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
