import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import { AntDesign } from "@expo/vector-icons";
import { Overlay } from "@rneui/themed";
import OTPTextView from "react-native-otp-textinput";
import { useSelector } from "react-redux";
import { services } from "../../services";
import { useLoginForm } from "../../hooks/useLoginForm";
import { useDispatch } from "react-redux";
import { loginSlice } from "../../redux/features/login/loginSlice";
import * as ImagePicker from 'expo-image-picker';
import auth from "@react-native-firebase/auth";


const VerificationScreen = ({ navigation }) => {

  const dispatch = useDispatch();

  const { form, setForm } = useLoginForm();

  const register = useSelector((state) => state.login);

  const [otpInput, setOtpInput] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [confirm, setConfirm] = useState(null);
  const [code, setCode] = useState('');

  console.log( register.registerResponse); 

  useEffect(() => {
    
    signInWithPhoneNumber(`+244${form?.phone}`.replace(/ /g, ""));
  }, []);
  
  const signInWithPhoneNumber = async (phoneNumber) => {
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    console.log("Confirmado ",confirmation);
    
    setConfirm(confirmation);
  }

  async function confirmCode() {
    try {
      await confirm.confirm(code);
      navigation.push("Register");
    } catch (error) {
      console.log('Invalid code.');
    }
  }

  

  const isValidateForm = () => {
    if (!codeInput) return false;

    console.log("Registo", register.registerResponse); 

    return true;
  };
  
  const handleVerification = async () => {

    //setIsLoading(true);
    console.log("Código", code);

    

    //setIsLoading(true);

    /*if (response?.status == 200) {
      navigation.push("Register");
    } else {
    }*/

    confirmCode();

    
  };


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <View style={{ flex: 1 }}>
        {header()}
        <ScrollView showsVerticalScrollIndicator={false}>
          {enterCodeInfo()}
          {/*{otpFields()}*/}
          {codeField()}
          {dontReceiveInfo()}
        </ScrollView>
      </View>
      {continueButton()}
      {loadingDialog()}
    </SafeAreaView>
  );

  function loadingDialog() {
    return (
      <Overlay isVisible={isLoading} overlayStyle={styles.dialogStyle}>
        <ActivityIndicator
          size={56}
          color={Colors.primaryColor}
          style={{ alignSelf: "center" }}
        />
        <Text
          style={{
            marginTop: Sizes.fixPadding * 2.0,
            textAlign: "center",
            ...Fonts.grayColor14Regular,
          }}
        >
          Por favor aguarde...
        </Text>
      </Overlay>
    );
  }

  function continueButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleVerification}
        style={styles.buttonStyle}
      >
        <Text style={{ ...Fonts.whiteColor18Bold }}>Verificar</Text>
      </TouchableOpacity>
    );
  }

  function dontReceiveInfo() {
    return (
      <Text style={{ textAlign: "center" }}>
        <Text style={{ ...Fonts.grayColor14Regular }}>
          Não recebeu o código? {}
        </Text>
        <Text style={{ ...Fonts.primaryColor15Bold }}>Re-enviar</Text>
      </Text>
    );
  }

  function codeField()
  {
    return (
      <View style={{ justifyContent: "center",
      marginHorizontal: Sizes.fixPadding * 5.0,
      marginVertical: Sizes.fixPadding * 2.0,}}>
          
          <TextInput
              value={code} 
              onChangeText={text => setCode(text)}
              style={styles.textFieldStyle}
              cursorColor={Colors.primaryColor}
              keyboardType='name-phone-pad'
              textAlign={'center'}
          />
          {divider()}
      </View>
  )
  }

  function otpFields() {
    return (
      <OTPTextView
        containerStyle={{
          justifyContent: "center",
          marginHorizontal: Sizes.fixPadding * 2.0,
          marginVertical: Sizes.fixPadding * 2.0,
        }}
        handleTextChange={(text) => {
          setotpInput(text);
          if (otpInput.length == 3) {
            setIsLoading(true);
            setTimeout(() => {
              setIsLoading(false);
              navigation.push("Home");
            }, 2000);
          }
        }}
        inputCount={7}
        keyboardType="default"
        tintColor={Colors.primaryColor}
        offTintColor={Colors.shadowColor}
        textInputStyle={{ ...styles.textFieldStyle }}
      />
    );
  }

  function enterCodeInfo() {
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2.0,
          marginTop: Sizes.fixPadding * 2.0,
        }}
      >
        <Text style={{ textAlign: "center", ...Fonts.blackColor18SemiBold }}>
          Introduz o código de verificação
        </Text>
        <Text
          style={{
            textAlign: "center",
            marginTop: Sizes.fixPadding,
            ...Fonts.grayColor15SemiBold,
          }}
        >
          Um código de 6 dígitos foi enviado
        </Text>
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
        <Text
          style={{
            flex: 1,
            marginLeft: Sizes.fixPadding + 2.0,
            ...Fonts.blackColor20ExtraBold,
          }}
        >
          Verificação
        </Text>
      </View>
    );
  }

  function divider() {
    return (
      <View style={{ backgroundColor: Colors.shadowColor, height: 1.0 }} />
    );
  }



  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
 

 
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
 

 
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
    }
  };

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
 

 
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
    </View>
  );

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
    </View>
  );
 

 
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
 

 
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
    </View>
  );

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
    </View>
  );
 

 
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
    </View>
  );
}


export default VerificationScreen;

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
  buttonStyle: {
    backgroundColor: Colors.primaryColor,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Sizes.fixPadding - 5.0,
    paddingVertical: Sizes.fixPadding + 3.0,
    marginHorizontal: Sizes.fixPadding * 6.0,
    marginVertical: Sizes.fixPadding * 2.0,
  },
  dialogStyle: {
    width: "80%",
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding - 5.0,
    paddingHorizontal: Sizes.fixPadding * 2.0,
    paddingBottom: Sizes.fixPadding + 5.0,
    paddingTop: Sizes.fixPadding * 2.0,
    elevation: 3.0,
  },
});
