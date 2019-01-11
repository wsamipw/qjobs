import React, { Component } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
  ActivityIndicator
} from "react-native";
import { connect } from "react-redux";
import {
  DatePicker,
  Picker,
  Container,
  Content,
  Button,
  Text
} from "native-base";
import { Query } from "react-apollo";

import { saveMultiplePostJobScreensState } from "../../actions/";

import { JOB_TITLES_QUERY } from "../../config/queries";
import { SELECT_A_JOB_TITLE, PRIMARY_COLOR } from "../../config/CONSTANTS";

class PostJobScreen1 extends Component {
  static navigationOptions = {
    headerTitle: "Job Details",
    headerStyle: {
      backgroundColor: "#5968ef"
    },
    headerTintColor: "#ffffff"
  };

  state = {
    jobTitle: SELECT_A_JOB_TITLE,
    hireBy: ""
  };

  onChange = (key, val) => this.setState({ [key]: val });

  render() {
    return (
      <Container>
        <Content
          style={{
            padding: 16
          }}
        >
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
                  <Text style={styles.questionTitleText}>
                    Select the Job Type
                  </Text>
                  <View style={styles.stepsWrapper}>
                    <View style={styles.stepNumber}>
                      <Text
                        style={{
                          color: "white"
                        }}
                      >
                        1
                      </Text>
                    </View>
                    <Picker
                      selectedValue={this.state.jobTitle}
                      style={styles.pickerStyle}
                      itemStyle={{
                        paddingLeft: 8
                      }}
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
                  </View>
                  <Text style={styles.questionTitleText}>
                    How urgently do you need to hire?
                  </Text>
                  <View style={styles.stepsWrapper}>
                    <View style={styles.stepNumber}>
                      <Text
                        style={{
                          color: "white"
                        }}
                      >
                        2
                      </Text>
                    </View>
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
                      onDateChange={val =>
                        this.onChange("hireBy", val.toISOString())
                      }
                    />
                  </View>

                  <Button
                    block
                    rounded
                    backgroundColor={PRIMARY_COLOR}
                    style={{
                      marginTop: 16
                    }}
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
                  >
                    <Text>Next</Text>
                  </Button>
                </ScrollView>
              );
            }}
          </Query>
        </Content>
      </Container>
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
  },

  questionTitleText: {
    fontWeight: "bold",
    fontSize: 18,
    marginVertical: 10
  },
  stepsWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  stepNumber: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: PRIMARY_COLOR,
    height: 20,
    width: 20,
    borderRadius: 10
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
