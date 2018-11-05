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
import { Item, Input } from "native-base";
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel
} from "react-native-simple-radio-button";

import { Query } from "react-apollo";

import { saveMultiplePostJobScreensState } from "../../actions/";

import { JOB_TITLES_QUERY, TYPES_OF_JOB_QUERY } from "../../config/queries";

import { SELECT_A_JOB_TITLE } from "../../config/CONSTANTS";

// const jobTitles = ["job1", "job2", "job3", "job4"];

// const typesOfJob = [
//   { label: "Full Time", value: "Full Time" },
//   { label: "Part Time", value: "Part Time" },
//   { label: "Temporary", value: "Temporary" },
//   { label: "Contract", value: "Contract" },
//   { label: "Internship", value: "Internship" },
//   { label: "Commission", value: "Commission" }
// ];

class PostJobScreen1 extends Component {
  state = {
    jobTitle: SELECT_A_JOB_TITLE,
    typeOfJob: ""
  };

  onChange = (key, val) => this.setState({ [key]: val });

  render() {
    console.log("this state:", this.state);
    return (
      <Query query={JOB_TITLES_QUERY} fetchPolicy="cache-and-network">
        {({
          loading: loadingJobTitles,
          error: errorJobTitles,
          data: dataJobTitles
        }) => (
          <Query query={TYPES_OF_JOB_QUERY}>
            {({
              loading: loadingJobTypes,
              error: errorJobTypes,
              data: dataJobTypes
            }) => {
              if (loadingJobTitles || loadingJobTypes)
                return <ActivityIndicator size="large" color="#ff6347" />;
              if (errorJobTitles || errorJobTypes)
                return <Text>Error Fetching Data !</Text>;

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

                  <Text>What type of job is it?</Text>
                  <RadioForm
                    radio_props={
                      dataJobTypes.typeOfJob
                        ? dataJobTypes.typeOfJob.map(eachType => ({
                            label: eachType.name,
                            value: eachType.name
                          }))
                        : []
                    }
                    initial={this.state.typeOfJob}
                    onPress={typeOfJob => {
                      this.setState({ typeOfJob });
                    }}
                  />

                  <Button
                    backgroundColor="#3F51B5"
                    title="Next"
                    onPress={() => {
                      if (
                        this.state.typeOfJob &&
                        this.state.jobTitle !== SELECT_A_JOB_TITLE
                      ) {
                        this.props.saveMultiplePostJobScreensState({
                          ...this.state
                        });
                        this.props.navigation.navigate("postJob2");
                      } else {
                        Alert.alert(
                          "Title or Type of Job Empty",
                          "Please give title and type of job!",
                          [{ text: "OK" }]
                        );
                      }
                    }}
                  />
                </ScrollView>
              );
            }}
          </Query>
        )}
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
)(PostJobScreen1);
