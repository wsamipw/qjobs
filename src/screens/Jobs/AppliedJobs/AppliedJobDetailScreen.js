import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  ScrollView,
  StatusBar,
  Alert
} from "react-native";

import { isEmpty } from "lodash";

import { Button, ListItem, Text } from "native-base";
import { Card } from "react-native-elements";
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
  UNCOMPLETED
} from "../../../config/CONSTANTS";

import {
  DELETE_APPLY_JOB_MUTATION,
  CONFIRM_APPLY_JOB_MUTATION
} from "../../../config/mutations";
import { APPLIED_JOBS_QUERY } from "../../../config/queries";

class AppliedJobDetailScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: `${navigation.state.params.item.naAccordionme ||
        navigation.state.params.item.job.name}`,
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

  async componentDidMount() {
    try {
      const user = JSON.parse(await _retrieveData(USER_DATA));
      user && this.setState({ id: user.id });
    } catch (err) {
      console.log("error searchdetailscreen.js: ", err);
    }
  }

  renderStatus = item => {
    console.log("renderStatus applied job ", item);
    if (item.status === ACCEPTED) {
      console.log("accepted: ", item.status);
      return (
        <View>
          <Button
            round
            block
            primary
            styles={styles.statusBtnStylesAppliedJobs}
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
            styles={styles.statusBtnStylesAppliedJobs}
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
            styles={styles.statusBtnStylesAppliedJobs}
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
          round
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
          round
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
          round
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
          round
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
          round
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
          round
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

  render() {
    const eachItem = this.props.navigation.getParam("item", null);

    return eachItem ? (
      <ScrollView scrollEnabled>
        <View style={styles.mainWrapper}>
          <StatusBar barStyle="light-content" backgroundColor="#ecf0f1" />
          <Card>
            {/* <Text>Name: {eachItem.name}</Text> */}
            <Text style={styles.headingTextStyles}>Description</Text>
            <Text>{eachItem.description}</Text>
          </Card>
          {eachItem.extraQuestion && eachItem.extraQuestion.length > 0 && (
            <Card>
              <Text style={styles.headingTextStyles}>Extra Questions</Text>
              {eachItem.extraQuestion.map((eachExtraQuestion, index, arr) => {
                return (
                  <ListItem
                    key={index}
                    first={index === 0}
                    last={index === arr.length - 1}
                  >
                    <Text>{eachExtraQuestion}</Text>
                  </ListItem>
                );
              })}
            </Card>
          )}

          {eachItem.applyjobquestionsSet &&
            eachItem.applyjobquestionsSet.length > 0 && (
              <Card>
                <Text style={styles.headingTextStyles}>Extra Questions</Text>
                {eachItem.applyjobquestionsSet.map(
                  (eachExtraQuestion, index, arr) => {
                    return (
                      <ListItem
                        key={index}
                        first={index === 0}
                        last={index === arr.length - 1}
                      >
                        <Text>Question: {eachExtraQuestion.question}</Text>
                        <Text>Answer: {eachExtraQuestion.answer}</Text>
                      </ListItem>
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

              console.log("data inside query: ", data);
              if (error) {
                console.log("error job status: ", error);
                stopPolling();
              }

              if (finalData) {
                console.log("finaldata ran applied job detail: ", finalData);

                return this.renderStatus(finalData);
              }
            }}
          </Query>
        </View>
      </ScrollView>
    ) : null;
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
  statusBtnStylesAppliedJobs: {
    marginVertical: 6,
    marginHorizontal: Dimensions.get("screen").width * 0.04
  }
});

export default compose(
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
