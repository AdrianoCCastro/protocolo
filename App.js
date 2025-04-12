import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, Button } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { RegistraProtocolo } from "./components/registraProtocolo";
import { ListaProtocolos} from "./components/listaProtocolos";
import { Inicio } from "./components/inicio";
import { Cadastrar } from "./components/Cadastrar";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Toast from 'react-native-toast-message';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Telas com Abas
function TelaSegura({ onLogout }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Registrar") iconName = "document-text-outline";
          else if (route.name === "Inicio") iconName = "home-outline";
          else if (route.name === "Protocolos") iconName = "list-outline";
          else if (route.name === "Sair") iconName = "log-out";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Inicio" component={Inicio} />
      <Tab.Screen name="Registrar" component={RegistraProtocolo} />
      <Tab.Screen name="Protocolos" component={ListaProtocolos} />
      <Tab.Screen name="Sair">
        {() => <LogoutScreen onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

// Tela de Logout
function LogoutScreen({ onLogout }) {
  return (
    <View style={styles.screen}>
      <Text>Tem certeza que deseja sair?</Text>
      <TouchableOpacity style={styles.button} onPress={onLogout}>
        <Text style={{ color: "white" }}>Sim</Text>
      </TouchableOpacity>
    </View>
  );
}

// Tela de Login
function LoginScreen({ navigation, onLogin, biometria, autenticar }) {
  return (
    <View style={styles.container}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Image source={require("./assets/logo2.jpg")} style={styles.img} />
        <Text style = {styles.text}>Protocolo Online</Text>
        <TextInput placeholder="Usuário" style={styles.input} />
        <TextInput placeholder="Senha" secureTextEntry style={styles.input} />
        <View style={styles.iconContainer}>
          <Button title="Entrar" onPress={onLogin} />
          <Button title="Cadastrar" color={"red"} onPress={() => navigation.navigate("Cadastrar")} />
        </View>
      </View>

      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>
          {biometria
            ? "Ou faça o login com biometria"
            : "Dispositivo não compatível com biometria"}
        </Text>
        <TouchableOpacity onPress={autenticar}>
          <Image source={require("./assets/digital.png")} style={styles.img} />
        </TouchableOpacity>
        <StatusBar style="auto" />
      </View>
    </View>
  );
}

export default function App() {
  const [biometria, setBiometria] = useState(false);
  const [logado, setLogado] = useState(false);

  useEffect(() => {
    (async () => {
      const compativel = await LocalAuthentication.hasHardwareAsync();
      setBiometria(compativel);
    })();
  }, []);

  const autenticar = async () => {
    const authentication = await LocalAuthentication.authenticateAsync();
    if (authentication.success) {
      setLogado(true);
    }
  };

  return (
    <>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!logado ? (
          <>
            <Stack.Screen name="Login">
              {({ navigation }) => (
                <LoginScreen
                  navigation={navigation}
                  onLogin={() => setLogado(true)}
                  biometria={biometria}
                  autenticar={autenticar}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Cadastrar" component={Cadastrar} />
          </>
        ) : (
          <Stack.Screen name="Main">
            {() => <TelaSegura onLogout={() => setLogado(false)} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
      
    </NavigationContainer>
    
    </>
    
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input:{
    borderBottomWidth: 1,
    width: 200,
    marginBottom: 20,
    padding: 10,
  },
  img: {
    width: 100,
    height: 100,
  },
  button: {
    padding: 10,
    backgroundColor: "blue",
    borderRadius: 5,
    marginTop: 10,
    
  },
  iconContainer: {
    flexDirection: "row", 
    justifyContent: "space-around", 
    alignItems: "center", 
    marginVertical: 10,
    marginHorizontal:10,
     
  },
  text: {
    padding: 5,
    fontSize: 28,
    fontWeight: 'bold'
  }
});
