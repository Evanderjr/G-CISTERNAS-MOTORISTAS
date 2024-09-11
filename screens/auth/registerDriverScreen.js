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
  Image,
  FlatList,
  Dimensions
} from "react-native";
import React, { useState, useEffect } from "react";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useLoginForm } from "../../hooks/useLoginForm";
import { services } from "../../services";
import { useDispatch } from "react-redux";
import { loginSlice } from "../../redux/features/login/loginSlice";
import IntlPhoneInput from "react-native-intl-phone-input";
import { appMessage } from "../../utils/messages";
import {io} from 'socket.io-client';

const { width, height } = Dimensions.get('window');

const RegisterDriverScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  
  const { form, setForm } = useLoginForm();
  const [error, setError] = useState("");

  console.log({ form });

  const [isLoading, setIsLoading] = useState(false);
  const [selectedCabIndex, setSelectedCabIndex] = useState(-1);
  const [data, setData] = useState([]);

  const getInitialData = async () => {
    const response = await services.cistern.getAllCisterns();

    console.log("[debug]: Resposta do servico de cisternas ", response.data);

    if (response?.status == 200) {
      setData(response?.data?.data);
    }
    else {
      setData([]);
    }
  }

  useEffect(() => {
    getInitialData();
  }, []);

  const isValidateForm = () => {

    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

    if (reg.test(form?.email) === false) {
      setError(appMessage.register.invalidEmail);
      clearMessage();
      return false;
    }

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

    if (!form?.phone) {
      setError(appMessage.register.invalidPhone);
      clearMessage();
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!isValidateForm()) return;

    const nameArr = form?.name?.split(" ");

    setIsLoading(true);

    const driverResponse = await services.driver.registerDriver(
      {
        username: form?.name,
        email: form?.email,
        password: form?.password,
        avatar: "perfil.png",
        first_name: `${nameArr?.shift()}`,
        last_name: `${nameArr?.pop()}`,
        city: "",
        phone: "+244" + " " + form?.phone,
        id_cistern: (selectedCabIndex + 1)
      }
    );

    console.log("[debug]: resposta dos driveres ", driverResponse);

    if (driverResponse?.status == 201) {

      const data = driverResponse?.data?.data;

      const userResponse = await services.user.getUser({ "id": data?.id_user });

      setIsLoading(false);

      console.log("[debug]: resposta dos usuarios ", userResponse);

      if (userResponse?.status == 200) {

        console.log("logged", { ...userResponse?.data?.data, ...driverResponse?.data?.data })

        dispatch(loginSlice.actions.setLoggedUser({ ...userResponse?.data?.data, ...driverResponse?.data?.data }));
        navigation.push("DriverHome");
      } else {

      }
    } else {
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
          {cabsInfo()}
          {continueButton()}
        </ScrollView>
        
      </View>
      
    </SafeAreaView>
  );

  function cabsInfo() {
    
    
    const renderItem = ({ item, index }) => (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => { setSelectedCabIndex(index); }}
        style={styles.cabInfoWrapStyle}
      >
        <Image
          source={require('../../assets/images/cabs/cab5.png')}
          style={styles.cabImageStyle}
        />
        <View style={{ marginLeft: Sizes.fixPadding, marginTop: - (width / 6.3) + 30.0, }}>
          <Text style={{ ...Fonts.blackColor15SemiBold }}>
            {item.capacity + ` mL`}
          </Text>

          <View
            style={{
              backgroundColor: selectedCabIndex == index ? Colors.lightBlackColor : Colors.shadowColor,
              ...styles.selectedCabIndicatorStyle,
            }}
          >
            <MaterialIcons
              name='check'
              color={Colors.whiteColor}
              size={14}
            />
          </View>
        </View>
      </TouchableOpacity>
    )
    return (
      <View
        style={{
          marginBottom: Sizes.fixPadding * 2.0,
        }}
      >
      <Text style={{ ...Fonts.grayColor15SemiBold,  marginHorizontal: Sizes.fixPadding * 2.0,  marginBottom: Sizes.fixPadding * 2.0, }}>Capacidade da Cisterna</Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingLeft: Sizes.fixPadding * 2.0, paddingRight: Sizes.fixPadding }}
      />
      </View>
      
    )
  }

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
        <Text style={{ ...Fonts.grayColor15SemiBold }}>Email (opcional)</Text>
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

export default RegisterDriverScreen;

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
    marginTop: Sizes.fixPadding * 13.0
    
  },
  cabTypesInfoWrapStyle: {
    marginHorizontal: Sizes.fixPadding * 2.0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Sizes.fixPadding + 5.0
},
cabInfoWrapStyle: {
    backgroundColor: Colors.whiteColor,
    borderColor: Colors.shadowColor,
    borderWidth: 1.0,
    borderRadius: Sizes.fixPadding,
    marginRight: Sizes.fixPadding,
    marginTop: (width / 6.3) / 1.5,
},
cabImageStyle: {
    top: -(width / 6.3) / 1.5,
    alignSelf: 'center',
    width: width / 6.3,
    height: width / 3.5,
    resizeMode: 'stretch',
    marginHorizontal: Sizes.fixPadding * 2.0,
},
selectedCabIndicatorStyle: {
    marginTop: -Sizes.fixPadding,
    width: 20.0,
    height: 20.0,
    borderRadius: 10.0,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    right: -0.50,
},
});
