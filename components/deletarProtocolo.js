import React from 'react';
import { Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from '../config';
import { TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';

export default function DeletarProtocolo({ id }) {
    const navigation = useNavigation();

    const handleDelete = () => {
        Alert.alert(
            "Confirmar exclusão",
            "Tem certeza que deseja excluir este protocolo?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const response = await fetch(`${API_BASE_URL}/protocolo/${id}`, {
                                method: 'DELETE',
                            });

                            if (response.ok) {

                                Toast.show({
                                    type: 'success',
                                    text1: 'deletado com sucesso!',
                                    text2: 'Aguarde...',
                                });
                                setTimeout(() => {
                                    navigation.navigate("Tabs", { screen: "Protocolos", params: { atualizar: true } });
                                }, 2500);

                            } else {
                                Alert.alert("Erro", "Não foi possível excluir.");
                            }
                        } catch (error) {
                            console.error("Erro ao excluir:", error);
                            Alert.alert("Erro", "Ocorreu um erro ao tentar excluir.");
                        }
                    }
                }
            ]
        );
    };

    return (

        <TouchableOpacity onPress={handleDelete}>
            <Ionicons name="trash-outline" size={32} color="#FFF" />
        </TouchableOpacity>
    );
}
