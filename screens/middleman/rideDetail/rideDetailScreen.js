import { StyleSheet, Text, View, StatusBar, SafeAreaView, Image, Dimensions, ScrollView } from 'react-native'
import React from 'react'
import { Colors, Fonts, Sizes } from '../../../constants/styles'
import MapViewDirections from 'react-native-maps-directions';
import { Key } from "../../../constants/key";
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from "react-native-maps";
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import BottomSheet from 'react-native-simple-bottom-sheet';

const { width, height } = Dimensions.get('window');

const RideDetailScreen = ({ navigation }) => {

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.shadowColor }}>
            <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1 }}>
                {directionInfo()}
                {header()}
                {driverInfoSheet()}
            </View>
        </SafeAreaView>
    )

    function driverInfoSheet() {
        return (
            <BottomSheet
                isOpen={false}
                sliderMinHeight={300}
                sliderMaxHeight={height - 150.0}
                lineContainerStyle={{ height: 0.0, marginVertical: Sizes.fixPadding + 10.0, }}
                lineStyle={styles.sheetIndicatorStyle}
                wrapperStyle={{ ...styles.bottomSheetWrapStyle, }}
            >
                {(onScrollEndDrag) => (
                    <ScrollView
                        onScrollEndDrag={onScrollEndDrag}
                        contentContainerStyle={{ paddingBottom: Sizes.fixPadding, }}
                        showsVerticalScrollIndicator={false}
                    >
                        <Animatable.View
                            animation="slideInUp"
                            iterationCount={1}
                            duration={1500}
                        >
                            {driverInfo()}
                            {divider()}
                            {tripInfo()}
                            {divider()}
                            {paymentInfo()}
                            {divider()}
                            {otherInfo()}
                        </Animatable.View>
                    </ScrollView>
                )}
            </BottomSheet>
        )
    }

    function otherInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, marginBottom: Sizes.fixPadding }}>
                <Text style={{ marginBottom: Sizes.fixPadding, ...Fonts.blackColor18Bold }}>
                    Outras informações
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={{ marginRight: Sizes.fixPadding * 4.0, alignItems: 'center' }}>
                        <Text style={{ ...Fonts.grayColor14SemiBold }}>
                            Via de pagamento
                        </Text>
                        <Text style={{ ...Fonts.blackColor15Bold }}>
                            Tranferência
                        </Text>
                    </View>
                    <View style={{ marginRight: Sizes.fixPadding * 4.0, alignItems: 'center' }}>
                        <Text style={{ ...Fonts.grayColor14SemiBold }}>
                            Custos
                        </Text>
                        <Text style={{ ...Fonts.blackColor15Bold }}>
                            15.000.00 KZ
                        </Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ ...Fonts.grayColor14SemiBold }}>
                            Tipo
                        </Text>
                        <Text style={{ ...Fonts.blackColor15Bold }}>
                            Cisterna
                        </Text>
                    </View>
                </ScrollView>
            </View>
        )
    }

    function paymentInfo() {
        return (
            <View>
                <View style={styles.paymentHeaderStyle}>
                    <Text style={{ ...Fonts.blackColor18Bold }}>
                        Pagamento
                    </Text>
                    <Text style={{ ...Fonts.primaryColor14Bold }}>
                        15.000.00 KZ
                    </Text>
                </View>
                <View style={styles.paymentMethodWrapStyle}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <Image
                            source={require('../../../assets/images/paymentMethods/visa.png')}
                            style={{ width: 40.0, height: 40.0, resizeMode: 'contain' }}
                        />
                        <View style={{ flex: 1, marginLeft: Sizes.fixPadding + 5.0 }}>
                            <Text numberOfLines={1} style={{ ...Fonts.blackColor16SemiBold }}>
                                **** **** **56 7896
                            </Text>
                            <Text numberOfLines={1} style={{ ...Fonts.grayColor12SemiBold }}>
                                Expires 04/25
                            </Text>
                        </View>
                    </View>
                    <View style={styles.selectedMethodIndicatorStyle}>
                        <MaterialIcons
                            name='check'
                            color={Colors.whiteColor}
                            size={14}
                        />
                    </View>
                </View>
            </View>
        )
    }

    function tripInfo() {
        return (
            <View>
                <View style={styles.tripRouteTitleWrapStyle}>
                    <Text style={{ ...Fonts.blackColor18Bold }}>
                        Rota da viagem
                    </Text>
                    <Text style={{ ...Fonts.primaryColor14Bold }}>
                        10 km (15 min)
                    </Text>
                </View>
                {currentLocationInfo()}
                {currentToDropLocDivider()}
                {dropLocationInfo()}
            </View>
        )
    }

    function dropLocationInfo() {
        return (
            <View style={styles.dropLocationInfoWrapStyle}>
                <View style={{ width: 24.0, alignItems: 'center' }}>
                    <MaterialIcons name="location-pin" size={24} color={Colors.primaryColor} />
                </View>
                <Text numberOfLines={1} style={{ flex: 1, marginLeft: Sizes.fixPadding + 5.0, ...Fonts.blackColor15SemiBold }}>
                    Centralidade do kilamba, Y12
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
                <View style={{ width: 24, alignItems: 'center' }}>
                    <View style={styles.currentLocationIconStyle}>
                        <View style={{ width: 7.0, height: 7.0, borderRadius: 3.5, backgroundColor: Colors.blackColor }} />
                    </View>
                </View>
                <Text numberOfLines={1} style={{ marginLeft: Sizes.fixPadding + 5.0, flex: 1, ...Fonts.blackColor15SemiBold }}>
                    Centralidade do kilamba
                </Text>
            </View>
        )
    }

    function divider() {
        return (
            <View style={styles.sheetDividerStyle} />
        )
    }

    function driverInfo() {
        return (
            <View style={{ marginTop: Sizes.fixPadding }}>
                {driverImage()}
                {driverDetail()}
            </View>
        )
    }

    function driverDetail() {
        return (
            <View style={{ marginTop: Sizes.fixPadding }}>
                <Text style={{ marginBottom: Sizes.fixPadding, textAlign: 'center', ...Fonts.blackColor17SemiBold }}>
                    Joaquim Zumbuca
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ maxWidth: width / 2.5, marginHorizontal: Sizes.fixPadding + 9.0, alignItems: 'center' }}>
                        <Text numberOfLines={1} style={{ ...Fonts.grayColor14Regular }}>
                            Swift Dezire
                        </Text>
                        <Text numberOfLines={1} style={{ ...Fonts.blackColor15SemiBold }}>
                            LD-79-29-HD
                        </Text>
                    </View>
                    <View style={{ maxWidth: width / 2.5, marginHorizontal: Sizes.fixPadding + 9.0, alignItems: 'center' }}>
                        <Text numberOfLines={1} style={{ ...Fonts.grayColor14Regular }}>
                            Chegando Em
                        </Text>
                        <Text numberOfLines={1} style={{ ...Fonts.blackColor15SemiBold }}>
                            3 mins
                        </Text>
                    </View>
                </View>
            </View>
        )
    }

    function driverImage() {
        return (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Image
                    source={require('../../../assets/images/users/perfil.png')}
                    style={styles.driverImageStyle}
                />
                <View style={styles.ratingInfoWrapStyle}>
                    <Text numberOfLines={1} style={{ maxWidth: width / 12.0, ...Fonts.whiteColor12Bold }}>
                        4.7
                    </Text>
                    <MaterialIcons
                        name='star'
                        color={Colors.orangeColor}
                        size={16}
                        style={{ marginLeft: Sizes.fixPadding - 5.0 }}
                    />
                </View>
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
                        source={require('../../../assets/images/icons/marker2.png')}
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
                                1655 Island Pkwy, Kamloops, BC V2B 6Y9
                            </Text>
                        </View>
                    </Callout>
                </Marker>
                <Marker coordinate={userLocation}>
                    <Image
                        source={require('../../../assets/images/icons/marker3.png')}
                        style={{ width: 23.0, height: 23.0, }}
                    />
                    <Callout>
                        <Text style={{ width: width / 1.5, ...Fonts.blackColor14SemiBold }}>
                            9 Bailey Drive, Fredericton, NB E3B 5A3
                        </Text>
                    </Callout>
                </Marker>
            </MapView>
        )
    }
}

