import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { setProtocolos } from './listaProtocolos'

export default function BotaoDeletar({ id, onPress, size = 32, color = "#FFF" }) {

    return (
        <TouchableOpacity onPress={onPress}>
            <Ionicons name="trash-outline" size={size} color={color} />
        </TouchableOpacity>
    );
}
