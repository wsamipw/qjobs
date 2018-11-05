import React, { Component } from "react";
import {
  StyleSheet,
  StatusBar,
  ToolbarAndroid,
  View,
  Text,
  FlatList,
  TouchableOpacity
} from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";

import { connect } from "react-redux";
import { Button, Card } from "react-native-elements";

import { _removeData } from "../../config/utils";
import { JWT_AUTH_TOKEN } from "../../config/CONSTANTS";

import { Query, compose } from "react-apollo";

import { MY_JOBS_QUERY } from "../../config/queries";

import { createMaterialTopTabNavigator } from "react-navigation";

class ProfileScreen extends Component {
  static navigationOptions = { header: null };

  onActionSelected = async position => {
    console.log("postioon: ", position);

    if (position === 0) {
      this.props.navigation.navigate("settings");
    } else if (position === 1) {
      await _removeData(JWT_AUTH_TOKEN);
      this.props.mainNavigation.navigate("login");
    }
  };

  render() {
    return (
      <View>
        <StatusBar backgroundColor="rgb(122,77,246)" barStyle="light-content" />
        <ToolbarAndroid
          style={styles.toolbar}
          logo={require("../../static/img/logoIcon.png")}
          title="AwesomeApp"
          actions={[
            {
              title: "Settings",
              icon: require("../../static/img/settings.png"),
              show: "always"
            },
            {
              title: "Logout",
              icon: require("../../static/img/logout.png"),
              show: "always"
            }
          ]}
          onActionSelected={this.onActionSelected}
        />

        <View>
          <Button
            backgroundColor="#3F51B5"
            title="Post A Job"
            onPress={() => {
              this.props.navigation.navigate("postJob1");
            }}
          />
          <Query
            query={MY_JOBS_QUERY}
            fetchPolicy="cache-and-network"
            notifyOnNetworkStatusChange
          >
            {({ loading, error, data, refetch, networkStatus }) => {
              if (networkStatus === 4) return <Text>Refetching!</Text>;
              if (loading) return <Text>Loading ...</Text>;
              if (error) return <Text>Error Fetching Data !</Text>;
              return (
                <View>
                  <FlatList
                    data={data.me.jobSet}
                    refreshing={networkStatus === 4}
                    onRefresh={() => refetch()}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => {
                      return (
                        <TouchableOpacity
                          onPress={() => {
                            this.props.navigation.navigate("searchDetail", {
                              item
                            });
                          }}
                          key={item.id}
                        >
                          <Card>
                            <Text>Id: {item.id}</Text>
                            <Text>Name: {item.name}</Text>
                            <Text>Type of Job: {item.typeOfJob}</Text>
                          </Card>
                        </TouchableOpacity>
                      );
                    }}
                  />
                </View>
              );
            }}
          </Query>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerToolbar: {
    flex: 1,
    //justifyContent: 'center',
    justifyContent: "flex-start",
    // https://github.com/facebook/react-native/issues/2957#event-417214498
    alignItems: "stretch",
    backgroundColor: "#F5FCFF"
  },
  toolbar: {
    backgroundColor: "#95a2b2",
    marginTop: getStatusBarHeight(),
    height: 30 + getStatusBarHeight()
  }
});

const mapStateToProps = ({ myNavigationReducer }) => {
  return { ...myNavigationReducer };
};

export default compose(connect(mapStateToProps))(ProfileScreen);
