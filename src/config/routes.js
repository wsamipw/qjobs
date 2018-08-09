import { createSwitchNavigator, createStackNavigator } from "react-navigation";
import { LoginScreen, RegisterScreen, HomeScreen } from "../screens";

export const MainStack = createStackNavigator(
  {
    home: HomeScreen
  },
  { initialRouteName: "home" }
);

export default initialRouteName =>
  createSwitchNavigator(
    {
      login: LoginScreen,
      register: RegisterScreen,
      home: HomeScreen
    },
    {
      initialRouteName
    }
  );