export default RideDetailScreen

const styles = StyleSheet.create({
    currentLocationInfoWrapStyle: {
        marginTop: Sizes.fixPadding,
        marginHorizontal: Sizes.fixPadding * 2.0,
        flexDirection: 'row',
        alignItems: 'center'
    },
    dropLocationInfoWrapStyle: {
        marginHorizontal: Sizes.fixPadding * 2.0,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: -(Sizes.fixPadding - 5.0)
    },
    headerWrapStyle: {
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
        paddingTop: Sizes.fixPadding,
        paddingHorizontal: 0.0,
    },
    sheetIndicatorStyle: {
        width: 50,
        height: 5.0,
        backgroundColor: Colors.primaryColor,
        borderRadius: Sizes.fixPadding,
        alignSelf: 'center',
        marginVertical: Sizes.fixPadding * 2.0,
    },
    ratingInfoWrapStyle: {
        position: 'absolute',
        bottom: 5.0,
        flexDirection: 'row',
        alignItems: 'center',
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
    tripRouteTitleWrapStyle: {
        marginHorizontal: Sizes.fixPadding * 2.0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    selectedMethodIndicatorStyle: {
        width: 20.0,
        height: 20.0,
        borderRadius: 10.0,
        backgroundColor: Colors.lightBlackColor,
        alignItems: 'center',
        justifyContent: 'center',
    },
    paymentMethodWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderColor: Colors.shadowColor,
        borderWidth: 1.0,
        borderRadius: Sizes.fixPadding - 5.0,
        padding: Sizes.fixPadding,
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginTop: Sizes.fixPadding,
    },
    paymentHeaderStyle: {
        marginHorizontal: Sizes.fixPadding * 2.0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    sheetDividerStyle: {
        height: 1.0,
        backgroundColor: Colors.shadowColor,
        marginVertical: Sizes.fixPadding * 3.0,
        marginHorizontal: Sizes.fixPadding * 2.0,
    },
    driverImageStyle: {
        width: width / 4.0,
        height: width / 4.0,
        borderRadius: (width / 4.0) / 2.0,
        marginHorizontal: Sizes.fixPadding * 2.0
    }
})