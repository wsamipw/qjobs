import React, { Component } from "react";
import { View, Image, StyleSheet } from "react-native";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import HeaderButtons, {
  HeaderButton,
  Item
} from "react-navigation-header-buttons";

import ActionButton from "react-native-action-button";

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
      //headerLeft: <View />,
      headerStyle: {
        backgroundColor: "#5968ef"
      },
      headerTitle: (
        <View
          style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}
        >
          <Image
            source={require("../../static/img/logoIconMin.png")}
            style={{
              width: 50,
              height: 50,
              resizeMode: "contain",
              alignSelf: "center"
            }}
          />
        </View>
      )
      // headerRight: (
      //   <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
      //     <Item
      //       title="Add Job"
      //       iconName="plus-circle"
      //       onPress={() => {
      //         navigation.navigate("postJob1");
      //       }}
      //     />
      //     <Item
      //       title="settings"
      //       iconName="settings"
      //       onPress={() => {
      //         navigation.navigate("settings");
      //       }}
      //     />
      //     <Item
      //       title="logout"
      //       iconName="logout"
      //       onPress={async () => {
      //         await _removeData(JWT_AUTH_TOKEN);
      //         navigation.navigate("login");
      //       }}
      //     />
      //   </HeaderButtons>
      // )
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
      <View style={styles.container}>
        <TabView
          navigationState={this.state}
          onIndexChange={index => this.setState({ index })}
          renderScene={SceneMap({
            myJobs: MyJobsScreen,
            appliedJobs: AppliedJobsScreen
          })}
          renderTabBar={props => (
            <TabBar
              {...props}
              indicatorStyle={{ backgroundColor: "pink" }}
              style={{ backgroundColor: "#1abc9c" }}
            />
          )}
        />

        <ActionButton buttonColor="#ef3ea2">
          <ActionButton.Item
            buttonColor="#1abc9c"
            title="Create Job"
            onPress={() => this.props.navigation.navigate("postJob1")}
          >
            <MaterialIcons name="work" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: "white"
  }
});

export default ProfileScreen;
