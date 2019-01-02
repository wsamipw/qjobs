import { AsyncStorage } from "react-native";

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
    console.log("value: ", value);
    return value;
  } catch (error) {
    // Error retrieving data
    console.log("token retrieval Error: ", error);
    return null;
  }
};
