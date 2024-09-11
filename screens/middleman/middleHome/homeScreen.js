import { StyleSheet, BackHandler, Text, View, SafeAreaView, StatusBar, Image, ScrollView, Dimensions, TouchableOpacity } from 'react-native'
import { useEffect, useState } from 'react'; // Importar o useEffect e o useState
import React, { useCallback } from 'react'
import { Colors, Fonts, Sizes } from '../../../constants/styles'
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import BottomSheet from 'react-native-simple-bottom-sheet';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

//-----------------------------------------------------------------------------------------------------------------------
import * as Location from 'expo-location'; // Importar as funções de localização do Expo
//import { database } from '../../seu-firebase-config'; // Importar seu serviço em tempo real (Firebase, por exemplo)
//-----------------------------------------------------------------------------------------------------------------------

const { height } = Dimensions.get('screen');

const nearestCabs = [
    {
        id: '1',
        coordinate: {
            latitude: -8.848333,
            longitude: 13.235444,
        },
    },
    {
        id: '2',
        coordinate: {
            latitude: -8.858393,
            longitude: 13.234944,
        },
    },
    {
        id: '3',
        coordinate: {
            latitude: -8.839339,
            longitude: 13.244494,
        },
    },
    {
        id: '4',
        coordinate: {
            latitude: -8.838343,
            longitude: 13.274494,
        },
    },
    {
        id: '5',
        coordinate: {
            latitude: -8.838335,
            longitude: 13.284448,
        },
    },
];

const nearestLocations = [
    {
        id: '1',
        address: 'Luanda',
        addressDetail: 'Centralidade do kilamba, Y12',
    },
    {
        id: '2',
        address: 'Luanda',
        addressDetail: 'Rotunda do camama',
    },
];

const HomeScreen = ({ navigation }) => {

    //---------------------------------------------------------------------

    const [userLocation, setUserLocation] = useState(null);

    // Obtenha a localização do usuário
    useEffect(() => {
      getLocation();
    }, []);


    async function getLocation() {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.error('Permissão de localização negada');
          return;
        }
    
        let location = await Location.getCurrentPositionAsync({});
        setUserLocation(location.coords);
      }
    
      // ...
    
