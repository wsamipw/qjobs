import React, { Component } from "react";
import { View, FlatList, ActivityIndicator } from "react-native";
import { Query } from "react-apollo";
import moment from "moment";
import { ListItem, Right, Body, Text, Icon, Badge } from "native-base";
import { APPLIED_JOBS_QUERY } from "../../../config/queries";
import { PRIMARY_COLOR } from "../../../config/CONSTANTS";

class AppliedJobsScreen extends Component {
  val = { page: 1, rows: 4 };

  _renderItem = ({ item }) => (
    <ListItem
      onPress={() => {
        this.props.route.navigation.navigate("appliedJobDetail", {
          item,
          key: this.props.route.key
        });
      }}
    >
      <Body>
        <Text
          style={{
            fontWeight: "bold"
          }}
        >
          {item.job && item.job.name}
        </Text>

        <Text note>
          By: {item.job && item.job.employer && item.job.employer.username}
        </Text>
        <Text note> Deadline: {moment(item.job.hireBy).fromNow()}</Text>
      </Body>
      <Right>
        <Badge
          style={{
            backgroundColor: "white",
            borderWidth: 1,
            borderColor: PRIMARY_COLOR
          }}
        >
          <Text style={{ color: PRIMARY_COLOR, fontSize: 8 }}>
            {item.status}
          </Text>
        </Badge>
        <Text note>Rate: {item.hourlyRate}</Text>
        <Icon active name="arrow-forward" />
      </Right>
    </ListItem>
  );

  render() {
    console.log("this props applied");
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

            console.log("data: appleid:  ", data);

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
                    renderItem={this._renderItem}
                  />
                </View>
              );
            } else {
              if (loading) {
                return (
                  <View>
                    <Text>Loading...</Text>
                  </View>
                );
              } else {
                return (
                  <View style={{ flex: 1 }}>
                    <StatusBar
                      barStyle="light-content"
                      backgroundColor={PRIMARY_COLOR}
                    />
                    <View
                      style={{
                        flex: 1,
                        // height: "100%",
                        marginTop: 100,
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      <Icon
                        type="MaterialIcons"
                        name="cloud-off"
                        style={{ fontSize: 50, color: "#d3d3d3" }}
                      />
                      <Text note>
                        No results for{" "}
                        {this.props.navigation.state.params.query}
                      </Text>
                    </View>
                  </View>
                );
              }
            }
          }}
        </Query>
      </View>
    );
  }
}

export default AppliedJobsScreen;
