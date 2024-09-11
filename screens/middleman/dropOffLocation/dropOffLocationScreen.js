import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Dimensions
} from "react-native";
import React, { useState, useEffect } from "react";
import { Colors, Fonts, Sizes } from "../../../constants/styles";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import * as Location from "expo-location";
//import { TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native"; // Importe useNavigation
import AsyncStorage from "@react-native-async-storage/async-storage"; // Importe o AsyncStorage

const { width, height } = Dimensions.get('window');

const DropOffLocationScreen = ({ navigation }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [recentLocations, setRecentLocations] = useState([]);

  useEffect(() => {
    getLocationAsync();
    loadRecentLocations(); // Carregue locais recentes ao iniciar a tela
  }, []);

  const getLocationAsync = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setUserLocation(location);
  };

  const loadRecentLocations = async () => {
    try {
      const recentLocationsData = await AsyncStorage.getItem("recentLocations");

      if (recentLocationsData) {
        const parsedRecentLocations = JSON.parse(recentLocationsData);
        setRecentLocations(parsedRecentLocations);
      }
    } catch (error) {
      console.error("Error loading recent locations:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/*}<StatusBar translucent={false} backgroundColor={Colors.primaryColor} />{*/}
      <View style={styles.container}>
        {backArrow()}
        {/*{currentToDropLocationInfo()}*/}
        <GooglePlacesAutocomplete
          placeholder="Local de deposito de água?"
          onPress={async (data, details = null) => {
            // Quando o usuário selecionar um local na pesquisa
            //---------------------------------------
            //navigation.push("BookNow");
            //-------------------------------------
            const selectedLocation = {
              name: data.structured_formatting.main_text,
              address: data.description,
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
            };

            // Navegue para a próxima página "dropLocationInfo" e passe os dados do local como parâmetros
            navigation.navigate("BookNow", { selectedLocation });

            //------------------------------------
            const newLocation = {
              id: String(recentLocations.length + 1),
              address: data.structured_formatting.main_text,
              addressDetail: data.description,
            };

            const updatedRecentLocations = [newLocation, ...recentLocations.slice(0, 1)]; // Limite para, por exemplo, os últimos 5 locais
            setRecentLocations(updatedRecentLocations);

            try {
              await AsyncStorage.setItem("recentLocations", JSON.stringify(updatedRecentLocations));
            } catch (error) {
              console.error("Error saving recent locations:", error);
            }

            setSelectedLocation({
              name: newLocation.address,
              address: newLocation.addressDetail,
            });
            //----------------------------------------------------------------------------------        
          }}
          query={{
            key: "AIzaSyBcPlR5DtV_FS3OLcd-lAkvVN7i78HumNY",
            language: "pt-BR",
            location: `${userLocation?.coords.latitude}, ${userLocation?.coords.longitude}`,
            radius: 10000, // Raio em metros para pesquisar locais próximos
          }}
          listViewDisplayed="auto" // Exibe automaticamente a lista de sugestões
          styles={autoCompleteStyles}
          fetchDetails={true}
        />
          

        {selectedLocation && (
          <View style={styles.selectedLocationContainer}>
            <Text style={styles.selectedLocationTitle}>Local Selecionado:</Text>
            <Text>Nome: {selectedLocation.name}</Text>
            <Text>Endereço: {selectedLocation.address}</Text>
            <Text>Latitude: {selectedLocation.latitude}</Text>
            <Text>Longitude: {selectedLocation.longitude}</Text>
          </View>
        )}

          <View style={styles.scrollViewContent}>
            {recentLocationsInfo()}  
          </View>

        
        
      </View>
    </SafeAreaView>
  );



  function recentLocationsInfo() {
    return (
      <View>
        <Text
          style={{
            marginBottom: Sizes.fixPadding,
            marginHorizontal: Sizes.fixPadding * 2.0,
            ...Fonts.blackColor18Bold,
          }}
        >
          Recente
        </Text>
        {recentLocations.map((item, index) => (
          <View
            
            style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                // Quando o usuário tocar em um local recente, você pode definir esse local como o local atual ou realizar a ação desejada
                setSelectedLocation(item);

                // Passar os dados selecionados para a próxima tela
                navigation.push("BookNow", { selectedLocation: item });
              }}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <View style={styles.iconCircleStyle}>
                <MaterialIcons
                  name="history"
                  size={18}
                  color={Colors.lightGrayColor}
                />
              </View>
              <View style={{ flex: 1, marginLeft: Sizes.fixPadding + 5.0 }}>
                <Text style={{ ...Fonts.blackColor16SemiBold }}>
                  {item.address}
                </Text>
                <Text numberOfLines={1} style={{ ...Fonts.grayColor15Regular }}>
                  {item.addressDetail}
                </Text>
              </View>
            </TouchableOpacity>
            {recentLocations.length - 1 == index ? null : (
              <View
                style={{
                  backgroundColor: Colors.shadowColor,
                  height: 1.0,
                  marginVertical: Sizes.fixPadding + 5.0,
                }}
              />
            )}
          </View>
        ))}
      </View>
    );
  }



  {/*} function adddressesInfo() {
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2.0,
          marginTop: Sizes.fixPadding * 3.0,
          marginBottom: Sizes.fixPadding,
        }}
      >
         {addressOptionSort({ iconName: 'Home', option: 'Home', onPress: () => { navigation.push('BookNow') }, iconSize: 22, })}
                {addressOptionSort({ iconName: 'Work', option: 'Work', onPress: () => { navigation.push('BookNow') }, iconSize: 19, })}
      </View>
    );
  }

  function addressOptionSort({ iconName, option, onPress, iconSize }) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={styles.addressOptionWrapStyle}
      >
        <View style={{ width: 22.0, alignItems: "center" }}>
          <MaterialIcons
            name={iconName}
            size={iconSize}
            color={Colors.primaryColor}
          />
        </View>
        <Text
          style={{
            marginLeft: Sizes.fixPadding + 5.0,
            ...Fonts.blackColor16SemiBold,
          }}
        >
          {option}
        </Text>
      </TouchableOpacity>
    );
  }*/}

  function currentToDropLocationInfo() {
    return (
      <View style={styles.currentToDropLocationInfoWrapStyle}>
        {/*       {currentLocationInfo()}
        {currentToDropLocDivider()}
    {dropLocationInfo()} */}
      </View>
    );
  }

  {/*function dropLocationInfo() {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: -(Sizes.fixPadding - 5.0),
        }}
      >
        <View style={{ width: 24.0, alignItems: "center" }}>
          <MaterialIcons
            name="location-pin"
            size={24}
            color={Colors.primaryColor}
          />
        </View>
        <TextInput
          placeholder="Local de deposito?"
          placeholderTextColor={Colors.grayColor}
          style={{
            flex: 1,
            marginLeft: Sizes.fixPadding + 5.0,
            ...Fonts.blackColor15SemiBold,
          }}
          cursorColor={Colors.primaryColor}
          autoFocus
        />
      </View>
    );
  }*/}

  {/* function currentToDropLocDivider() {
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ width: 24.0, alignItems: "center" }}>
          <Text style={{ ...Fonts.blackColor8SemiBold, lineHeight: 6 }}>
            •{`\n`}•{`\n`}•{`\n`}•{`\n`}•{`\n`}•{`\n`}•
          </Text>
        </View>
        <View style={styles.currentToDropLocationInfoDividerStyle} />
      </View>
    );
  }

  function currentLocationInfo() {
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ width: 24, alignItems: "center" }}>
          <View style={styles.currentLocationIconStyle}>
            <View
              style={{
                width: 7.0,
                height: 7.0,
                borderRadius: 3.5,
                backgroundColor: Colors.blackColor,
              }}
            />
          </View>
        </View>
        <Text
          style={{
            marginLeft: Sizes.fixPadding + 5.0,
            flex: 1,
            ...Fonts.blackColor15SemiBold,
          }}
        >
          Localização actual
        </Text>
      </View>
    );
  }*/}

  function backArrow() {
    return (
      <AntDesign
        name="arrowleft"
        size={24}
        color={Colors.blackColor}
        onPress={() => navigation.pop()}
        style={{
          marginVertical: Sizes.fixPadding * 2.0,
          marginHorizontal: Sizes.fixPadding + 5.0,
        }}
      />
    );
  }

};

