import React, { Component } from "react";
import {
  Image,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";

import { Card } from "react-native-elements";

import { Query } from "react-apollo";

import { MY_JOBS_QUERY } from "../../config/queries";

class MyJobScreen extends Component {
  _renderItem = ({ item }) => (
    <TouchableOpacity
      key={item.id}
      style={{
        flex: 1,
        flexDirection: "row",
        marginBottom: 3
        //backgroundColor: "#FF0000"
      }}
      onPress={() => {
        this.props.route.navigation.navigate("searchDetail", {
          item,
          key: this.props.route.key
        });
      }}
    >
      <Image
        style={{ width: 80, height: 80, margin: 5 }}
        source={require("../../static/img/user.png")}
      />
      <View style={{ flex: 1, justifyContent: "center", marginLeft: 5 }}>
        <Text style={{ fontSize: 18, color: "green", marginBottom: 15 }}>
          {item.typeOfJob}
        </Text>
        <Text style={{ fontSize: 16, color: "red" }}>
          {item.jobTitle && item.jobTitle.name}
        </Text>
      </View>
    </TouchableOpacity>
  );

  _renderSeparator = () => (
    <View style={{ height: 1, width: "100%", backgroundColor: "grey" }} />
  );

  render() {
    return (
      <View>
        <Query
          query={MY_JOBS_QUERY}
          fetchPolicy="cache-and-network"
          notifyOnNetworkStatusChange
        >
          {({ loading, error, data, refetch, networkStatus }) => {
            if (networkStatus === 4)
              return <ActivityIndicator size="large" color="#ff6347" />;
            if (loading)
              return <ActivityIndicator size="large" color="#ff6347" />;
            if (error) return <Text>Error Fetching Data !</Text>;

            if (data && data.me && data.me.jobSet && data.me.jobSet.length) {
              return (
                <View>
                  <FlatList
                    data={data.me.jobSet}
                    refreshing={networkStatus === 4}
                    onRefresh={() => refetch()}
                    keyExtractor={item => item.id}
                    /* renderItem={({ item }) => {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          this.props.route.navigation.navigate("searchDetail", {
                            item,
                            key: this.props.route.key
                          });
                        }}
                        key={item.id}
                      >
                        <Card>
                          <Text>Id: {item.id}</Text>
                          <Text>
                            Name: {item.jobTitle && item.jobTitle.name}
                          </Text>
                          <Text>Type of Job: {item.typeOfJob}</Text>
                        </Card>
                      </TouchableOpacity>
                    );
                  }} */
                    renderItem={this._renderItem}
                    ItemSeparatorComponent={this._renderSeparator}
                  />
                </View>
              );
            } else {
              return (
                <View>
                  <Text>No Data Found</Text>
                </View>
              );
            }
          }}
        </Query>
      </View>
    );
  }
}

export default MyJobScreen;
