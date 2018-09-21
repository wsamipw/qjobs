import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Picker,
  ScrollView,
  TextInput
} from "react-native";
import { connect } from "react-redux";
import { Button } from "react-native-elements";
import { Item, Input, DatePicker } from "native-base";

import { Query } from "react-apollo";

import { saveMultiplePostJobScreensState } from "../../actions/";

import { SALARY_TIME_QUERY } from "../../config/mutations";

class PostJobScreen2 extends Component {
  state = {
    salaryTime: "",
    salary: "",
    hires: "",
    hireBy: new Date().toISOString()
  };

  onChange = (key, val) => this.setState({ [key]: val });

  render() {
    return (
      <Query query={SALARY_TIME_QUERY} fetchPolicy="cache-and-network">
        {({ loading, error, data }) => {
          if (loading) return <Text>Fetching Data ...</Text>;
          if (error) return <Text>Error Fetching Data !</Text>;

          return (
            <ScrollView scrollEnabled>
              <Item>
                <Text>$</Text>
                <TextInput
                  keyboardType="numeric"
                  placeholder="Eg. 10"
                  value={this.state.salary}
                  onChangeText={val => this.onChange("salary", val)}
                />
                <Picker
                  selectedValue={this.state.salaryTime}
                  style={styles.pickerStyle}
                  onValueChange={salaryTime => this.setState({ salaryTime })}
                >
                  {data.perTime &&
                    data.perTime.map(eachPerTime => (
                      <Picker.Item
                        key={eachPerTime.id}
                        label={eachPerTime.name}
                        value={eachPerTime.name}
                      />
                    ))}
                </Picker>
              </Item>

              <Text>How many hires do you want to make?</Text>
              <Item>
                <TextInput
                  style={{ width: "50%" }}
                  keyboardType="numeric"
                  placeholder="Give your own Job Title"
                  value={this.state.hires}
                  onChangeText={val => this.onChange("hires", val)}
                />
              </Item>

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
                  this.props.saveMultiplePostJobScreensState({
                    ...this.state,
                    salary: Number(this.state.salary),
                    hires: Number(this.state.hires)
                  });
                  this.props.navigation.navigate("postJob3");
                }}
              />
            </ScrollView>
          );
        }}
      </Query>
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
