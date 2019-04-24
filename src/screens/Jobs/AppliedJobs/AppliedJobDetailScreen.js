import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  ScrollView,
  StatusBar,
  Alert
} from "react-native";

// import DropdownAlert from "react-native-dropdownalert";

import { isEmpty } from "lodash";

import { Item, Button, ListItem, Text, Input, Toast } from "native-base";
import { Card, Divider } from "react-native-elements";
import { compose, graphql } from "react-apollo";

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
  PRIMARY_COLOR
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
    // LoggedIn user id
    id: "",
    totalHours: "",
    loading: false
  };

  async componentDidMount() {
    try {
      const user = JSON.parse(await _retrieveData(USER_DATA));
      user && this.setState({ id: user.id });
    } catch (err) {
      console.log("error searchdetailscreen.js: ", err);
    }
  }

  componentWillUnmount() {
    Toast.toastInstance = null;
  }

  renderStatus = item => {
    // console.log("renderStatus applied job ", item);
    if (item.status === ACCEPTED) {
      console.log("accepted: ", item.status);
      return (
        <View>
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
                      .deleteApplyjob(item.id)
                      .then(response => {
                        console.log("resp_delete apply: ", response);
                        if (
                          response.data.deleteApplyjob.status === 200 &&
                          response.data.deleteApplyjob.msg === "success"
                        ) {
                          console.log("success delete apply");
                          this.props.navigation.goBack();
                        } else throw new Error(response);
                      })
                      .catch(error => {
                        console.log("erro: ", JSON.stringify(error));
                      });
                  }
                },
                { text: "GO BACK" }
              ]);
            }}
          >
            <Text>ACCEPTED</Text>
          </Button>
          <Button
            block
            success
            style={styles.statusBtnStylesAppliedJobs}
            onPress={() => {
              this.props
                .confirmApplyjob(item.id, true)
                .then(response => {
                  console.log("resp_confirm: ", response);
                  if (
                    response.data.confirmApplyjob.status === 200 &&
                    response.data.confirmApplyjob.msg === "success"
                  ) {
                    console.log("success confirm ");
                    // this.props.navigation.goBack();
                  } else throw new Error(response);
                })
                .catch(error => {
                  console.log("erro: ", JSON.stringify(error));
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
                .confirmApplyjob(item.id, false)
                .then(response => {
                  console.log("resp_revoke: ", response);
                  if (
                    response.data.confirmApplyjob.status === 200 &&
                    response.data.confirmApplyjob.msg === "success"
                  ) {
                    console.log("success close revoke");
                    // this.props.navigation.goBack();
                  } else throw new Error(response);
                })
                .catch(error => {
                  console.log("erro: ", JSON.stringify(error));
                });
            }}
          >
            <Text>REVOKE</Text>
          </Button>
        </View>
      );
    } else if (item.status === REJECTED) {
      return (
        <Button
          onPress={() => {
            Alert.alert("CANCEL JOB", "Do you want to cancel the job?", [
              {
                text: "CANCEL JOB",
                onPress: () => {
                  console.log("CANCEL JOB CLICKED");
                  this.props
                    .deleteApplyjob(item.id)
                    .then(response => {
                      console.log("resp_delete apply: ", response);
                      if (
                        response.data.deleteApplyjob.status === 200 &&
                        response.data.deleteApplyjob.msg === "success"
                      ) {
                        console.log("success delete apply");
                        this.props.navigation.goBack();
                      } else throw new Error(response);
                    })
                    .catch(error => {
                      console.log("erro: ", JSON.stringify(error));
                    });
                }
              },
              { text: "GO BACK" }
            ]);
          }}
          block
          danger
          style={styles.statusBtnStylesAppliedJobs}
        >
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
                    .deleteApplyjob(item.id)
                    .then(response => {
                      console.log("resp_delete apply: ", response);
                      if (
                        response.data.deleteApplyjob.status === 200 &&
                        response.data.deleteApplyjob.msg === "success"
                      ) {
                        console.log("success delete apply");
                        this.props.navigation.goBack();
                      } else throw new Error(response);
                    })
                    .catch(error => {
                      console.log("erro: ", JSON.stringify(error));
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
        <Button
          onPress={() => {
            Alert.alert("CANCEL JOB", "Do you want to cancel the job?", [
              {
                text: "CANCEL JOB",
                onPress: () => {
                  console.log("CANCEL JOB CLICKED");
                  this.props
                    .deleteApplyjob(item.id)
                    .then(response => {
                      console.log("resp_delete apply: ", response);
                      if (
                        response.data.deleteApplyjob.status === 200 &&
                        response.data.deleteApplyjob.msg === "success"
                      ) {
                        console.log("success delete apply");
                        this.props.navigation.goBack();
                      } else throw new Error(response);
                    })
                    .catch(error => {
                      console.log("erro: ", JSON.stringify(error));
                    });
                }
              },
              { text: "GO BACK" }
            ]);
          }}
          block
          primary
          style={styles.statusBtnStylesAppliedJobs}
        >
          <Text>CONFIRMED</Text>
        </Button>
      );
    } else if (item.status === REVOKED) {
      return (
        <Button
          onPress={() => {
            Alert.alert("CANCEL JOB", "Do you want to cancel the job?", [
              {
                text: "CANCEL JOB",
                onPress: () => {
                  console.log("CANCEL JOB CLICKED");
                  this.props
                    .deleteApplyjob(item.id)
                    .then(response => {
                      console.log("resp_delete apply: ", response);
                      if (
                        response.data.deleteApplyjob.status === 200 &&
                        response.data.deleteApplyjob.msg === "success"
                      ) {
                        console.log("success delete apply");
                        this.props.navigation.goBack();
                      } else throw new Error(response);
                    })
                    .catch(error => {
                      console.log("erro: ", JSON.stringify(error));
                    });
                }
              },
              { text: "GO BACK" }
            ]);
          }}
          block
          info
          style={styles.statusBtnStylesAppliedJobs}
        >
          <Text>REVOKED</Text>
        </Button>
      );
    } else if (item.status === TIMEOUT) {
      return (
        <Button
          onPress={() => {
            Alert.alert("CANCEL JOB", "Do you want to cancel the job?", [
              {
                text: "CANCEL JOB",
                onPress: () => {
                  console.log("CANCEL JOB CLICKED");
                  this.props
                    .deleteApplyjob(item.id)
                    .then(response => {
                      console.log("resp_delete apply: ", response);
                      if (
                        response.data.deleteApplyjob.status === 200 &&
                        response.data.deleteApplyjob.msg === "success"
                      ) {
                        console.log("success delete apply");
                        this.props.navigation.goBack();
                      } else throw new Error(response);
                    })
                    .catch(error => {
                      console.log("erro: ", JSON.stringify(error));
                    });
                }
              },
              { text: "GO BACK" }
            ]);
          }}
          block
          warning
          style={styles.statusBtnStylesAppliedJobs}
        >
          <Text>TIMEOUT</Text>
        </Button>
      );
    } else if (item.status === COMPLETED) {
      return (
        <Button
          onPress={() => {
            Alert.alert("CANCEL JOB", "Do you want to cancel the job?", [
              {
                text: "CANCEL JOB",
                onPress: () => {
                  console.log("CANCEL JOB CLICKED");
                  this.props
                    .deleteApplyjob(item.id)
                    .then(response => {
                      console.log("resp_delete apply: ", response);
                      if (
                        response.data.deleteApplyjob.status === 200 &&
                        response.data.deleteApplyjob.msg === "success"
                      ) {
                        console.log("success delete apply");
                        this.props.navigation.goBack();
                      } else throw new Error(response);
                    })
                    .catch(error => {
                      console.log("erro: ", JSON.stringify(error));
                    });
                }
              },
              { text: "GO BACK" }
            ]);
          }}
          block
          success
          style={styles.statusBtnStylesAppliedJobs}
        >
          <Text>COMPLETED</Text>
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
                    this.setState({ loading: false });

                    // this.dropdown.alertWithType("success", "Success");

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
                    text: error.message,
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

  render() {
    const eachItem = this.props.navigation.getParam("item", null);
    console.log("each item applied job detail: ", eachItem);

    return eachItem ? (
      <ScrollView scrollEnabled>
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

          <Query
            query={JOB_STATUS_CHECK_QUERY}
            fetchPolicy="cache-and-network"
            variables={{
              id: eachItem.id,
              status: eachItem.status
            }}
            // pollInterval={1000}
          >
            {({ loading, error, data, startPolling, stopPolling }) => {
              // console.log("eachITem in side query id: ", eachItem.id);
              // console.log(
              //   "eachITem in side query applied job detail status: ",
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
               */
              const finalData = !isEmpty(data)
                ? data.jobStatusChange
                : eachItem;

              !finalData.status !== COMPLETED && startPolling(1000);
              finalData.status === COMPLETED && stopPolling();

              // console.log("data inside query: ", data);
              if (error) {
                console.log("error job status: ", error);
                stopPolling();
              }

              if (finalData) {
                // console.log("finaldata ran applied job detail: ", finalData);

                return this.renderStatus(finalData);
              }
            }}
          </Query>
          {this.renderInputTotalHoursForm()}
        </View>
        {/* <DropdownAlert ref={ref => (this.dropdown = ref)} /> */}
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
      deleteApplyjob: id =>
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
      confirmApplyjob: (id, confirm) =>
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