//-------------------------------------------------------------------------------


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

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1, }}>
                {nearestCabsInfo()}
                {currentLocationWithMenuIcon()}
                {nearestLocationsSheet()}
            </View>
            {exitInfo()}
        </SafeAreaView>
    )

    function currentLocationIcon() {
        return (
            <View style={styles.currentLocationIconWrapStyle}>
                <MaterialIcons name="my-location" size={20} color="black" />
            </View>
        )
    }

    function currentLocationWithMenuIcon() {
        return (
            <View style={styles.currentLocationWithIconWrapStyle}>
                <MaterialIcons name="menu" size={20} color={Colors.blackColor} onPress={() => { navigation.openDrawer() }} />
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginHorizontal: Sizes.fixPadding + 5.0 }}>
                    <MaterialIcons name="location-pin" size={20} color={Colors.primaryColor} />
                    <Text style={{ marginLeft: Sizes.fixPadding - 4.0, flex: 1, ...Fonts.blackColor15SemiBold }}>
                        Localização Actual
                    </Text>
                </View>
            </View>
        )
    }

    function nearestLocationsSheet() {
        return (
            <BottomSheet
                isOpen={false}
                sliderMinHeight={nearestLocations.length * 120 > height / 2.2 ? height / 2.2 : nearestLocations.length * 120}
                sliderMaxHeight={height - 100}
                lineContainerStyle={{ height: 0.0, marginVertical: Sizes.fixPadding + 5.0, }}
                lineStyle={styles.sheetIndicatorStyle}
                wrapperStyle={{ ...styles.bottomSheetWrapStyle, }}
            >
                {searchBar()}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingTop: Sizes.fixPadding, paddingBottom: Sizes.fixPadding * 3.0 }}
                >
                    {
                        nearestLocations.map((item, index) => (
                            <View
                                key={`${item.id}`}
                                style={{}}
                            >
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => { navigation.push('BookNow') }}
                                    style={{ flexDirection: 'row', alignItems: 'center', }}
                                >
                                    <View style={styles.iconCircleStyle}>
                                        <MaterialIcons name="star-border" size={18} color={Colors.lightGrayColor} />
                                    </View>
                                    <View style={{ flex: 1, marginLeft: Sizes.fixPadding + 5.0 }}>
                                        <Text style={{ ...Fonts.blackColor16SemiBold }}>
                                            {item.address}
                                        </Text>
                                        <Text style={{ ...Fonts.grayColor15Regular }}>
                                            {item.addressDetail}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                {
                                    nearestLocations.length - 1 == index
                                        ?
                                        null :
                                        <View style={{ backgroundColor: Colors.shadowColor, height: 1.0, marginVertical: Sizes.fixPadding + 5.0, }} />
                                }
                            </View>
                        ))
                    }
                </ScrollView>
                {currentLocationIcon()}
            </BottomSheet>
        )
    }

    function searchBar() {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => { navigation.push('DropOffLocation') }}
                style={styles.searchBarWrapStyle}
            >
                <MaterialIcons name="search" size={24} color={Colors.primaryColor} />
                <Text style={{ flex: 1, marginLeft: Sizes.fixPadding, ...Fonts.blackColor15SemiBold }}>
                    Pedir cisterna de água?
                </Text>
            </TouchableOpacity>
        )
    }

    function nearestCabsInfo() {
        const userCurrentLocation = {
            latitude: userLocation ? userLocation.latitude: 0,
            longitude: userLocation ? userLocation.longitude: 0,
        }
        const rotationsList = [120, 180, 120, 90, 180];
        return (
            <View style={{ flex: 1, }}>
                <MapView
                    region={{
                        latitude: userLocation ? userLocation.latitude : 0, // Use a localização do usuário se disponível
                        longitude: userLocation ? userLocation.longitude : 0,
                        latitudeDelta: 0.15,
                        longitudeDelta: 0.15,
                      }}
                      style={{ height: '100%' }}
                      provider={PROVIDER_GOOGLE}
                      mapType="terrain"
                >
                    {
                        nearestCabs.map((item, index) => (
                            <Marker key={`${item.id}`} coordinate={item.coordinate}>
                                <Image
                                    source={require('../../../assets/images/icons/cab.png')}
                                    style={{
                                        width: 23.0, height: 43.0, resizeMode: 'contain',
                                        transform: [{ rotate: `${rotationsList[index]}deg` }]
                                    }}
                                />
                            </Marker>
                        ))
                    }
                    <Marker coordinate={userLocation ? userLocation : { latitude: 0, longitude: 0 }}>
                        <Image
                            source={require('../../../assets/images/icons/marker2.png')}
                            style={{ width: 70.0, height: 70.0, resizeMode: 'contain' }}
                        />
                    </Marker>
                </MapView>
            </View>
        )
    }

    function exitInfo() {
        return (
            backClickCount == 1
                ?
                <View style={styles.exitInfoWrapStyle}>
                    <Text style={{ ...Fonts.whiteColor15SemiBold }}>
                        Pressione mais duas vezes para sair
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
    bottomSheetWrapStyle: {
        paddingBottom: Sizes.fixPadding - 5.0,
        paddingTop: Sizes.fixPadding + 5.0,
        paddingHorizontal: Sizes.fixPadding * 2.0,
        borderTopLeftRadius: Sizes.fixPadding * 2.5,
        borderTopRightRadius: Sizes.fixPadding * 2.5,
        backgroundColor: Colors.whiteColor,
    },
    searchBarWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.shadowColor,
        borderRadius: Sizes.fixPadding - 5.0,
        paddingHorizontal: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding + 5.0,
        marginBottom: Sizes.fixPadding * 2.0,
    },
    currentLocationWithIconWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.whiteColor,
        paddingHorizontal: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding * 2.0,
        borderRadius: Sizes.fixPadding - 5.0,
        margin: Sizes.fixPadding * 2.0,
        position: 'absolute',
    },
    currentLocationIconWrapStyle: {
        top: -100.0,
        right: 0.0,
        position: "absolute",
        flex: 1,
        borderRadius: 20.0,
        width: 40.0,
        height: 40.0,
        backgroundColor: Colors.whiteColor,
        elevation: 2.0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    iconCircleStyle: {
        backgroundColor: Colors.shadowColor,
        width: 30.0,
        height: 30.0,
        borderRadius: 15.0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    sheetIndicatorStyle: {
        width: 50,
        height: 5.0,
        backgroundColor: Colors.primaryColor,
        borderRadius: Sizes.fixPadding
    }
})