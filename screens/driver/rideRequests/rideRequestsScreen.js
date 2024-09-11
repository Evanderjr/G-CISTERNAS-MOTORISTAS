import { StyleSheet, Text, TextInput, Button, View, StatusBar, SafeAreaView, Image, Dimensions, ScrollView, TouchableOpacity, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Colors, Fonts, Sizes } from '../../../constants/styles';
import MapViewDirections from 'react-native-maps-directions';
import { Key } from "../../../constants/key";
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from "react-native-maps";
import { MaterialIcons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import * as Location from 'expo-location';
import { firebase } from '../../../config';
import { useSelector, useDispatch } from "react-redux";
import { services } from '../../../services';
import { requestSlice } from '../../../redux/features/request/requestSlice';
import  {io} from 'socket.io-client';
import messaging from '@react-native-firebase/messaging';


const { width, height } = Dimensions.get('window');


const RideRequestsScreen = ({ navigation, onPress }) => {

  const [showMore, setshowMore] = useState(false)
  const [getRequests, setRequests] = useState(0)
  const [counter, setCounter] = useState(1)
  const [data, setData] = useState([])
  const [driverLocation, setDriverLocation] = useState(null);
  const [passengerLocation, setPassengerLocation] = useState(null);
  const [image, setImage] = useState("image");
  const [username, setUsername] = useState("");
  const [clientId, setClientId] = useState(0);
  const [cisternId, setCisternId] = useState(0);
  const [requestId, setRequestId] = useState(0);
  const [message, setMessage] = useState('');
  const [receiveMessage, setReceivedMessage] = useState('');
  const [driverList, setDriverList] = useState([]);
  const [notificationToken, setNotificationToken] = useState(''); 

  const dispatch = useDispatch();
  const login = useSelector((state) => state.login);
  const loggedUser = login.loggedUser;
  const socket = io('http://192.168.1.3:4000');
  
  
  //------------------------------------------------------------------------------
  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permissão de localização não concedida');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      const coords = {lat:currentLocation.coords.latitude, lng: currentLocation.coords.longitude};

      return coords;      

      // Defina a localização do cliente aqui também, da mesma maneira.
    } catch (error) {
      console.error('Erro ao obter a localização:', error);


    }
  };

  const getInitialData = async () => {
    const response = await services.request.getAllRequests();

    console.log("[debug]: Resposta do servico de pedidos ", response.data);

    if (response?.status == responseStatus.OK) {
      console.log(response.data);
      //setData(response?.data?.data);
      //setRequests(response?.data?.data.length)
    }
    else {
      setData([]);
      setRequests(0);
      setCounter(0)
    }
  }

   const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
   }
   
  useEffect(() => {

    if(requestUserPermission())
    {
        messaging().getToken().then(token => {
            setNotificationToken(token);
        });
    }
    else
    {
        console.log("Failed token status", authStatus);
    }
    //getClientInfo();
    //getMediaData();
    getLocation().then((response) => {
      
      Alert.alert("Coordenadas: ", JSON.stringify(response));
      console.log("User Loc ", response);
      socket.emit('sendCoordinates', { driverId: loggedUser.id, lat: response.lat, lng: response.lng, token: notificationToken  });
    });

    /*socket.on('initialDriverList', (initialList) => {
      setDriverList(initialList);
      console.log("Initial List", initialList);
    });

    socket.on("updatedDriverList", (updateList) => {
      setDriverList(updateList);
      console.log("Update List", updateList);
    });

    if(requestUserPermission())
        {
            messaging().getToken().then(token => {
                console.log(token);
            });
        }
        else
        {
            console.log("Failed token status", authStatus);
        }*/

        // Check whether an initial notification is available
    messaging()
    .getInitialNotification()
    .then(async (remoteMessage) => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        ); 
      }
    });

    messaging().onNotificationOpenedApp(async (remoteMessage) => {
        console.log(
          'Notification caused app to open from background state:',
          remoteMessage.notification,
        );
        navigation.navigate(remoteMessage.data.type);
      });

      // Register background handler
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Message handled in the background!', remoteMessage);
  });
  
  const unsubscribe = messaging().onMessage(async remoteMessage => {
    Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    //navigation.push();
  });


    return () => {
        socket.disconnect();
    }

    
  }, [counter]);
  //---------------------------------------------------- 

  const stopCounter = () => {
    //clearInterval(intervalId);
  }
  

  async function getMediaData() {
    const mediRefs = firebase.storage().ref(image);
    const link = await mediRefs.getDownloadURL();
    setImage(link);
    console.log("Olha a imagem", link);
  }

  const getClientInfo = async () => {

    const response = await services.request.getRequestByStatusId({
      status: "nulo",

    });

    const length = await response?.data?.data.length;
    setRequests(length);

    console.log("REQUESTTTT",response?.data?.data[counter]);

    id_client = response?.data?.data[counter]?.id_client;
    id_cistern = response?.data?.data[counter]?.id_cistern;
    id_request = response?.data?.data[counter]?.id;
    setClientId(id_client);
    setCisternId(id_cistern);
    setRequestId(id_request);

    console.log("IDS: ",id_client," ", id_cistern, " ", id_request);

    if (response?.status == 200) {
      const response = await services.clients.getClient({
        id: id_client
      });

      const id_user = response.data.data.id_user;

      console.log("CLIENT", response.data.data.id_user);
      if (response?.status == 200) {
        console.log("USER_ID", id_user);
        const response = await services.user.getUser({
          id: id_user
        });

        setImage(response?.data?.data.avatar);
        setUsername(response?.data?.data?.username);
        getMediaData();
      }
      else {
      }
      //setImage(response?.data?.data.avatar);
      //setUsername(response?.data?.data.username);
    }
    else {
    }

  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.shadowColor }}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <View style={{ flex: 1 }}>
        {directionInfo()}
        {goOffLineAndMenuButton()}
        {/*{requestTimingInfo()}*/}
        {requestInfoSheet()}

        
      </View>
    </SafeAreaView>
  );

  function requestTimingInfo() {
    return (
      <View style={styles.requestTimingInfoWrapStyle}>
        <Text numberOfLines={1} style={{ ...Fonts.primaryColor18Bold }}>
          Solicitação de entrega recebida
        </Text>
        <Text style={{ ...Fonts.blackColor16Bold }}>

        </Text>
      </View>
    )
  }

  function goOffLineAndMenuButton() {
    return (
      <View style={styles.goOffLineAndMenuButtonWrapStyle}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            navigation.openDrawer();
          }}
          style={styles.menuIconWrapStyle}
        >
          <MaterialIcons name="menu" size={22} color={Colors.whiteColor} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPress}
          style={{
            backgroundColor: Colors.primaryColor,
            padding: Sizes.fixPadding,
            borderRadius: Sizes.fixPadding - 5.0,
          }}
        >
          <Text style={{ textAlign: "center", ...Fonts.whiteColor16Bold }}>
            Ir Offline
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function requestInfoSheet() {
    return (
      <Animatable.View
        animation="slideInUp"
        iterationCount={1}
        duration={1500}
        style={{ ...styles.bottomSheetWrapStyle, maxHeight: showMore ? height - 100.0 : null, }}
      >
        {indicator()}

        {
          counter < getRequests ?
            <>
              <ScrollView
                contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 2.0, }}
                showsVerticalScrollIndicator={false}
              >

                {passengerInfo()}
                {
                  showMore
                    ?
                    <View>
                      {/*{divider()}
                                {tripInfo()}
                                {divider()}
                                {paymentInfo()}
                                {divider()}
                    {otherInfo()}*/}
                    </View>
                    :
                    null
                }

              </ScrollView>
              {acceptRejectAndMoreLessButton()}
            </>
            :
            <Text style={{ ...Fonts.blackColor18Bold, paddingBottom: Sizes.fixPadding * 2.0, textAlign: 'center' }}>Sem novos pedidos</Text>
        }

      </Animatable.View>
    )
  }

  function indicator() {
    return <View style={{ ...styles.sheetIndicatorStyle }} />;
  }

  {/*function otherInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, }}>
                <Text style={{ marginBottom: Sizes.fixPadding, ...Fonts.blackColor18Bold }}>
                    Outras informações
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={{ marginRight: Sizes.fixPadding * 4.0, alignItems: 'center' }}>
                        <Text style={{ ...Fonts.grayColor14SemiBold }}>
                            Vida de pagamento
                        </Text>
                        <Text style={{ ...Fonts.blackColor15Bold }}>
                            Carteira
                        </Text>
                    </View>
                    <View style={{ marginRight: Sizes.fixPadding * 4.0, alignItems: 'center' }}>
                        <Text style={{ ...Fonts.grayColor14SemiBold }}>
                            Custos
                        </Text>
                        <Text style={{ ...Fonts.blackColor15Bold }}>
                            KZ 15.000
                        </Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ ...Fonts.grayColor14SemiBold }}>
                            Tipo
                        </Text>
                        <Text style={{ ...Fonts.blackColor15Bold }}>
                            Mini
                        </Text>
                    </View>
                </ScrollView>
            </View>
        )
    }

  function paymentInfo() {
    return (
      <View>
        <View style={styles.paymentHeaderStyle}>
          <Text style={{ ...Fonts.blackColor18Bold }}>Pagamento</Text>
          <Text style={{ ...Fonts.primaryColor14Bold }}>KZ 15.000</Text>
        </View>
        <View style={styles.paymentMethodWrapStyle}>
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <Image
              source={require("../../assets/images/paymentMethods/wallet.png")}
              style={{ width: 40.0, height: 40.0, resizeMode: "contain" }}
            />
            <View style={{ flex: 1, marginLeft: Sizes.fixPadding + 5.0 }}>
              <Text numberOfLines={1} style={{ ...Fonts.blackColor16SemiBold }}>
                **** **** **56 7896
              </Text>
              <Text numberOfLines={1} style={{ ...Fonts.grayColor12SemiBold }}>
                Carteira
              </Text>
            </View>
          </View>
          <View style={styles.selectedMethodIndicatorStyle}>
            <MaterialIcons name="check" color={Colors.whiteColor} size={14} />
          </View>
        </View>
      </View>
    );
  }

  function tripInfo() {
    return (
      <View>
        <View style={styles.tripRouteTitleWrapStyle}>
          <Text style={{ ...Fonts.blackColor18Bold }}>Rota</Text>
          <Text style={{ ...Fonts.primaryColor14Bold }}>10 km (15 min)</Text>
        </View>
        {currentLocationInfo()}
        {currentToDropLocDivider()}
        {dropLocationInfo()}
      </View>
    );
  }

  function dropLocationInfo() {
    return (
      <View style={styles.dropLocationInfoWrapStyle}>
        <View style={{ width: 24.0, alignItems: "center" }}>
          <MaterialIcons
            name="location-pin"
            size={24}
            color={Colors.primaryColor}
          />
        </View>
        <Text
          numberOfLines={1}
          style={{
            flex: 1,
            marginLeft: Sizes.fixPadding + 5.0,
            ...Fonts.blackColor15SemiBold,
          }}
        >
          Centralidade do kilamba
        </Text>
      </View>
    );
  }

  function currentToDropLocDivider() {
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2.0,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
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
      <View style={styles.currentLocationInfoWrapStyle}>
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
          numberOfLines={1}
          style={{
            marginLeft: Sizes.fixPadding + 5.0,
            flex: 1,
            ...Fonts.blackColor15SemiBold,
          }}
        >
          Centralidade do kilamba
        </Text>
      </View>
    );
  }

    function divider() {
        return (
            <View style={styles.sheetDividerStyle} />
        )
    }*/}

  //=========================================================================================================================
  // ==================================  Aceitar ou rejeitar a solicitação ==================================================

  function acceptRejectAndMoreLessButton() {
    const acceptRide = async () => {
      // Lógica para aceitar a solicitação de corrida
      // Isso pode incluir atualizar o estado no servidor para indicar que você aceitou a corrida.
      // Você também pode redirecionar para a tela de início da corrida ou fazer outras ações necessárias.
      const response = await services.request.updateRequestInfo(requestId,
        {
          date: new Date(),
          status: "aceite",
          location: "353534543",
          id_client: clientId,//loggedUser.id,
          id_cistern: cisternId,
          id_driver: loggedUser?.id
        }
      );
        
      if (response?.status == 200) {
        console.log("REQUEST INFO", response?.data?.data);
        dispatch(requestSlice.actions.setRequestInfo(response?.data?.data));
        navigation.push('StartRide'); // Redireciona para a tela de início da corrida
      }
    };

    const rejectRide = () => {
      // Lógica para rejeitar a solicitação de corrida
      // Isso pode incluir atualizar o estado no servidor para indicar que você rejeitou a corrida.
      // Você pode exibir uma mensagem ou fazer outras ações necessárias.

      // Por exemplo, exiba uma mensagem de rejeição
      {
        counter <= getRequests ? 
          setCounter(counter+1)
          :
          setCounter(0)
      }

      console.log("COUNTER2",counter)
      alert('Você rejeitou a corrida.');


      // Depois de lidar com a rejeição, você pode fechar a tela atual ou fazer outra ação apropriada.
      // Fecha a tela atual
    };

    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={acceptRide} // Chama a função para aceitar a corrida
          style={styles.buttonStyle}
        >
          <Text style={{ ...Fonts.whiteColor18Bold }}>
            Aceitar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={rejectRide} // Chama a função para rejeitar a corrida
          style={{ ...styles.buttonStyle, marginHorizontal: Sizes.fixPadding - 9.0 }}
        >
          <Text style={{ ...Fonts.whiteColor18Bold }}>
            Rejeitar
          </Text>
        </TouchableOpacity>
        {/*
  
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => { setshowMore(!showMore) }}
        style={{ flexDirection: 'row', ...styles.buttonStyle }}
      >
        <MaterialIcons
          name={showMore ? "keyboard-arrow-down" : "keyboard-arrow-up"}
          size={24}
          color={Colors.whiteColor}
        />
        <Text style={{ marginLeft: Sizes.fixPadding, ...Fonts.whiteColor18Bold }}>
          {showMore ? 'Menos' : 'Mais'}
        </Text>
      </TouchableOpacity>
      */}
      </View>
    );
  }

  //================================================================================================================
  //================================================================================================================

  function passengerInfo() {
    return (
      <View>
        {passengerImageWithCallAndMessage()}
        {passengerDetail()}
      </View>
    );
  }

  function passengerDetail() {
    return (
      <View style={{ marginTop: Sizes.fixPadding }}>
        <Text
          style={{
            marginBottom: Sizes.fixPadding,
            textAlign: "center",
            ...Fonts.blackColor17SemiBold,
          }}
        >
          {username}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              maxWidth: width / 2.5,
              marginHorizontal: Sizes.fixPadding + 9.0,
              alignItems: "center",
            }}
          >
            <Text numberOfLines={1} style={{ ...Fonts.grayColor14Regular }}>
              Custos
            </Text>
            <Text numberOfLines={1} style={{ ...Fonts.blackColor15SemiBold }}>
              KZ 15.000
            </Text>
          </View>
          <View
            style={{
              maxWidth: width / 2.5,
              marginHorizontal: Sizes.fixPadding + 9.0,
              alignItems: "center",
            }}
          >
            <Text numberOfLines={1} style={{ ...Fonts.grayColor14Regular }}>
              Distancia
            </Text>
            <Text numberOfLines={1} style={{ ...Fonts.blackColor15SemiBold }}>
              10km
            </Text>
          </View>
        </View>
      </View>
    );
  }

  function passengerImageWithCallAndMessage() {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View style={styles.callAndMessageIconWrapStyle}>
          <MaterialIcons
            name="call"
            color={Colors.primaryColor}
            size={width / 18.0}
          />
        </View>
        <Image
          source={{ uri: image }}
          style={styles.passengerImageStyle}
        />
        {/* <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => { navigation.push('ChatWithPassenger') }}
                    style={styles.callAndMessageIconWrapStyle}
                >
                    <MaterialIcons
                        name='message'
                        color={Colors.primaryColor}
                        size={width / 18.0}
                    />
                </TouchableOpacity> */}
      </View>
    );
  }

  function directionInfo() {
    return (
      <MapView
        region={{
          latitude: driverLocation ? driverLocation.latitude : 0,
          longitude: driverLocation ? driverLocation.longitude : 0,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }}
        style={{ height: '100%' }}
        provider={PROVIDER_GOOGLE}
        mapType="terrain"
      >
        {passengerLocation && (
          <MapViewDirections
            origin={driverLocation}
            destination={passengerLocation}
            apikey={Key.apiKey}
            strokeColor={Colors.primaryColor}
            strokeWidth={3}
          />
        )}
        {/* Marcador e Callout do motorista */}
        {driverLocation && (
          <Marker coordinate={driverLocation}>
            <Image
              source={require('../../../assets/images/icons/marker3.png')}
              style={{ width: 23.0, height: 23.0 }}
            />
            <Callout>
              <Text style={{ width: width / 1.5, ...Fonts.blackColor14SemiBold }}>
                Centralidade do kilamba (Motorista)
              </Text>
            </Callout>
          </Marker>
        )}

        {/* Marcador e Callout do cliente */}
        {passengerLocation && (
          <Marker coordinate={passengerLocation}>
            <Image
              source={require('../../../assets/images/icons/marker2.png')}
              style={{ width: 50.0, height: 50.0, resizeMode: 'stretch' }}
            />
            <Callout>
              <View style={styles.calloutWrapStyle}>
                <View style={styles.kilometerInfoWrapStyle}>
                  <Text style={{ ...Fonts.whiteColor10Bold }}>10km</Text>
                </View>
                <Text style={{ marginLeft: Sizes.fixPadding, flex: 1, ...Fonts.blackColor14SemiBold }}>
                  Centralidade do kilamba (Cliente)
                </Text>
              </View>
            </Callout>
          </Marker>
        )}
      </MapView>
    );
  }

}

