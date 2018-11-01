import React, { Component } from "react";
import {
  StyleSheet,
  StatusBar,
  ToolbarAndroid,
  View,
  ScrollView,
  Text,
  RefreshControl
} from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";

import { connect } from "react-redux";
import { Button, Card } from "react-native-elements";

import { _removeData } from "../config/utils";
import { JWT_AUTH_TOKEN } from "../config/CONSTANTS";

import { Query } from "react-apollo";

import { PostJobStack } from "../config/routes";
import { JOBS_QUERY } from "../config/queries";
import { Content } from "native-base";

class ProfileScreen extends Component {
  state = {
    page: 1,
    rows: 5
  };

  static navigationOptions = { header: null };

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

  render() {
    const { page, rows } = this.state;

    return (
      <ScrollView scrollEnabled>
        <StatusBar backgroundColor="rgb(122,77,246)" barStyle="light-content" />
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
                <Query
          query={JOBS_QUERY}
          fetchPolicy="cache-and-network"
          variables={{ page, rows }}
          notifyOnNetworkStatusChange
        >
          {({ loading, error, data, refetch, networkStatus }) => {
            if (networkStatus === 4) return <Text>Refetching!</Text>;
            if (loading) return <Text>Fetching Data ...</Text>;
            if (error) return <Text>Error Fetching Data !</Text>;
            console.log("jobs list: ", data, networkStatus);
            return (
              <View>
                <Content>
                  <FlatList
                    data={data.jobs.data}
                    refreshing={this.onCheckRefreshCondition(networkStatus)}
                    onRefresh={() => refetch()}
                    keyExtractor={item => item.id}
                    renderItem={({ job }) => {
                      console.log("job: ", job);
                      return (
                        <Card key={job.id}>
                          <Text>Id: {job.id}</Text>
                          <Text>Name: {job.name}</Text>
                          <Text>Type of Job: {job.typeOfJob}</Text>
                        </Card>
                      );
                    }}
                  />
                  {/*
                  {data.jobs.data.map(job => (
                    <Card key={job.id}>
                      <Text>Id: {job.id}</Text>
                      <Text>Name: {job.name}</Text>
                      <Text>Type of Job: {job.typeOfJob}</Text>
                    </Card>
                  ))}
*/}
               
               
        
        <Query
          query={JOBS_QUERY}
          fetchPolicy="cache-and-network"
          variables={{ page, rows }}
          notifyOnNetworkStatusChange
        >
          {({ loading, error, data, refetch, networkStatus }) => {
            if (networkStatus === 4) return <Text>Refetching!</Text>;
            if (loading) return <Text>Fetching Data ...</Text>;
            if (error) return <Text>Error Fetching Data !</Text>;
            console.log("jobs list: ", data, networkStatus);
            return (
              <View>
                <Content
                  refreshControl={
                    <RefreshControl
                      refreshing={this.onCheckRefreshCondition(networkStatus)}
                      onRefresh={() => refetch()}
                    />
                  }
                >
                  {data.jobs.data.map(job => (
                    <Card key={job.id}>
                      <Text>Id: {job.id}</Text>
                      <Text>Name: {job.name}</Text>
                      <Text>Type of Job: {job.typeOfJob}</Text>
                    </Card>
                  ))}
                </Content>
              </View>
            );
          }}
        </Query>
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

export default connect(mapStateToProps)(ProfileScreen);
