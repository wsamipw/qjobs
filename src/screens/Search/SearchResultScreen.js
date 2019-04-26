import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator
} from "react-native";

import { Button, Icon, Text } from "native-base";

import { Card, Divider } from "react-native-elements";
import moment from "moment";
import { Query } from "react-apollo";

import { JOBS_QUERY } from "../../config/queries";
import { _retrieveData } from "../../config/utils";
import {
  LOCATION,
  USER_DATA,
  MAX_SHORT_DESCRIPTION_CHARACTER,
  PRIMARY_COLOR
} from "../../config/CONSTANTS";

class SearchResultScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: `Search Results for ${navigation.state.params.query}`,
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
    location: null,
    queryDisable: true,
    title: "",
    // LoggedIn user
    user: null
  };

  async componentDidMount() {
    try {
      const obj = {};
      const location = await _retrieveData(LOCATION);
      const user = JSON.parse(await _retrieveData(USER_DATA));

      obj.location = location ? JSON.parse(location) : undefined;
      obj.user = user || undefined;

      // console.log("obj: ", obj);
      // this.props.navigation.setParams({
      //   myTitle: "j hos"
      // });
      this.setState({
        ...obj,
        queryDisable: false
        // title: this.props.navigation.getParam("query", undefined)
      });
    } catch (err) {
      console.log("error in try catch location: ", err);
    }
  }
  val = { page: 1, rows: 4 };

  _checkJobStatus = item => {
    if (
      item.properties.employer &&
      this.state.user &&
      item.properties.employer.id === this.state.user.id
    )
      return "My Job";

    const appliedJob =
      item.properties.applyjobSet && item.properties.applyjobSet.length
        ? item.properties.applyjobSet.find(
            eachjobSet => eachjobSet.employee.id === this.state.user.id
          )
        : null;

    return appliedJob ? appliedJob.status : null;
  };

  _displayJobStatus = jobStatus => {
    return jobStatus ? (
      <Button rounded small success style={styles.jobStatusBtnStyle}>
        <Text>{jobStatus}</Text>
      </Button>
    ) : null;
  };

  render() {
    const query = this.props.navigation.getParam("query", undefined);
    // console.log("navigation params::", this.props.navigation);
    // console.log("state::", this.state);
    return !this.state.queryDisable ? (
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" backgroundColor={PRIMARY_COLOR} />
        <Query
          query={JOBS_QUERY}
          fetchPolicy="network-only"
          variables={{
            page: this.val.page,
            rows: this.val.rows,
            query,
            latitude:
              this.state.location &&
              this.state.location.coords &&
              this.state.location.coords.latitude
                ? this.state.location.coords.latitude
                : undefined,
            longitude:
              this.state.location &&
              this.state.location.coords &&
              this.state.location.coords.longitude
                ? this.state.location.coords.longitude
                : undefined
          }}
        >
          {({ loading, error, data, fetchMore }) => {
            // This loading will re-render entire page
            // But we don't want that on Infinite-Scroll page
            // So it is checked below

            if (error) {
              console.log("error search job: ", JSON.stringify(error));
              return <Text>Error Fetching Data !</Text>;
            }

            if (data && data.jobs && data.jobs.data.length) {
              console.log("data::", data.jobs.data);
              return (
                <View
                  style={{
                    flex: 1,
                    marginBottom: 16
                  }}
                >
                  <FlatList
                    data={data.jobs.data}
                    keyExtractor={item => item.id}
                    onEndReached={() => {
                      this.val.page += 1;
                      // console.log("val: ", this.val);
                      // console.log("pages: ", data.jobs.pages);
                      // console.log("data length: ", data.jobs.data.length);
                      if (data.jobs.data.length < data.jobs.rowCount) {
                        fetchMore({
                          variables: {
                            page: this.val.page,
                            rows: this.val.rows
                          },
                          updateQuery: (prev, { fetchMoreResult }) => {
                            if (!fetchMoreResult) return prev;
                            return Object.assign({}, prev, {
                              jobs: {
                                ...prev.jobs,
                                data: [
                                  ...prev.jobs.data,
                                  ...fetchMoreResult.jobs.data
                                ]
                              }
                            });
                          }
                        });
                      }
                    }}
                    onEndReachedThreshold={0.1}
                    renderItem={({ item }) => {
                      const jobStatus = this._checkJobStatus(item);

                      return (
                        <TouchableOpacity
                          onPress={() =>
                            this.props.navigation.navigate("searchDetail", {
                              item,
                              jobStatus
                            })
                          }
                          key={item.id}
                        >
                          <Card>
                            <Text style={styles.jobSearchName}>
                              {item.properties.name}
                            </Text>
                            <Text style={styles.jobSearchDescription}>
                              {item.properties.description.slice(
                                0,
                                MAX_SHORT_DESCRIPTION_CHARACTER
                              )}
                              {item.properties.description.length >
                                MAX_SHORT_DESCRIPTION_CHARACTER && "..."}
                            </Text>
                            {this._displayJobStatus(jobStatus)}
                            <Divider
                              style={{
                                marginVertical: 8
                              }}
                            />
                            <View style={styles.searchMetaStyles}>
                              <Text style={styles.searchMetaTextStyles}>
                                Applicant: {item.properties.applyJobCount}
                              </Text>
                              <Text style={styles.searchMetaTextDividerStyles}>
                                |
                              </Text>
                              <Text style={styles.searchMetaTextStyles}>
                                Deadline:{" "}
                                {moment(item.properties.hireBy).fromNow()}
                              </Text>
                            </View>
                            <View style={styles.searchMetaStyles}>
                              <Text style={styles.searchMetaTextStyles}>
                                Posted By:{" "}
                                {item.properties.employer.firstName &&
                                item.properties.employer.lastName
                                  ? `${item.properties.employer.firstName} ${
                                      item.properties.employer.lastName
                                    }`
                                  : `${item.properties.employer.username}`}
                              </Text>
                            </View>
                          </Card>
                        </TouchableOpacity>
                      );
                    }}
                  />
                </View>
              );
            }
            if (loading) {
              return <ActivityIndicator size="large" color="#ff6347" />;
            }
            return (
              <View style={{ flex: 1 }}>
                <StatusBar
                  barStyle="light-content"
                  backgroundColor={PRIMARY_COLOR}
                />
                <View style={styles.noDataViewStyle}>
                  <Icon
                    type="MaterialIcons"
                    name="cloud-off"
                    style={{ fontSize: 50, color: "#d3d3d3" }}
                  />
                  <Text note>
                    No results for {this.props.navigation.state.params.query}
                  </Text>
                </View>
              </View>
            );
          }}
        </Query>
      </View>
    ) : (
      <ActivityIndicator size="large" color="#ff6347" />
    );
  }
}

const styles = StyleSheet.create({
  noDataViewStyle: {
    flex: 1,
    height: "100%",
    marginTop: 100,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  jobSearchName: {
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 8
  },
  jobSearchDescription: {
    fontSize: 12,
    color: "rgba(0,0,0,0.6)"
  },
  searchMetaStyles: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start"
  },
  searchMetaTextStyles: {
    fontSize: 12,
    color: "rgba(0,0,0,0.7)",
    marginRight: 5
  },
  searchMetaTextDividerStyles: {
    fontSize: 12,
    marginRight: 5,
    color: "rgba(0,0,0,0.7)"
  },
  jobStatusBtnStyle: {
    marginTop: 8
  }
});

export default SearchResultScreen;
