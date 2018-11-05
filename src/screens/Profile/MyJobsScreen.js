import React, { Component } from "react";
import {
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
                  }}
                />
              </View>
            );
          }}
        </Query>
      </View>
    );
  }
}

export default MyJobScreen;
