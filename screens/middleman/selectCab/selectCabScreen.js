import { StyleSheet, Text, View, StatusBar, SafeAreaView, Image, FlatList, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState, useCallback, useEffect } from 'react'
import { Colors, Fonts, Sizes } from '../../../constants/styles'
import MapViewDirections from 'react-native-maps-directions';
import { Key } from "../../../constants/key";
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from "react-native-maps";
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { useDispatch, useSelector } from 'react-redux';
import { cisternSlice } from '../../../redux/features/cistern/cisternSlicer';
import { requestSlice } from '../../../redux/features/request/requestSlice';
import { services } from '../../../services';
import { responseStatus } from '../../../utils/responseStatus';


const { width, height } = Dimensions.get('window');

const cabTypes = ['Cisterna', 'Cisterna', 'Cisterna'];

const SelectCabScreen = ({ navigation }) => {

    const dispatch = useDispatch();

    const login = useSelector((state) => state.login);
    const loggedUser = login.loggedUser;

    const [data, setData] = useState([]);
    const [selectedCabTypeIndex, setSelectedCabTypeIndex] = useState(0);
    const [selectedCabIndex, setSelectedCabIndex] = useState(-1);
    const [isLoading, setIsLoading] = useState(false);

    const getInitialData = async () => {
        const response = await services.cistern.getAllCisterns();

        console.log("[debug]: Resposta do servico de cisternas ", response.data);

        if (response?.status == responseStatus.OK) {
            setData(response?.data?.data);
        }
        else {
            setData([]);
        }
    }

    useEffect(() => {
        getInitialData();


    }, []);


    const saveSelectedCistern = (index, item) => {
        const data = {
            id: item.id,
            image: '../../../assets/images/cabs/cab1.png',
            capacity: item.capacity,
            price: item.price,
        }

        console.log(data);

        dispatch(cisternSlice.actions.setCisternInfo(data));
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1 }}>
                {header()}

                {selectCabSheet()}
            </View>
        </SafeAreaView>
    )

    function selectCabSheet() {
        return (
            <Animatable.View
                animation="slideInUp"
                iterationCount={1}
                duration={1500}
                style={{ ...styles.bottomSheetWrapStyle }}
            >
                {displayImage()}
                {indicator()}
                {cabTypesInfo()}
                {cabsInfo()}
                {bookRideButton()}
            </Animatable.View>
        )
    }

    function indicator() {
        return (
            <View style={{ ...styles.sheetIndicatorStyle }} />
        )
    }

    function cabsInfo() {
        const renderItem = ({ item, index }) => (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => { setSelectedCabIndex(index); saveSelectedCistern(index, item) }}
                style={styles.cabInfoWrapStyle}
            >
                <Image
                    source={require('../../../assets/images/cabs/cab5.png')}
                    style={styles.cabImageStyle}
                />
                <View style={{ marginLeft: Sizes.fixPadding, marginTop: - (width / 6.3) + 30.0, }}>
                    <Text style={{ ...Fonts.blackColor15SemiBold }}>
                        {item.capacity + ` mL`}
                    </Text>
                    <Text style={{ ...Fonts.blackColor15Bold }}>
                        {item.price + ` kz`}
                    </Text>
                    <View
                        style={{
                            backgroundColor: selectedCabIndex == index ? Colors.lightBlackColor : Colors.shadowColor,
                            ...styles.selectedCabIndicatorStyle,
                        }}
                    >
                        <MaterialIcons
                            name='check'
                            color={Colors.whiteColor}
                            size={14}
                        />
                    </View>
                </View>
            </TouchableOpacity>
        )
        return (
            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingLeft: Sizes.fixPadding * 2.0, paddingRight: Sizes.fixPadding }}
            />
        )
    }

    function cabTypesInfo() {
        return (
            <View style={styles.cabTypesInfoWrapStyle}>
                {
                    cabTypes.map((item, index) => (
                        <Text
                            key={`${index}`}
                            onPress={() => setSelectedCabTypeIndex(index)}
                            style={{
                                ...selectedCabTypeIndex == index ? { ...Fonts.blackColor18SemiBold } : { ...Fonts.lightGrayColor18SemiBold },
                                ...styles.cabTypeTextStyle
                            }}
                        >
                            {item}
                        </Text>
                    ))
                }
            </View>
        )
    }

    //-----------------------------------------------------
    //======================================= Solicitação do pedido de cisterna de água ===========================================

    function bookRideButton() {
        const sendRequest = async () => {

            setIsLoading(true);

            console.log("[debug]: Chegou",loggedUser?.id);

            const response = await services.request.registerRequest(
                {
                    date: new Date(),
                    status: "nulo",
                    location: "353534543",
                    id_client: loggedUser?.id,//loggedUser.id,
                    id_cistern: (selectedCabIndex+1),
                }
            );

            console.log("[debug]: resposta do pedido ", response);

            setIsLoading(false);

            if (response?.status == 201) {
                console.log("resposta ",response?.data)

                dispatch(requestSlice.actions.setRequestInfo(response?.data));
                navigation.push("SelectWater");
            }
        };

        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={sendRequest} // Chama a função para enviar a solicitação
                style={styles.buttonStyle}
            >{isLoading ? (
                <ActivityIndicator color="#ffff" />
              ) : (
                <Text style={{ ...Fonts.whiteColor18Bold }}>Pedir</Text>
              )}
            </TouchableOpacity>
        );
    }

    // ================================================ Termina Aqui =============================================================


    function header() {
        return (
            <View style={styles.headerWrapStyle}>
                <AntDesign
                    name="arrowleft"
                    size={24}
                    color={Colors.blackColor}
                    onPress={() => navigation.pop()}
                />
                <Text style={{ flex: 1, marginLeft: Sizes.fixPadding + 2.0, ...Fonts.blackColor20ExtraBold }}>
                    Escolhe sua especificação
                </Text>
            </View>
        )
    }

    function displayImage() {
        return (
            <Image
                source={require("../../../assets/images/onboarding/5.png")}
                style={{ width: "100%", height: height / 3.0 }}
            />
        );
    }

    {/*function directionInfo() {
        const currentCabLocation = {
            latitude: -8.958333,
            longitude: 13.214444,
        }
        const userLocation = {
            latitude: -8.948333,
            longitude: 13.454444,
        }
        return (
            <MapView
                region={{
                    latitude: -8.838333,
                    longitude: 13.234444,
                    latitudeDelta: 0.5,
                    longitudeDelta: 0.5,
                }}
                style={{ height: '100%', }}
                provider={PROVIDER_GOOGLE}
                mapType="terrain"
            >
                <MapViewDirections
                    origin={userLocation}
                    destination={currentCabLocation}
                    apikey={Key.apiKey}
                    strokeColor={Colors.primaryColor}
                    strokeWidth={3}
                />
                <Marker coordinate={currentCabLocation}>
                    <Image
                        source={require('../../assets/images/icons/marker2.png')}
                        style={{ width: 50.0, height: 50.0, resizeMode: 'stretch', }}
                    />
                    <Callout>
                        <View style={styles.calloutWrapStyle}>
                            <View style={styles.kilometerInfoWrapStyle}>
                                <Text style={{ ...Fonts.whiteColor10Bold }}>
                                    10km
                                </Text>
                            </View>
                            <Text style={{ marginLeft: Sizes.fixPadding, flex: 1, ...Fonts.blackColor14SemiBold }}>
                                Via Expresso,Cacuaco
                            </Text>
                        </View>
                    </Callout>
                </Marker>
                <Marker coordinate={userLocation}>
                    <Image
                        source={require('../../assets/images/icons/marker3.png')}
                        style={{ width: 23.0, height: 23.0, }}
                    />
                    <Callout>
                        <Text style={{ width: width / 1.5, ...Fonts.blackColor14SemiBold }}>
                            Centralidade do Kilamba
                        </Text>
                    </Callout>
                </Marker>
            </MapView>
        )
    }*/}

}

