import React from "react";
import { View } from "react-native";

<View style={{ marginBottom: 20 }}>
  <Button
    title="Avançar estado"
    onPress={async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/protocolo/altera_estado/${protocolo}/`,
          { method: "POST" }
        );

        const result = await response.json();
        if (response.ok) {
          console.log("Sucesso", result.mensagem);
          onUpdate();

        } else {
          Alert.alert("Erro", result.detail || "Não foi possível alterar o estado");
        }
      } catch (error) {
        console.error("Erro ao alterar estado:", error);
        console.log("Erro", "Erro ao tentar alterar estado.");
      }
    }}
  />
</View>