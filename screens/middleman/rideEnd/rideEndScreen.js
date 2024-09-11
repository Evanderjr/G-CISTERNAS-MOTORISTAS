import { StyleSheet, Text, View, StatusBar, SafeAreaView, Image, Dimensions, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { Colors, Fonts, Sizes } from '../../../constants/styles'
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import BottomSheet from 'react-native-simple-bottom-sheet';

const { width, height } = Dimensions.get('window');

const RideEndScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.shadowColor }}>
            <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1 }}>
                {directionInfo()}
                {header()}
                {rideEndInfoSheet()}
            </View>
        </SafeAreaView>
    )

    function rideEndInfoSheet() {
        return (
            <BottomSheet
                isOpen={false}
                sliderMinHeight={400}
                sliderMaxHeight={height - 100}
                lineContainerStyle={{ height: 0.0, marginVertical: Sizes.fixPadding + 5.0, }}
                lineStyle={styles.sheetIndicatorStyle}
                wrapperStyle={{ ...styles.bottomSheetWrapStyle }}
            >
                <Animatable.View
                    animation="slideInUp"
                    iterationCount={1}
                    duration={1500}
                    style={{ flex: 1, }}
                >
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {driverInfo()}
                        {tripInfo()}
                        <View style={styles.sheetDividerStyle} />
                        {feedbackInfo()}
                    </ScrollView>
                </Animatable.View>
            </BottomSheet>
        )
    }

    function driverInfo() {
        return (
            <View style={{ marginTop: Sizes.fixPadding, }}>
                {driverImage()}
                {driverDetail()}
            </View>
        )
    }

    function feedbackInfo() {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => { navigation.push('Rating') }}
                style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}
            >
                <Text style={{ textAlign: 'center', ...Fonts.blackColor18Bold }}>
                    Como foi tua entrega?
                </Text>
                <Text style={{ marginVertical: Sizes.fixPadding, textAlign: 'center', ...Fonts.grayColor14Regular }}>
                    Tua avaliação será necessário para {`\n`} a experiência do motorista
                </Text>
                <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'center' }}>
                    {
                        [1, 2, 3, 4, 5].map((item) => (
                            <AntDesign
                                key={`${item}`}
                                name="star"
                                size={24}
                                color={Colors.shadowColor}
                                style={{ marginHorizontal: Sizes.fixPadding - 5.0, }}
                            />
                        ))
                    }
                </View>
            </TouchableOpacity>
        )
    }

    function tripInfo() {
        return (
            <View style={{ marginTop: Sizes.fixPadding * 3.0 }}>
                <Text style={{ marginHorizontal: Sizes.fixPadding * 2.0, ...Fonts.blackColor18Bold }}>
                    Rota
                </Text>
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
                    Centralidade do Kilamba
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
                    Centralidade do Kilamba
                </Text>
            </View>
        )
    }

    function driverDetail() {
        return (
            <View style={{ marginTop: Sizes.fixPadding, marginHorizontal: Sizes.fixPadding * 2.0, }}>
                <Text style={{ textAlign: 'center', ...Fonts.blackColor17SemiBold }}>
                    Joaquim Zumbuca
                </Text>
                <Text style={{ marginTop: Sizes.fixPadding - 5.0, textAlign: 'center', ...Fonts.grayColor14Regular }}>
                    Entrega feita
                </Text>
            </View>
        )
    }

    function driverImage() {
        return (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Image
                    source={require('../../../assets/images/users/user2.png')}
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
                <Marker
                    coordinate={currentCabLocation}
                    title="Island Pkwy"
                >
                    <Image
                        source={require('../../../assets/images/icons/marker2.png')}
                        style={{ width: 50.0, height: 50.0, resizeMode: 'stretch', }}
                    />
                </Marker>
                <Marker coordinate={userLocation}>
                    <Image
                        source={require('../../../assets/images/icons/cab.png')}
                        style={{ width: 25.0, height: 30.0, resizeMode: 'stretch', zIndex: 1 }}
                    />
                </Marker>
            </MapView>
        )
    }
}

export default RideEndScreen

const styles = StyleSheet.create({
    headerWrapStyle: {
        position: 'absolute',
        top: 20.0,
        left: 15.0,
        right: 15.0,
    },
    bottomSheetWrapStyle: {
        paddingTop: Sizes.fixPadding + 5.0,
        borderTopLeftRadius: Sizes.fixPadding * 2.5,
        borderTopRightRadius: Sizes.fixPadding * 2.5,
        backgroundColor: Colors.whiteColor,
        paddingHorizontal: 0.0,
        elevation: 0.0,
        paddingBottom: Sizes.fixPadding * 3.0,
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
    ratingInfoWrapStyle: {
        position: 'absolute',
        bottom: 5.0,
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primaryColor,
        paddingVertical: Sizes.fixPadding + 3.0,
    },
    reachingDestinationInfoWrapStyle: {
        position: 'absolute',
        left: 20.0,
        right: 20.0,
        top: 60.0,
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding - 5.0,
        paddingHorizontal: Sizes.fixPadding * 2.0,
        paddingVertical: Sizes.fixPadding,
    },
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