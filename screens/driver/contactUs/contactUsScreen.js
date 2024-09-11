import { StyleSheet, Text, View, SafeAreaView, StatusBar, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Colors, Fonts, Sizes } from "../../../constants/styles";
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { useSelector } from "react-redux";

const DriverContactUsScreen = ({ navigation }) => {

    const login = useSelector((state) => state.login);

    const loggedUser = login.loggedUser; 

    const [name, setName] = useState(loggedUser?.username);
    const [email, setEmail] = useState(loggedUser?.email);
    const [message, setMessage] = useState('');

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1, }}>
                {header()}
                <ScrollView showsVerticalScrollIndicator={false}>
                    {contactInfo()}
                    {messageDetail()}
                </ScrollView>
            </View>
            {submitButton()}
        </SafeAreaView>
    )

    function submitButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => { navigation.pop() }}
                style={styles.buttonStyle}
            >
                <Text style={{ ...Fonts.whiteColor18Bold }}>
                    Enviar
                </Text>
            </TouchableOpacity>
        )
    }

    function messageDetail() {
        return (
            <View style={{ marginTop: Sizes.fixPadding * 2.0, }}>
                <Text style={{ margin: Sizes.fixPadding * 2.0, ...Fonts.blackColor18Bold }}>
                    Ou enviar mensagem
                </Text>
                {fullNameInfo()}
                {emailInfo()}
                {messageInfo()}
            </View>
        )
    }

    function messageInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, marginBottom: Sizes.fixPadding * 2.0, }}>
                <Text style={{ ...Fonts.grayColor15SemiBold }}>
                    Mensagem
                </Text>
                <TextInput
                    value={message}
                    onChangeText={(value) => setMessage(value)}
                    placeholder="Escreva aqui a sua mensagem..."
                    placeholderTextColor={Colors.lightGrayColor}
                    style={styles.textFieldStyle}
                    cursorColor={Colors.primaryColor}
                />
                {divider()}
            </View>
        )
    }

    function emailInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, marginBottom: Sizes.fixPadding * 2.0, }}>
                <Text style={{ ...Fonts.grayColor15SemiBold }}>
                    Email
                </Text>
                <TextInput
                    value={email}
                    onChangeText={(value) => setEmail(value)}
                    style={styles.textFieldStyle}
                    cursorColor={Colors.primaryColor}
                    keyboardType='email-address'
                />
                {divider()}
            </View>
        )
    }

    function fullNameInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, marginBottom: Sizes.fixPadding * 2.0, }}>
                <Text style={{ ...Fonts.grayColor15SemiBold }}>
                    Nome completo
                </Text>
                <TextInput
                    value={name}
                    onChangeText={(value) => setName(value)}
                    style={styles.textFieldStyle}
                    cursorColor={Colors.primaryColor}
                />
                {divider()}
            </View>
        )
    }

    function divider() {
        return (
            <View style={{ backgroundColor: Colors.shadowColor, height: 1.0, }} />
        )
    }

    function contactInfo() {
        return (
            <View style={{ marginTop: Sizes.fixPadding - 5.0, marginHorizontal: Sizes.fixPadding * 2.0, }}>
                <Text style={{ ...Fonts.blackColor18Bold }}>
                    Vamos ver o que tens a dizer
                </Text>
                <View style={{ marginVertical: Sizes.fixPadding * 2.0, flexDirection: 'row', alignItems: 'center' }}>
                    <MaterialIcons
                        name='call'
                        color={Colors.primaryColor}
                        size={20}
                    />
                    <Text style={{ marginLeft: Sizes.fixPadding, flex: 1, ...Fonts.grayColor16SemiBold }}>
                        +244 920 000 000
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MaterialIcons
                        name='email'
                        color={Colors.primaryColor}
                        size={20}
                    />
                    <Text style={{ marginLeft: Sizes.fixPadding, flex: 1, ...Fonts.grayColor16SemiBold }}>
                        geral@globalcisternas.com
                    </Text>
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
                <Text style={{ flex: 1, marginLeft: Sizes.fixPadding + 2.0, ...Fonts.blackColor20ExtraBold }}>
                    Contacte-nos
                </Text>
            </View>
        )
    }
}

export default DriverContactUsScreen

const styles = StyleSheet.create({
    headerWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: Sizes.fixPadding + 5.0,
        marginVertical: Sizes.fixPadding * 2.0
    },
    textFieldStyle: {
        height: 20.0,
        ...Fonts.blackColor16Bold,
        marginTop: Sizes.fixPadding - 5.0,
        marginBottom: Sizes.fixPadding - 4.0,
    },
    buttonStyle: {
        backgroundColor: Colors.primaryColor,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Sizes.fixPadding - 5.0,
        paddingVertical: Sizes.fixPadding + 3.0,
        marginHorizontal: Sizes.fixPadding * 6.0,
        marginVertical: Sizes.fixPadding * 2.0
    },
})