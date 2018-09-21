import React, { Component } from "react";
import { Text, ScrollView } from "react-native";
import { connect } from "react-redux";
import { Button } from "react-native-elements";
import { Item, Input } from "native-base";

import { saveMultiplePostJobScreensState } from "../../actions";

class PostJobScreen51 extends Component {
  state = {
    name: ""
  };

  onChange = (key, val) => this.setState({ [key]: val });

  render() {
    return (
      <ScrollView scrollEnabled>
        <Item>
          <Input
            placeholder=""
            value={this.state.name}
            onChangeText={val => this.onChange("name", val)}
          />
        </Item>
        <Button
          backgroundColor="#3F51B5"
          title="Next"
          onPress={() => {
            const experience = this.props.postJobState.experience;

            experience && experience.length
              ? this.props.saveMultiplePostJobScreensState({
                  experience: [...experience, this.state]
                })
              : this.props.saveMultiplePostJobScreensState({
                  experience: [this.state]
                });
            this.props.navigation.navigate("postJob5");
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
)(PostJobScreen51);
