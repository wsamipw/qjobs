import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { Container, Content, Item, Input, DatePicker } from "native-base";
import { Button } from "react-native-elements";
import { connect } from "react-redux";
import { TRAINING_DETAILS_QUERY } from "./TrainingScreen";

import { compose, graphql } from "react-apollo";
import gql from "graphql-tag";

import { v4 } from "uuid";

export const TRAINING_MUTATION = gql`
  mutation TrainingMutation($training: JSONString!) {
    updateUser(training: $training) {
      msg
      status
    }
  }
`;

class TrainingFormScreen extends Component {
  state = {
    training: "",
    trainingInstitute: ""
  };

  componentDidMount() {
    const data = this.props.navigation.getParam("selectedTraining", null);

    if (data) {
      const { training, trainingInstitute } = data;

      this.setState({
        training,
        trainingInstitute
      });
    }
  }

  onChange = (key, val) => this.setState({ [key]: val });

  render() {
    return (
      <Container>
        <Content scrollEnabled contentContainerStyle={styles.contentStyle}>
          <Item rounded>
            <Input
              selectionColor="rgba(255,255,255,0.5)"
              placeholder="Training"
              value={this.state.training}
              onChangeText={val => this.onChange("training", val)}
            />
          </Item>
          <Item rounded>
            <Input
              selectionColor="rgba(255,255,255,0.5)"
              placeholder="Training Institute"
              value={this.state.trainingInstitute}
              onChangeText={val => this.onChange("trainingInstitute", val)}
            />
          </Item>
        </Content>
        <Button
          backgroundColor="#3F51B5"
          containerViewStyle={styles.loginButtton}
          rounded
          title={
            this.props.navigation.getParam("selectedTraining", null)
              ? "Update"
              : "Add"
          }
          onPress={() => {
            let training = "";

            const trainingsList = this.props.navigation.getParam(
              "trainings",
              []
            );
            const selectedTraining = this.props.navigation.getParam(
              "selectedTraining",
              null
            );

            if (selectedTraining) {
              const deletedTrainingList = trainingsList.filter(
                eachtraining => eachtraining.id !== selectedTraining.id
              );

              training = JSON.stringify([
                ...deletedTrainingList,
                { ...this.state, id: selectedTraining.id }
              ]);
            } else {
              training = JSON.stringify([
                ...trainingsList,
                { ...this.state, id: v4() }
              ]);
            }

            this.props
              .updateUser(training)
              .then(({ data }) => {
                if (data.updateUser.msg === "success") {
                  console.log("add training success");
                  this.props.navigation.goBack();
                } else throw new Error(data.updateUser.msg);
              })
              .catch(error => {
                console.log("update error: ", error);
              });
          }}
        />
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
  }
});

const mapStateToProps = ({ myNavigation }) => {
  return { ...myNavigation };
};

export default compose(
  connect(mapStateToProps),
  graphql(TRAINING_MUTATION, {
    props: ({ mutate }) => ({
      updateUser: training =>
        mutate({
          variables: {
            training
          },
          refetchQueries: [{ query: TRAINING_DETAILS_QUERY }]
        })
    })
  })
)(TrainingFormScreen);
