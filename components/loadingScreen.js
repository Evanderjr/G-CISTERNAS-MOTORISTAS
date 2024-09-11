import React, { useEffect } from "react";
import { View } from "react-native";
import * as Font from "expo-font";
import { Colors } from "../constants/styles";

const LoadingScreen = ({ navigation }) => {

    useEffect(() => {
        async function loadFont() {
            await Font.loadAsync({
                NunitoSans_Regular: require("../assets/fonts/NunitoSans-Regular.ttf"),
                NunitoSans_SemiBold: require("../assets/fonts/NunitoSans-SemiBold.ttf"),
                NunitoSans_Bold: require("../assets/fonts/NunitoSans-Bold.ttf"),
                NunitoSans_ExtraBold: require("../assets/fonts/NunitoSans-ExtraBold.ttf"),
                Rasa_Bold: require("../assets/fonts/Rasa-Bold.ttf"),
            });
            navigation.navigate('Splash');
        }
        loadFont();
    })
    return (
        <View style={{ flex: 1, backgroundColor: Colors.whiteColor }} />
    )
}

export default LoadingScreen;