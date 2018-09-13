import { AsyncStorage } from "react-native";

export const _storeData = async (key, data) => {
  try {
    await AsyncStorage.setItem(key, data);
    console.log("token Stored Successfully");
  } catch (error) {
    // Error saving data
    console.log("token Storing Error: ", error);
  }
};

export const _removeData = async (key, data) => {
  try {
    await AsyncStorage.removeItem(key);
    console.log("token Deleted Successfully");
  } catch (error) {
    // Error saving data
    console.log("token Deleting Error: ", error);
  }
};

export const _retrieveData = async key => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (error) {
    // Error retrieving data
    console.log("token retrieval Error: ", error);
    return null;
  }
};
