import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { Ionicons } from "@expo/vector-icons";

WebBrowser.maybeCompleteAuthSession();

export default function LoginGoogle({ autenticar }) {
    const [request, response, promptAsync] = Google.useAuthRequest({
        expoClientId: '1001857153786-0hvseeu7adtgn7g9dhghqlf6u8457j8h.apps.googleusercontent.com',
        androidClientId: '1001857153786-i2akk6b63hch8c2h6rq9nghvbcitgcs9.apps.googleusercontent.com',
        webClientId: '1001857153786-0hvseeu7adtgn7g9dhghqlf6u8457j8h.apps.googleusercontent.com',
        redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    });
    console.log(AuthSession.makeRedirectUri({ useProxy: true }));
    useEffect(() => {
        if (response?.type === 'success') {
            const { authentication } = response;
            autenticar(true);
            console.log('Token de acesso:', authentication.accessToken);
        }
    }, [response]);

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.googleButton}
                disabled={!request}
                onPress={() => promptAsync({ useProxy: true })}
            >
                <Ionicons name="logo-google" size={32} color="#fff" style={{ marginRight: 10 }} />
                <Text style={styles.googleButtonText}>Entrar com o Google</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#bf0a0a',
        paddingVertical: 14,
        paddingHorizontal: 25,
        borderRadius: 30,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    googleButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
});
