import React, { Component } from "react";
import { View, FlatList, ActivityIndicator } from "react-native";
import { Query } from "react-apollo";
import moment from "moment";
import { ListItem, Right, Body, Text, Icon } from "native-base";
import { APPLIED_JOBS_QUERY } from "../../config/queries";

class AppliedJobsScreen extends Component {
  val = { page: 1, rows: 4 };

  _renderItem = ({ item }) => (
    <ListItem
      onPress={() => {
        this.props.route.navigation.navigate("searchDetail", {
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
        <Text note>Rate: {item.hourlyRate}</Text>
        <Icon active name="arrow-forward" />
      </Right>
    </ListItem>
  );

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
              if (loading) displayText = "Loading ...";
              else displayText = "No Data Found";

              return (
                <View>
                  <Text> {displayText}</Text>
                  {/* <Image
                    source={require("../../static/img/noResult.jpg")}
                    style={{
                      flex: 1,
                      resizeMode: "cover"
                    }}
                  /> */}
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