export default SelectCabScreen

const styles = StyleSheet.create({
    headerWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        top: 20.0,
        left: 15.0,
        right: 15.0,
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
    bottomSheetWrapStyle: {
        borderTopLeftRadius: Sizes.fixPadding * 2.5,
        borderTopRightRadius: Sizes.fixPadding * 2.5,
        backgroundColor: Colors.whiteColor,
        paddingHorizontal: 0.0,
        maxHeight: height - 150.0,
        position: 'absolute',
        bottom: 0.0,
        left: 0.0,
        right: 0.0,
    },
    sheetIndicatorStyle: {
        width: 50,
        height: 5.0,
        backgroundColor: Colors.primaryColor,
        borderRadius: Sizes.fixPadding,
        alignSelf: 'center',
        marginVertical: Sizes.fixPadding * 2.0,
    },
    buttonStyle: {
        marginTop: Sizes.fixPadding * 3.0,
        backgroundColor: Colors.primaryColor,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Sizes.fixPadding + 2.0
    },
    cabTypesInfoWrapStyle: {
        marginHorizontal: Sizes.fixPadding * 2.0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Sizes.fixPadding + 5.0
    },
    cabInfoWrapStyle: {
        backgroundColor: Colors.whiteColor,
        borderColor: Colors.shadowColor,
        borderWidth: 1.0,
        borderRadius: Sizes.fixPadding,
        marginRight: Sizes.fixPadding,
        marginTop: (width / 6.3) / 1.5,
    },
    cabImageStyle: {
        top: -(width / 6.3) / 1.5,
        alignSelf: 'center',
        width: width / 6.3,
        height: width / 3.5,
        resizeMode: 'stretch',
        marginHorizontal: Sizes.fixPadding * 2.0,
    },
    selectedCabIndicatorStyle: {
        marginTop: -Sizes.fixPadding,
        width: 20.0,
        height: 20.0,
        borderRadius: 10.0,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-end',
        right: -0.50,
    },
    cabTypeTextStyle: {
        maxWidth: width / 3.5,
        flex: 1,
        textAlign: 'center'
    }
})