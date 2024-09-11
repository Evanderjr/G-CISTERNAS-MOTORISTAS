import * as React from "react";

import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import { Dimensions, LogBox } from "react-native";
import { Sizes } from "../constants/styles";
import DriverHomeScreen from "../screens/driver/driverHome/homeScreen";
import MiddlemanHomeScreen from "../screens/middleman/middleHome/homeScreen";
import LoadingScreen from "../components/loadingScreen";
import DriverDrawer from "../components/driverDrawerScreen";
import MiddlemanDrawer from "../components/middlemanDrawerScreen";
import EditDriverProfileScreen from "../screens/driver/editProfile/editProfileScreen";
import EditMiddlemanProfileScreen from "../screens/middleman/editProfile/editProfileScreen";
//import NotificationsScreen from "../screens/driver/notifications/notificationsScreen";
//import InviteFriendsScreen from "../screens/driver/inviteFriends/inviteFriendsScreen";
//import FaqsScreen from "../screens/driver/faqs/faqsScreen";
import DriverContactUsScreen from "../screens/driver/contactUs/contactUsScreen";
import MiddlemanContactUsScreen from "../screens/middleman/contactUs/contactUsScreen";
import SplashScreen from "../screens/splashScreen";
import StartScreen from "../screens/start/startScreen";
import LoginScreen from "../screens/auth/loginScreen";
import RegisterDriverScreen from "../screens/auth/registerDriverScreen";
import RegisterMiddleScreen from "../screens/auth/registerMiddleScreen";
import VerificationScreen from "../screens/auth/verificationScreen";
import PhoneScreen from "../screens/auth/phoneScreen";
import StartRideScreen from "../screens/driver/startRide/startRideScreen";
//import WalletScreen from "../screens/driver/wallet/walletScreen";
//import UserRidesScreen from "../screens/driver/userRides/userRidesScreen";
//import UserRatingsScreen from "../screens/driver/userRatings/userRatingsScreen";
import RideRequestsScreen from "../screens/driver/rideRequests/rideRequestsScreen";
import RideDetailScreen from "../screens/driver/rideDetail/rideDetailScreen";
import GoToPickupScreen from "../screens/driver/goToPickup/goToPickupScreen";
import EndRideScreen from "../screens/driver/endRide/endRideScreen";
//import ChatWithPassengerScreen from "../screens/driver/chatWithPassenger/chatWithPassengerScreen";
import SelectServiceScreen from "../screens/selectService/selectServiceScreen";

import DropOffLocationScreen from "../screens/middleman/dropOffLocation/dropOffLocationScreen";
import SelectCabScreen from "../screens/middleman/selectCab/selectCabScreen";
import SearchingForDriversScreen from "../screens/middleman/searchingForDrivers/searchingForDriversScreen";
//import DriverDetailScreen from "../screens/middleman/driverDetail/driverDetailScreen";
//import RideStartedScreen from "../screens/middleman/rideStarted/rideStartedScreen";
//import RideEndScreen from "../screens/middleman/rideEnd/rideEndScreen";
//import RatingScreen from "../screens/middleman/rating/ratingScreen";
//import UserRidesScreen from "../screens/middleman/userRides/userRidesScreen";
//import RideDetailScreen from "../screens/middleman/rideDetail/rideDetailScreen";
//import OnboardingScreen from "../screens/middleman/onboarding/onboardingScreen";
import SelectWaterScreen from "../screens/middleman/SelectWater/SelectWaterScreen";


const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const { width } = Dimensions.get("window");

LogBox.ignoreAllLogs();

const DriverDrawerNavigation = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DriverDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: width - 90.0,
          borderTopRightRadius: Sizes.fixPadding * 2.0,
          borderBottomRightRadius: Sizes.fixPadding * 2.0,
        },
      }}
    >
      <Drawer.Screen name="DriverDrawerScreen" component={DriverHomeScreen} />
    </Drawer.Navigator>
  );
};

const MiddlemanDrawerNavigation = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <MiddlemanDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: width - 90.0,
          borderTopRightRadius: Sizes.fixPadding * 2.0,
          borderBottomRightRadius: Sizes.fixPadding * 2.0,
        },
      }}
    >
      <Drawer.Screen name="MiddlemanDrawerScreen" component={MiddlemanHomeScreen} />
    </Drawer.Navigator>
  );
};

export const RootRouter = () => {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            ...TransitionPresets.SlideFromRightIOS,
          }}
        >
          <Stack.Screen name="Loading" component={LoadingScreen} />
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{ ...TransitionPresets.DefaultTransition }}
          />
          <Stack.Screen name="Start" component={StartScreen} />
          <Stack.Screen name="SelectService" component={SelectServiceScreen} />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ ...TransitionPresets.DefaultTransition }}
          />
          <Stack.Screen name="RegisterDriver" component={RegisterDriverScreen} />
          <Stack.Screen name="RegisterMiddle" component={RegisterMiddleScreen} />
          <Stack.Screen name="Phone" component={PhoneScreen} />
          <Stack.Screen name="Verification" component={VerificationScreen} />
          <Stack.Screen
            name="DriverHome"
            component={DriverDrawerNavigation}
            options={{ ...TransitionPresets.DefaultTransition }}
          />
          <Stack.Screen
            name="MiddlemanHome"
            component={MiddlemanDrawerNavigation}
            options={{ ...TransitionPresets.DefaultTransition }}
          />
          <Stack.Screen name="StartRide" component={StartRideScreen} />
          {/*<Stack.Screen name="UserRides" component={UserRidesScreen} />*/}
          {/*<Stack.Screen name="UserRatings" component={UserRatingsScreen} />*/}
          <Stack.Screen name="EndRide" component={EndRideScreen} />
          <Stack.Screen name="RideDetail" component={RideDetailScreen} />
          <Stack.Screen name="RideRequests" component={RideRequestsScreen} />
          <Stack.Screen name="Pickup" component={GoToPickupScreen} />
          {/*<Stack.Screen name="Chat" component={ChatWithPassengerScreen} />*/}
          {/*<Stack.Screen name="Wallet" component={WalletScreen} />*/}
          
          <Stack.Screen name="EditDriverProfile" component={EditDriverProfileScreen} />
          <Stack.Screen name="EditMiddlemanProfile" component={EditMiddlemanProfileScreen} />
          {/*<Stack.Screen name="Notifications" component={NotificationsScreen} />*/}
          {/*<Stack.Screen name="InviteFriends" component={InviteFriendsScreen} />*/}
          {/*<Stack.Screen name="Faqs" component={FaqsScreen} />*/}
          <Stack.Screen name="DriverContactUs" component={DriverContactUsScreen} />
          <Stack.Screen name="MiddlemanContactUs" component={MiddlemanContactUsScreen} />

          <Stack.Screen
            name="DropOffLocation"
            component={DropOffLocationScreen}
          />
          <Stack.Screen name="SelectCab" component={SelectCabScreen} />
          <Stack.Screen name="SelectWater" component={SelectWaterScreen} />
          <Stack.Screen
            name="SearchingForDrivers"
            component={SearchingForDriversScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};
