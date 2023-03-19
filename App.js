import * as React from 'react';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import 'react-native-gesture-handler';
import { Button, StyleSheet, Text, TextInput, View, Pressable, Image } from 'react-native';

import { useEffect, useState, createContext, useContext } from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

import HomeScreen from './pages/HomeScreen';
import AddTaskScreen from './pages/AddTaskScreen';
import DetailsScreen from './pages/DetailsScreen';
import ProfileScreen from './pages/ProfileScreen';
import SettingsScreen from './pages/SettingsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs({ route }) {
  const { username, userId, userEmail } = route.params;
  return (
    <Tab.Navigator
      screenOptions={
        ({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Tasks') {
              iconName = focused
                ? 'ios-checkmark-circle'
                : 'ios-checkmark-circle-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'ios-settings-sharp' : 'ios-settings-outline';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#F6A02D',
          tabBarInactiveTintColor: '#F6C481',
        })}>
      <Tab.Screen
        name="Tasks"
        component={HomeScreen}
        options={{ title: 'Tasks', headerShown: false }}
        initialParams={{ username: username, userId: userId, userEmail: userEmail }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Tab.Navigator>
  );
}

WebBrowser.maybeCompleteAuthSession();

export default function App() {

  //#region Google Authentication 
  const [token, setToken] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "772403710610-a7p8eit582enn9lvjnm33go45q6615ph.apps.googleusercontent.com",
    expoClientId: "772403710610-5f2goo0qhjkht5bpl58mlkjss2j6vt3n.apps.googleusercontent.com"
  });

  useEffect(() => {
    if (response?.type === "success") {
      setToken(response.authentication.accessToken);
      getUserInfo();
    }
  }, [response, token]);

  const getUserInfo = async () => {
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const user = await response.json();
      setUserInfo(user);
    } catch (error) {
      // Add your own error handler here
    }
  };
  //#endregion

  return (
    <NavigationContainer>
      {userInfo != null && userInfo.name != null ? (
        <Stack.Navigator
          initialRouteName="Feed"
        >
          <Stack.Screen
            name="Home"
            component={HomeTabs}
            options={{
              headerShown: false,
              tabBarLabel: 'Tasks',
            }}
            initialParams={{ username: userInfo.name, userId: userInfo.id, userEmail: userInfo.email }}
          />
          <Stack.Screen
            name="AddTask"
            component={AddTaskScreen}
            options={{
              presentation: 'modal', title: 'Add Task', headerShown: false
            }}
          />
          <Stack.Screen
            name="Details"
            component={DetailsScreen}
            options={{
              presentation: 'modal', title: 'Details Page', headerShown: false
            }}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              title: 'Profile Page'
            }}
          />
        </Stack.Navigator>
      ) : (
        <View style={styles.container}>
            <Image style={styles.appLogo} source={require('./assets/signing-screen-logo.png')} />
          <Pressable style={styles.button} disabled={!request} onPress={() => {
            promptAsync();
          }}>
            <Image style={styles.logo} source={require('./assets/google-logo.png')} />
            <View style={styles.textContainer}>
              <Text style={styles.text}>Sign in with Google</Text>
            </View>
          </Pressable>
          <Text style={styles.declaration}>By signing up, you agree to our Terms of Service and Privacy Policy</Text>
        </View>
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#444"
  },
  button: {
    flexDirection: "row",
    alignItems: 'center',
    borderColor: "rgb(220,220,220)",
    borderWidth: 1,
    borderRadius: 6,
    width: '90%',
    paddingVertical: 12,
    paddingHorizontal: 10
  },
  appLogo: {
    width: 180,
    height: 180,
    marginBottom: 200
  },
  logo: {
    width: 24,
    height: 24,
  },
  textContainer: {
    paddingHorizontal: 80,
    justifyContent: 'center',
  },
  declaration: {
    fontSize: 10,
    color: "#444",
    marginTop: 10
  }
});
