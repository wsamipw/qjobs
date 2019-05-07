import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  ScrollView,
  StatusBar,
  Alert,
  RefreshControl
} from "react-native";

// import DropdownAlert from "react-native-dropdownalert";

import { isEmpty } from "lodash";

import { Item, Button, ListItem, Text, Input, Toast } from "native-base";
import { Card, Divider } from "react-native-elements";
import { compose, graphql, withApollo } from "react-apollo";

import { Query } from "react-apollo";

import { JOB_STATUS_CHECK_QUERY } from "../../../config/queries";

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
  PRIMARY_COLOR,
  PAID,
  DISPUTE
} from "../../../config/CONSTANTS";

import {
  DELETE_APPLY_JOB_MUTATION,
  CONFIRM_APPLY_JOB_MUTATION,
  INPUT_TOTAL_HOURS_MUTATION
} from "../../../config/mutations";
import { APPLIED_JOBS_QUERY } from "../../../config/queries";

class AppliedJobDetailScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: `${navigation.state.params.item.naAccordionme ||
        navigation.state.params.item.job.properties.name}`,
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
    totalHours: "",
    loading: false,

    eachItem: null,
    refreshing: false
  };

  componentDidMount = () => {
    const eachItem = this.props.navigation.getParam("item", null);

    this.setState({ eachItem });
  };

  renderStatus = () => {
    const item = this.state.eachItem;

    // console.log("itemmmmmm: applied job detail: ", item);
    if (item.status === ACCEPTED) {
      return (
        <View>
          <Button block primary style={styles.statusBtnStylesAppliedJobs}>
            <Text>ACCEPTED</Text>
          </Button>
          <Button
            block
            success
            style={styles.statusBtnStylesAppliedJobs}
            onPress={() => {
              this.props
                .confirmApplyJob(item.id, true)
                .then(response => {
                  console.log("resp_confirm: ", response);
                  if (
                    response.data.confirmApplyJob.status === 200 &&
                    response.data.confirmApplyJob.msg === "success"
                  ) {
                    console.log("success confirm ");
                    this.setState({
                      eachItem: {
                        ...this.state.eachItem,
                        status: response.data.confirmApplyJob.applyJob.status
                      }
                    });
                    // this.props.navigation.goBack();
                  } else throw new Error(response);
                })
                .catch(error => {
                  console.log("appliedjob detaul : ===> confirm erro: ", error);
                });
            }}
          >
            <Text>CONFIRM</Text>
          </Button>
          <Button
            block
            danger
            style={styles.statusBtnStylesAppliedJobs}
            onPress={() => {
              this.props
                .confirmApplyJob(item.id, false)
                .then(response => {
                  console.log("resp_revoke: ", response);
                  if (
                    response.data.confirmApplyJob.status === 200 &&
                    response.data.confirmApplyJob.msg === "success"
                  ) {
                    console.log("success close revoke");
                    this.setState({
                      eachItem: {
                        ...this.state.eachItem,
                        status: response.data.confirmApplyJob.applyJob.status
                      }
                    });
                    // this.props.navigation.goBack();
                  } else throw new Error(response);
                })
                .catch(error => {
                  console.log(
                    "appied job detal --> crevoke erro: ",
                    JSON.stringify(error)
                  );
                });
            }}
          >
            <Text>REVOKE</Text>
          </Button>
        </View>
      );
    } else if (item.status === REJECTED) {
      return (
        <Button block danger style={styles.statusBtnStylesAppliedJobs}>
          <Text> REJECTED</Text>
        </Button>
      );
    } else if (item.status === APPLIED) {
      console.log("applied: ", item.status);

      return (
        <Button
          block
          primary
          style={styles.statusBtnStylesAppliedJobs}
          onPress={() => {
            Alert.alert("CANCEL JOB", "Do you want to cancel the job?", [
              {
                text: "CANCEL JOB",
                onPress: () => {
                  console.log("CANCEL JOB CLICKED");
                  this.props
                    .deleteApplyJob(item.id)
                    .then(response => {
                      console.log("resp_delete apply: ", response);
                      if (
                        response.data.deleteApplyJob.status === 200 &&
                        response.data.deleteApplyJob.msg === "success"
                      ) {
                        console.log("success delete apply");
                        this.props.navigation.goBack();
                      } else throw new Error(response);
                    })
                    .catch(error => {
                      console.log(
                        "apleid job detail: ===> APPLIED erro: ",
                        JSON.stringify(error)
                      );
                    });
                }
              },
              { text: "GO BACK" }
            ]);
          }}
        >
          <Text>APPLIED</Text>
        </Button>
      );
    } else if (item.status === CONFIRMED) {
      return (
        <Button block primary style={styles.statusBtnStylesAppliedJobs}>
          <Text>CONFIRMED</Text>
        </Button>
      );
    } else if (item.status === REVOKED) {
      return (
        <Button block info style={styles.statusBtnStylesAppliedJobs}>
          <Text>REVOKED</Text>
        </Button>
      );
    } else if (item.status === TIMEOUT) {
      return (
        <Button block warning style={styles.statusBtnStylesAppliedJobs}>
          <Text>TIMEOUT</Text>
        </Button>
      );
    } else if (item.status === COMPLETED) {
      return (
        <Button block success style={styles.statusBtnStylesAppliedJobs}>
          <Text>COMPLETED</Text>
        </Button>
      );
    } else if (item.status === PAID) {
      return (
        <Button block success style={styles.statusBtnStylesAppliedJobs}>
          <Text> PAID</Text>
        </Button>
      );
    } else if (item.status === DISPUTE) {
      return (
        <Button block danger style={styles.statusBtnStylesAppliedJobs}>
          <Text> DISPUTE</Text>
        </Button>
      );
    } else {
      return null;
    }
  };

  renderInputTotalHoursForm = () => {
    return (
      <View>
        <Item>
          <Input
            keyboardType="numeric"
            placeholder="Total Hours to complete this job"
            value={this.state.totalHours}
            onChangeText={val => this.setState({ totalHours: val })}
          />
        </Item>

        <Button
          backgroundColor={PRIMARY_COLOR}
          rounded
          block
          disabled={this.state.loading}
          style={{
            marginTop: 15
          }}
          onPress={() => {
            if (this.state.totalHours) {
              this.setState({
                loading: true
              });

              const eachItem = this.props.navigation.getParam("item", null);
              const id = eachItem && eachItem.id;

              const totalHours = Number(this.state.totalHours);

              this.props
                .inputTotalHours(id, totalHours)
                .then(response => {
                  console.log("eresponse: ", response);

                  if (response.data.inputTotalHours.msg === "success") {
                    this.setState({});

                    this.setState({
                      loading: false,
                      eachItem: {
                        ...this.state.eachItem,
                        status: response.data.inputTotalHours.applyJob.status
                      }
                    });

                    Toast.show({
                      text: "Success",
                      buttonText: "Okay",
                      duration: 3000,
                      position: "bottom",
                      type: "success"
                    });
                  } else throw new Error(response.data.inputTotalHours.msg);
                })
                .catch(error => {
                  console.log("error total hours:", JSON.stringify(error));
                  this.setState({ loading: false });

                  Toast.show({
                    text: error.message || "Error performing the task.",
                    buttonText: "Okay",
                    duration: 5000,
                    position: "bottom",
                    type: "danger"
                  });

                  // this.dropdown.alertWithType("error", "Error", error.message);
                });
            } else {
              Alert.alert(
                "Input field Empty",
                "Please enter the required hours",
                [{ text: "OK" }]
              );
            }
          }}
        >
          <Text>Submit</Text>
        </Button>
      </View>
    );
  };

  _onRefresh = () => {
    if (this.state.eachItem.status !== PAID) {
      this.setState({ refreshing: true }, async () => {
        try {
          const { data } = await this.props.client.query({
            query: JOB_STATUS_CHECK_QUERY,
            variables: {
              id: this.state.eachItem.id,
              status: this.state.eachItem.status
            }
          });

          console.log("dataa applied job detai: ", data);

          this.setState({
            refreshing: false,
            eachItem: {
              ...this.state.eachItem,
              status: data.jobStatusChange.status
            }
          });
        } catch (error) {
          console.log(
            "error catched JOB STATUS CHECK ------>  APPLIED JOB: ",
            error
          );

          this.setState({ refreshing: false });
          Toast.show({
            text: "Error Getting Data From Server !",
            buttonText: "Okay",
            duration: 8000,
            position: "bottom",
            type: "danger"
          });
        }
      });
    } else {
      Alert.alert(
        "Job Completed",
        "Congratulations! Job Completed Successfully",
        [{ text: "OK" }]
      );
    }
  };

  render() {
    const { eachItem } = this.state;

    return eachItem ? (
      <ScrollView
        scrollEnabled
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }
      >
        <View style={styles.mainWrapper}>
          <StatusBar barStyle="light-content" backgroundColor={PRIMARY_COLOR} />
          <Card>
            {/* <Text>Name: {eachItem.name}</Text> */}
            <Text style={styles.headingTextStyles}>Description</Text>
            <Text>{eachItem.description}</Text>
          </Card>

          {eachItem.applyjobquestionsSet &&
            eachItem.applyjobquestionsSet.length > 0 && (
              <Card>
                <Text style={styles.headingTextStyles}>Extra Questions</Text>
                {eachItem.applyjobquestionsSet.map(
                  (eachExtraQuestion, index, arr) => {
                    return (
                      <View style={{ marginVertical: 8 }} key={index}>
                        <Text>{eachExtraQuestion.question}</Text>
                        <Text note style={{ marginBottom: 5 }}>
                          {eachExtraQuestion.answer}
                        </Text>
                        {arr.length - 1 !== index && <Divider />}
                      </View>
                    );
                  }
                )}
              </Card>
            )}

          {/* <Query
            query={JOB_STATUS_CHECK_QUERY}
            fetchPolicy="cache-and-network"
            variables={{
              id: eachItem.id,
              status: eachItem.status
            }}
            // pollInterval={1000}
          >
            {({ loading, error, data, startPolling, stopPolling }) => {
              // console.log("eachItem in side query id: ", eachItem.id);
              // console.log(
              //   "eachItem in side query applied job detail status: ",
              //   eachItem.status
              // );

              /*
               * `finalData` priotizes the data received
               * from the query .i.e the changed status data.
               * The above query checks whether the `status`
               * has been changed and responds only if `status`
               * is changed else it is timedOut. So if no response
               * if received from the query, `eachItem` variable
               * is to be used to get the unchanged status
               
              const finalData = !isEmpty(data)
                ? data.jobStatusChange
                : eachItem;

              finalData.status !== PAID && startPolling(1000);
              finalData.status === PAID && stopPolling();

              // console.log("data inside query: ", data);
              if (error) {
                console.log("error job status: ", error);
                stopPolling();
              }

              if (finalData) {
                // console.log("finaldata ran applied job detail: ", finalData);

                return (
                  <View>
                    {this.renderStatus(finalData)}
                    {finalData.status === CONFIRMED &&
                      this.renderInputTotalHoursForm()}
                  </View>
                );
              }
            }}
          </Query> */}
          {this.renderStatus()}
          {this.state.eachItem.status === CONFIRMED &&
            this.renderInputTotalHoursForm()}
        </View>
      </ScrollView>
    ) : null;
  }
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    marginBottom: 10
  },
  headingTextStyles: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 8
  },
  statusBtnStylesAppliedJobs: {
    marginHorizontal: Dimensions.get("screen").width * 0.04,
    marginVertical: 10
  }
});

export default compose(
  withApollo,
  graphql(INPUT_TOTAL_HOURS_MUTATION, {
    props: ({ mutate }) => ({
      inputTotalHours: (id, totalHours) =>
        mutate({
          variables: {
            id,
            totalHours
          }
        })
    })
  }),
  graphql(DELETE_APPLY_JOB_MUTATION, {
    props: ({ mutate }) => ({
      deleteApplyJob: id =>
        mutate({
          variables: {
            id
          },
          refetchQueries: [
            {
              query: APPLIED_JOBS_QUERY,
              variables: {
                page: 1,
                rows: 4
              }
            }
          ]
        })
    })
  }),
  graphql(CONFIRM_APPLY_JOB_MUTATION, {
    props: ({ mutate }) => ({
      confirmApplyJob: (id, confirm) =>
        mutate({
          variables: {
            id,
            confirm
          },
          refetchQueries: [
            {
              query: APPLIED_JOBS_QUERY,
              variables: {
                page: 1,
                rows: 4
              }
            }
          ]
        })
    })
  })
)(AppliedJobDetailScreen);
