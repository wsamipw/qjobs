import React, { Component } from "react";
import { Text, ScrollView, Alert } from "react-native";
import { connect } from "react-redux";
import { Button } from "react-native-elements";
import { Item, Input } from "native-base";

import { saveMultiplePostJobScreensState } from "../../actions";

/*
 * This Screen/Page is changed from `experience` to `extraQuestion`
 * currently from date: 2075/07/15
 */

class PostJobScreen41 extends Component {
  static navigationOptions = {
    headerTitle: "Add Extra Question",
    headerStyle: {
      backgroundColor: "#5968ef"
    },
    headerTintColor: "#ffffff"
  };

  state = {
    name: ""
  };

  onChange = (key, val) => this.setState({ [key]: val });

  render() {
    return (
      <ScrollView scrollEnabled>
        <Text style={{ fontWeight: "bold" }}>Extra Questions</Text>
        <Item>
          <Input
            placeholder="What is your experience in JAVA?"
            value={this.state.name}
            onChangeText={val => this.onChange("name", val)}
          />
        </Item>

        <Button
          backgroundColor="#3F51B5"
          title="Add"
          onPress={() => {
            if (this.state.name) {
              const extraQuestion =
                this.props.postJobState &&
                this.props.postJobState.extraQuestion;

              extraQuestion && extraQuestion.length
                ? this.props.saveMultiplePostJobScreensState({
                    extraQuestion: [...extraQuestion, this.state.name]
                  })
                : this.props.saveMultiplePostJobScreensState({
                    extraQuestion: [this.state.name]
                  });
              this.props.navigation.goBack();
            } else {
              Alert.alert(
                "Question is Empty!",
                "Please type a question or press Back Button",
                [{ text: "OK" }]
              );
            }
          }}
        />
      </ScrollView>
    );
  }
}

const mapStateToProps = ({ postJobReducer }) => {
  return { ...postJobReducer };
};

export default connect(
  mapStateToProps,
  { saveMultiplePostJobScreensState }
)(PostJobScreen41);
