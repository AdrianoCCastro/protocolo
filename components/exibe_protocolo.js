import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import { API_BASE_URL } from "../config";
import { useRoute } from "@react-navigation/native";
import * as Animatable from 'react-native-animatable';

export default function ExibeProtocolo() {
  const route = useRoute();
  const { protocoloId } = route.params;

  const [protocolo, setProtocolo] = useState(null);
  const [images, setImages] = useState([]);
  const [imagemSelecionada, setImagemSelecionada] = useState(null);

  const buscaProtocoloPorId = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/processo/ExibeProtocolo/${protocoloId}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar protocolo. Status: ' + response.status);
      }

      const data = await response.json();
      setProtocolo(data);
      setImages(data.imagens_urls || []);
    } catch (error) {
      console.error("Erro ao buscar protocolo:", error);
    }
  };

  useEffect(() => {
    buscaProtocoloPorId();
  }, []);

  return (
    <View style={styles.container}>
      {protocolo ? (
        <>
         <Animatable.View delay={600} animation = "fadeInRight">
            <Text style={styles.title}>{protocolo.titulo}</Text>
         </Animatable.View>
          
          <Animatable.View delay={600} animation = "fadeInUp" style={styles.containerProtocolo}>
          
            <Text style={styles.text}>{protocolo.descricao}</Text>
                            
            
            
            {images.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                {images.map((img, index) => (
                  <TouchableOpacity key={index} onPress={() => setImagemSelecionada(`${API_BASE_URL}${img.imagem}`)}>
                    
                    <Animatable.Image
                      animation = "flipInY"
                      delay={index * 1000}
                      source={{ uri: `${API_BASE_URL}${img.imagem}` }}
                      style={styles.img}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}                          
          </Animatable.View>
          <Animatable.View delay={800} animation = "fadeInUp" style={[styles.footer, { backgroundColor: protocolo.cor }]}>                 
              <View style={styles.footerItem}>
                <Text style={styles.footerLabel}>Status</Text>
                <Text style={styles.footerNumber}>{protocolo.estado}</Text>
                
              </View>
          </Animatable.View>
        </>
      ) : (
        <Text>Protocolo não encontrado</Text>
      )}
      

      {imagemSelecionada && (
        <View style={styles.imageViewer}>
          <TouchableOpacity onPress={() => setImagemSelecionada(null)} style={styles.closeButton}>
            <Text style={{ color: "#fff", fontSize: 18 }}>Fechar</Text>
          </TouchableOpacity>
          <Image
            source={{ uri: imagemSelecionada }}
            style={styles.selectedImage}
            resizeMode="contain"
          />
        </View>
      )}
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
    marginTop: 28,
    marginBottom: 12,
    color: '#FFF'
  },
  containerProtocolo: {
    backgroundColor: '#FFF',
    flex: 1,
    width: '100%',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingStart: '5%',
    paddingEnd: '5%',
    justifyContent: 'space-between',  
  },
  status: {
    color: '#a1a1a1',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  text: {
    color: '#a1a1a1',
    flex: 1,
    paddingTop:30,
    fontSize: 16,
     
  },
  img: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 8,
  },
  imageViewer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
  },
  selectedImage: {
    width: "90%",
    height: "70%",
    borderRadius: 10,
  },
  footerItem: {
    alignItems: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    width: '100%',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    paddingStart: '5%',
    paddingEnd: '5%',
    
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
