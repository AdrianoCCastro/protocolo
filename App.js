import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, Button } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { RegistraProtocolo } from "./components/registraProtocolo";
import  ListaProtocolos from "./components/listaProtocolos";
import { Inicio } from "./components/inicio";
import { Cadastrar } from "./components/Cadastrar";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Animatable from 'react-native-animatable'
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from "./config";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


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
function LoginScreen({ navigation,onLogin,biometria, autenticar }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  

  const salvarUsuarioLogado = async (token, user) => {
    console.log("Salvando token:", token);
    console.log("Salvando usuário:", user);
  
    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("usuario", JSON.stringify(user));
  
    // Verificar se salvou corretamente
    const tokenSalvo = await AsyncStorage.getItem("token");
    const usuarioSalvo = await AsyncStorage.getItem("usuario");
  
    console.log("Token salvo:", tokenSalvo);
    console.log("Usuário salvo:", JSON.parse(usuarioSalvo));
  };

  
  const realizarLogin = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/usuario/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          senha: senha,
        }),
      });
  
      const data = await response.json();
      console.log("Resposta da API:", data);
  
      if (response.ok) {
        const usuario = data.usuario;
  
        await AsyncStorage.setItem("usuario", JSON.stringify(usuario));
  
        const usuarioSalvo = await AsyncStorage.getItem("usuario");
        console.log("Usuário salvo:", JSON.parse(usuarioSalvo));
        
  
        Toast.show({
          type: 'success',
          text1: 'Login realizado com sucesso!',
          text2: 'Aguarde...',
        });
  
        await new Promise(resolve => setTimeout(resolve, 2000));
        onLogin();
      } else {
        Toast.show({
          type: 'error',
          text1: data.error || 'Erro no login',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro de conexão',
        text2: error.message,
      });
    }
  };
  

  return (
    <View style = {styles.container}>
                <Animatable.View animation = 'fadeInLeft' delay={500} style = {styles.containerHeader}>
                <Text style = {styles.message}>Bem-vindo(a)</Text>
                </Animatable.View>
    
                <Animatable.View animation = 'fadeInUp' style = {styles.containerForm}>
                    <Text styles = {styles.title}>Email</Text>    
                    <TextInput
                      placeholder="Digite um email..."
                      style={styles.input}
                      value={email}
                      onChangeText={setEmail}
                    />
                        
                    <Text styles = {styles.title}>Senha</Text>
                    <TextInput
                      placeholder="Digite a sua senha"
                      style={styles.input}
                      secureTextEntry
                      value={senha}
                      onChangeText={setSenha}
                    />
                        
                    <TouchableOpacity style = {styles.button}
                        onPress={realizarLogin}>
                        <Text style = {styles.buttonText}>Acessar</Text>
                    </TouchableOpacity>
    
                    <TouchableOpacity style = {styles.buttonRegister} onPress={() => navigation.navigate('Cadastrar')}>
                        <Text style = {styles.registerText}>Não possui uma conta? Cadastre-se</Text>
                    </TouchableOpacity>
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
                </Animatable.View>
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
    <Toast />
    </>
    
    
  );
}

const styles = StyleSheet.create ({
    container: {
        flex: 1,
        backgroundColor: '#4169E1',
    },
    containerHeader: {
       marginTop: '14%',
       marginBottom: '8%',
       paddingStart: '5%',   
    },
    message: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFF'
    },
    containerForm: {
        backgroundColor: '#FFF',
        flex: 1,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingStart: '5%',
        paddingEnd: '5%'
    },
    title:{
        fontSize: 20,
        marginTop: 28,        
    },
    input: {
        borderBottomWidth: 1,
        height: 40,
        marginBottom: 12,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#4169E1',
        widht: '100%',
        borderRadius: 4,
        paddingVertical: 8,
        marginTop: 14,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonRegister: {
        marginTop: 14,
        alignSelf: 'center',
    },
    registerText: {
        color: '#a1a1a1'
    },
    img:{
      width:100,
      height:100,
    }

})
