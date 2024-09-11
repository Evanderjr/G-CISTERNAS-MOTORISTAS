import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, TextInput, SafeAreaView, StatusBar } from "react-native";
import { Colors, Fonts, Sizes } from '../../../constants/styles'
import { MaterialIcons, AntDesign } from '@expo/vector-icons';

const userMessages = [
    {
        id: '1',
        message: `Hello, are you nearby?`,
        isSender: true,
        messageTime: '11:00 am',
    },
    {
        id: '2',
        message: 'i’m at vinmark store',
        isSender: false,
        messageTime: '11:01 am',
    },
    {
        id: '3',
        message: 'Oky, i’ll be there in a few mins.',
        isSender: true,
        messageTime: '11:01 am',
    },
];

const receiverImage = require('../../assets/images/users/user2.png');

const senderImage = require('../../assets/images/users/user1.png');

const ChatWithPassengerScreen = ({ navigation }) => {

    const [messagesList, setMessagesList] = useState(userMessages);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1, }}>
                {header()}
                <View style={{ flex: 1, }}>
                    {messages()}
                    {typeMessage()}
                </View>
            </View>
        </SafeAreaView>
    )

    function messages() {
        const renderItem = ({ item, index }) => {
            return (
                <View style={{
                    alignItems: item.isSender == true ? 'flex-end' : 'flex-start',
                    marginHorizontal: Sizes.fixPadding * 2.0,
                    marginBottom: Sizes.fixPadding * 2.0,
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                        <View>
                            <View style={{
                                ...styles.messageWrapStyle,
                                borderBottomRightRadius: item.isSender ? 0.0 : Sizes.fixPadding - 5.0,
                                borderBottomLeftRadius: item.isSender ? Sizes.fixPadding - 5.0 : 0.0,
                                backgroundColor: item.isSender == true ? Colors.primaryColor : '#F0F0F0',
                                marginLeft: !item.isSender ? Sizes.fixPadding * 4.0 : 0.0,
                                marginRight: !item.isSender ? 0.0 : Sizes.fixPadding * 4.0,
                            }}>
                                <Text style={item.isSender ? { ...Fonts.whiteColor15SemiBold } : { ...Fonts.blackColor15SemiBold }}>
                                    {item.message}
                                </Text>
                            </View>
                            <View style={{ flexDirection: item.isSender ? 'row' : 'row-reverse', alignItems: 'center', alignSelf: item.isSender == true ? 'flex-end' : 'flex-start', }}>
                                <Text style={{ ...Fonts.grayColor12Bold }}>
                                    {item.messageTime}
                                </Text>
                                <Image
                                    source={item.isSender ? senderImage : receiverImage}
                                    style={{
                                        ...styles.userImageStyle,
                                        marginRight: item.isSender ? 0.0 : Sizes.fixPadding,
                                        marginLeft: item.isSender ? Sizes.fixPadding : 0.0,
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            )
        }
        return (
            <View style={{ paddingBottom: Sizes.fixPadding * 8.0, }}>
                <FlatList
                    inverted
                    data={messagesList}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexDirection: 'column-reverse', paddingBottom: Sizes.fixPadding * 2.0 }}
                />
            </View>
        )
    }

    function addMessage({ message }) {

        const oldMessages = messagesList;

        let date = Date();
        let hour = (new Date(date)).getHours();
        let minute = (new Date(date)).getMinutes();
        let AmPm = hour > 12 ? 'pm' : 'am';
        let finalhour = (hour > 12) ? (hour - 12) : hour;

        const newMessage = {
            id: messagesList.length + 1,
            message: message,
            messageTime: `${finalhour}:${minute} ${AmPm}`,
            isSender: true,
        }

        oldMessages.push(newMessage);
        setMessagesList(oldMessages);
    }

    function typeMessage() {
        const [message, setMessage] = useState('');
        return (
            <View style={styles.typeMessageWrapStyle}>
                <TextInput
                    cursorColor={Colors.primaryColor}
                    value={message}
                    onChangeText={setMessage}
                    placeholder='Type a message...'
                    style={{ ...Fonts.blackColor14SemiBold, flex: 1, height: 20.0, }}
                    placeholderTextColor={Colors.grayColor}
                />
                <MaterialIcons
                    name="send"
                    size={20}
                    color={Colors.primaryColor}
                    style={{ marginLeft: Sizes.fixPadding - 5.0 }}
                    onPress={() => {
                        if (message != '') {
                            addMessage({ message: message })
                            setMessage('');
                        }
                    }}
                />
            </View>
        )
    }

    function header() {
        return (
            <View style={styles.headerWrapStyle}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, }}>
                    <AntDesign
                        name="arrowleft"
                        size={24}
                        color={Colors.blackColor}
                        onPress={() => navigation.pop()}
                    />
                    <View style={{ flex: 1, marginHorizontal: Sizes.fixPadding + 2.0, }}>
                        <Text numberOfLines={1} style={{ ...Fonts.blackColor18Bold }}>
                            Tynisha Obey
                        </Text>
                        <Text style={{ ...Fonts.grayColor14SemiBold }}>
                            Online
                        </Text>
                    </View>
                </View>
                <MaterialIcons name="more-vert" size={22} color={Colors.blackColor} onPress={() => { }} />
            </View>
        )
    }
}

export default ChatWithPassengerScreen

const styles = StyleSheet.create({
    headerWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.whiteColor,
        elevation: 3.0,
        padding: Sizes.fixPadding + 5.0,
    },
    messageWrapStyle: {
        paddingHorizontal: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding - 5.0,
        borderRadius: Sizes.fixPadding - 5.0,
    },
    typeMessageWrapStyle: {
        position: 'absolute',
        bottom: 0.0,
        left: 0.0,
        right: 0.0,
        flexDirection: 'row',
        alignItems: "center",
        backgroundColor: Colors.whiteColor,
        padding: Sizes.fixPadding * 2.0,
        borderColor: Colors.shadowColor,
        borderWidth: 1.0,
        padding: Sizes.fixPadding + 5.0,
        marginHorizontal: Sizes.fixPadding * 2.0,
        borderRadius: Sizes.fixPadding - 5.0,
        marginBottom: Sizes.fixPadding * 2.0,
    },
    userImageStyle: {
        width: 30.0,
        height: 30.0,
        borderRadius: 15.0
    },
})