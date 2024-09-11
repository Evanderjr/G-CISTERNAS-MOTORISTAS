import { StyleSheet, Text, View, StatusBar, SafeAreaView, Image, Dimensions, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { Colors, Fonts, Sizes } from '../../../constants/styles'
import MapViewDirections from 'react-native-maps-directions';
import { Key } from "../../../constants/key";
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from "react-native-maps";
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { firebase } from '../../../config';
import { useSelector, useDispatch } from "react-redux";
import { services } from '../../../services';
import { requestSlice } from '../../../redux/features/request/requestSlice';


const { width, height } = Dimensions.get('window');

const EndRideScreen = ({ navigation }) => {
    const [driverLocation, setDriverLocation] = useState(null);
    const [passengerLocation, setPassengerLocation] = useState(null);
    //-----------------------------------------------------------------------------
    const getLocation = async () => {
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            console.error('Permissão de localização não concedida');
            return;
          }
      
          const driverLocation = await Location.getCurrentPositionAsync({});
          setDriverLocation(driverLocation.coords);
      
          // Defina a localização do cliente aqui também, da mesma maneira.
        } catch (error) {
          console.error('Erro ao obter a localização:', error);
        }
      };
      
      useEffect(() => {
        getLocation();
        getClientInfo();
      }, []);
//--------------------------------------------------------------------------------------------------      

const [username, setUsername] = useState("");
  const [image, setImage] = useState("");

  const dispatch = useDispatch();

  const request = useSelector((state) => state.request);
  const requestInfo = request?.requestInfo;

  const getClientInfo = async () => {

    const response = await services.request.getRequest({
      "id": requestInfo?.id
    });

    const client_id = response?.data?.data?.id_client;

    if (response?.status == 200) {

        console.log("OIEECLIENT", client_id);

      const response = await services.clients.getClient({
        "id": client_id
      });

      const user_id = response?.data?.data?.id_user;

      console.log("OIEE", user_id);

      if (response?.status == 200) {

        const response = await services.user.getUser({
          "id": user_id
        });

        if (response?.status == 200) {
          setUsername(response?.data?.data?.username);
          setImage(response?.data?.data?.avatar);
          getMediaData();
        }
      }
    }
  }

  async function getMediaData() {
    const mediRefs = firebase.storage().ref(image);
    const link = await mediRefs.getDownloadURL();
    setImage(link);
    console.log("Olha a imagem", link);
  }


return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.shadowColor }}>
            <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1, }}>
                {directionInfo()}
                {header()}
                {passengerInfoSheet()}
            </View>
        </SafeAreaView>
    )

    function passengerInfoSheet() {
        return (
            <Animatable.View
                animation="slideInUp"
                iterationCount={1}
                duration={1500}
                style={{ ...styles.bottomSheetWrapStyle, }}
            >
                {indicator()}
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 2.0, }}>
                    {passengerInfo()}
                    {tripInfo()}
                </ScrollView>
                {endRideButton()}
            </Animatable.View>
        )
    }

    function indicator() {
        return (
            <View style={{ ...styles.sheetIndicatorStyle }} />
        )
    }

    function endRideButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => { navigation.navigate('Home') }}
                style={styles.buttonStyle}
            >
                <Text style={{ ...Fonts.whiteColor18Bold }}>
                    Terminar corrida
                </Text>
            </TouchableOpacity>
        )
    }

    function passengerInfo() {
        return (
            <View style={{ marginTop: Sizes.fixPadding, }}>
                {passengerImageWithCallAndMessage()}
                {passengerDetail()}
            </View>
        )
    }

    function tripInfo() {
        return (
            <View>
                <Text style={{ marginHorizontal: Sizes.fixPadding * 2.0, ...Fonts.blackColor18Bold }}>
                
                </Text>
                {/*{currentLocationInfo()}
                {currentToDropLocDivider()}
                {dropLocationInfo()}*/}
            </View>
        )
    }

    {/*function dropLocationInfo() {
        return (
            <View style={styles.dropLocationInfoWrapStyle}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: 24.0, alignItems: 'center' }}>
                        <MaterialIcons name="location-pin" size={24} color={Colors.primaryColor} />
                    </View>
                    <Text numberOfLines={1} style={{ flex: 1, marginHorizontal: Sizes.fixPadding + 5.0, ...Fonts.blackColor15SemiBold }}>
                        Centralidade do kilamba
                    </Text>
                </View>
                <Text style={{ ...Fonts.primaryColor12Bold }}>
                    11:45
                </Text>
            </View>
        )
    }

    function currentToDropLocDivider() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 24.0, alignItems: "center" }}>
                    <Text style={{ ...Fonts.blackColor8SemiBold, lineHeight: 6 }}>
                        •{`\n`}
                        •{`\n`}
                        •{`\n`}
                        •{`\n`}
                        •{`\n`}
                        •{`\n`}
                        •
                    </Text>
                </View>
                <View style={styles.currentToDropLocationInfoDividerStyle} />
            </View>
        )
    }

    function currentLocationInfo() {
        return (
            <View style={styles.currentLocationInfoWrapStyle}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: 24, alignItems: 'center' }}>
                        <View style={styles.currentLocationIconStyle}>
                            <View style={{ width: 7.0, height: 7.0, borderRadius: 3.5, backgroundColor: Colors.blackColor }} />
                        </View>
                    </View>
                    <Text numberOfLines={1} style={{ marginHorizontal: Sizes.fixPadding + 5.0, flex: 1, ...Fonts.blackColor15SemiBold }}>
                        Centralidade do kilamba
                    </Text>
                </View>
                <Text style={{ ...Fonts.primaryColor12Bold }}>
                    11:20
                </Text>
            </View>
        )
    }*/}

    function passengerDetail() {
        return (
            <View style={{ margin: Sizes.fixPadding * 2.0, marginTop: Sizes.fixPadding, }}>
                <Text style={{ textAlign: 'center', ...Fonts.blackColor17SemiBold }}>
                    {username}
                </Text>
                <Text style={{ textAlign: 'center', ...Fonts.grayColor14Regular }}>
                    Cliente
                </Text>
            </View>
        )
    }

    function passengerImageWithCallAndMessage() {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <View style={styles.callAndMessageIconWrapStyle}>
                    <MaterialIcons
                        name='call'
                        color={Colors.primaryColor}
                        size={width / 18.0}
                    />
                </View>
                <Image
                    source={image}
                    style={styles.passengerImageStyle}
                />
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => { navigation.push('ChatWithPassenger') }}
                    style={styles.callAndMessageIconWrapStyle}
                >
                    <MaterialIcons
                        name='message'
                        color={Colors.primaryColor}
                        size={width / 18.0}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    function header() {
        return (
            <View style={styles.headerWrapStyle}>
                <AntDesign
                    name="arrowleft"
                    size={24}
                    color={Colors.blackColor}
                    onPress={() => navigation.pop()}
                />
            </View>
        )
    }

    function directionInfo() {
        return (
          <MapView
            region={{
              latitude: driverLocation ? driverLocation.latitude : 0,
              longitude: driverLocation ? driverLocation.longitude : 0,
              latitudeDelta: 0.5,
              longitudeDelta: 0.5,
            }}
            style={{ flex: 1 }}
            provider={PROVIDER_GOOGLE}
            mapType="terrain"
          >
            {passengerLocation && (
              <MapViewDirections
                origin={driverLocation}
                destination={passengerLocation}
                apikey={Key.apiKey}
                strokeColor={Colors.primaryColor}
                strokeWidth={3}
              />
            )}
            {driverLocation && (
              <Marker coordinate={driverLocation}>
                <Image
                  source={require('../../../assets/images/icons/cab.png')}
                  style={styles.cabMarkerStyle}
                />
              </Marker>
            )}
            {passengerLocation && (
              <Marker coordinate={passengerLocation} title='Drop point'>
                <Image
                  source={require('../../../assets/images/icons/marker2.png')}
                  style={{ width: 50.0, height: 50.0, resizeMode: 'stretch' }}
                />
              </Marker>
            )}
          </MapView>
        );
      }
      
}

