import { AsyncStorage } from "react-native";
import { Permissions, Notifications, Location } from "expo";
import { LOCATION, EXPO_PUSH_TOKEN } from "./CONSTANTS";

export const _storeData = async (key, data) => {
  try {
    await AsyncStorage.setItem(key, data);
    console.log(`${key} Stored Successfully`);
  } catch (error) {
    // Error saving data
    console.log(`${key} Storing Error: `, error);
    throw new Error(error);
  }
};

export const _removeData = async key => {
  try {
    await AsyncStorage.removeItem(key);
    console.log(`${key} Deleted Successfully`);
  } catch (error) {
    // Error saving data
    console.log(`${key} token Deleting Error: `, error);
    throw new Error(error);
  }
};

export const _retrieveData = async key => {
  try {
    const value = await AsyncStorage.getItem(key);
    // console.log("value utils.js: ", value);
    return value;
  } catch (error) {
    // Error retrieving data
    console.log("token retrieval Error: ", error);
    return null;
  }
};

export const registerForPushNotificationsAsync = async () => {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;

  // only ask if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  if (existingStatus !== "granted") {
    // Android remote notification permissions are granted during the app
    // install, so this will only ask on iOS
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }

  // Stop here if the user did not grant permissions
  if (finalStatus !== "granted") {
    return;
  }

  // Get the token that uniquely identifies this device
  try {
    const token = await Notifications.getExpoPushTokenAsync();
    console.log(" EXPO PUSH TOKEN: ", token);
    _storeData(EXPO_PUSH_TOKEN, token);
  } catch (error) {
    console.log("EXPO NOtification utils.js: ", error);
  }
};

export const _getLocationAsync = async () => {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.LOCATION
  );

  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    console.log("not granted");
    // Alert.alert(
    //   "No Location Permission",
    //   "Please Allow the location permission to the app. Reopen the App again.",
    //   [{ text: "OK", onPress: () => BackHandler.exitApp() }]
    // );

    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    finalStatus = status;
  }

  // Stop here if the user did not grant permissions
  if (finalStatus !== "granted") {
    return;
  }

  try {
    let location = await Location.getCurrentPositionAsync({});
    _storeData(LOCATION, JSON.stringify(location));
  } catch (error) {
    console.log("ERROR LOCAION utils.js: ", error);
  }
};
