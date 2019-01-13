import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  FlatList,
  ScrollView,
  StatusBar,
  Alert,
  TouchableOpacity,
  Modal,
  Picker
} from "react-native";

import { isEmpty } from "lodash";

import { Button, Accordion, ListItem, Text, Item, Input } from "native-base";
import { AirbnbRating } from "react-native-ratings";
import { Card } from "react-native-elements";
import { compose, graphql } from "react-apollo";

import ParallaxScrollView from "react-native-parallax-scroll-view";

import { Query } from "react-apollo";

import { JOB_STATUS_CHECK_QUERY } from "../../config/queries";

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
  UNCOMPLETED,
  PRIMARY_COLOR
} from "../../config/CONSTANTS";

import {
  SELECT_APPLY_JOB_MUTATION,
  DELETE_APPLY_JOB_MUTATION,
  COMPLETE_APPLY_JOB_MUTATION,
  CONFIRM_APPLY_JOB_MUTATION
} from "../../config/mutations";
import { MY_JOBS_QUERY, APPLIED_JOBS_QUERY } from "../../config/queries";

class SearchDetailScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: `${navigation.state.params.item.name ||
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
    id: "",
    isModalVisible: false,

    // Below field should be cast into float
    totalHours: "",

    // Below field should be cast into int
    rating: 1,
    review: "",

    isJobCompleted: true,
    eachItem: null,
    key: null,
    selectedApplicationItem: null
  };

  async componentDidMount() {
    try {
      const user = JSON.parse(await _retrieveData(USER_DATA));
      user && this.setState({ id: user.id });
    } catch (err) {
      console.log("error searchdetailscreen.js: ", err);
    }

    const eachItem = this.props.navigation.getParam("item", null);
    const key = this.props.navigation.getParam("key", null);

    // Checks whether the job creater and applier are same
    // Return True if they are different
    const condition1 =
      eachItem.employer && eachItem.employer.id !== this.state.id;

    // Checks whether the person has already applied for the job
    // Inner conditions returns True if found
    // and outer negation `!` negates it and returns false to
    // determine whether to display the `Apply Job` button
    // console.log("this state: ", this.state);
    // console.log("eachItem: ", eachItem);
    const condition2 = !(eachItem.applyjobSet && eachItem.applyjobSet.length
      ? eachItem.applyjobSet.find(
          eachApplyJobSet =>
            eachApplyJobSet.employee &&
            eachApplyJobSet.employee.id === this.state.id
        )
      : false);

    this.setState({
      eachItem,
      key,
      condition1,
      condition2
    });
  }

  _toggleModal = item =>
    this.setState({
      isModalVisible: !this.state.isModalVisible,
      selectedApplicationItem: item
    });

  ratingCompleted(rating) {
    console.log("complete Rating is: " + rating);
  }

  // Used when it came from My Jobs
  renderCheckmarks = item => {
    if (item.status === ACCEPTED) {
      return <Icon name="md-checkmark-circle" size={30} color="#00FF00" />;
    } else if (item.status === APPLIED) {
      return (
        <View style={styles.renderCheckmarksWrapper}>
          <Icon
            name="md-close-circle"
            size={30}
            color="#FF0000"
            style={{
              marginRight: 10
            }}
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
        <Button danger round small style={styles.statusBtnStyles}>
          <Text>REJECTED</Text>
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
            success
            onPress={() => {
              this._toggleModal(item);
            }}
          >
            <Text>FINALIZE JOB</Text>
          </Button>
        </View>
      );
    } else if (item.status === COMPLETED) {
      return (
        <Button round small success style={styles.statusBtnStyles}>
          <Text> COMPLETED</Text>
        </Button>
      );
    } else if (item.status === UNCOMPLETED) {
      return (
        <Button round small danger style={styles.statusBtnStyles}>
          <Text> UNCOMPLETED</Text>
        </Button>
      );
    }
  };

  // Used when it came from AppliedJobs
  renderStatus = item => {
    // console.log("item: ", item);
    if (item.status === ACCEPTED) {
      return (
        <View>
          <Button
            round
            block
            primary
            styles={styles.statusBtnStylesAppliedJobs}
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
                    this.props.navigation.goBack();
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
                    this.props.navigation.goBack();
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
        <Button round block danger style={styles.statusBtnStylesAppliedJobs}>
          <Text> REJECTED</Text>
        </Button>
      );
    } else if (item.status === APPLIED) {
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
        <Button round block primary style={styles.statusBtnStylesAppliedJobs}>
          <Text>CONFIRMED</Text>
        </Button>
      );
    } else if (item.status === REVOKED) {
      return (
        <Button round block info style={styles.statusBtnStylesAppliedJobs}>
          <Text>REVOKED</Text>
        </Button>
      );
    } else if (item.status === TIMEOUT) {
      return (
        <Button round block warning style={styles.statusBtnStylesAppliedJobs}>
          <Text>TIMEOUT</Text>
        </Button>
      );
    } else if (item.status === COMPLETED) {
      return (
        <Button round block success style={styles.statusBtnStylesAppliedJobs}>
          <Text>COMPLETED</Text>
        </Button>
      );
    } else {
      return null;
    }
  };

  render() {
    // console.log("this state: ", this.state);
    // console.log("this prips: ", this.props);

    const { eachItem, key, condition1, condition2 } = this.state;

    return eachItem ? (
      <ScrollView scrollEnabled>
        <View style={styles.mainWrapper}>
          <StatusBar barStyle="light-content" backgroundColor={PRIMARY_COLOR} />
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

          {condition1 && condition2 && (
            <View
              style={{
                marginTop: 10,
                marginHorizontal: Dimensions.get("screen").width * 0.05
              }}
            >
              <Button
                rounded
                block
                onPress={() =>
                  this.props.navigation.navigate("applyJob", { item: eachItem })
                }
              >
                <Text>Apply</Text>
              </Button>
            </View>
          )}

          {/* {eachItem.status && ( */}
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
              console.log("eachITem in side query id: ", eachItem.id);
              console.log("eachITem in side query status: ", eachItem.status);
              startPolling(1000);
              /*
               * `finalData` priotizes the data received
               * from the query .i.e the changed status data.
               * The above query checks whether the `status`
               * has been changed and responds only if `status`
               * is changed else it is timedOut. So if no response
               * if received from the query, `eachItem` variable
               * is to be used to get the unchanged status
               */
              const finalData = !isEmpty(data) ? data : eachItem;

              if (error) {
                console.log("error job status: ", error);
                stopPolling();
              }

              if (finalData) {
                return this.renderStatus(finalData);
              }
            }}
          </Query>
          {/* )} */}
          {/* Used when it came from My Jobs */}
          {key === "myJobs" &&
          eachItem.applyjobSet &&
          eachItem.applyjobSet.length ? (
            <View>
              <View
                style={{
                  marginTop: 10,
                  marginHorizontal: Dimensions.get("screen").width * 0.05
                }}
              >
                <Text style={styles.headingTextStyles}>Applications</Text>
              </View>
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
                        <Text>
                          Email: {item.employee && item.employee.email}
                        </Text>
                        <Text>Hourly Rate: {item.hourlyRate}</Text>

                        {this.renderCheckmarks(item)}
                      </Card>
                    </View>
                  );
                }}
              />
            </View>
          ) : null}

          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.isModalVisible}
            onRequestClose={() => {
              this._toggleModal(null);
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%"
              }}
            >
              <AirbnbRating
                count={5}
                size={20}
                reviews={["Terrible", "Bad", "Okay", "Good", "Greate"]}
                defaultRating={this.state.rating}
                onFinishRating={this.ratingCompleted}
              />

              <Picker
                selectedValue={this.state.isJobCompleted}
                style={{ height: 50, width: 200 }}
                onValueChange={isJobCompleted =>
                  this.setState({ isJobCompleted }, () =>
                    console.log("job comple: ", this.state)
                  )
                }
              >
                <Picker.Item label="Job Completed" value={true} />
                <Picker.Item label="Job Terminated" value={false} />
              </Picker>

              <Item rounded>
                <Input
                  placeholder="Total Hours spent in the job"
                  value={this.state.totalHours}
                  onChangeText={val => this.setState({ totalHours: val })}
                />
              </Item>
              <Item rounded>
                <Input
                  placeholder="Review"
                  value={this.state.review}
                  onChangeText={val => this.setState({ review: val })}
                />
              </Item>
              <Button
                backgroundColor="#3F51B5"
                primary
                onPress={() => {
                  console.log("state apply job: ");

                  const {
                    isJobCompleted,
                    totalHours,
                    rating,
                    review,
                    selectedApplicationItem
                  } = this.state;

                  console.log("selc: ", selectedApplicationItem);
                  this.props
                    .completeApplyjob(
                      selectedApplicationItem.id,
                      isJobCompleted,
                      totalHours,
                      rating,
                      review
                    )
                    .then(response => {
                      console.log("resp_confirm: ", response);
                      if (
                        response.data.completeApplyjob.status === 200 &&
                        response.data.completeApplyjob.msg === "success"
                      ) {
                        console.log("success close");
                        // this.props.navigation.goBack();
                        // this.setState({ eachItem: })
                        this._toggleModal(null);
                      } else throw new Error(response);
                    })
                    .catch(error => {
                      console.log("erro: ", JSON.stringify(error));
                    });
                }}
              >
                <Text>Submit</Text>
              </Button>
            </View>
          </Modal>
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
  renderCheckmarksWrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  statusBtnStyles: {
    marginVertical: 6
  },
  statusBtnStylesAppliedJobs: {
    marginVertical: 6,
    marginHorizontal: Dimensions.get("screen").width * 0.04
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
  graphql(COMPLETE_APPLY_JOB_MUTATION, {
    props: ({ mutate }) => ({
      completeApplyjob: (id, complete, totalHours, rating, review) =>
        mutate({
          variables: {
            id,
            complete,
            totalHours,
            rating,
            review
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
)(SearchDetailScreen);