export default RideRequestsScreen;

const styles = StyleSheet.create({
  currentLocationInfoWrapStyle: {
    marginTop: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 2.0,
    flexDirection: "row",
    alignItems: "center",
  },
  dropLocationInfoWrapStyle: {
    marginHorizontal: Sizes.fixPadding * 2.0,
    flexDirection: "row",
    alignItems: "center",
    marginTop: -(Sizes.fixPadding - 5.0),
  },
  calloutWrapStyle: {
    width: width / 1.5,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: Sizes.fixPadding,
    backgroundColor: Colors.whiteColor,
  },
  kilometerInfoWrapStyle: {
    borderRadius: Sizes.fixPadding - 5.0,
    backgroundColor: Colors.lightBlackColor,
    paddingVertical: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding - 5.0,
  },
  bottomSheetWrapStyle: {
    borderTopLeftRadius: Sizes.fixPadding * 2.5,
    borderTopRightRadius: Sizes.fixPadding * 2.5,
    backgroundColor: Colors.whiteColor,
    position: "absolute",
    left: 0.0,
    right: 0.0,
    bottom: 0.0,
  },
  sheetIndicatorStyle: {
    width: 50,
    height: 5.0,
    backgroundColor: Colors.primaryColor,
    borderRadius: Sizes.fixPadding,
    alignSelf: "center",
    marginVertical: Sizes.fixPadding * 2.0,
  },
  callAndMessageIconWrapStyle: {
    width: width / 10.0,
    height: width / 10.0,
    borderRadius: width / 10.0 / 2.0,
    backgroundColor: Colors.whiteColor,
    elevation: 3.0,
    alignItems: "center",
    justifyContent: "center",
  },
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
  tripRouteTitleWrapStyle: {
    marginHorizontal: Sizes.fixPadding * 2.0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectedMethodIndicatorStyle: {
    width: 20.0,
    height: 20.0,
    borderRadius: 10.0,
    backgroundColor: Colors.lightBlackColor,
    alignItems: "center",
    justifyContent: "center",
  },
  paymentMethodWrapStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: Colors.shadowColor,
    borderWidth: 1.0,
    borderRadius: Sizes.fixPadding - 5.0,
    padding: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginTop: Sizes.fixPadding,
  },
  paymentHeaderStyle: {
    marginHorizontal: Sizes.fixPadding * 2.0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primaryColor,
    paddingVertical: Sizes.fixPadding + 3.0,
  },
  sheetDividerStyle: {
    height: 1.0,
    backgroundColor: Colors.shadowColor,
    marginVertical: Sizes.fixPadding * 3.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
  },
  passengerImageStyle: {
    width: width / 4.0,
    height: width / 4.0,
    borderRadius: width / 4.0 / 2.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
  },
  goOffLineAndMenuButtonWrapStyle: {
    position: "absolute",
    left: 20.0,
    right: 20.0,
    top: 20.0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  menuIconWrapStyle: {
    width: 40.0,
    height: 40.0,
    borderRadius: 20.0,
    backgroundColor: Colors.primaryColor,
    alignItems: "center",
    justifyContent: "center",
  },
  requestTimingInfoWrapStyle: {
    position: "absolute",
    top: 70.0,
    left: 20.0,
    right: 20.0,
    alignItems: "center",
    justifyContent: "center",
  },
});
