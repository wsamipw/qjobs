import React, { Component } from "react";
import { StyleSheet, ScrollView, Dimensions } from "react-native";
import {
  Item,
  Input,
  View,
  Button,
  Text,
  Textarea,
  Container,
  Content,
  Label,
  Toast,
  Spinner
} from "native-base";

import RadioForm from "react-native-simple-radio-button";

import { connect } from "react-redux";

import { compose, graphql, withApollo } from "react-apollo";

import { APPLY_JOB_MUTATION } from "../config/mutations";
// import CustomToast from "../config/CustomToast";
import { JOBS_QUERY, APPLIED_JOBS_QUERY } from "../config/queries";

import { NavigationActions, StackActions } from "react-navigation";
import { PRIMARY_COLOR } from "../config/CONSTANTS";

class SearchDetailScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: `Apply for ${
        navigation.state.params.item.properties.jobTitle.name
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
    job: "",
    description: "",
    // Below field should be cast into float
    hourlyRate: "",
    extraQuestion: [],

    loading: false
  };

  componentDidMount() {
    const item = this.props.navigation.getParam("item", null);

    const extraQuestion =
      item &&
        item.properties.extraQuestion &&
        item.properties.extraQuestion.length
        ? item.properties.extraQuestion.map(eachExtraQuestion => ({
          question: eachExtraQuestion,
          answer: ""
        }))
        : [];

    this.setState({ job: item.id, extraQuestion });
  }

  // componentWillUnmount() {
  //   Toast.toastInstance = null;
  // }

  onChange = (key, val) => this.setState({ [key]: val });

  // Default_Toast_Bottom = () => {
  //   this.refs.defaultToastBottom.ShowToastFunction("Successfully Applied");
  // };

  resetStack = () => {
    this.props.navigation.dispatch(
      StackActions.reset({
        index: 0,
        // key: null,
        actions: [
          NavigationActions.navigate({
            routeName: "search",
            params: { someParams: "parameters goes here..." }
          })
        ]
      })
    );
  };

  render() {
    return (
      <Container>
        <Content
          style={{
            padding: 16
          }}
        >
          <ScrollView scrollEnabled>
            <Text
              style={{
                fontWeight: "bold"
              }}
            >
              Your Proposed Rate:
            </Text>
            <Item floatingLabel>
              <Label>Hourly Rate</Label>
              <Input
                keyboardType="numeric"
                value={this.state.hourlyRate}
                onChangeText={val => this.onChange("hourlyRate", val)}
              />
            </Item>
            <Text
              style={{
                marginVertical: 10,
                fontWeight: "bold"
              }}
            >
              Job Description:
            </Text>
            <Textarea
              placeholder="Description"
              rowSpan={5}
              bordered
              value={this.state.description}
              onChangeText={val => this.onChange("description", val)}
            />
            {this.state.extraQuestion.length ? (
              <View>
                <Text
                  style={{ fontWeight: "bold", marginTop: 10, marginBottom: 6 }}
                >
                  Extra Questions
                </Text>

                {this.state.extraQuestion.map((eachExtraQuestion, index) => {
                  return (
                    <View key={index}>
                      <Text style={{ fontWeight: "bold" }}>
                        {eachExtraQuestion.question}
                      </Text>
                      <Textarea
                        bordered
                        rowSpan={4}
                        placeholder="Your Answer"
                        value={eachExtraQuestion.answer}
                        onChangeText={val =>
                          this.setState({
                            extraQuestion: this.state.extraQuestion.map(each =>
                              each.question === eachExtraQuestion.question
                                ? {
                                  ...each,
                                  answer: val
                                }
                                : each
                            )
                          })
                        }
                      />
                    </View>
                  );
                })}
              </View>
            ) : null}

            {this.state.loading ? (
              <Spinner />
            ) : (
                <Button
                  backgroundColor={PRIMARY_COLOR}
                  rounded
                  block
                  style={{
                    marginTop: 15
                  }}
                  onPress={() => {
                    this.setState({ loading: true }, () => {
                      console.log("state apply job: ", this.state);
                      const hourlyRate = Number(this.state.hourlyRate);

                      const { job, description, extraQuestion } = this.state;

                      this.props.client
                        .mutate({
                          mutation: APPLY_JOB_MUTATION,
                          variables: {
                            job,
                            description,
                            hourlyRate,
                            extraQuestion
                          },
                          refetchQueries: [
                            {
                              query: APPLIED_JOBS_QUERY,
                              variables: {
                                //awaitRefetchQueries: true,
                                page: 1,
                                rows: 4
                              }
                            }
                          ]
                        })
                        .then(response => {
                          console.log("response apply:", response);
                          if (
                            response.data.applyJob.status === 200 &&
                            response.data.applyJob.msg === "success"
                          ) {
                            console.log("success apply job: ");
                            // this.Default_Toast_Bottom();
                            this.setState({ loading: false });
                            Toast.show({
                              text: "Successfully Applied !",
                              buttonText: "Okay",
                              duration: 3000,
                              position: "bottom",
                              type: "success"
                            });

                            this.resetStack();

                            this.props.navigation.navigate("jobs");
                          } else throw new Error(JSON.stringify(response));
                        })
                        .catch(error => {
                          const err = JSON.parse(error.message);
                          this.setState({ loading: false });

                          console.log("error apply jov:", err);
                          Toast.show({
                            text:
                              "You must first be registered as a professional for this job! \nGoto More > Register as Pro User",
                            buttonText: "Okay",
                            duration: 3000,
                            position: "bottom",
                            type: "danger"
                          });
                        });
                    });
                  }}
                >
                  <Text>Apply</Text>
                </Button>
              )}
            {/* <CustomToast ref="defaultToastBottom" position="bottom" /> */}
          </ScrollView>
        </Content>
      </Container>
    );
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

const mapStateToProps = ({ myNavigation }) => {
  return { ...myNavigation };
};

export default compose(
  withApollo,
  connect(mapStateToProps)
)(SearchDetailScreen);
