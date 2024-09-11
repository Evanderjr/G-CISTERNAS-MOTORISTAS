import { Text, View, SafeAreaView, StatusBar, Image, BackHandler } from 'react-native'
import React, { useCallback } from 'react'
import { Colors, Fonts, Sizes } from '../constants/styles'
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { loginSlice } from "../redux/features/login/loginSlice";

const SplashScreen = ({ navigation }) => {

    const backAction = () => {
        BackHandler.exitApp();
        return true;
    }

    useFocusEffect(
        useCallback(() => {
            BackHandler.addEventListener("hardwareBackPress", backAction);
            return () => BackHandler.removeEventListener("hardwareBackPress", backAction);
        }, [backAction])
    );

    const dispatch = useDispatch();

    const fetchUser = async () =>  {
        const token = await AsyncStorage.getItem('token');
    
        const data = JSON.parse(token);
        console.log("TOOOKEN", data);
    
        if(token !== null)
        {
          dispatch(loginSlice.actions.setLoggedUser(data));
          navigation.push("Home");
        }else
        {
          navigation.push("SelectService");
        }
      }

    setTimeout(() => {
        fetchUser();
        //navigation.push("Phone");
    }, 2000);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                {appIcon()}
                {appName()}
            </View>
            <Text style={{ textAlign: 'center', margin: Sizes.fixPadding, ...Fonts.grayColor12SemiBold }}>
                Serviços APP
            </Text>
        </SafeAreaView>
    )

    function appName() {
        return (
            <Text style={{ marginTop: Sizes.fixPadding, letterSpacing: 3.0, ...Fonts.primaryColor24RasaBold }}>
                Global Cisternas
            </Text>
        )
    }

    function appIcon() {
        return (
            <Image
                source={require('../assets/images/appIcon.png')}
                style={{ width: 66.0, height: 66.0, resizeMode: 'contain' }}
            />
        )
    }
}

export default SplashScreen;