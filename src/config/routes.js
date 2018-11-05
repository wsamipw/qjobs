import { createSwitchNavigator } from "react-navigation";
import { LoginScreen, RegisterScreen } from "../screens";

import routesHomeScreen from "../screens/config/routesHomeScreen";

export default initialRouteName =>
  createSwitchNavigator(
    {
      login: LoginScreen,
      register: RegisterScreen,
      home: routesHomeScreen
    },
    {
      initialRouteName
    }
  );
