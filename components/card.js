import {React} from "react";
import { View, Text, Image, StyleSheet,Button,TouchableOpacity} from "react-native";
import { API_BASE_URL } from "../config";

export default function Card({
  imgSrc,
  titulo,
  descricao,  
  status,
  color,
  protocolo,
  onUpdate,
  onPress
}) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(protocolo)}>
      <Image source={{ uri: imgSrc }} style={styles.image} />
      <View style={styles.body}>
        <Text style={styles.title}>{titulo}</Text>
        <Text style={styles.description}>{descricao}</Text>
      </View>
      <View style={[styles.footer, { backgroundColor: color }]}>                 
        <View style={styles.footerItem}>
          <Text style={styles.footerLabel}>Status</Text>
          <Text style={styles.footerNumber}>{status}</Text>
          
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 300,
    backgroundColor: "#fff",
    borderRadius: 15,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 4,
  },
  image: {
    width: "100%",
    height: 150,
  },
  body: {
    padding: 16,
    alignItems: "center",
  },
  spanTag: {
    fontWeight: "bold",
  },
  title: {
    fontSize: 18,
    marginTop: 8,
    marginBottom: 8,
    fontWeight: "600",
  },
  description: {
    textAlign: "center",
    color: "#555",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
  },
  footerItem: {
    alignItems: "center",
  },
  footerNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  footerLabel: {
    fontSize: 12,
    color: "#fff",
  },
});
