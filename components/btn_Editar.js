import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function BotaoEditar({ id, titulo, descricao, latitude, longitude, onPress, size = 32, color = "#FFF" }) {
    const navigation = useNavigation();

    const Editar = () => {
        navigation.navigate("Tabs", {
            screen: "Registrar",
            params: {
                atualizar: true,
                id: id,
                titulo_param: titulo,
                descricao_param: descricao,
                latitude_param: latitude,
                longitude_param: longitude
            }
        });
    }

    return (
        <TouchableOpacity onPress={Editar}>
            <Ionicons name="create-outline" size={size} color={color} />
        </TouchableOpacity>
    );
}


