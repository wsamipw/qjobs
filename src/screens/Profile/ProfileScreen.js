import React, { Component } from "react";
import { View, Image } from "react-native";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";

import Ionicons from "react-native-vector-icons/MaterialCommunityIcons";
import HeaderButtons, {
  HeaderButton,
  Item
} from "react-navigation-header-buttons";

import { Button } from "react-native-elements";

import { _removeData } from "../../config/utils";
import { JWT_AUTH_TOKEN } from "../../config/CONSTANTS";
import MyJobsScreen from "./MyJobsScreen";
import AppliedJobsScreen from "./AppliedJobsScreen";

const IoniconsHeaderButton = passMeFurther => (
  // the `passMeFurther` variable here contains props from <Item .../> as well as <HeaderButtons ... />
  // and it is important to pass those props to `HeaderButton`
  // then you may add some information like icon size or color (if you use icons)
  <HeaderButton
    {...passMeFurther}
    IconComponent={Ionicons}
    iconSize={23}
    color="black"
  />
);

class ProfileScreen extends Component {
  /* Below navigationOptions need not be called or passed
   * It is static and automatically used by react-navigation
   * For details refer: https://reactnavigation.org/docs/en/headers.html
  */
  static navigationOptions = ({ navigation }) => {
    return {
      // `headerLeft` needed to align `headerTitle` exactly at center
      headerLeft: <View />,
      headerTitle: (
        <View
          style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}
        >
          <Image
            source={require("../../static/img/logoIcon.png")}
            style={{
              width: 50,
              height: 50,
              resizeMode: "contain",
              alignSelf: "center"
            }}
          />
        </View>
      ),
      headerRight: (
        <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
          <Item
            title="Add Job"
            iconName="plus-circle"
            onPress={() => {
              navigation.navigate("postJob1");
            }}
          />
          <Item
            title="settings"
            iconName="settings"
            onPress={() => {
              navigation.navigate("settings");
            }}
          />
          <Item
            title="logout"
            iconName="logout"
            onPress={async () => {
              await _removeData(JWT_AUTH_TOKEN);
              navigation.navigate("login");
            }}
          />
        </HeaderButtons>
      )
    };
  };

  state = {
    index: 0,
    routes: [
      { key: "myJobs", title: "My Jobs", navigation: this.props.navigation },
      {
        key: "appliedJobs",
        title: "Applied Jobs",
        navigation: this.props.navigation
      }
    ]
  };

  render() {
    return (
      <TabView
        navigationState={this.state}
        onIndexChange={index => this.setState({ index })}
        renderScene={SceneMap({
          myJobs: MyJobsScreen,
          appliedJobs: AppliedJobsScreen
        })}
      />
    );
  }
}

export default ProfileScreen;
