import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import { AntDesign } from "@expo/vector-icons";
import { useLoginForm } from "../../hooks/useLoginForm";
import { services } from "../../services";
import { useDispatch } from "react-redux";
import { loginSlice } from "../../redux/features/login/loginSlice";
import IntlPhoneInput from "react-native-intl-phone-input";
import { appMessage } from "../../utils/messages";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RegisterScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const { form, setForm} = useLoginForm();
  const [error, setError] = useState("");

  useEffect(() => {
    
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  const isValidateForm = () => {

    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

    if (!form?.name) {
      setError(appMessage.register.nullFullName);
      clearMessage();
      return false;
    }

    if (!form?.password) {
      setError(appMessage.register.nullPassword);
      clearMessage();
      return false;
    }

    if (!form?.passwordConfirm || form?.passwordConfirm !== form?.password) {
      setError(appMessage.register.invalidConfirmPassword);
      clearMessage();
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!isValidateForm()) return;

    const vectorArr = form?.name?.trim();
    const nameArr = vectorArr.split(" ");
    const first_name = nameArr?.shift();
    const last_name = nameArr?.pop();

    if (!last_name) {
      setError(appMessage.register.nullLastName);
      clearMessage();
      return;
    } else

setIsLoading(true);

const middlemanResponse = await services.middleman.registerMiddleman(
  {
    username: form?.name,
    email: form?.email,
    password: form?.password,
    avatar: "perfil.png",
    first_name: first_name,
    last_name: last_name,
    city: "",
    phone: "+244" + " " + form?.phone,
  }
);

console.log("[debug]: resposta dos clientes ", middlemanResponse);

if (middlemanResponse?.status == 201) {

  const data = middlemanResponse?.data?.data;

  const userResponse = await services.user.getUser({ "id": data?.id_user });

  setIsLoading(false);

  console.log("[debug]: resposta dos usuarios ", userResponse);

  if (userResponse?.status == 200) {

    const token = true;
    await AsyncStorage.setItem('token', JSON.stringify({ ...userResponse?.data?.data, ...middlemanResponse?.data?.data }));

    console.log("logged", { ...userResponse?.data?.data, ...middlemanResponse?.data?.data })

    dispatch(loginSlice.actions.setLoggedUser({ ...userResponse?.data?.data, ...middlemanResponse?.data?.data }));
    navigation.push("MiddlemanHome");
  } else {
   
  }
} else {
  setIsLoading(false);
}

  };

return (
  <SafeAreaView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
    <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
    <View style={{ flex: 1 }}>
      {header()}
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {errorMessage()}
        {fullNameInfo()}
        {emailInfo()}
        {passwordInfo()}
        {passwordConfirmInfo()}
        
      </ScrollView>
    </View>
    {continueButton()}
  </SafeAreaView>
);

function continueButton() {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handleRegister}
      style={styles.buttonStyle}
    >
      {isLoading ? (
        <ActivityIndicator color="#ffff" />
      ) : (
        <Text style={{ ...Fonts.whiteColor18Bold }}>Continuar</Text>
      )}
    </TouchableOpacity>
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
      <Text style={{ ...Fonts.grayColor15SemiBold }}>Email (Opcional)</Text>
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

function fullNameInfo() {
  return (
    <View style={{ margin: Sizes.fixPadding * 2.0 }}>
      <Text style={{ ...Fonts.grayColor15SemiBold }}>Nome Completo</Text>
      <TextInput
        value={form?.name}
        onChangeText={(name) => setForm({ name })}
        style={styles.textFieldStyle}
        cursorColor={Colors.primaryColor}
        placeholder="Digite aqui..."
        placeholderTextColor={Colors.lightGrayColor}
      />
      {divider()}
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
        onCountryChange={(country) => {
          setForm({ country });
        }}
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
      />
    </View>

  );
}

function passwordInfo() {
  return (
    <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, marginBottom: Sizes.fixPadding * 2.0, }}>
      <Text style={{ ...Fonts.grayColor15SemiBold }}>
        Senha
      </Text>
      <TextInput
        value={form?.password}
        onChangeText={(password) =>
          setForm({ password })
        }
        style={styles.textFieldStyle}
        cursorColor={Colors.primaryColor}
        secureTextEntry
      />
      {divider()}
    </View>
  )
}

function passwordConfirmInfo() {
  return (
    <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, marginBottom: Sizes.fixPadding * 2.0, }}>
      <Text style={{ ...Fonts.grayColor15SemiBold }}>
        Confirmar Senha
      </Text>
      <TextInput
        value={form?.passwordConfirm}
        onChangeText={(passwordConfirm) => setForm({ passwordConfirm })}
        style={styles.textFieldStyle}
        cursorColor={Colors.primaryColor}
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

function errorMessage() {
  return (
    <View
      style={{
        marginHorizontal: Sizes.fixPadding * 2.0,
        
      }}
    >
      <Text style={{ ...Fonts.redColor14SemiBold }}>{error}</Text>
    </View>
      
  );
}

function clearMessage() {
  setTimeout(() => {
    setError("");
  }, 8000);
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
        Registrar
      </Text>
    </View>
  );
}
};

export default RegisterScreen;

const styles = StyleSheet.create({
  headerWrapStyle: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: Sizes.fixPadding + 5.0,
    marginVertical: Sizes.fixPadding * 2.0,
  },
  textFieldStyle: {
    height: 20.0,
    ...Fonts.blackColor16Bold,
    marginTop: Sizes.fixPadding - 5.0,
    marginBottom: Sizes.fixPadding - 4.0,
  },
  phoneInputStyle: {
    flex: 1,
    ...Fonts.blackColor15Bold,
    borderBottomColor: Colors.shadowColor,
    borderBottomWidth: 1.0,
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
