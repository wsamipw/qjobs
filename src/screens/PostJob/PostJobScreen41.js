import React, { Component } from "react";
import { ScrollView, Alert } from "react-native";
import { connect } from "react-redux";
import { Item, Input, Button, Text, Container, Content } from "native-base";

import { saveMultiplePostJobScreensState } from "../../actions";
import { PRIMARY_COLOR } from "../../config/CONSTANTS";

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
      <Container>
        <Content
          style={{
            padding: 16
          }}
        >
          <ScrollView scrollEnabled>
            <Text style={{ fontWeight: "bold" }}>Extra Questions</Text>
            <Item>
              <Input
                placeholder="What is your experience in Related Field?"
                value={this.state.name}
                onChangeText={val => this.onChange("name", val)}
              />
            </Item>

            <Button
              backgroundColor={PRIMARY_COLOR}
              rounded
              block
              style={{
                marginTop: 15
              }}
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
            >
              <Text>Add</Text>
            </Button>
          </ScrollView>
        </Content>
      </Container>
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
