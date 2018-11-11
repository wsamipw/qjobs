import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Picker,
  ScrollView,
  Alert,
  ActivityIndicator
} from "react-native";
import { connect } from "react-redux";
import { Button } from "react-native-elements";
import { Item, Input, DatePicker } from "native-base";
import { Query } from "react-apollo";

import { saveMultiplePostJobScreensState } from "../../actions/";

import { JOB_TITLES_QUERY } from "../../config/queries";
import { SELECT_A_JOB_TITLE } from "../../config/CONSTANTS";

class PostJobScreen1 extends Component {
  state = {
    jobTitle: SELECT_A_JOB_TITLE,
    hireBy: ""
  };

  onChange = (key, val) => this.setState({ [key]: val });

  render() {
    return (
      <Query query={JOB_TITLES_QUERY} fetchPolicy="cache-and-network">
        {({
          loading: loadingJobTitles,
          error: errorJobTitles,
          data: dataJobTitles
        }) => {
          if (loadingJobTitles)
            return <ActivityIndicator size="large" color="#ff6347" />;
          if (errorJobTitles) return <Text>Error Fetching Data !</Text>;

          const jobTitles = [
            { id: SELECT_A_JOB_TITLE, name: SELECT_A_JOB_TITLE },
            ...dataJobTitles.jobTitle
          ];

          return (
            <ScrollView scrollEnabled>
              {/* Job Titles */}
              <Picker
                selectedValue={this.state.jobTitle}
                style={styles.pickerStyle}
                onValueChange={jobTitle => this.setState({ jobTitle })}
              >
                {jobTitles &&
                  jobTitles.map(jobTitle => (
                    <Picker.Item
                      key={jobTitle.id}
                      label={jobTitle.name}
                      value={jobTitle.id}
                    />
                  ))}
              </Picker>

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
                  if (
                    this.state.hireBy &&
                    this.state.jobTitle !== SELECT_A_JOB_TITLE
                  ) {
                    this.props.saveMultiplePostJobScreensState({
                      ...this.state
                    });
                    this.props.navigation.navigate("postJob3");
                  } else {
                    Alert.alert(
                      "Title or Date Empty",
                      "Please give title and enter the!",
                      [{ text: "OK" }]
                    );
                  }
                }}
              />
            </ScrollView>
          );
        }}
        }
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

// Not Required
// const mapStateToProps = ({ postJobReducer }) => {
//   return { ...postJobReducer };
// };

export default connect(
  null,
  { saveMultiplePostJobScreensState }
)(PostJobScreen1);
