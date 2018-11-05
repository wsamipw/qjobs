import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity
} from "react-native";

import { connect } from "react-redux";
import { Card } from "react-native-elements";

import { Query, compose } from "react-apollo";

import { MY_JOBS_QUERY } from "../../config/queries";

class MyJobs extends Component {
  render() {
    return (
      <View>
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
    );
  }
}

const mapStateToProps = ({ myNavigationReducer }) => {
  return { ...myNavigationReducer };
};

export default compose(connect(mapStateToProps))(MyJobs);
