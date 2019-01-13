import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  FlatList,
  ScrollView,
  StatusBar,
  Alert,
  Modal,
  Picker
} from "react-native";

import { isEmpty } from "lodash";

import { Button, ListItem, Text, Item, Input } from "native-base";
import { AirbnbRating } from "react-native-ratings";
import { Card } from "react-native-elements";
import { compose, graphql } from "react-apollo";

import { Query } from "react-apollo";

import { JOB_STATUS_CHECK_QUERY } from "../../../config/queries";

import Icon from "react-native-vector-icons/Ionicons";
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
  SELECT_APPLY_JOB_MUTATION,
  COMPLETE_APPLY_JOB_MUTATION
} from "../../../config/mutations";
import { MY_JOBS_QUERY } from "../../../config/queries";

class JobApplicationDetailScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: `${navigation.state.params.item.employee.firstName} ${
        navigation.state.params.item.employee.lastName
      }`,
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
  }

  _toggleModal = item =>
    this.setState({
      isModalVisible: !this.state.isModalVisible,
      selectedApplicationItem: item
    });

  ratingCompleted(rating) {
    console.log("complete Rating is: " + rating);
  }

  renderJobStatus = item => {
    if (item.status === ACCEPTED) {
      return <Icon name="md-checkmark-circle" size={30} color="#00FF00" />;
    } else if (item.status === APPLIED) {
      return (
        <View style={styles.renderJobStatusWrapper}>
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
                    // this.props.navigation.goBack();
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
                    // this.props.navigation.goBack();
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

  render() {
    const eachItem = this.props.navigation.getParam("item", null);

    return eachItem ? (
      <ScrollView scrollEnabled>
        <View style={styles.mainWrapper}>
          <StatusBar barStyle="light-content" backgroundColor="#ecf0f1" />

          <Card>
            <Text>
              {eachItem.employee.firstName}
              {eachItem.employee.lastName}
            </Text>
            <Text>{eachItem.applied}</Text>
            <Text>{eachItem.description}</Text>
            <Text>{eachItem.hourlyRate}</Text>
          </Card>
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
              console.log("eachITem in side query id: ", eachItem.id);
              console.log(
                "eachITem in side query job app detaik status: ",
                eachItem.status
              );

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

              if (error) {
                console.log("error job status: ", JSON.stringify(error));
                stopPolling();
                return <Text>Error Data Fetching</Text>;
              }

              if (finalData) {
                console.log("finaldata ran job app detail: ", finalData);
                return this.renderJobStatus(finalData);
              }
            }}
          </Query>

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
  renderJobStatusWrapper: {
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
  })
)(JobApplicationDetailScreen);
