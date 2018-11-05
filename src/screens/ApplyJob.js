import React, { Component } from "react";
import { StyleSheet, Text, ScrollView, Dimensions } from "react-native";
import { Item, Input, View } from "native-base";
import { Button } from "react-native-elements";

import RadioForm from "react-native-simple-radio-button";

import { connect } from "react-redux";

import { compose, graphql } from "react-apollo";

import { APPLY_JOB_MUTATION } from "../config/mutations";

class SearchDetailScreen extends Component {
  state = {
    job: "",
    backgroundCheck: false,
    description: "",
    // Below field should be cast into float
    hourlyRate: "",
    extraQuestion: []
  };

  componentDidMount() {
    const item = this.props.navigation.getParam("item", null);

    const extraQuestion =
      item && item.extraQuestion && item.extraQuestion.length
        ? item.extraQuestion.map(eachExtraQuestion => ({
            question: eachExtraQuestion,
            answer: ""
          }))
        : [];

    this.setState({ job: item.id, extraQuestion });
  }

  onChange = (key, val) => this.setState({ [key]: val });

  render() {
    return (
      <ScrollView scrollEnabled>
        <Item>
          <Input
            placeholder="Hourly Rate ($10.00)"
            value={this.state.hourlyRate}
            onChangeText={val => this.onChange("hourlyRate", val)}
          />
        </Item>
        <Item>
          <Input
            placeholder="Description"
            value={this.state.description}
            onChangeText={val => this.onChange("description", val)}
          />
        </Item>
        <Text style={{ fontWeight: "bold" }}>Background Check</Text>
        <RadioForm
          radio_props={[
            { label: "Required", value: "Required" },
            { label: "Not Required", value: "Not Required" }
          ]}
          initial={this.state.backgroundCheck}
          onPress={value => {
            this.setState({
              backgroundCheck: value === "Required" ? true : false
            });
          }}
        />
        <Text style={{ fontWeight: "bold" }}>Extra Questions</Text>
        {this.state.extraQuestion.length
          ? this.state.extraQuestion.map((eachExtraQuestion, index) => {
              return (
                <View key={index}>
                  <Text style={{ fontWeight: "bold" }}>
                    {eachExtraQuestion.question}
                  </Text>
                  <Item>
                    <Input
                      placeholder="Your Answer"
                      value={eachExtraQuestion.answer}
                      onChangeText={val =>
                        this.setState({
                          extraQuestion: this.state.extraQuestion.map(
                            each =>
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
                  </Item>
                </View>
              );
            })
          : null}
        <Button
          backgroundColor="#3F51B5"
          title="Apply"
          onPress={() => {
            console.log("stat: ", this.state);

            const hourlyRate = Number(this.state.hourlyRate);
            const shiftAvailability = "shift available";

            const {
              job,
              description,
              backgroundCheck,
              extraQuestion
            } = this.state;

            this.props
              .applyJob(
                job,
                backgroundCheck,
                description,
                hourlyRate,
                extraQuestion,
                shiftAvailability
              )
              .then(response => {
                console.log("response:", response);
                if (
                  response.data.applyJob.status === 200 &&
                  response.data.applyJob.msg === "success"
                ) {
                  console.log("success apply job: ", response);
                } else throw new Error(response);
              })
              .catch(error => {
                console.log("error apply jov:", JSON.stringify(error));
              });
          }}
        >
          <Text>Apply </Text>
        </Button>
      </ScrollView>
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
  connect(mapStateToProps),
  graphql(APPLY_JOB_MUTATION, {
    props: ({ mutate }) => ({
      applyJob: (
        job,
        backgroundCheck,
        description,
        hourlyRate,
        extraQuestion,
        shiftAvailability
      ) =>
        mutate({
          variables: {
            job,
            backgroundCheck,
            description,
            hourlyRate,
            extraQuestion,
            shiftAvailability
          }
          // refetchQueries: [{ query: APPLY_JOB_MUTATION }]
        })
    })
  })
)(SearchDetailScreen);
