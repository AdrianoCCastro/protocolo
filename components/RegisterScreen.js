import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, Button, Image, TouchableOpacity,Alert} from "react-native";
import * as ImagePicker from "expo-image-picker";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
export function RegisterScreen() {
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.uri);
    }
  };
  
  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permissão para acessar a localização foi negada');
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location.coords);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TouchableOpacity onPress={pickImage}>
        <Image  source={require("../assets/images/perfil.png")} style={{ width: 100, height: 100, marginTop: 10 }}  />
      </TouchableOpacity>
      
      
      <TextInput placeholder="Nome" style={styles.input} />
      <TextInput placeholder="CPF" keyboardType="numeric" style={styles.input} />
      <TextInput placeholder="Telefone" keyboardType="numeric" style={styles.input} />
      
      {image && <Image source={{ uri: image }} style={{ width: 100, height: 100, marginTop: 10 }} />}
      
      <Button title="Obter Localização" onPress={getLocation} />
      {location && (
        <MapView
          style={{ width: '100%', height: 200, marginTop: 10 }}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} />
        </MapView>
        
      )}
       <View style={{ flex: 1, justifyContent: "flex-end" }}>
       <Button title="Salvar"  onPress={() => Alert.alert("Salvou!")} style ={styles.btn_Salvar}/>
       </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
    input:{
      borderBottomWidth: 1,
      marginBottom: 10

    },
    btn_Salvar:{
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignSelf: "center",
    }
})