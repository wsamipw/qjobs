import React, { Component } from "react";
import { Text, ScrollView } from "react-native";
import { connect } from "react-redux";
import { Button } from "react-native-elements";
import { Item, Input } from "native-base";

import { saveMultiplePostJobScreensState } from "../../actions/";

class PostJobScreen3 extends Component {
  state = {
    description: ""
  };

  onChange = (key, val) => this.setState({ [key]: val });

  render() {
    return (
      <ScrollView scrollEnabled>
        <Text>
          Describe the responsibilities of this job required, work experience,
          skills or education and other details?
        </Text>
        <Item>
          <Input
            multiline
            placeholder="Job Description"
            value={this.state.description}
            onChangeText={val => this.onChange("description", val)}
          />
        </Item>
        <Button
          backgroundColor="#3F51B5"
          title="Next"
          onPress={() => {
            this.props.saveMultiplePostJobScreensState({ ...this.state });
            this.props.navigation.navigate("postJob4");
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
)(PostJobScreen3);
