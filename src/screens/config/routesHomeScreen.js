import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import {
  createSwitchNavigator,
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";

import {
  SearchJobScreen,
  SearchDetailScreen,
  UserDetailScreen,
  ProfileScreen,
  ProfileDetailScreen,
  MyJobsScreen,
  AppliedJobsScreen,
  SearchResultScreen,
  SettingsScreen,
  PostJobScreen1,
  PostJobScreen2,
  PostJobScreen3,
  PostJobScreen4,
  PostJobScreen5,
  PostJobScreen6,
  // SubPart
  PostJobScreen41,
  Accounts,
  ApplyJob
} from "..";

const ProfileStack = createStackNavigator(
  {
    profile: ProfileScreen,
    profileDetail: ProfileDetailScreen,

    searchDetail: SearchDetailScreen,

    // Post Job Related Pages
    postJob1: {
      screen: PostJobScreen1,
      navigationOptions: { tabBarVisible: false }
    },
    postJob2: PostJobScreen2,
    postJob3: PostJobScreen3,
    postJob4: PostJobScreen4,
    postJob5: PostJobScreen5,
    postJob6: PostJobScreen6,

    postJob41: PostJobScreen41,

    // Settings Related Pages
    settings: SettingsScreen,
    accounts: Accounts
  },
  {
    initialRouteName: "profile"
  }
);

const SearchStack = createStackNavigator(
  {
    search: SearchJobScreen,
    result: SearchResultScreen,
    applyJob: ApplyJob,
    searchDetail: SearchDetailScreen
  },
  { initialRouteName: "search" }
);

const PostStack = createStackNavigator(
  {
    userDetail: UserDetailScreen
  },
  { initialRouteName: "userDetail" }
);

export default createBottomTabNavigator(
  {
    Profile: ProfileStack,
    Search: SearchStack,
    Post: PostStack
  },
  {
    initialRouteName: "Search",

    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === "Profile") {
          iconName = `user`;
        } else if (routeName === "Search") {
          iconName = `search`;
        } else if (routeName === "Post") {
          iconName = `star-o`;
        }

        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return (
          <FontAwesome
            name={iconName}
            size={horizontal ? 20 : 25}
            color={tintColor}
          />
        );
      }
    }),
    tabBarOptions: {
      activeTintColor: "tomato",
      inactiveTintColor: "gray"
    }
  }
);
