import React, { Component } from "react";
import { StyleSheet, Text, View, Picker, ScrollView } from "react-native";
import { connect } from "react-redux";
import { Button } from "react-native-elements";
import { Item, Input } from "native-base";
import RadioForm from "react-native-simple-radio-button";

import { Query } from "react-apollo";

import { saveMultiplePostJobScreensState } from "../../actions/";

import { TYPES_OF_JOB_QUERY } from "../../config/mutations";

const industries = ["IT", "PLUMBER", "PHARMACY", "ENGINEERING"];
const categories = ["cat1", "cat2", "cat3", "cat4"];
const jobTitles = ["job1", "job2", "job3", "job4"];

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
    industry: "",
    category: "",
    jobTitle: "",
    customJobTitle: "",
    typeOfJob: ""
  };

  onChange = (key, val) => this.setState({ [key]: val });

  render() {
    return (
      <Query query={TYPES_OF_JOB_QUERY} fetchPolicy="cache-and-network">
        {({ loading, error, data }) => {
          if (loading) return <Text>Fetching Data ...</Text>;
          if (error) return <Text>Error Fetching Data !</Text>;

          return (
            <ScrollView scrollEnabled>
              {/* Industry */}
              <Picker
                selectedValue={this.state.industry}
                style={styles.pickerStyle}
                onValueChange={industry => this.setState({ industry })}
              >
                {industries &&
                  industries.map(industry => (
                    <Picker.Item
                      key={industry}
                      label={industry}
                      value={industry}
                    />
                  ))}
              </Picker>

              {/* Category*/}
              <Picker
                selectedValue={this.state.category}
                style={styles.pickerStyle}
                onValueChange={category => this.setState({ category })}
              >
                {categories &&
                  categories.map(category => (
                    <Picker.Item
                      key={category}
                      label={category}
                      value={category}
                    />
                  ))}
              </Picker>

              {/* Job Titles */}
              <Picker
                selectedValue={this.state.jobTitle}
                style={styles.pickerStyle}
                onValueChange={jobTitle => this.setState({ jobTitle })}
              >
                {jobTitles &&
                  jobTitles.map(jobTitle => (
                    <Picker.Item
                      key={jobTitle}
                      label={jobTitle}
                      value={jobTitle}
                    />
                  ))}
              </Picker>
              <Text>
                ------------------------------- OR
                -------------------------------
              </Text>
              <Item>
                <Input
                  placeholder="Give your own Job Title"
                  value={this.state.customJobTitle}
                  onChangeText={val => this.onChange("customJobTitle", val)}
                />
              </Item>
              <Text>What type of job is it?</Text>
              <RadioForm
                radio_props={
                  data.typeOfJob
                    ? data.typeOfJob.map(eachType => ({
                        label: eachType.name,
                        value: eachType.name
                      }))
                    : []
                }
                initial={0}
                onPress={typeOfJob => {
                  this.setState({ typeOfJob });
                }}
              />
              <Button
                backgroundColor="#3F51B5"
                title="Next"
                onPress={() => {
                  this.props.saveMultiplePostJobScreensState({ ...this.state });
                  this.props.navigation.navigate("postJob2");
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
)(PostJobScreen1);
