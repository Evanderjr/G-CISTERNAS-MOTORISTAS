import {
  StyleSheet,
  Text,
  TextInput,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Image,
  BackHandler,
  ActivityIndicator,
} from "react-native";
import React, { useState, useCallback } from "react";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import IntlPhoneInput from "react-native-intl-phone-input";
import { useFocusEffect, Link } from "@react-navigation/native";
import { services } from "../../services";
import { useLoginForm } from "../../hooks/useLoginForm";
import { useDispatch } from "react-redux";
import { loginSlice } from "../../redux/features/login/loginSlice";

const { height } = Dimensions.get("window");

const StartScreen = ({ navigation }) => {

  const dispatch = useDispatch();

  const { form, setForm } = useLoginForm();
  const [isLoading, setIsLoading] = useState(false);
  const [backClickCount, setBackClickCount] = useState(0);

  console.log(form);

  const isValidateForm = () => {
    if (!form?.email) return false;

    if (!form?.password) return false;

    return true;
  };

  const handleLogin = async () => {
    if (!isValidateForm()) return;

    setIsLoading(true);

    const response = await services.auth.login({
        email: form?.email,
        password: form?.password
    });

    console.log("[debug]: resposta do login ", response);

    if (response?.status == 200) {

        const data = response?.data?.data?.userData?.driver;

        const userResponse = await services.user.getUser({"id" : data?.id_user});
  
        setIsLoading(false);
  
        console.log("[debug]: resposta dos usuarios ", userResponse);
  
        if (userResponse?.status == 200) {
  
          dispatch(loginSlice.actions.setLoggedUser({...userResponse?.data?.data, ...data}));
          navigation.push("Home");
        }else{
  
        }
    } else {
    }
  };

  const backAction = () => {
    backClickCount == 1 ? BackHandler.exitApp() : _spring();
    return true;
  };

  function _spring() {
    setBackClickCount(1);
    setTimeout(() => {
      setBackClickCount(0);
    }, 1000);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <ScrollView 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ justifyContent: "center", flexGrow: 1 }}>
        <ScrollView
          
        >
          {loginImage()}
          {welcomeInfo()}

          {emailInfo()}
          {passwordInfo()}

        </ScrollView>
        {loginButton()}
        {registerLink()}
     </ScrollView>
      {exitInfo()}
    </SafeAreaView >
  );
  function registerLink()
  {
    return (
      <Text style={{ ...Fonts.grayColor15SemiBold,  textAlign: "center",  marginBottom: Sizes.fixPadding * 3.0, }}> Não possui uma conta?&nbsp; 
      <Link to={{ screen: 'Register' }} style={{color: Colors.primaryColor}}>
       Criar conta
    </Link></Text>      
    );
  }

  function loginButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          handleLogin()
        }}
        style={styles.buttonStyle}
      >{isLoading ? (
        <ActivityIndicator color="#ffff" />
      ) : (
        <Text style={{ ...Fonts.whiteColor18Bold }}>Entrar</Text>
      )}
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
          Preencha os campos
        </Text>
      </View>
    );
  }

  function emailInfo() {
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2.0,
          marginBottom: Sizes.fixPadding * 2.0,
        }}
      >
        <Text style={{ ...Fonts.grayColor15SemiBold }}>Email</Text>
        <TextInput
          value={form?.email}
          onChangeText={(email) => setForm({ email })}
          style={styles.textFieldStyle}
          cursorColor={Colors.primaryColor}
          keyboardType="email-address"
          placeholder="Digite aqui..."
          placeholderTextColor={Colors.lightGrayColor}
        />
        {divider()}
      </View>
    );
  }

  function passwordInfo() {
    return (
      <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, marginBottom: Sizes.fixPadding * 2.0, }}>
        <Text style={{ ...Fonts.grayColor15SemiBold }}>
          Palavra-Passe
        </Text>
        <TextInput
          value={form?.password}
          onChangeText={(password) => setForm({ password })}
          style={styles.textFieldStyle}
          cursorColor={Colors.primaryColor}
          placeholder="Insira a sua palvra-passe"
          secureTextEntry
        />
        {divider()}
      </View>
    )
  }

  function divider() {
    return (
      <View style={{ backgroundColor: Colors.shadowColor, height: 1.0 }} />
    );
  }

  function loginImage() {
    return (
      <Image
        source={require("../../assets/images/login.png")}
        style={{ width: "100%", height: height / 3.0, resizeMode: "stretch" }}
      />
    );
  }

}

export default StartScreen;

const styles = StyleSheet.create({
  textFieldStyle: {
    height: 20.0,
    ...Fonts.blackColor16Bold,
    marginTop: Sizes.fixPadding - 5.0,
    marginBottom: Sizes.fixPadding - 4.0,
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