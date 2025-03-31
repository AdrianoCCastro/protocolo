import React from "react";
import { View, Text, TextInput, Button } from "react-native";

export function LoginScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Login</Text>
      <TextInput placeholder="Usuário" style={{ borderBottomWidth: 1, width: 200, marginBottom: 10 }} />
      <TextInput placeholder="Senha" secureTextEntry style={{ borderBottomWidth: 1, width: 200, marginBottom: 10 }} />
      <Button title="Entrar" onPress={() => navigation.replace("Main")} />
    </View>
  );
}
