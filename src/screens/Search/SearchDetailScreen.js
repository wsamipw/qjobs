import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { Button } from "native-base";
import { Card } from "react-native-elements";
import { compose, graphql } from "react-apollo";

import ParallaxScrollView from "react-native-parallax-scroll-view";

import Icon from "react-native-vector-icons/Ionicons";
import { _retrieveData } from "../../config/utils";
import {
  USER_DATA,
  JWT_AUTH_TOKEN,
  APPLIED,
  ACCEPTED,
  REJECTED,
  CONFIRMED,
  REVOKED,
  TIMEOUT,
  COMPLETED,
  UNCOMPLETED
} from "../../config/CONSTANTS";

import {
  SELECT_APPLY_JOB_MUTATION,
  COMPLETE_APPLY_JOB_MUTATION,
  CONFIRM_APPLY_JOB_MUTATION
} from "../../config/mutations";
import { MY_JOBS_QUERY, APPLIED_JOBS_QUERY } from "../../config/queries";

class SearchDetailScreen extends Component {
  // To disable the default header
  // static navigationOptions = { header: null };

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

  // Used when it came from My Jobs
  renderCheckmarks = item => {
    if (item.status === ACCEPTED) {
      return <Icon name="md-checkmark-circle" size={30} color="#00FF00" />;
    } else if (item.status === APPLIED) {
      return (
        <View>
          <Icon
            name="md-close-circle"
            size={30}
            color="#FF0000"
            onPress={() => {
              this.props
                .selectApplyjob(item.id, false)
                .then(response => {
                  console.log("resp_close: ", response);
                  if (
                    response.data.selectApplyjob.status === 200 &&
                    response.data.selectApplyjob.msg === "success"
                  ) {
                    console.log("success close");
                    this.props.navigation.goBack();
                  } else throw new Error(response);
                })
                .catch(error => {
                  console.log("erro: ", JSON.stringify(error));
                });
            }}
          />
          <Icon
            name="md-checkmark-circle-outline"
            size={30}
            color="#00FF00"
            onPress={() => {
              this.props
                .selectApplyjob(item.id, true)
                .then(response => {
                  console.log("resp_tick: ", response);
                  if (
                    response.data.selectApplyjob.status === 200 &&
                    response.data.selectApplyjob.msg === "success"
                  ) {
                    console.log("success tick");
                    this.props.navigation.goBack();
                  } else throw new Error(response);
                })
                .catch(error => {
                  console.log("erro: ", JSON.stringify(error));
                });
            }}
          />
        </View>
      );
    } else if (item.status === REJECTED) {
      return (
        <Button style={{ backgroundColor: "red" }} round small>
          <Text style={{ color: "white" }}>REJECTED</Text>
        </Button>
      );
    } else if (item.status === CONFIRMED) {
      return (
        <View>
          <Text>
            <Icon name="md-checkmark-circle" size={30} color="#00FF00" />
          </Text>
          <View style={{ height: 10 }} />

          <Button
            block
            onPress={() => {
              this.props
                .completeApplyjob(item.id, true, 10.0)
                .then(response => {
                  console.log("resp_confirm: ", response);
                  if (
                    response.data.completeApplyjob.status === 200 &&
                    response.data.completeApplyjob.msg === "success"
                  ) {
                    console.log("success close");
                    this.props.navigation.goBack();
                  } else throw new Error(response);
                })
                .catch(error => {
                  console.log("erro: ", JSON.stringify(error));
                });
            }}
          >
            <Text style={{ color: "white" }}>COMPLETE</Text>
          </Button>
          <Button
            style={{ backgroundColor: "red" }}
            block
            onPress={() => {
              this.props
                .completeApplyjob(item.id, false, 10.0)
                .then(response => {
                  console.log("resp_confirm: ", response);
                  if (
                    response.data.completeApplyjob.status === 200 &&
                    response.data.completeApplyjob.msg === "success"
                  ) {
                    console.log("success close");
                    this.props.navigation.goBack();
                  } else throw new Error(response);
                })
                .catch(error => {
                  console.log("erro: ", JSON.stringify(error));
                });
            }}
          >
            <Text style={{ color: "white" }}>CANCEL</Text>
          </Button>
        </View>
      );
    } else if (item.status === COMPLETED) {
      return (
        <Button
          round
          small
          style={{
            backgroundColor: "green",
            borderRadius: 8
          }}
        >
          <Text style={{ color: "white" }}> COMPLETED</Text>
        </Button>
      );
    } else if (item.status === UNCOMPLETED) {
      return (
        <Button
          round
          small
          style={{
            backgroundColor: "red",
            borderRadius: 8
          }}
        >
          <Text style={{ color: "white" }}> UNCOMPLETED</Text>
        </Button>
      );
    }
  };

