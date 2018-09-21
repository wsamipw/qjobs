import React, { Component } from "react";
import { Text, ScrollView } from "react-native";
import { connect } from "react-redux";
import { Button } from "react-native-elements";
import { Item, Input } from "native-base";

import { saveMultiplePostJobScreensState } from "../../actions";

class PostJobScreen41 extends Component {
  state = {
    time: "",
    name: ""
  };

  onChange = (key, val) => this.setState({ [key]: val });

  render() {
    return (
      <ScrollView scrollEnabled>
        <Text style={{ fontWeight: "bold" }}>Experience</Text>
        <Item>
          <Input
            placeholder="Field (Eg. iOS Programming}"
            value={this.state.name}
            onChangeText={val => this.onChange("name", val)}
          />
        </Item>

        <Item>
          <Input
            placeholder="Number of Years"
            keyboardType="numeric"
            value={this.state.time}
            onChangeText={val => this.onChange("time", val)}
          />
        </Item>

        <Button
          backgroundColor="#3F51B5"
          title="Add"
          onPress={() => {
            const experience =
              this.props.postJobState && this.props.postJobState.experience;

            experience && experience.length
              ? this.props.saveMultiplePostJobScreensState({
                  experience: [...experience, this.state]
                })
              : this.props.saveMultiplePostJobScreensState({
                  experience: [this.state]
                });
            this.props.navigation.goBack();
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
