import { StyleSheet, Text, View, Button } from "react-native";
import { useEffect, useState, createContext, useContext} from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";


const LoginScreen = ({ navigation }) => {
    const contextType = AuthContext;

    return (
        <View style={styles.container}>
            <Button
                title="Sign in with Google"
                disabled={!request}
                onPress={() => {
                    promptAsync();
                }}
            />
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        fontSize: 20,
        fontWeight: "bold",
    },
});

export default LoginScreen;