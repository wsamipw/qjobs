import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  FlatList,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";

import { Button, Text } from "native-base";
import { Card } from "react-native-elements";

import { Query } from "react-apollo";

import { JOB_STATUS_CHECK_QUERY } from "../../../config/queries";

import { _retrieveData } from "../../../config/utils";
import { USER_DATA } from "../../../config/CONSTANTS";

import { JOB_APPLICATIONS_QUERY } from "../../../config/queries";

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
    // LoggedIn user id
    id: ""
  };

  val = { page: 1, rows: 4 };

  async componentDidMount() {
    try {
      const user = JSON.parse(await _retrieveData(USER_DATA));
      user && this.setState({ id: user.id });
    } catch (err) {
      console.log("error searchdetailscreen.js: ", err);
    }
  }

  render() {
    const jobId = this.props.navigation.getParam("jobId", null);

    return (
      <ScrollView scrollEnabled>
        <View style={styles.mainWrapper}>
          <StatusBar barStyle="light-content" backgroundColor="#ecf0f1" />

          <Query
            query={JOB_APPLICATIONS_QUERY}
            variables={{ page: this.val.page, rows: this.val.rows, jobId }}
            fetchPolicy="cache-and-network"
            notifyOnNetworkStatusChange
          >
            {({ loading, error, data, refetch, networkStatus, fetchMore }) => {
              if (networkStatus === 4)
                return <ActivityIndicator size="large" color="#ff6347" />;
              if (loading)
                return <ActivityIndicator size="large" color="#ff6347" />;
              if (error) {
                console.log("error: ", JSON.stringify(error));
                return <Text>Error Fetching Data !</Text>;
              }

              console.log("dataL list: ", data);

              if (
                data &&
                data.jobApplications &&
                data.jobApplications.data &&
                data.jobApplications.data.length
              ) {
                return (
                  <View>
                    <FlatList
                      data={data.jobApplications.data}
                      refreshing={networkStatus === 4}
                      onRefresh={() => refetch()}
                      keyExtractor={item => item.id}
                      renderItem={({ item }) => {
                        return (
                          <TouchableOpacity
                            onPress={() =>
                              this.props.navigation.navigate(
                                "jobApplicationDetail",
                                {
                                  item
                                }
                              )
                            }
                            key={item.id}
                          >
                            <Card>
                              <Text style={{ fontWeight: "100" }}>
                                Name:
                                {item.employee &&
                                  `${item.employee.firstName} ${
                                    item.employee.lastName
                                  }`}
                              </Text>
                              <Text>
                                Email: {item.employee && item.employee.email}
                              </Text>
                              <Text>Hourly Rate: {item.hourlyRate}</Text>

                              {/* {this.renderCheckmarks(item)} */}
                            </Card>
                          </TouchableOpacity>
                        );
                      }}
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
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    marginBottom: 10
    // marginTop: Dimensions.get("window").height * 0.05,
    // marginLeft: Dimensions.get("screen").width * 0.05,
    // marginRight: Dimensions.get("screen").width * 0.05
  },
  headingTextStyles: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 8
  },
  renderCheckmarksWrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  statusBtnStyles: {
    marginVertical: 6
  }
});

export default JobApplicationsListScreen;