export default DropOffLocationScreen;

const styles = StyleSheet.create({
  currentToDropLocationInfoDividerStyle: {
    backgroundColor: Colors.shadowColor,
    height: 1.0,
    flex: 1,
    marginRight: Sizes.fixPadding * 2.5,
    marginLeft: Sizes.fixPadding,
  },
  currentLocationIconStyle: {
    width: 18.0,
    height: 18.0,
    borderRadius: 9.0,
    alignItems: "center",
    justifyContent: "center",
    borderColor: Colors.blackColor,
    borderWidth: 2.0,
  },
  currentToDropLocationInfoWrapStyle: {
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding - 5.0,
    elevation: 2.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding * 2.0,
  },
  iconCircleStyle: {
    backgroundColor: Colors.shadowColor,
    width: 30.0,
    height: 30.0,
    borderRadius: 15.0,
    alignItems: "center",
    justifyContent: "center",
  },
  addressOptionWrapStyle: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Sizes.fixPadding * 2.0,
  },
  //----------------------------------------------------------------------

  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
  selectedLocationContainer: {
    margin: Sizes.fixPadding,
  },
  selectedLocationTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  scrollViewContent: {
    paddingBottom: Sizes.fixPadding ,
    marginBottom: Sizes.fixPadding * 2.0,

  },

  //------------------------------------------------------------------------ 
});

//---------------------------------------------------------------------
const autoCompleteStyles = {
  container: {
    flex: 1,
    margin: Sizes.fixPadding,
  },
  textInput: {
    ...Fonts.blackColor15SemiBold,
    borderColor: Colors.primaryColor,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
};


