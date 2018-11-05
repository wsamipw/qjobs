import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Picker,
  ScrollView,
  TextInput,
  Alert
} from "react-native";
import { connect } from "react-redux";
import { Button } from "react-native-elements";
import { Item, Input, DatePicker } from "native-base";

import { saveMultiplePostJobScreensState } from "../../actions/";

class PostJobScreen2 extends Component {
  state = {
    hireBy: ""
  };

  onChange = (key, val) => this.setState({ [key]: val });

  render() {
    return (
      <ScrollView scrollEnabled>
        <Text>How urgently do you need to make a hire?</Text>
        <DatePicker
          defaultDate={new Date()}
          minimumDate={new Date(1951, 1, 1)}
          maximumDate={new Date(2051, 12, 31)}
          locale={"en"}
          timeZoneOffsetInMinutes={undefined}
          modalTransparent={false}
          animationType={"fade"}
          androidMode={"default"}
          placeHolderText="Select date"
          textStyle={{ color: "green" }}
          placeHolderTextStyle={{ color: "#d3d3d3" }}
          onDateChange={val => this.onChange("hireBy", val.toISOString())}
        />

        <Button
          backgroundColor="#3F51B5"
          title="Next"
          onPress={() => {
            if (this.state.hireBy) {
              this.props.saveMultiplePostJobScreensState({
                ...this.state
              });
              this.props.navigation.navigate("postJob3");
            } else {
              Alert.alert(
                "Fill all data",
                "Please select an option and other values",
                [{ text: "OK" }]
              );
            }
          }}
        />
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
  pickerStyle: {
    height: 50,
    width: "100%"
  }
});

const mapStateToProps = ({ postJobReducer }) => {
  return { ...postJobReducer };
};

export default connect(
  mapStateToProps,
  { saveMultiplePostJobScreensState }
)(PostJobScreen2);
