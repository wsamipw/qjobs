import React, { Component } from "react";
import { ScrollView } from "react-native";
import { connect } from "react-redux";
import {
  Item,
  Input,
  Form,
  Button,
  Text,
  Textarea,
  Content,
  Container
} from "native-base";

import { saveMultiplePostJobScreensState } from "../../actions/";
import { PRIMARY_COLOR } from "../../config/CONSTANTS";

class PostJobScreen3 extends Component {
  static navigationOptions = {
    headerTitle: "Description",
    headerStyle: {
      backgroundColor: "#5968ef"
    },
    headerTintColor: "#ffffff"
  };

  state = {
    description: ""
  };

  onChange = (key, val) => this.setState({ [key]: val });

  render() {
    // console.log("props: ", this.props);
    return (
      <Container>
        <Content
          style={{
            padding: 16
          }}
        >
          <ScrollView scrollEnabled>
            <Text>
              Describe the responsibilities of this job required, work
              experience, skills or education and other details?
            </Text>
            <Textarea
              rowSpan={5}
              bordered
              placeholder="Job Description"
              value={this.state.description}
              onChangeText={val => this.onChange("description", val)}
            />
            <Button
              block
              rounded
              backgroundColor={PRIMARY_COLOR}
              style={{
                marginTop: 16
              }}
              onPress={() => {
                this.props.saveMultiplePostJobScreensState({ ...this.state });
                this.props.navigation.navigate("postJob4");
              }}
            >
              <Text>Next</Text>
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
)(PostJobScreen3);
