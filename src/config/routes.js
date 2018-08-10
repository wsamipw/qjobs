import { createSwitchNavigator, createStackNavigator } from "react-navigation";
import {
  LoginScreen,
  RegisterScreen,
  HomeScreen,
  SearchJobScreen,
  PostJobScreen,
  ProfileScreen,
  ProfileDetailScreen
} from "../screens";

export const ProfileStack = createStackNavigator(
  {
    profile: ProfileScreen,
    profileDetail: ProfileDetailScreen
  },
  { initialRouteName: "profile" }
);
export const SearchStack = createStackNavigator(
  {
    search: SearchJobScreen
  },
  { initialRouteName: "search" }
);
export const PostStack = createStackNavigator(
  {
    post: PostJobScreen
  },
  { initialRouteName: "post" }
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
