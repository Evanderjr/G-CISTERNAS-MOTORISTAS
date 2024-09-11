import { StyleSheet, Text, View, SafeAreaView, StatusBar, TouchableOpacity, Image, ScrollView, TextInput, Dimensions, Button,  ActivityIndicator, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Colors, Fonts, Sizes } from "../../../constants/styles";
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { BottomSheet } from '@rneui/themed';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system'
import {firebase} from '../../../config';
import { services } from '../../../services';
import { useDispatch, useSelector } from 'react-redux';
import { loginSlice } from '../../../redux/features/login/loginSlice';


const { width } = Dimensions.get('window');

const EditMiddlemanProfileScreen = ({ navigation }) => {

    const dispatch = useDispatch();
    const login = useSelector((state) => state.login);
    const loggedUser = login.loggedUser;

    const [name, setName] = useState(loggedUser?.username);
    const [email, setEmail] = useState(loggedUser?.email);
    const [phoneNumber, setPhoneNumber] = useState(loggedUser?.phone);
    const [cistern, setCistern] = useState(loggedUser?.id_cistern);
    const [showSheet, setShowSheet] = useState(false);


    const [image, setImage] = useState(loggedUser?.avatar);
    const [upoading, setUploading] = useState(false);
    const [changed, setCanged] = useState(false);


    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function getMediaData()
        {
            const mediRefs = firebase.storage().ref(image);
            const link = await mediRefs.getDownloadURL();
            setImage(link);
            console.log("Olha a imagem", link);
        }

        getMediaData();
    }, []);

    const handleEdit = async () => {
        const nameArr = name.split(" ");

        setIsLoading(true);

        const driverResponse = await services.driver.updateDriverInfo(loggedUser.id,
            {
                
                first_name: nameArr?.shift(),
                last_name: nameArr?.pop(),
                city: "",
                phone: phoneNumber,
                id_cistern: cistern
            }
        );

        console.log("[debug]: resposta da edição do cliente ", driverResponse);

        if (driverResponse?.status == 200) {

            const userResponse = await services.user.updateUserInfo(loggedUser.id_user,
                {
                    username: name,
                    email: email,
                    password: loggedUser?.password,
                    avatar: image,

                }
            );
            console.log("[debug]: resposta da edição do User", userResponse);

            setIsLoading(false);

            if (userResponse?.status == 200) { 

                if(setCanged)
                {
                    uploadMedia();
                }

                dispatch(loginSlice.actions.setLoggedUser({...userResponse?.data?.data, ...driverResponse?.data?.data}));
                navigation.push("Home");
                
            }
            else {
            }
        } else {
            setIsLoading(false);
        }
    }

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            setCanged(true);
        }
    };

    const uploadMedia = async () => {
        setUploading(true);

        try {
            const { uri } = await FileSystem.getInfoAsync(image);
            const blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = () => {
                    resolve(xhr.response);
                };
                xhr.onerror = (e) => {
                    reject(new TypeError('Network request failed'));
                };
                xhr.responseType = 'blob';
                xhr.open('GET', uri, true);
                xhr.send(null);
            });

            const filename = image.substring(image.lastIndexOf('/') + 1);
            const ref = firebase.storage().ref().child(filename);

            await ref.put(blob);
            setUploading(false);
            setImage(filename);
            Alert.alert('Photo Uploaded!!!');
        } catch (error) {
            console.error(error);
            setUploading(false)
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1, }}>
                {header()}
                <ScrollView showsVerticalScrollIndicator={false}>
                    {profilePic()}
                    {fullNameInfo()}
                    {emailInfo()}
                    {phoneNumberInfo()}  
                </ScrollView>
            </View>
            {saveButton()}
            {editProfilePicSheet()}
        </SafeAreaView>
    )

    function editProfilePicSheet() {
        return (
            <BottomSheet
                isVisible={showSheet}
                onBackdropPress={() => setShowSheet(false)}
            >
                <View style={styles.sheetWrapStyle}>
                    <View style={styles.sheetIndicatorStyle} />
                    <Text style={{ marginBottom: Sizes.fixPadding * 2.0, textAlign: 'center', ...Fonts.blackColor18Bold }}>
                        Escolha a opção
                    </Text>
                    {profilePicOptionSort({ icon: 'photo', option: 'Abrir Galeria', onPress: () => { pickImage() } })}
                    {profilePicOptionSort({ icon: 'cancel', option: 'Cancelar', onPress: () => { setShowSheet(false) } })}
                </View>
            </BottomSheet>
        )
    }

    function profilePicOptionSort({ icon, option, onPress }) {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={onPress}
                style={{ marginBottom: Sizes.fixPadding + 5.0, flexDirection: 'row', alignItems: 'center', }}
            >
                <MaterialIcons name={icon} size={20} color={Colors.lightGrayColor} />
                <Text style={{ marginLeft: Sizes.fixPadding + 5.0, flex: 1, ...Fonts.grayColor15SemiBold }}>
                    {option}
                </Text>
            </TouchableOpacity>
        )
    }

    function saveButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleEdit}
                style={styles.buttonStyle}
            >
            {isLoading ? (
                <ActivityIndicator color="#ffff" />
              ) : (
                <Text style={{ ...Fonts.whiteColor18Bold }}>Continuar</Text>
              )}
            </TouchableOpacity>
        )
    }

    function passwordInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, marginBottom: Sizes.fixPadding * 2.0, }}>
                <Text style={{ ...Fonts.grayColor15SemiBold }}>
                    Senha
                </Text>
                <TextInput
                    value={password}
                    onChangeText={(value) => setPassword(value)}
                    style={styles.textFieldStyle}
                    cursorColor={Colors.primaryColor}
                    secureTextEntry
                />
                {divider()}
            </View>
        )
    }

    function phoneNumberInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, marginBottom: Sizes.fixPadding * 2.0, }}>
                <Text style={{ ...Fonts.grayColor15SemiBold }}>
                    Telefone
                </Text>
                <TextInput
                    value={phoneNumber}
                    onChangeText={(value) => setPhoneNumber(value)}
                    style={styles.textFieldStyle}
                    cursorColor={Colors.primaryColor}
                    keyboardType='phone-pad'
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
                    Nome Completo
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



    function profilePic() {
        return (
            <View style={styles.profilePicWrapStyle}>

                <Image
                    source={{ uri: image }}
                    style={{ width: width / 4.8, height: width / 4.8, borderRadius: (width / 4.8) / 2.0 }}
                />
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => { setShowSheet(true) }}
                    style={styles.editIconWrapStyle}
                >
                    <MaterialIcons name="camera-alt" size={width / 29.0} color={Colors.primaryColor} />
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
                <Text style={{ flex: 1, marginLeft: Sizes.fixPadding + 2.0, ...Fonts.blackColor20ExtraBold }}>
                    Editar perfil
                </Text>
            </View>
        )
    }
}

export default EditMiddlemanProfileScreen

const styles = StyleSheet.create({
    headerWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: Sizes.fixPadding + 5.0,
        marginVertical: Sizes.fixPadding * 2.0
    },
    editIconWrapStyle: {
        backgroundColor: Colors.whiteColor,
        width: width / 16.0,
        height: width / 16.0,
        borderRadius: (width / 16.0) / 2.0,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 0.0,
        right: 0.0,
        elevation: 3.0,
    },
    profilePicWrapStyle: {
        marginTop: Sizes.fixPadding,
        marginBottom: Sizes.fixPadding * 3.0,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center'
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
    sheetIndicatorStyle: {
        width: 50,
        height: 5.0,
        backgroundColor: Colors.primaryColor,
        borderRadius: Sizes.fixPadding,
        alignSelf: 'center',
        marginVertical: Sizes.fixPadding * 2.0,
    },
    sheetWrapStyle: {
        borderTopLeftRadius: Sizes.fixPadding * 2.5,
        borderTopRightRadius: Sizes.fixPadding * 2.5,
        backgroundColor: Colors.whiteColor,
        paddingHorizontal: Sizes.fixPadding * 2.0,
    }
})