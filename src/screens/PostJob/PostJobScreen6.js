import React, { Component } from "react";
import { Text, ScrollView, ActivityIndicator } from "react-native";
import { Item, Input } from "native-base";

import { connect } from "react-redux";
import { Button } from "react-native-elements";
import { MapView } from "expo";
import { compose, graphql, withApollo } from "react-apollo";

import { deleteMultiplePostJobScreensState } from "../../actions/";
import { _retrieveData } from "../../config/utils";

import { POST_JOB_MUTATION } from "../../config/mutations";
import { MY_JOBS_QUERY } from "../../config/queries";
import { LOCATION } from "../../config/CONSTANTS";

class PostJobScreen6 extends Component {
  state = {
    timeOut: "",
    loading: false
  };

  onChange = (key, val) => this.setState({ [key]: val });

  render() {
    console.log("this. props: ", this.props.postJobState);
    console.log("this. props: ", this.props.loading);
    console.log("this. props: ", this.props.error);
    if (this.state.loading)
      return <ActivityIndicator size="large" color="#ff6347" />;

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
            this.setState({
              loading: true
            });
            console.log("porp6: ", this.props.postJobState);
            const {
              jobTitle,
              hireBy,
              description,
              extraQuestion
            } = this.props.postJobState;

            const { timeOut } = this.state;

            const timeout = Number(timeOut);

            const location = JSON.parse(await _retrieveData(LOCATION));

            const latitude = location ? location.coords.latitude : undefined;
            const longitude = location ? location.coords.longitude : undefined;

            console.log("latitude: ", latitude, " longiidf: ", longitude);

            console.log(
              "reuquesDAt: ",
              jobTitle,
              hireBy,
              description,
              latitude,
              longitude,
              timeout,
              extraQuestion
            );

            {
              /* const response = await this.props.createJob(
              jobTitle,
              hireBy,
              description,
              latitude,
              longitude,
              timeout,
              extraQuestion
            ); */
            }

            {
              /* const {
              data: {
                createJob: { msg, status }
              }
            } = response;

            if (status === 200 && msg === "success") {
              console.log("success: ", response);
              this.props.navigation.navigate("Profile");
            } else {
              console.log("error: ", response);
            } */
            }

            this.props
              .createJob(
                jobTitle,
                hireBy,
                description,
                latitude,
                longitude,
                timeout,
                extraQuestion
              )
              .then(response => {
                if (response.data.createJob.msg === "success") {
                  this.setState({ loading: false });
                  console.log("success: ", response);

                  this.props.navigation.navigate("profile");
                } else throw new Error(response);
              })
              .catch(error => {
                this.setState({ loading: false });

                console.log("job post errror: ", JSON.stringify(error));
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

const mapStateToProps = ({ myNavigation, postJobReducer }) => {
  return { ...myNavigation, ...postJobReducer };
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
        jobTitle,
        hireBy,
        description,
        latitude,
        longitude,
        timeout,
        extraQuestion
      ) =>
        mutate({
          variables: {
            jobTitle,
            hireBy,
            description,
            latitude,
            longitude,
            timeout,
            extraQuestion
          },
          refetchQueries: [{ query: MY_JOBS_QUERY }]
        })
    })
  })
)(PostJobScreen6);
