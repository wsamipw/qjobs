import React, { Component } from "react";
import { StyleSheet, Text, ScrollView, Picker } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";

import { connect } from "react-redux";
import { Button } from "react-native-elements";
import MultiSelect from "react-native-multiple-select";
import RadioForm from "react-native-simple-radio-button";

import { saveMultiplePostJobScreensState } from "../../actions";

const shiftTimes = ["None", "Any Time", "Max 2 hrs", "Limited"];

class PostJobScreen5 extends Component {
  state = {
    workAuthorization: [] /* This is actually sent to server */,
    backgroundCheck: true,
    shiftAvailability: "",
    jobLocation: true
  };

  items = [
    {
      id: "92iijs7yta",
      name: "Ondo"
    },
    {
      id: "a0s0a8ssbsd",
      name: "Ogun"
    },
    {
      id: "16hbajsabsd",
      name: "Calabar"
    },
    {
      id: "nahs75a5sg",
      name: "Lagos"
    },
    {
      id: "667atsas",
      name: "Maiduguri"
    },
    {
      id: "hsyasajs",
      name: "Anambra"
    },
    {
      id: "djsjudksjd",
      name: "Benue"
    },
    {
      id: "sdhyaysdj",
      name: "Kaduna"
    },
    {
      id: "suudydjsjd",
      name: "Abuja"
    }
  ];

  onSelectedItemsChange = names => {
    const workAuthorization = names.map(name => ({ name }));
    this.setState({ workAuthorization });
  };

  render() {
    return (
      <ScrollView scrollEnabled>
        <Text style={{ fontWeight: "bold" }}> Work Authorization</Text>

        <MultiSelect
          hideTags
          items={this.items}
          uniqueKey="id"
          ref={component => {
            this.multiSelect = component;
          }}
          onSelectedItemsChange={this.onSelectedItemsChange}
          selectedItems={this.state.workAuthorization.map(each => each.name)}
          selectText="Pick Items"
          searchInputPlaceholderText="Search Items..."
          //onChangeInput={text => console.log("text changed: ", text)}
          tagRemoveIconColor="#CCC"
          tagBorderColor="#CCC"
          tagTextColor="#CCC"
          selectedItemTextColor="#CCC"
          selectedItemIconColor="#CCC"
          itemTextColor="#000"
          displayKey="name"
          searchInputStyle={{ color: "#CCC" }}
        />

        <Text style={{ fontWeight: "bold" }}>Background Check</Text>
        <RadioForm
          radio_props={[
            { label: "Required", value: "Required" },
            { label: "Preferred", value: "Preferred" }
          ]}
          initial={0}
          onPress={value => {
            this.setState({
              backgroundCheck: value === "Required" ? true : false
            });
          }}
        />

        <Text style={{ fontWeight: "bold" }}>Job Location</Text>
        <RadioForm
          radio_props={[
            { label: "Yes", value: "Yes" },
            { label: "No", value: "No" }
          ]}
          initial={0}
          onPress={value => {
            this.setState({
              jobLocation: value === "Yes" ? true : false
            });
          }}
        />

        {/* <Text>Education</Text>
        <Text>Completed Level of Education: </Text>

        <Picker
          selectedValue={this.state.shiftAvailability}
          style={styles.pickerStyle}
          onValueChange={shiftAvailability =>
            this.setState({ shiftAvailability })
          }
        >
          {shiftTimes &&
            shiftTimes.map(shiftTime => (
              <Picker.Item
                key={shiftTime}
                label={shiftTime}
                value={shiftTime}
              />
            ))}
        </Picker> */}

        <Text style={{ fontWeight: "bold" }}>Shift Availability</Text>
        <Text>Available Shift: </Text>

        <Picker
          selectedValue={this.state.shiftAvailability}
          style={styles.pickerStyle}
          onValueChange={shiftAvailability =>
            this.setState({ shiftAvailability })
          }
        >
          {shiftTimes &&
            shiftTimes.map(shiftTime => (
              <Picker.Item
                key={shiftTime}
                label={shiftTime}
                value={shiftTime}
              />
            ))}
        </Picker>

        <Button
          backgroundColor="#3F51B5"
          title="Next"
          onPress={() => {
            this.props.saveMultiplePostJobScreensState({
              ...this.state
            });
            this.props.navigation.navigate("postJob6");
          }}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  containerToolbar: {
    flex: 1,
    //justifyContent: 'center',
    justifyContent: "flex-start",
    // https://github.com/facebook/react-native/issues/2957#event-417214498
    alignItems: "stretch",
    backgroundColor: "#F5FCFF"
  },
  toolbar: {
    backgroundColor: "#95a2b2",
    marginTop: getStatusBarHeight(),
    height: 30 + getStatusBarHeight()
  }
});

const mapStateToProps = ({ postJobReducer }) => {
  return { ...postJobReducer };
};

export default connect(
  mapStateToProps,
  { saveMultiplePostJobScreensState }
)(PostJobScreen5);
