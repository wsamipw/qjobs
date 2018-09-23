import React, { Component } from "react";
import { Text, ScrollView } from "react-native";
import { Item, Input } from "native-base";

import { connect } from "react-redux";
import { Button } from "react-native-elements";
import { MapView } from "expo";
import { compose, graphql, withApollo } from "react-apollo";

import { deleteMultiplePostJobScreensState } from "../../actions/";
import { _retrieveData } from "../../config/utils";

import { JOBS_QUERY, POST_JOB_MUTATION } from "../../config/mutations";
import { LOCATION } from "../../config/CONSTANTS";

class PostJobScreen6 extends Component {
  state = {
    timeOut: "",
    extraQuestion: ["what is your question"]
  };

  onChange = (key, val) => this.setState({ [key]: val });

  render() {
    // console.log("port 6 props: ", this.props);

    return (
      <ScrollView scrollEnabled>
        <MapView
          style={{
            flex: 1
          }}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
        />
        <Text style={{ fontWeight: "bold" }}>TimeOut: </Text>

        <Item>
          <Input
            placeholder="Respone Time (in Hrs) from the Job Seeker"
            value={this.state.timeOut}
            onChangeText={val => this.onChange("timeOut", val)}
          />
        </Item>

        <Button
          backgroundColor="#3F51B5"
          title="Publish"
          onPress={async () => {
            console.log("porp6: ", this.props.postJobState);
            const {
              customJobTitle,
              typeOfJob,
              salaryTime,
              salary,
              hires,
              hireBy,
              description,
              experience,
              workAuthorization,
              backgroundCheck,
              jobLocation,
              shiftAvailability
            } = this.props.postJobState;

            const { timeOut, extraQuestion } = this.state;

            const timeout = Number(timeOut);

            const location = JSON.parse(await _retrieveData(LOCATION));

            const latitude = location ? location.coords.latitude : undefined;
            const longitude = location ? location.coords.longitude : undefined;

            console.log("latitude: ", latitude, " longiidf: ", longitude);

            this.props
              .createJob(
                customJobTitle,
                typeOfJob,
                salaryTime,
                salary,
                hires,
                hireBy,
                description,
                experience,
                workAuthorization,
                backgroundCheck,
                jobLocation,
                shiftAvailability,
                latitude,
                longitude,
                timeout,
                extraQuestion
              )
              .then(response => {
                console.log("job post data: ", response);
                if (response.data.createJob.msg === "success") {
                  this.props.navigation.navigate("profile");
                } else throw new Error(response);
              })
              .catch(error => {
                console.log("job post errror: ", error);
              });
          }}
        />
        {/* <Button
                backgroundColor="green"
                title="Publish"
                onPress={() => {
                  console.log("publish");
                }}
              /> */}
      </ScrollView>
    );
  }
}

const mapStateToProps = ({ myNavigation, postJobReducer, extraReducer }) => {
  return { ...myNavigation, ...postJobReducer, ...extraReducer };
};

export default compose(
  connect(
    mapStateToProps,
    { deleteMultiplePostJobScreensState }
  ),
  withApollo,
  graphql(POST_JOB_MUTATION, {
    props: ({ mutate }) => ({
      createJob: (
        customJobTitle,
        typeOfJob,
        salaryTime,
        salary,
        hires,
        hireBy,
        description,
        experience,
        workAuthorization,
        backgroundCheck,
        jobLocation,
        shiftAvailability,
        latitude,
        longitude,
        timeout,
        extraQuestion
      ) =>
        mutate({
          variables: {
            customJobTitle,
            typeOfJob,
            salaryTime,
            salary,
            hires,
            hireBy,
            description,
            experience,
            workAuthorization,
            backgroundCheck,
            jobLocation,
            shiftAvailability,
            latitude,
            longitude,
            timeout,
            extraQuestion
          },
          refetchQueries: [{ query: JOBS_QUERY }]
        })
    })
  })
)(PostJobScreen6);
