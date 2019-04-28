import React, { Component } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";

import { Text } from "native-base";
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
      <ScrollView scrollEnabled>
        <View style={styles.mainWrapper}>
          <StatusBar barStyle="light-content" backgroundColor={PRIMARY_COLOR} />

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

              // console.log("dataL list: ", data);

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
  }
});

export default JobApplicationsListScreen;