  // Used when it came from AppliedJobs
  renderStatus = item => {
    if (item.status === ACCEPTED) {
      return (
        <View>
          <Button
            round
            small
            style={{
              backgroundColor: "#097c28",
              borderRadius: 8
            }}
          >
            <Text style={{ color: "white" }}> ACCEPTED</Text>
          </Button>
          <View style={{ height: 10 }} />
          <Button
            block
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
                    this.props.navigation.goBack();
                  } else throw new Error(response);
                })
                .catch(error => {
                  console.log("erro: ", JSON.stringify(error));
                });
            }}
          >
            <Text style={{ color: "white" }}>CONFIRM</Text>
          </Button>
          <Button
            block
            style={{ backgroundColor: "red" }}
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
                    this.props.navigation.goBack();
                  } else throw new Error(response);
                })
                .catch(error => {
                  console.log("erro: ", JSON.stringify(error));
                });
            }}
          >
            <Text style={{ color: "white" }}>REVOKE</Text>
          </Button>
        </View>
      );
    } else if (item.status === REJECTED) {
      return (
        <Button
          round
          small
          style={{
            backgroundColor: "red",
            borderRadius: 8
          }}
        >
          <Text style={{ color: "white" }}> REJECTED</Text>
        </Button>
      );
    } else if (item.status === APPLIED) {
      return (
        <Button
          round
          small
          style={{
            backgroundColor: "#f4f442",
            borderRadius: 8
          }}
        >
          <Text style={{ color: "blue" }}>APPLIED</Text>
        </Button>
      );
    } else if (item.status === CONFIRMED) {
      return (
        <Button
          round
          small
          style={{
            backgroundColor: "#f4f442",
            borderRadius: 8
          }}
        >
          <Text style={{ color: "blue" }}>CONFIRMED</Text>
        </Button>
      );
    } else if (item.status === REVOKED) {
      return (
        <Button
          round
          small
          style={{
            backgroundColor: "#f4f442",
            borderRadius: 8
          }}
        >
          <Text style={{ color: "blue" }}>REVOKED</Text>
        </Button>
      );
    } else if (item.status === TIMEOUT) {
      return (
        <Button
          round
          small
          style={{
            backgroundColor: "#f4f442",
            borderRadius: 8
          }}
        >
          <Text style={{ color: "blue" }}>TIMEOUT</Text>
        </Button>
      );
    } else if (item.status === COMPLETED) {
      return (
        <Button
          round
          small
          style={{
            backgroundColor: "#f4f442",
            borderRadius: 8
          }}
        >
          <Text style={{ color: "blue" }}>COMPLETED</Text>
        </Button>
      );
    }
  };

  render() {
    const eachItem = this.props.navigation.getParam("item", null);
    const key = this.props.navigation.getParam("key", null);
    console.log('eachItem, ", ', eachItem);
    console.log('key, ", ', key);

    // Checks whether the job creater and applier are same
    // Also checks if the status is set i.e if status is set
    // then it should return false
    // Return True if they are different
    const condition1 =
      !eachItem.status &&
      (eachItem.employer && eachItem.employer.id !== this.state.id);

    // Checks whether the person has already applied for the job
    // Inner conditions returns True if found
    // and outer negation `!` negates it and returns false to
    // determine whether to display the `Apply Job` button
    const condition2 = !(eachItem.applyjobSet && eachItem.applyjobSet.length
      ? eachItem.applyjobSet.find(
          eachApplyJobSet =>
            eachApplyJobSet.employee &&
            eachApplyJobSet.employee.id === this.state.id
        )
      : false);

    return eachItem ? (
      <View style={{ height: 500 }}>
        <Text>Id: {eachItem.id}</Text>
        <Text>Name: {eachItem.name}</Text>
        <Text>Description: {eachItem.description}</Text>

        {eachItem.extraQuestion && eachItem.extraQuestion.length ? (
          <View>
            <Text style={{ fontWeight: "bold" }}>Extra Questions</Text>

            {eachItem.extraQuestion.map((eachExtraQuestion, index) => {
              return (
                <View key={index}>
                  <Text style={{ fontWeight: "200" }}>{eachExtraQuestion}</Text>
                </View>
              );
            })}
          </View>
        ) : null}

        {condition1 &&
          condition2 && (
            <Button
              rounded
              block
              onPress={() =>
                this.props.navigation.navigate("applyJob", { item: eachItem })
              }
            >
              <Text>Apply Job</Text>
            </Button>
          )}

        {this.renderStatus(eachItem)}

        {/* Used when it came from My Jobs */}
        {key === "myJobs" &&
        eachItem.applyjobSet &&
        eachItem.applyjobSet.length ? (
          <ScrollView scrollEnabled>
            <Text style={{ fontWeight: "bold" }}>Applications</Text>

            <FlatList
              data={eachItem.applyjobSet}
              keyExtractor={eachItem => eachItem.id}
              renderItem={({ item }) => {
                return (
                  <View key={item.id}>
                    <Card>
                      <Text style={{ fontWeight: "100" }}>
                        Name:
                        {item.employee &&
                          `${item.employee.firstName} ${
                            item.employee.lastName
                          }`}
                      </Text>
                      <Text>Email: {item.employee && item.employee.email}</Text>
                      <Text>Hourly Rate: {item.hourlyRate}</Text>

                      {this.renderCheckmarks(item)}
                    </Card>
                  </View>
                );
              }}
            />
          </ScrollView>
        ) : null}
      </View>
    ) : null;
  }
}

const styles = StyleSheet.create({
  contentStyle: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  mainWrapper: {
    flex: 1,
    marginTop: Dimensions.get("window").height * 0.1,
    width: Dimensions.get("screen").width * 0.8,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  logo: {
    height: 80,
    width: 80,
    resizeMode: "contain",
    marginBottom: 26
  },
  inputStyles: {
    paddingLeft: 15,
    flex: 1
    // borderRadius: 50
  }
});

export default compose(
  graphql(SELECT_APPLY_JOB_MUTATION, {
    props: ({ mutate }) => ({
      selectApplyjob: (id, select) =>
        mutate({
          variables: {
            id,
            select
          },
          refetchQueries: [{ query: MY_JOBS_QUERY }]
        })
    })
  }),
  graphql(COMPLETE_APPLY_JOB_MUTATION, {
    props: ({ mutate }) => ({
      completeApplyjob: (id, complete, totalHours) =>
        mutate({
          variables: {
            id,
            complete,
            totalHours
          },
          refetchQueries: [{ query: MY_JOBS_QUERY }]
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
          refetchQueries: [{ query: APPLIED_JOBS_QUERY }]
        })
    })
  })
)(SearchDetailScreen);
