import { StyleSheet, Text, View, SafeAreaView, ScrollView, StatusBar, Image, Dimensions } from 'react-native'
import React from 'react'
import { Colors, Fonts, Sizes } from "../../../constants/styles";
import { AntDesign, MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const InviteFriendsScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1, }}>
                {header()}
                <View style={styles.inviteFriendDetailWrapStyle}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}
                    >
                        {giftImage()}
                        {inviteFriendInfo()}
                        {referalCode()}
                    </ScrollView>
                </View>
                {shareButton()}
            </View>
        </SafeAreaView>
    )

    function shareButton() {
        return (
            <View style={styles.shareButtonWrapStyle}>
                <MaterialIcons name="share" size={24} color={Colors.primaryColor} />
            </View>
        )
    }

    function referalCode() {
        return (
            <View style={styles.referalCodeWrapStyle}>
                <Text style={{ ...Fonts.blackColor16SemiBold }}>
                    DEG148F5
                </Text>
            </View>
        )
    }

    function inviteFriendInfo() {
        return (
            <View>
                <Text style={{ textAlign: 'center', ...Fonts.blackColor18Bold }}>
                    Convidar amigos
                </Text>
                <Text style={{ marginTop: Sizes.fixPadding, textAlign: 'center', ...Fonts.grayColor15SemiBold }}>
                    Quando teu amigo se cadastrar terás bónus
                </Text>
            </View>
        )
    }

    function giftImage() {
        return (
            <Image
                source={require('../../../assets/images/inviteFriend.png')}
                style={styles.giftImageStyle}
            />
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
                    Convidar amigos
                </Text>
            </View>
        )
    }
}

export default InviteFriendsScreen

const styles = StyleSheet.create({
    headerWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: Sizes.fixPadding + 5.0,
        marginVertical: Sizes.fixPadding * 2.0
    },
    referalCodeWrapStyle: {
        backgroundColor: Colors.whiteColor,
        borderColor: Colors.primaryColor,
        borderWidth: 1.8,
        borderStyle: 'dashed',
        borderRadius: Sizes.fixPadding - 5.0,
        paddingHorizontal: Sizes.fixPadding * 2.5,
        paddingVertical: Sizes.fixPadding,
        marginTop: Sizes.fixPadding * 3.0,
    },
    shareButtonWrapStyle: {
        width: 50.0,
        height: 50.0,
        borderRadius: 25.0,
        backgroundColor: Colors.whiteColor,
        elevation: 2.0,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        borderColor: Colors.shadowColor,
        borderWidth: 1.0,
        borderBottomWidth: 0.0,
        margin: Sizes.fixPadding * 2.0,
    },
    inviteFriendDetailWrapStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: Sizes.fixPadding * 2.0,
    },
    giftImageStyle: {
        width: width / 2.0,
        height: width / 2.0,
        resizeMode: 'contain',
        marginBottom: Sizes.fixPadding * 2.0,
    }
})