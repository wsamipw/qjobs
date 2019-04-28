import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  ScrollView,
  StatusBar,
  Modal
} from "react-native";

import { isEmpty } from "lodash";

import { Button, Text, Content, Textarea } from "native-base";
import { Card } from "react-native-elements";
import { Query, compose, graphql, withApollo } from "react-apollo";

// Review Imports
import { AirbnbRating } from "react-native-ratings";

import {
  JOB_STATUS_CHECK_QUERY,
  JOB_APPLICATIONS_QUERY
} from "../../../config/queries";

import { _retrieveData } from "../../../config/utils";
import {
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

import {
  SELECT_APPLY_JOB_MUTATION,
  CREATE_REVIEW_MUTATION
} from "../../../config/mutations";
import { MY_JOBS_QUERY } from "../../../config/queries";
import Tag from "../../../components/Tag";
import moment from "moment";

class JobApplicationDetailScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title:
        navigation.state.params.item.employee.firstName &&
        navigation.state.params.item.employee.lastName
          ? `${navigation.state.params.item.employee.firstName} ${
              navigation.state.params.item.employee.lastName
            }`
          : `${navigation.state.params.item.employee.username}  `,
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
    eachItem: null,
    // For rating and review
    isModalVisible: false,

    rating: 1,
    review: "",

    // When createReview mutation is successful
    ratingReview: null
  };

  componentDidMount = () => {
    const eachItem = this.props.navigation.getParam("item", null);
    this.setState({ eachItem }, async () => {
      try {
        console.log("before AWAIT");
        const { data } = await this.props.client.query({
          query: JOB_STATUS_CHECK_QUERY,
          variables: {
            id: eachItem.id,
            status: eachItem.status
          }
        });

        // const pollQuery = this.props.client.query({
        //   query: My_QUERY,
        //   variables: { ...vars }
        // });
        // const response =  await pollQuery.startPolling(1000);

        console.log("RESPONE JOB STATU : ", data);
        this.setState({
          eachItem: {
            ...this.state.eachItem,
            status: data.jobStatusChange.status
          }
        });
      } catch (error) {
        console.log("error catched JOB STATUS CHECK: ", error);
      }
    });
  };

  // used for rating and review
  _toggleModal = () =>
    this.setState({
      isModalVisible: !this.state.isModalVisible
    });

  // used for rating and review
  ratingCompleted = rating => {
    console.log("complete Rating is: " + rating);
    this.setState({ rating });
  };

  renderStatus = () => {
    const status = this.state.eachItem.status;

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

  renderJobStatus = () => {
    // console.log("job applic detai: ", item);
    const item = this.state.eachItem;

    if (item.status === COMPLETED) {
      return (
        <Button
          block
          success
          style={styles.statusBtnStylesAppliedJobs}
          onPress={() => {
            // this._toggleModal(item);
            this.props.navigation.navigate("payment", {
              id: item.id
            });
          }}
        >
          <Text>PAY</Text>
        </Button>
      );
    } else if (item.status === APPLIED) {
      return (
        <View style={styles.renderJobStatusWrapper}>
          <Button
            danger
            block
            style={styles.jobStatusButton}
            onPress={() => {
              this.props
                .selectApplyJob(item.id, false)
                .then(response => {
                  console.log("resp_close: ", response);
                  if (
                    response.data.selectApplyJob.status === 200 &&
                    response.data.selectApplyJob.msg === "success"
                  ) {
                    console.log("success close");
                    this.setState({
                      eachItem: {
                        ...this.state.eachItem,
                        status: response.data.selectApplyJob.applyJob.status
                      }
                    });
                    // this.props.navigation.goBack();
                  } else throw new Error(response);
                })
                .catch(error => {
                  console.log(" job app detail REJECT erro: ", error);
                });
            }}
          >
            <Text>Reject</Text>
          </Button>
          <Button
            primary
            block
            style={styles.jobStatusButton}
            onPress={() => {
              this.props
                .selectApplyJob(item.id, true)
                .then(response => {
                  console.log("resp_tick: ", response);
                  if (
                    response.data.selectApplyJob.status === 200 &&
                    response.data.selectApplyJob.msg === "success"
                  ) {
                    console.log("success tick");
                    this.setState({
                      eachItem: {
                        ...this.state.eachItem,
                        status: response.data.selectApplyJob.applyJob.status
                      }
                    });
                    // this.props.navigation.goBack();
                  } else throw new Error(response);
                })
                .catch(error => {
                  console.log(
                    "job app detail ACCEPT erro: ",
                    JSON.stringify(error)
                  );
                });
            }}
          >
            <Text>Accept</Text>
          </Button>
        </View>
      );
    } else if (item.status === PAID) {
      if (
        this.state.ratingReview ||
        (item.reviewSet && item.reviewSet.length)
      ) {
        const ratingReview =
          this.state.ratingRevieeachItem.employee.firstNamew ||
          item.reviewSet[0];

        return (
          <Card>
            <Text style={styles.headingTextStyles}>Ratings and Review</Text>

            <AirbnbRating
              isDisabled
              count={5}
              size={20}
              reviews={["Terrible", "Bad", "Okay", "Good", "Great"]}
              defaultRating={ratingReview.rating}
            />
            <Text>{ratingReview.review}</Text>
          </Card>
        );
      }
      return (
        <Button
          block
          primary
          style={styles.statusBtnStylesAppliedJobs}
          onPress={() => {
            this._toggleModal();
          }}
        >
          {/* <Text>
            Review{" "}
            {item.employee && item.employee.firstName && item.employee.lastName
              ? `${item.employee.firstName} ${item.employee.lastName}`
              : `${item.employee.username}`}{" "}
            about his work ...
          </Text> */}
          <Text>Review your employee ...</Text>
        </Button>
      );
    } else {
      return null;
    }
  };

  render() {
    const { eachItem } = this.state;

    console.log("eachItem job app detail render: ", eachItem);
    return eachItem ? (
      <ScrollView scrollEnabled>
        <View style={styles.mainWrapper}>
          <StatusBar barStyle="light-content" backgroundColor={PRIMARY_COLOR} />
          <Card>
            <Text style={{ fontWeight: "bold" }}>Name: </Text>
            <Text>
              {eachItem.employee.firstName && eachItem.employee.lastName
                ? `${eachItem.employee.firstName} ${eachItem.employee.lastName}`
                : `${eachItem.employee.username}`}
            </Text>
            <Text style={{ fontWeight: "bold", marginTop: 10 }}>
              Applied Date:
            </Text>
            <Text>{moment(eachItem.applied).format("MMMM DD, YYYY")}</Text>
            <Text style={{ fontWeight: "bold", marginTop: 10 }}>
              Description:
            </Text>
            <Text>{eachItem.description}</Text>
            <Text style={{ fontWeight: "bold", marginTop: 10 }}>Rate:</Text>
            <Text>{eachItem.hourlyRate}</Text>
            {/* {this.renderStatus(eachItem.status)} */}
            {/* <Query
              query={JOB_STATUS_CHECK_QUERY}
              fetchPolicy="network-only"
              variables={{
                id: eachItem.id,
                status: eachItem.status
              }}
              notifyOnNetworkStatusChange
              // pollInterval={1000}
            >
              {({
                loading,
                error,
                data,
                startPolling,
                stopPolling,
                networkStatus
              }) => {
                /*
                 * `finalData` priotizes the data received
                 * from the query .i.e the changed status data.
                 * The above query checks whether the `status`
                 * has been changed and responds only if `status`
                 * is changed else it is timedOut. So if no response
                 * is received from the query, `eachItem` variable
                 * is to be used to get the unchanged status
                 

                console.log("STATUS CHECK POLL LOADING: ", loading);
                console.log(
                  "STATUS CHECK POLL REFETCH LOADING: ",
                  networkStatus
                );
                const finalData = !isEmpty(data)
                  ? data.jobStatusChange
                  : eachItem;

                if (finalData.status !== PAID) {
                  startPolling(1000);
                }
                if (finalData.status === PAID) {
                  stopPolling();
                }

                if (error) {
                  console.log("erropolling: ", error);
                  stopPolling();
                  return <Text>Error Data Fetching</Text>;
                }

                if (finalData) {
                  console.log("final data");
                  return this.renderStatus(finalData.status);
                }
              }}
            </Query> */}
            {this.renderStatus()}
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

              if (error) {
                console.log("error job status: ", JSON.stringify(error));
                stopPolling();
                return <Text>Error Data Fetching</Text>;
              }

              if (finalData) {
                // console.log("finaldata ran job app detail: ", finalData);
                return this.renderJobStatus(finalData);
              }
            }}
          </Query> */}

          {this.renderJobStatus()}
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.isModalVisible}
            onRequestClose={() => {
              this._toggleModal();
            }}
          >
            <Content padder>
              <View
                style={{
                  backgroundColor: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "100%"
                }}
              >
                <AirbnbRating
                  count={5}
                  size={20}
                  reviews={["Terrible", "Bad", "Okay", "Good", "Great"]}
                  defaultRating={this.state.rating}
                  onFinishRating={this.ratingCompleted}
                />

                <Textarea
                  style={{ width: "100%" }}
                  rowSpan={5}
                  bordered
                  value={this.state.review}
                  onChangeText={val => this.setState({ review: val })}
                  placeholder="Review"
                />
                <Button
                  backgroundColor={PRIMARY_COLOR}
                  primary
                  block
                  rounded
                  style={{
                    marginTop: 15
                  }}
                  onPress={() => {
                    console.log("state apply job: ");

                    const { rating, review } = this.state;

                    const applyJobId = eachItem.id;

                    console.log("applyjobid: ,", applyJobId);

                    const jobId = this.props.navigation.getParam("jobId", null);

                    console.log("jobbididdddddd: ", jobId);
                    this.props.client
                      .mutate({
                        mutation: CREATE_REVIEW_MUTATION,
                        variables: {
                          applyJobId,
                          rating,
                          review
                        },
                        refetchQueries: [
                          {
                            query: JOB_APPLICATIONS_QUERY,
                            variables: {
                              jobId
                            }
                          }
                        ]
                      })
                      .then(response => {
                        console.log("review Resonse: ", response);
                        if (
                          response.data.createReview.status === 200 &&
                          response.data.createReview.msg === "success"
                        ) {
                          console.log("Review success");
                          // this.props.navigation.goBack();
                          // this.setState({ eachItem: })
                          this.setState(
                            { ratingReview: response.data.createReview.review },
                            () => {
                              this._toggleModal();
                            }
                          );
                        } else throw new Error(response);
                      })
                      .catch(error => {
                        console.log(" review error: ", error);
                      });

                    // this.props
                    //   .createReview(applyJobId, rating, review)
                    //   .then(response => {
                    //     console.log("review Resonse: ", response);
                    //     if (
                    //       response.data.createReview.status === 200 &&
                    //       response.data.createReview.msg === "success"
                    //     ) {
                    //       console.log("Review success");
                    //       // this.props.navigation.goBack();
                    //       // this.setState({ eachItem: })
                    //       this.setState(
                    //         { ratingReview: response.data.createReview.review },
                    //         () => {
                    //           this._toggleModal();
                    //         }
                    //       );
                    //     } else throw new Error(response);
                    //   })
                    //   .catch(error => {
                    //     console.log(" review error: ", error);
                    //   });
                  }}
                >
                  <Text>Submit</Text>
                </Button>
              </View>
            </Content>
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
  },
  headingTextStyles: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 8
  },

  statusBtnStylesAppliedJobs: {
    marginVertical: 10,
    marginHorizontal: Dimensions.get("screen").width * 0.04
  },
  renderJobStatusWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
    marginHorizontal: Dimensions.get("screen").width * 0.04
  },
  jobStatusButton: {
    width: "48%"
  }
});

export default compose(
  withApollo,
  graphql(SELECT_APPLY_JOB_MUTATION, {
    props: ({ mutate }) => ({
      selectApplyJob: (id, select) =>
        mutate({
          variables: {
            id,
            select
          },
          refetchQueries: [{ query: MY_JOBS_QUERY }]
        })
    })
  }),

  graphql(CREATE_REVIEW_MUTATION, {
    props: ({ mutate }) => ({
      createReview: (applyJobId, rating, review) =>
        mutate({
          variables: {
            applyJobId,
            rating,
            review
          },
          refetchQueries: [
            {
              query: JOB_APPLICATIONS_QUERY,
              variables: {
                jobId: this.state.jobId
              }
            }
          ]
        })
    })
  })
)(JobApplicationDetailScreen);
