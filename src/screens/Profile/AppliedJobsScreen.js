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

import { APPLIED_JOBS_QUERY } from "../../config/queries";

class AppliedJobsScreen extends Component {
  val = { page: 1, rows: 4 };

  render() {
    return (
      <View>
        <Query
          query={APPLIED_JOBS_QUERY}
          fetchPolicy="cache-and-network"
          variables={{ page: this.val.page, rows: this.val.rows }}
          notifyOnNetworkStatusChange
        >
          {({ loading, error, data, refetch, networkStatus, fetchMore }) => {
            let displayText = "";

            if (networkStatus === 4)
              return <ActivityIndicator size="large" color="#ff6347" />;
            if (loading)
              return <ActivityIndicator size="large" color="#ff6347" />;
            if (error) {
              console.log("error applied jobs: ", JSON.stringify(error));
              return <Text>Error Fetching Data !</Text>;
            }

            {
              /* console.log("applied jobs: ", data); */
            }
            if (data && data.appliedJobs && data.appliedJobs.data.length) {
              return (
                <View>
                  <FlatList
                    data={data.appliedJobs.data}
                    refreshing={networkStatus === 4}
                    onRefresh={() => refetch()}
                    keyExtractor={item => item.id}
                    onEndReached={() => {
                      this.val.page += 1;

                      if (this.val.page <= data.appliedJobs.pages) {
                        fetchMore({
                          variables: {
                            page: this.val.page,
                            rows: this.val.rows
                          },
                          updateQuery: (prev, { fetchMoreResult }) => {
                            if (!fetchMoreResult) return prev;
                            return Object.assign({}, prev, {
                              appliedJobs: {
                                ...prev.appliedJobs,
                                data: [
                                  ...prev.appliedJobs.data,
                                  ...fetchMoreResult.appliedJobs
                                ]
                              }
                            });
                          }
                        });
                      }
                    }}
                    onEndReachedThreshold={0.1}
                    renderItem={({ item }) => {
                      return (
                        <TouchableOpacity
                          onPress={() => {
                            this.props.route.navigation.navigate(
                              "searchDetail",
                              {
                                item
                              }
                            );
                          }}
                          key={item.id}
                        >
                          <Card>
                            <Text>Id: {item.id}</Text>
                            <Text>Name: {item.job && item.job.name}</Text>
                            <Text>Hourly Rate: {item.hourlyRate}</Text>
                          </Card>
                        </TouchableOpacity>
                      );
                    }}
                  />
                </View>
              );
            } else {
              if (loading) displayText = "Loading ...";
              else displayText = "No Data Found";

              return (
                <View>
                  <Image
                    source={require("../../static/img/noResult.jpg")}
                    style={{
                      flex: 1,
                      resizeMode: "cover"
                    }}
                  />
                </View>
              );
            }
          }}
        </Query>
      </View>
    );
  }
}

export default AppliedJobsScreen;
