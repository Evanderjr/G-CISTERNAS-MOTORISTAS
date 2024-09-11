import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  SafeAreaView,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Colors, Fonts, Sizes } from "../../../constants/styles";
import MapViewDirections from "react-native-maps-directions";
import { Key } from "../../../constants/key";
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from "react-native-maps";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { useSelector } from "react-redux";

const { width, height } = Dimensions.get("window");

const GoToPickupScreen = ({ navigation }) => {

  const login = useSelector((state) => state.login);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.shadowColor }}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <View style={{ flex: 1 }}>
        {directionInfo()}
        {header()}
        {passengerInfoSheet()}
      </View>
    </SafeAreaView>
  );

  function passengerInfoSheet() {
    return (
      <Animatable.View
        animation="slideInUp"
        iterationCount={1}
        duration={1500}
        style={{ ...styles.bottomSheetWrapStyle }}
      >
        {indicator()}
        <ScrollView showsVerticalScrollIndicator={false}>
          {passengerInfo()}
        </ScrollView>
        {goToPickupButton()}
      </Animatable.View>
    );
  }

  function indicator() {
    return <View style={{ ...styles.sheetIndicatorStyle }} />;
  }

    function goToPickupButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => { navigation.push('') }}
                style={styles.buttonStyle}
            >
                <Text style={{ ...Fonts.whiteColor18Bold }}>
                    Ir ao encontro
                </Text>
            </TouchableOpacity>
        )
    }

  function passengerInfo() {
    return (
      <View style={{ marginTop: Sizes.fixPadding }}>
        {passengerImageWithCallAndMessage()}
        {passengerDetail()}
      </View>
    );
  }

  function passengerDetail() {
    return (
      <View
        style={{
          marginTop: Sizes.fixPadding,
          marginBottom: Sizes.fixPadding * 3.0,
        }}
      >
        <Text style={{ textAlign: "center", ...Fonts.blackColor17SemiBold }}>
          {login.form.name}
        </Text>
        <View
          style={{
            marginTop: Sizes.fixPadding,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              maxWidth: width / 2.5,
              marginHorizontal: Sizes.fixPadding + 9.0,
              alignItems: "center",
            }}
          >
            <Text numberOfLines={1} style={{ ...Fonts.grayColor14Regular }}>
              Custos
            </Text>
            <Text numberOfLines={1} style={{ ...Fonts.blackColor15SemiBold }}>
              AKZ 15.000
            </Text>
          </View>
          <View
            style={{
              maxWidth: width / 2.5,
              marginHorizontal: Sizes.fixPadding + 9.0,
              alignItems: "center",
            }}
          >
            <Text numberOfLines={1} style={{ ...Fonts.grayColor14Regular }}>
              Distância
            </Text>
            <Text numberOfLines={1} style={{ ...Fonts.blackColor15SemiBold }}>
              10km
            </Text>
          </View>
        </View>
      </View>
    );
  }

  function passengerImageWithCallAndMessage() {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View style={styles.callAndMessageIconWrapStyle}>
          <MaterialIcons
            name="call"
            color={Colors.primaryColor}
            size={width / 18.0}
          />
        </View>
        <Image
          source={require("../../../assets/images/users/perfil.png")}
          style={styles.passengerImageStyle}
        />
        {/* <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => { navigation.push('ChatWithPassenger') }}
                    style={styles.callAndMessageIconWrapStyle}
                >
                    <MaterialIcons
                        name='message'
                        color={Colors.primaryColor}
                        size={width / 18.0}
                    />
                </TouchableOpacity> */}
      </View>
    );
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
    );
  }

  function directionInfo() {
    const currentCabLocation = {
      latitude: 22.558488,
      longitude: 88.309215,
    };
    const userLocation = {
      latitude: 22.715024,
      longitude: 88.474119,
    };
    return (
      <MapView
        region={{
          latitude: 22.483643,
          longitude: 88.37588,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }}
        style={{ height: "100%" }}
        provider={PROVIDER_GOOGLE}
        mapType="terrain"
      >
        <MapViewDirections
          origin={currentCabLocation}
          destination={userLocation}
          apikey={Key.apiKey}
          strokeColor={Colors.primaryColor}
          strokeWidth={3}
        />
        <Marker coordinate={currentCabLocation}>
          <Image
            source={require("../../../assets/images/icons/marker3.png")}
            style={{ width: 23.0, height: 23.0 }}
          />
          <Callout>
            <Text style={{ width: width / 1.5, ...Fonts.blackColor14SemiBold }}>
              Centralidade do kilamba
            </Text>
          </Callout>
        </Marker>
        <Marker coordinate={userLocation}>
          <Image
            source={require("../../../assets/images/icons/marker2.png")}
            style={{ width: 50.0, height: 50.0, resizeMode: "stretch" }}
          />
          <Callout>
            <View style={styles.calloutWrapStyle}>
              <View style={styles.kilometerInfoWrapStyle}>
                <Text style={{ ...Fonts.whiteColor10Bold }}>10km</Text>
              </View>
              <Text
                style={{
                  marginLeft: Sizes.fixPadding,
                  flex: 1,
                  ...Fonts.blackColor14SemiBold,
                }}
              >
                Centralidade do kilamba
              </Text>
            </View>
          </Callout>
        </Marker>
      </MapView>
    );
  }
};

export default GoToPickupScreen;

const styles = StyleSheet.create({
  headerWrapStyle: {
    position: "absolute",
    top: 20.0,
    left: 15.0,
    right: 15.0,
  },
  bottomSheetWrapStyle: {
    borderTopLeftRadius: Sizes.fixPadding * 2.5,
    borderTopRightRadius: Sizes.fixPadding * 2.5,
    backgroundColor: Colors.whiteColor,
    position: "absolute",
    left: 0.0,
    right: 0.0,
    bottom: 0.0,
    maxHeight: height / 2.4,
  },
  sheetIndicatorStyle: {
    width: 50,
    height: 5.0,
    backgroundColor: Colors.primaryColor,
    borderRadius: Sizes.fixPadding,
    alignSelf: "center",
    marginVertical: Sizes.fixPadding * 2.0,
  },
  callAndMessageIconWrapStyle: {
    width: width / 10.0,
    height: width / 10.0,
    borderRadius: width / 10.0 / 2.0,
    backgroundColor: Colors.whiteColor,
    elevation: 3.0,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonStyle: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primaryColor,
    paddingVertical: Sizes.fixPadding + 3.0,
  },
  passengerImageStyle: {
    width: width / 4.0,
    height: width / 4.0,
    borderRadius: width / 4.0 / 2.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
  },
  calloutWrapStyle: {
    width: width / 1.5,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: Sizes.fixPadding,
    backgroundColor: Colors.whiteColor,
  },
  kilometerInfoWrapStyle: {
    borderRadius: Sizes.fixPadding - 5.0,
    backgroundColor: Colors.lightBlackColor,
    paddingVertical: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding - 5.0,
  },
});
