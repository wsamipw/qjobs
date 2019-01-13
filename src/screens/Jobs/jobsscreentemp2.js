import React, { Component } from "react";
import {
  StyleSheet,
  StatusBar,
  ToolbarAndroid,
  View,
  ScrollView,
  Text,
  RefreshControl,
  FlatList
} from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";

import { connect } from "react-redux";
import { Button, Card } from "react-native-elements";

import { _removeData } from "../../config/utils";
import { JWT_AUTH_TOKEN, PRIMARY_COLOR } from "../../config/CONSTANTS";

import { Query, compose, withApollo, graphql } from "react-apollo";

import { PostJobStack } from "../../config/routes";
import { JOBS_QUERY } from "../../config/queries";

class JobsScreen extends Component {
  state = {
    page: 1,
    rows: 5,

    jobs: []
  };

  static navigationOptions = { header: null };

  componentDidMount() {
    this.onQueryFetch();
  }

  onActionSelected = async position => {
    console.log("postioon: ", position);
    console.log("porp: ", this.props);

    if (position === 0) {
      this.props.navigation.navigate("settings");
    } else if (position === 1) {
      await _removeData(JWT_AUTH_TOKEN);
      this.props.mainNavigation.navigate("login");
    }
  };

  onCheckRefreshCondition = networkStatus => {
    if (networkStatus === 7) return false;
    if (networkStatus === 4) return true;

    return false;
  };

  // onQueryFetch = callback => {
  //   const { page, rows } = this.state;

  //   this.props.client
  //     .query({
  //       query: JOBS_QUERY,
  //       variables: { page, rows }
  //     })
  //     .then(({ data }) => {
  //       this.setState({ jobs: data.jobs.data });
  //       // A Callback function to change ``refreshing`` state status ...
  //       if (callback) callback();
  //     })
  //     .catch(error => {
  //       console.log("error fetchting data: ", error);

  //       // A Callback function to change ``refreshing`` state status ...
  //       if (callback) callback();
  //     });
  // };

  onQueryFetch = callback => {
    const { page, rows } = this.state;

    this.props.client
      .query({
        query: JOBS_QUERY,
        variables: { page, rows },
        fetchPolicy: "no-cache"
      })
      .then(({ data }) => {
        this.setState({ jobs: data.jobs.data });
        // A Callback function to change ``refreshing`` state status ...
        if (callback) callback();
      })
      .catch(error => {
        console.log("error fetchting data: ", error);

        // A Callback function to change ``refreshing`` state status ...
        if (callback) callback();
      });
  };

  render() {
    const { page, rows } = this.state;
    return (
      <ScrollView scrollEnabled>
        <StatusBar backgroundColor={PRIMARY_COLOR} barStyle="light-content" />
        <ToolbarAndroid
          style={styles.toolbar}
          logo={require("../static/img/logoIcon.png")}
          title="AwesomeApp"
          actions={[
            {
              title: "Settings",
              icon: require("../static/img/settings.png"),
              show: "always"
            },
            {
              title: "Logout",
              icon: require("../static/img/logout.png"),
              show: "always"
            }
          ]}
          onActionSelected={this.onActionSelected}
        />

        <FlatList
          data={this.state.jobs}
          refreshing={this.props.jobs.networkStatus === 4}
          onRefresh={() => this.props.jobs.refetch()}
          keyExtractor={item => item.id}
          renderItem={({ item }) => {
            return (
              <Card key={item.id}>
                <Text>Id: {item.id}</Text>
                <Text>Name: {item.name}</Text>
                <Text>Type of Job: {item.typeOfJob}</Text>
              </Card>
            );
          }}
        />

        <Button
          backgroundColor="#3F51B5"
          title="Post A Job"
          onPress={() => this.props.navigation.navigate("postJob1")}
        />
      </ScrollView>
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

export default compose(
  connect(mapStateToProps),
  withApollo,
  graphql(JOBS_QUERY, {
    name: "jobs",
    options: props => ({
      variables: { page: props.page, rows: props.rows },
      fetchPolicy: "no-cache"
    })
  })
)(JobsScreen);
