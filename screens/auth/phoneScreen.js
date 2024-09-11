import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    StatusBar,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    Image,
    BackHandler,
} from "react-native";
import React, { useState, useCallback } from "react";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import IntlPhoneInput from "react-native-intl-phone-input";
import { AntDesign } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useLoginForm } from "../../hooks/useLoginForm";
import { services } from "../../services";


const { height } = Dimensions.get("window");

const PhoneScreen = ({ navigation }) => {
    const [backClickCount, setBackClickCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const { form, setForm } = useLoginForm();

    /*const backAction = () => {
        backClickCount == 1 ? BackHandler.exitApp() : _spring();
        return true;
    };

    useFocusEffect(
        useCallback(() => {
            BackHandler.addEventListener("hardwareBackPress", backAction);
            return () =>
                BackHandler.removeEventListener("hardwareBackPress", backAction);
        }, [backAction])
    );*/

      // Handle the button press

    const handleRegister = async () => {
        setIsLoading(true);

        navigation.push("Verification");
    }

    function _spring() {
        setBackClickCount(1);
        setTimeout(() => {
            setBackClickCount(0);
        }, 1000);
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1, justifyContent: "flex-end" }}>
                {header()}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ justifyContent: "center", flexGrow: 1 }}
                >
                    {loginImage()}
                    {welcomeInfo()}
                    {phoneNumberInfo()}

                </ScrollView>
                {continueButton()}
            </View>
            {exitInfo()}
        </SafeAreaView>
    );

    function continueButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleRegister}
                style={styles.buttonStyle}
            >
                <Text style={{ ...Fonts.whiteColor18Bold }}>Continuar</Text>
            </TouchableOpacity>
        );
    }

    function exitInfo() {
        return backClickCount == 1 ? (
            <View style={styles.exitInfoWrapStyle}>
                <Text style={{ ...Fonts.whiteColor15SemiBold }}>
                    Pressionar duas vezes
                </Text>
            </View>
        ) : null;
    }

    function welcomeInfo() {
        return (
            <View
                style={{
                    marginHorizontal: Sizes.fixPadding * 2.0,
                    marginTop: Sizes.fixPadding * 4.0,
                    marginBottom: Sizes.fixPadding * 2.0,
                }}
            >
                <Text style={{ ...Fonts.blackColor20Bold }}>
                    Bem-vindo á Global Cisternas
                </Text>
                <Text
                    style={{ marginTop: Sizes.fixPadding, ...Fonts.grayColor14SemiBold }}
                >
                    Entre com seu telefone para continuar
                </Text>
            </View>
        );
    }

    function phoneNumberInfo() {
        return (
            <View
                style={{
                    marginHorizontal: Sizes.fixPadding * 2.0,
                    marginBottom: Sizes.fixPadding * 2.0,
                }}
            >
                <Text style={{ ...Fonts.grayColor15SemiBold }}>Número de Telefone</Text>
                <IntlPhoneInput
                    onChangeText={({ phoneNumber }) =>
                        setForm({ phone: phoneNumber })
                    }
                    
                    defaultCountry="AO"
                    containerStyle={{ backgroundColor: Colors.whiteColor }}
                    placeholder={"Digite aqui..."}
                    phoneInputStyle={styles.phoneInputStyle}
                    dialCodeTextStyle={{
                        ...Fonts.blackColor15Bold,
                        marginHorizontal: Sizes.fixPadding - 2.0,
                    }}
                    disableCountryChange={true}
                />
            </View>

        );
    }

    function loginImage() {
        return (
            <Image
                source={require("../../assets/images/onboarding/5.png")}
                style={{ width: "100%", height: height / 3.0, resizeMode: "stretch" }}
            />
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
};

export default PhoneScreen;

const styles = StyleSheet.create({
    headerWrapStyle: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: Sizes.fixPadding + 5.0,
        marginVertical: Sizes.fixPadding * 2.0,
    },
    textFieldStyle: {
        borderBottomWidth: 1.0,
        borderBottomColor: Colors.shadowColor,
        backgroundColor: Colors.bgColor,
        ...Fonts.blackColor16Bold,
    },
    phoneInputStyle: {
        flex: 1,
        ...Fonts.blackColor15Bold,
        borderBottomColor: Colors.shadowColor,
        borderBottomWidth: 1.0,
    },
    exitInfoWrapStyle: {
        backgroundColor: Colors.lightBlackColor,
        position: "absolute",
        bottom: 20,
        alignSelf: "center",
        borderRadius: Sizes.fixPadding * 2.0,
        paddingHorizontal: Sizes.fixPadding + 5.0,
        paddingVertical: Sizes.fixPadding,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonStyle: {
        backgroundColor: Colors.primaryColor,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: Sizes.fixPadding - 5.0,
        paddingVertical: Sizes.fixPadding + 3.0,
        marginHorizontal: Sizes.fixPadding * 6.0,
        marginVertical: Sizes.fixPadding * 2.0,
    },
});
