import { StyleSheet, BackHandler, Text, View, SafeAreaView, StatusBar, ImageBackground, Image, TouchableOpacity, Alert } from 'react-native'
import React, { useState, useCallback,useEffect } from 'react'
import { Colors, Fonts, Sizes } from '../../../constants/styles'
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import RideRequestsScreen from '../rideRequests/rideRequestsScreen';

import * as Location from 'expo-location';

const HomeScreen = ({ navigation }) => {

    const backAction = () => {
        backClickCount == 1 ? BackHandler.exitApp() : _spring();
        return true;
    }

    useFocusEffect(
        useCallback(() => {
            BackHandler.addEventListener("hardwareBackPress", backAction);
            return () => BackHandler.removeEventListener("hardwareBackPress", backAction);
        }, [backAction])
    );

    function _spring() {
        setBackClickCount(1);
        setTimeout(() => {
            setBackClickCount(0)
        }, 1000)
    }

    const [backClickCount, setBackClickCount] = useState(0);
    const [showMenu, setShowMenu] = useState(false);
    const [isOnline, setIsOnline] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    //---------------------------------
    useEffect(() => {
      /*  const getLocationAsync = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                console.log("Permission to access location was denied");
                return;
            }

            let location = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.BestForNavigation,
                    timeInterval: 1000, // intervalo de atualização em milissegundos
                },
                (location) => {
                    setUserLocation({
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                    });
                }
            );

            Alert.alert("Coordenadas: ", userLocation);
            console.log("User Loc ", userLocation);
        };

        getLocationAsync();

        return () => {
            // Limpar a assinatura da localização quando o componente é desmontado
            if (userLocation) {
                userLocation.remove();
            }
        };*/
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
            {
                isOnline
                    ?
                    <RideRequestsScreen navigation={navigation} onPress={() => { setIsOnline(false) }} />
                    :
                    <View style={{ flex: 1, }}>
                        {mapViewWithCurrentLoc()}
                        {onlineOffLineInfoWithIcons()}
                        {goOnlineButton()}
                        {currentLocationIcon()}
                    </View>
            }
            {exitInfo()}
        </SafeAreaView>
    )
    //-------------------------------------------


    function goOnlineButton() {
        return (
            isOnline
                ?
                null
                :
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        setIsOnline(true)
                        setShowMenu(false)
                    }}
                >
                    <ImageBackground
                        source={require('../../../assets/images/icons/circle.png')}
                        style={styles.goOnlineButtonBgImageStyle}
                    >
                        <Text style={{ textAlign: 'center', ...Fonts.whiteColor18ExtraBold }}>
                            Ir{`\n`}Online
                        </Text>
                    </ImageBackground>
                </TouchableOpacity>
        )
    }

    {/*function ridesInfo() {
        return (
            <View style={styles.ridesInfoWrapStyle}>
                <Image
                    source={require('../../assets/images/users/user1.png')}
                    style={{ width: 50.0, height: 50.0, borderRadius: 25.0, }}
                />
                <View style={{ flex: 1, marginLeft: Sizes.fixPadding + 5.0, }}>
                    <Text style={{ ...Fonts.whiteColor13Bold }}>
                        3 Corridas | KZ 80.000
                    </Text>
                    <Text style={{ marginTop: Sizes.fixPadding - 5.0, ...Fonts.whiteColor12SemiBold }}>
                        Hoje
                    </Text>
                </View>
            </View>
        )
    }*/}

    function currentLocationIcon() {
        return (
            <View style={styles.currentLocationIconWrapStyle}>
                <MaterialIcons name="my-location" size={20} color="black" />
            </View>
        )
    }

    function onlineOffLineInfoWithIcons() {
        return (
            <View style={styles.onlineOffLineInfoWithIconsOuterWrapStyle}>
                <View style={styles.currentLocationWithIconWrapStyle}>
                    <MaterialIcons name="menu" size={20} color={Colors.blackColor} onPress={() => { navigation.openDrawer() }} />
                    <View style={{ maxWidth: '80%', alignItems: 'center', justifyContent: 'center', }}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => { setShowMenu(false) }}
                            style={styles.rowAlignCenterStyle}
                        >
                            <View style={{ ...styles.onlineOfflineIndicatorStyle, backgroundColor: !isOnline ? Colors.redColor : Colors.primaryColor }} />
                            <Text numberOfLines={1} style={{ textAlign: 'center', marginLeft: Sizes.fixPadding, ...Fonts.blackColor15SemiBold }}>
                                {isOnline ? 'Online' : 'Offline'}
                            </Text>
                        </TouchableOpacity>
                        {
                            showMenu
                                ?
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => {
                                        setIsOnline(!isOnline)
                                        setShowMenu(false)
                                    }}
                                    style={{ marginTop: Sizes.fixPadding * 2.0, ...styles.rowAlignCenterStyle }}
                                >
                                    <View style={{ ...styles.onlineOfflineIndicatorStyle, backgroundColor: !isOnline ? Colors.primaryColor : Colors.redColor }} />
                                    <Text numberOfLines={1} style={{ textAlign: 'center', marginLeft: Sizes.fixPadding, ...Fonts.blackColor15SemiBold }}>
                                        {!isOnline ? 'Online' : 'Offline'}
                                    </Text>
                                </TouchableOpacity>
                                :
                                null
                        }
                    </View>
                    <MaterialIcons name="keyboard-arrow-down" size={20} color={Colors.primaryColor} onPress={() => { setShowMenu(!showMenu) }} />
                </View>
            </View>
        )
    }

    function mapViewWithCurrentLoc() {
        return (
            <View style={{ flex: 1 }}>
                <MapView
                    region={{
                        latitude: userLocation ? userLocation.latitude : 0,
                        longitude: userLocation ? userLocation.longitude : 0,
                        latitudeDelta: 0.15,
                        longitudeDelta: 0.15,
                    }}
                    style={{ height: '100%' }}
                    provider={PROVIDER_GOOGLE}
                    mapType="terrain"
                >
                    {userLocation && (
                        <Marker coordinate={userLocation}>
                            <Image
                                source={require('../../../assets/images/icons/cab.png')}
                                style={{ width: 25.0, height: 45.0, resizeMode: 'contain' }}
                            />
                        </Marker>
                    )}
                </MapView>
            </View>
        );
    }
    

    function exitInfo() {
        return (
            backClickCount == 1
                ?
                <View style={styles.exitInfoWrapStyle}>
                    <Text style={{ ...Fonts.whiteColor15SemiBold }}>
                        Pressione duas vezes para sair
                    </Text>
                </View>
                :
                null
        )
    }
}

