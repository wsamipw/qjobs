import React, { Component } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl
} from "react-native";

import { Text, Spinner } from "native-base";
import { Card } from "react-native-elements";
import { Query } from "react-apollo";

import { _retrieveData } from "../../../config/utils";
import {
  USER_DATA,
  APPLIED,
  ACCEPTED,
  REJECTED,
  CONFIRMED,
  REVOKED,
  TIMEOUT,
  COMPLETED,
  UNCOMPLETED,
  PAID,
  DISPUTE,
  PRIMARY_COLOR
} from "../../../config/CONSTANTS";

import { JOB_APPLICATIONS_QUERY } from "../../../config/queries";
import Tag from "../../../components/Tag";

class JobApplicationsListScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: `Job Applications`,
      headerStyle: {
        backgroundColor: "#5968ef"
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold"
      }
    };
  };

  state = {
    page: 1,
    rows: 4,
    fetchMoreLoading: false
  };

  renderStatus = status => {
    if (status === ACCEPTED) {
      return <Tag text="Accepted" primary />;
    } else if (status === REJECTED) {
      return <Tag text="Rejected" danger />;
    } else if (status === APPLIED) {
      return <Tag text="Applied" primary />;
    } else if (status === CONFIRMED) {
      return <Tag text="Confirmed" success />;
    } else if (status === REVOKED) {
      return <Tag text="Revoked" warning />;
    } else if (status === TIMEOUT) {
      return <Tag text="Timeout" warning />;
    } else if (status === COMPLETED) {
      return <Tag text="Completed" success />;
    } else if (status === UNCOMPLETED) {
      return <Tag text="Uncompleted" warning />;
    } else if (status === PAID) {
      return <Tag text="Paid" success />;
    } else if (status === DISPUTE) {
      return <Tag text="Dispute" danger />;
    } else {
      return null;
    }
  };

  render() {
    const jobId = this.props.navigation.getParam("jobId", null);

    return (
      <Query
        query={JOB_APPLICATIONS_QUERY}
        variables={{ page: 1, rows: 4, jobId }}
        fetchPolicy="cache-and-network"
        notifyOnNetworkStatusChange
      >
        {({ loading, error, data, refetch, networkStatus, fetchMore }) => {
          if (error) {
            console.log("error: ", JSON.stringify(error));
            return <Text>Error Fetching Data !</Text>;
          }

          if (
            data &&
            data.jobApplications &&
            data.jobApplications.data &&
            data.jobApplications.data.length
          ) {
            return (
              <ScrollView
                scrollEnabled
                refreshControl={
                  <RefreshControl
                    refreshing={networkStatus === 4}
                    onRefresh={() => {
                      this.setState({ page: 1 }, () => refetch());
                    }}
                  />
                }
              >
                <View style={styles.mainWrapper}>
                  <StatusBar
                    barStyle="light-content"
                    backgroundColor={PRIMARY_COLOR}
                  />

                  <View>
                    <FlatList
                      data={data.jobApplications.data}
                      refreshing={networkStatus === 4}
                      onRefresh={() => {
                        this.setState({ page: 1 }, () => refetch());
                      }}
                      keyExtractor={item => item.id}
                      onEndReached={() => {
                        this.setState({ fetchMoreLoading: true }, () => {
                          console.log("page: ", data.jobApplications.page);
                          console.log("pages: ", data.jobApplications.pages);
                          console.log("pages: ", data.jobApplications.pages);
                          console.log("rows: ", data.jobApplications.rows);
                          console.log(
                            "data.length: ",
                            data.jobApplications.data.length
                          );
                          if (this.state.page < data.jobApplications.pages) {
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
                                      jobApplications: {
                                        ...previousResult.jobApplications,
                                        data: [
                                          ...previousResult.jobApplications
                                            .data,
                                          ...fetchMoreResult.jobApplications
                                            .data
                                        ],
                                        page:
                                          fetchMoreResult.jobApplications.page
                                      }
                                    });
                                  }
                                });
                              }
                            );
                          } else {
                            this.setState({ fetchMoreLoading: false });
                          }
                        });
                      }}
                      onEndReachedThreshold={0.5}
                      renderItem={({ item }) => {
                        return (
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate(
                                "jobApplicationDetail",
                                {
                                  item,
                                  jobId
                                }
                              )
                            }
                            key={item.id}
                          >
                            <Card>
                              <Text>
                                <Text style={{ fontWeight: "bold" }}>
                                  Name:{" "}
                                </Text>
                                {item.employee &&
                                item.employee.firstName &&
                                item.employee.lastName
                                  ? `${item.employee.firstName} ${
                                      item.employee.lastName
                                    }`
                                  : `${item.employee.username}  `}
                              </Text>
                              <Text>
                                <Text style={{ fontWeight: "bold" }}>
                                  Email:{" "}
                                </Text>
                                {item.employee && item.employee.email}
                              </Text>
                              <Text>
                                <Text style={{ fontWeight: "bold" }}>
                                  Hourly Rate:{" "}
                                </Text>
                                {item.hourlyRate}
                              </Text>
                              {this.renderStatus(item.status)}
                            </Card>
                          </TouchableOpacity>
                        );
                      }}
                    />
                    {this.state.fetchMoreLoading && <Spinner color="grey" />}
                  </View>
                </View>
              </ScrollView>
            );
          }
          if (loading) {
            console.log("loading  loading: ", loading);
            // console.log("loading  data: ", data);
            return <ActivityIndicator size="large" color="#ff6347" />;
          }

          return (
            <View>
              <Text>No Data Found</Text>
            </View>
          );
        }}
      </Query>
    );
  }
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    marginBottom: 10
  }
});

export default JobApplicationsListScreen;
