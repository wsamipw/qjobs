import React, { Component } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Dimensions
} from "react-native";
import { Query } from "react-apollo";
import moment from "moment";
import {
  ListItem,
  Right,
  Body,
  Text,
  Icon,
  Badge,
  Spinner,
  Button
} from "native-base";
import { APPLIED_JOBS_QUERY } from "../../../config/queries";
import { PRIMARY_COLOR } from "../../../config/CONSTANTS";

class AppliedJobsScreen extends Component {
  state = { page: 1, rows: 5, fetchMoreLoading: false };

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
          // Never use this.state.page in this variables
          // or else, below fetchMore and refetch might
          // jeopardise the result.
          // Trust me, I ignored above instructions
          // and got back to 0 (same state).
          // So, don't try again.
          variables={{ page: 1, rows: 5 }}
          notifyOnNetworkStatusChange
        >
          {({ loading, error, data, refetch, networkStatus, fetchMore }) => {
            // if (networkStatus === 4) {
            //   console.log("network status lading: ", loading);
            //   // console.log("network status data: ", data);

            //   return <ActivityIndicator size="large" color="#ff6347" />;
            // }
            if (loading && !this.state.fetchMoreLoading) {
              console.log("loading  loading: ", loading);
              // console.log("loading  data: ", data);
              return <ActivityIndicator size="large" color="#ff6347" />;
            }
            if (error) {
              console.log("error applied jobs: ", JSON.stringify(error));
              return <Text>Error Fetching Data !</Text>;
            }

            if (data && data.appliedJobs && data.appliedJobs.data.length) {
              // console.log("data apllied jos: ", data.appliedJobs);
              return (
                <View>
                  <FlatList
                    data={data.appliedJobs.data}
                    refreshing={networkStatus === 4}
                    onRefresh={() => {
                      console.log("state page refetch: ", this.state.page);
                      this.setState({ page: 1 }, () => refetch());
                    }}
                    keyExtractor={item => item.id}
                    onEndReached={() => {
                      this.setState({ fetchMoreLoading: true }, () => {
                        console.log("page:", this.state.page);
                        console.log("pagessss: ", data.appliedJobs.pages);
                        if (this.state.page < data.appliedJobs.pages) {
                          console.log("fetchmore ran: ", this.state.page);

                          this.setState(
                            {
                              page: this.state.page + 1
                            },
                            () => {
                              fetchMore({
                                variables: {
                                  page: this.state.page,
                                  rows: this.state.rows
                                },
                                updateQuery: (
                                  previousResult,
                                  { fetchMoreResult }
                                ) => {
                                  this.setState({ fetchMoreLoading: false });

                                  if (!fetchMoreResult) return previousResult;
                                  return Object.assign({}, previousResult, {
                                    appliedJobs: {
                                      ...previousResult.appliedJobs,
                                      data: [
                                        ...previousResult.appliedJobs.data,
                                        ...fetchMoreResult.appliedJobs.data
                                      ],
                                      page: fetchMoreResult.appliedJobs.page
                                    }
                                  });
                                }
                              });
                            }
                          );
                        } else {
                          this.setState({ fetchMoreLoading: false });

                          console.log("page >= data pages");
                        }
                      });
                    }}
                    onEndReachedThreshold={0.1}
                    renderItem={this._renderItem}
                  />
                  {this.state.fetchMoreLoading && <Spinner color="grey" />}
                </View>
              );
            } else {
              if (loading) {
                console.log("LOADING TEXTTTTTTTTTT laoding ....");
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
                        marginTop: 200,
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
                        Currently, you have not applied for any jobs!{" "}
                        {/* {this.props.navigation.state.params.query} */}
                      </Text>
                      <Button
                        block
                        success
                        style={styles.statusBtnStylesAppliedJobs}
                        onPress={() => {
                          this.props.route.navigation.navigate("search");
                        }}
                      >
                        <Text>Search for a Job</Text>
                      </Button>
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

const styles = StyleSheet.create({
  statusBtnStylesAppliedJobs: {
    marginHorizontal: Dimensions.get("screen").width * 0.1,
    marginVertical: 10
  }
});

export default AppliedJobsScreen;
