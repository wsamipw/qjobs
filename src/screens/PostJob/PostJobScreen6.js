import React, { Component } from "react";
import { ScrollView, ActivityIndicator } from "react-native";
import {
  Item,
  Input,
  Button,
  Container,
  Content,
  Text,
  Spinner,
  Toast
} from "native-base";

import { connect } from "react-redux";
import { MapView } from "expo";
import { compose, graphql, withApollo } from "react-apollo";

import { deleteMultiplePostJobScreensState } from "../../actions/";
import { _retrieveData } from "../../config/utils";

import { POST_JOB_MUTATION } from "../../config/mutations";
import { MY_JOBS_QUERY } from "../../config/queries";
import { LOCATION, PRIMARY_COLOR } from "../../config/CONSTANTS";

class PostJobScreen6 extends Component {
  static navigationOptions = {
    headerTitle: "Create Job",
    headerStyle: {
      backgroundColor: "#5968ef"
    },
    headerTintColor: "#ffffff"
  };

  state = {
    timeOut: "",
    loading: false
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
                keyboardType="numeric"
                placeholder="Respone Time (in Hrs) from the Job Seeker"
                value={this.state.timeOut}
                onChangeText={val => this.onChange("timeOut", val)}
              />
            </Item>

            {this.state.loading ? (
              <Spinner />
            ) : (
              <Button
                backgroundColor={PRIMARY_COLOR}
                rounded
                block
                style={{
                  marginTop: 15
                }}
                onPress={async () => {
                  this.setState({
                    loading: true
                  });
                  // console.log("porp6: ", this.props.postJobState);
                  const {
                    jobTitle,
                    hireBy,
                    description,
                    extraQuestion
                  } = this.props.postJobState;

                  const { timeOut } = this.state;

                  const timeout = Number(timeOut);

                  const location = JSON.parse(await _retrieveData(LOCATION));

                  const latitude = location
                    ? location.coords.latitude
                    : undefined;
                  const longitude = location
                    ? location.coords.longitude
                    : undefined;

                  // console.log("latitude: ", latitude, " longiidf: ", longitude);

                  // console.log(
                  //   "reuquesDAt: ",
                  //   jobTitle,
                  //   hireBy,
                  //   description,
                  //   latitude,
                  //   longitude,
                  //   timeout,
                  //   extraQuestion
                  // );

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
        this.props.navigation.navigate("jobs");
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

                        Toast.show({
                          text: "Job Successfully Created !",
                          buttonText: "Okay",
                          duration: 3000,
                          position: "bottom",
                          type: "success"
                        });

                        this.props.deleteMultiplePostJobScreensState();

                        this.props.navigation.navigate("jobs");
                      } else throw new Error(response.data.createJob.msg);
                    })
                    .catch(error => {
                      this.setState({ loading: false });

                      console.log("job post errror: ", JSON.stringify(error));

                      Toast.show({
                        text: error.message,
                        buttonText: "Okay",
                        duration: 5000,
                        position: "bottom",
                        type: "danger"
                      });
                    });
                }}
              >
                <Text>Publish</Text>
              </Button>
            )}
          </ScrollView>
        </Content>
      </Container>
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