export default HomeScreen

const styles = StyleSheet.create({
    exitInfoWrapStyle: {
        backgroundColor: Colors.lightBlackColor,
        position: "absolute",
        bottom: 20,
        alignSelf: 'center',
        borderRadius: Sizes.fixPadding * 2.0,
        paddingHorizontal: Sizes.fixPadding + 5.0,
        paddingVertical: Sizes.fixPadding,
        justifyContent: "center",
        alignItems: "center",
    },
    currentLocationWithIconWrapStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: Colors.whiteColor,
        paddingHorizontal: Sizes.fixPadding + 3.0,
        paddingVertical: Sizes.fixPadding * 2.0,
        borderRadius: Sizes.fixPadding - 5.0,
        margin: Sizes.fixPadding * 2.0,
        elevation: 2.0,
    },
    currentLocationIconWrapStyle: {
        bottom: 20.0,
        right: 20.0,
        position: "absolute",
        borderRadius: 20.0,
        width: 40.0,
        height: 40.0,
        backgroundColor: Colors.whiteColor,
        elevation: 2.0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    onlineOfflineIndicatorStyle: {
        width: 8.0,
        height: 8.0,
        borderRadius: 4.0,
    },
    ridesInfoWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.lightBlackColor,
        borderRadius: Sizes.fixPadding - 5.0,
        position: 'absolute',
        left: 20.0, right: 20.0,
        top: 95.0,
        padding: Sizes.fixPadding,
    },
    onlineOffLineInfoWithIconsOuterWrapStyle: {
        position: 'absolute',
        left: 0.0,
        right: 0.0,
        zIndex: 1,
    },
    rowAlignCenterStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    goOnlineButtonBgImageStyle: {
        width: 110.0,
        height: 110.0,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 80.0,
        alignSelf: 'center',
    }
})