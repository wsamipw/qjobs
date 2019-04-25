import React, { Component } from "react";
import { View, FlatList, ActivityIndicator } from "react-native";
import { Query } from "react-apollo";
import moment from "moment";
import { ListItem, Right, Body, Text, Icon, Badge, Spinner } from "native-base";
import { APPLIED_JOBS_QUERY } from "../../../config/queries";
import { PRIMARY_COLOR } from "../../../config/CONSTANTS";

class AppliedJobsScreen extends Component {
  val = { page: 1, rows: 5 };

  fetchMoreLoading = false;

  _renderItem = ({ item }) => {
    return (
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
            {item.job && item.job.properties.name}
          </Text>

          <Text note>
            {" "}
            By:{" "}
            {item.job &&
            item.job.properties &&
            item.job.properties.employer &&
            item.job.properties.employer.firstName &&
            item.job.properties.employer.lastName
              ? `${item.job.properties.employer.firstName} ${
                  item.job.properties.employer.lastName
                }`
              : `${item.job.properties.employer.username}`}
          </Text>
          <Text note>
            {" "}
            Deadline: {moment(item.job.properties.hireBy).fromNow()}
          </Text>
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
  };

  render() {
    return (
      <View>
        <Query
          query={APPLIED_JOBS_QUERY}
          fetchPolicy="cache-and-network"
          variables={{ page: this.val.page, rows: this.val.rows }}
          // notifyOnNetworkStatusChange
        >
          {({ loading, error, data, refetch, networkStatus, fetchMore }) => {
            if (networkStatus === 4) {
              console.log("network status lading: ", loading);
              console.log("network status data: ", data);

              return <ActivityIndicator size="large" color="#ff6347" />;
            }
            if (loading && !this.fetchMoreLoading) {
              console.log("loading  loading: ", loading);
              console.log("loading  data: ", data);
              return <ActivityIndicator size="large" color="#ff6347" />;
            }
            if (error) {
              console.log("error applied jobs: ", JSON.stringify(error));
              return <Text>Error Fetching Data !</Text>;
            }

            // console.log(
            //   "data: appleid:  ",
            //   data.appliedJobs.page,
            //   " ",
            //   data.appliedJobs.pages,
            //   " ",
            //   data.appliedJobs.rows,
            //   " ",
            //   data.appliedJobs.rowCount
            // );

            if (data && data.appliedJobs && data.appliedJobs.data.length) {
              console.log("data apllied jos: ", data.appliedJobs);
              return (
                <View>
                  <FlatList
                    data={data.appliedJobs.data}
                    refreshing={networkStatus === 4}
                    onRefresh={() => {
                      console.log("val page refetch: ", this.val.page);
                      this.val.page = 1;
                      refetch();
                    }}
                    keyExtractor={item => item.id}
                    onEndReached={() => {
                      this.val.page += 1;
                      this.fetchMoreLoading = true;

                      console.log("page:", this.val.page);
                      console.log("pagessss: ", data.appliedJobs.pages);
                      if (this.val.page <= data.appliedJobs.pages) {
                        console.log("fetchmore ran: ", this.val.page);
                        fetchMore({
                          variables: {
                            page: this.val.page,
                            rows: this.val.rows
                          },
                          updateQuery: (prev, { fetchMoreResult }) => {
                            this.fetchMoreLoading = false;
                            if (!fetchMoreResult) return prev;
                            return Object.assign({}, prev, {
                              appliedJobs: {
                                ...prev.appliedJobs,
                                data: [
                                  ...prev.appliedJobs.data,
                                  ...fetchMoreResult.appliedJobs.data
                                ],
                                page: fetchMoreResult.appliedJobs.page
                              }
                            });
                          }
                        });
                      }
                    }}
                    onEndReachedThreshold={0.8}
                    renderItem={this._renderItem}
                  />
                  {this.fetchMoreLoading && <Spinner color="grey" />}
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
                console.log("no result for aplplpedi jos: ", data.appliedJobs);
                return (
                  <View style={{ flex: 1 }}>
                    {/* <StatusBar
                      barStyle="light-content"
                      backgroundColor={PRIMARY_COLOR}
                    /> */}
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
                        {/* {this.props.navigation.state.params.query} */}
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