export default EndRideScreen

const styles = StyleSheet.create({
    headerWrapStyle: {
        position: 'absolute',
        top: 20.0,
        left: 15.0,
        right: 15.0,
    },
    bottomSheetWrapStyle: {
        borderTopLeftRadius: Sizes.fixPadding * 2.5,
        borderTopRightRadius: Sizes.fixPadding * 2.5,
        backgroundColor: Colors.whiteColor,
        position: 'absolute',
        left: 0.0,
        right: 0.0,
        bottom: 0.0,
        maxHeight: height / 2.0,
    },
    sheetIndicatorStyle: {
        width: 50,
        height: 5.0,
        backgroundColor: Colors.primaryColor,
        borderRadius: Sizes.fixPadding,
        alignSelf: 'center',
        marginVertical: Sizes.fixPadding * 2.0,
    },
    callAndMessageIconWrapStyle: {
        width: width / 10.0,
        height: width / 10.0,
        borderRadius: (width / 10.0) / 2.0,
        backgroundColor: Colors.whiteColor,
        elevation: 3.0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primaryColor,
        paddingVertical: Sizes.fixPadding + 3.0,
    },
    passengerImageStyle: {
        width: width / 4.0,
        height: width / 4.0,
        borderRadius: (width / 4.0) / 2.0,
        marginHorizontal: Sizes.fixPadding * 2.0
    },
    calloutWrapStyle: {
        width: width / 1.5,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: Sizes.fixPadding,
        backgroundColor: Colors.whiteColor
    },
    kilometerInfoWrapStyle: {
        borderRadius: Sizes.fixPadding - 5.0,
        backgroundColor: Colors.lightBlackColor,
        paddingVertical: Sizes.fixPadding,
        paddingHorizontal: Sizes.fixPadding - 5.0
    },
    currentLocationInfoWrapStyle: {
        marginTop: Sizes.fixPadding,
        marginHorizontal: Sizes.fixPadding * 2.0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dropLocationInfoWrapStyle: {
        marginHorizontal: Sizes.fixPadding * 2.0,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: -(Sizes.fixPadding - 5.0)
    },
    currentToDropLocationInfoDividerStyle: {
        backgroundColor: Colors.shadowColor,
        height: 1.0,
        flex: 1,
        marginRight: Sizes.fixPadding * 2.5,
        marginLeft: Sizes.fixPadding
    },
    currentLocationIconStyle: {
        width: 18.0,
        height: 18.0,
        borderRadius: 9.0,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: Colors.blackColor,
        borderWidth: 2.0,
    },
    cabMarkerStyle: {
        width: 25.0,
        height: 45.0,
        resizeMode: 'contain',
        top: 16.0,
        transform: [{ rotate: '70deg' }],
        zIndex: 100
    }
})