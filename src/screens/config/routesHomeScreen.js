import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Entypo from "react-native-vector-icons/Entypo";
import Feather from "react-native-vector-icons/Feather";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import {
  createSwitchNavigator,
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";

import {
  SearchJobScreen,
  SearchDetailScreen,
  UserDetailScreen,
  JobsScreen,
  JobsDetailScreen,
  MyJobDetailScreen,
  AppliedJobDetailScreen,
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
  ApplyJob,
  More,
  JobApplicationsListScreen,
  JobApplicationDetailScreen
} from "..";
import { ACCENT_COLOR } from "../../config/CONSTANTS";

const JobsStack = createStackNavigator(
  {
    jobs: JobsScreen,
    jobsDetail: JobsDetailScreen,

    appliedJobDetail: AppliedJobDetailScreen,
    jobApplicationsList: JobApplicationsListScreen,
    jobApplicationDetail: JobApplicationDetailScreen,

    myJobDetail: MyJobDetailScreen,

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

    postJob41: PostJobScreen41
  },
  {
    initialRouteName: "jobs"
    // navigationOptions: {
    //   headerStyle: {
    //     backgroundColor: "#5968ef"
    //   }
    // }
  }
);

const JobApplicationsListSwitch = createSwitchNavigator(
  {
    jobApplicationsList: JobApplicationsListScreen,
    jobApplicationDetail: JobApplicationDetailScreen
  },
  {
    initialRouteName: "jobApplicationsList"
  }
);

JobsStack.navigationOptions = {
  headerStyle: {
    backgroundColor: "#5968ef"
  }
};

const SearchStack = createStackNavigator(
  {
    search: SearchJobScreen,
    result: SearchResultScreen,
    applyJob: ApplyJob,
    searchDetail: SearchDetailScreen
  },
  {
    initialRouteName: "search"
  }
);

const MoreStack = createStackNavigator(
  {
    more: More,
    userDetail: UserDetailScreen,

    // Settings Related Pages

    //Not used currently
    //settings: SettingsScreen,
    accounts: Accounts
    // navigationOptions: {
    //   headerStyle: {
    //     backgroundColor: "#5968ef"
    //   }
    // }
  },
  { initialRouteName: "more" }
);

export default createBottomTabNavigator(
  {
    Jobs: JobsStack,
    Search: SearchStack,
    More: MoreStack
  },
  {
    initialRouteName: "Search",

    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === "Jobs") {
          iconName = `briefcase`;
          return (
            <FontAwesome
              name={iconName}
              size={horizontal ? 20 : 25}
              color={tintColor}
            />
          );
        } else if (routeName === "Search") {
          iconName = `search`;
          return (
            <FontAwesome
              name={iconName}
              size={horizontal ? 20 : 25}
              color={tintColor}
            />
          );
        } else if (routeName === "More") {
          iconName = `more-horiz`;
          return (
            <MaterialIcons
              name={iconName}
              size={horizontal ? 20 : 25}
              color={tintColor}
            />
          );
        }

        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        // return (
        //   <FontAwesome
        //     name={iconName}
        //     size={horizontal ? 20 : 25}
        //     color={tintColor}
        //   />
        // );
      }
    }),

    tabBarOptions: {
      activeTintColor: ACCENT_COLOR,
      inactiveTintColor: "gray"
    }
  }
);
