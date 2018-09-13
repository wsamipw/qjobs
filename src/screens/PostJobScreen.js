import React, { Component } from "react";
import { StyleSheet, Text, View, Picker, RefreshControl } from "react-native";
import { Container, Content, Item, Input, DatePicker } from "native-base";
import { Button, CheckBox } from "react-native-elements";

import { compose, graphql, withApollo } from "react-apollo";
import gql from "graphql-tag";

import styles from "../Styles/LoginRegisterStyles";

const USER_DETAILS_QUERY = gql`
  {
    me {
      firstName
      lastName
      currentAddress
      permanentAddress
      gender
      nationality
      religion
      dateOfBirth
      disability
    }
  }
`;

const UPDATE_USER_MUTATION = gql`
  mutation UpdateUserMutation(
    $firstName: String!
    $lastName: String!
    $currentAddress: String!
    $permanentAddress: String!
    $gender: String!
    $nationality: String!
    $religion: String!
    $dateOfBirth: Date!
    $disability: Boolean!
  ) {
    updateUser(
      firstName: $firstName
      lastName: $lastName
      currentAddress: $currentAddress
      permanentAddress: $permanentAddress
      gender: $gender
      nationality: $nationality
      religion: $religion
      dateOfBirth: $dateOfBirth
      disability: $disability
    ) {
      user {
        firstName
        lastName
        currentAddress
        permanentAddress
        gender
        nationality
        religion
        dateOfBirth
        disability
      }
      msg
      status
    }
  }
`;

class PostJobScreen extends Component {
  static navigationOptions = { header: null };

  state = {
    // loading displayed until the query data is fetched
    loading: true,
    fetchError: true,

    // used when user manually refreshes the data
    refreshing: false,

    firstName: "",
    lastName: "",
    currentAddress: "",
    permanentAddress: "",
    gender: "Male",
    nationality: "",
    religion: "",
    dateOfBirth: new Date().toJSON().slice(0, 10),
    disability: false
  };

  componentDidMount() {
    this.onQueryFetch();
  }

  onChange = (key, val) => this.setState({ [key]: val });

  onQueryFetch = callback =>
    this.props.client
      .query({
        query: USER_DETAILS_QUERY,
        fetchPolicy: "no-cache"
      })
      .then(response => {
        console.log("data: ", response);
        const {
          firstName,
          lastName,
          currentAddress,
          permanentAddress,
          gender,
          nationality,
          religion,
          dateOfBirth,
          disability
        } = response.data.me;

        this.setState({
          loading: false,
          fetchError: false,

          firstName,
          lastName,
          currentAddress,
          permanentAddress,
          gender,
          nationality,
          religion,
          dateOfBirth,
          disability
        });

        // A Callback function to change ``refreshing`` state status ...
        if (callback) callback();
      })
      .catch(error => {
        console.log("error fetchting data: ", error);
        this.setState({ loading: false, fetchError: true });

        // A Callback function to change ``refreshing`` state status ...
        if (callback) callback();
      });

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.onQueryFetch(() => this.setState({ refreshing: false }));
  };

  render() {
    if (this.state.loading) {
      console.log("loading ...");
      return null;
    }

    if (this.state.fetchError) {
      // Display Error Message PopUp or Something ...
    } else
      return (
        <Container>
          <Content
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
            scrollEnabled
            contentContainerStyle={styles.contentStyle}
          >
            <View style={styles.mainContent}>
              <DatePicker
                defaultDate={new Date(this.state.dateOfBirth)}
                minimumDate={new Date(1951, 1, 1)}
                maximumDate={new Date(2018, 12, 31)}
                locale={"en"}
                timeZoneOffsetInMinutes={undefined}
                modalTransparent={false}
                animationType={"fade"}
                androidMode={"default"}
                placeHolderText="Select date"
                textStyle={{ color: "green" }}
                placeHolderTextStyle={{ color: "#d3d3d3" }}
                onDateChange={val =>
                  this.onChange("dateOfBirth", val.toJSON().slice(0, 10))
                }
              />
              <CheckBox
                title="Disability: "
                checked={this.state.disability}
                onPress={() =>
                  this.setState({ disability: !this.state.disability })
                }
              />
              {/* <Item rounded style={styles.inputWrapper}>
                <Input
                  selectionColor="rgba(255,255,255,0.5)"
                  placeholder="First Name"
                  value={this.state.firstName}
                  onChangeText={val => this.onChange("firstName", val)}
                />
              </Item> */}
              <Item rounded style={styles.inputWrapper}>
                <Input
                  selectionColor="rgba(255,255,255,0.5)"
                  placeholder="Last Name"
                  value={this.state.lastName}
                  onChangeText={val => this.onChange("lastName", val)}
                />
              </Item>
              <Picker
                selectedValue={this.state.gender}
                style={{ height: 50, width: 200 }}
                onValueChange={gender => this.setState({ gender })}
              >
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
                <Picker.Item label="Other" value="Other" />
              </Picker>
              <Item rounded style={styles.inputWrapper}>
                <Input
                  selectionColor="rgba(255,255,255,0.5)"
                  placeholder="Current Address"
                  value={this.state.currentAddress}
                  onChangeText={val => this.onChange("currentAddress", val)}
                />
              </Item>
              <Item rounded style={styles.inputWrapper}>
                <Input
                  selectionColor="rgba(255,255,255,0.5)"
                  placeholder="Permanent Address"
                  value={this.state.permanentAddress}
                  onChangeText={val => this.onChange("permanentAddress", val)}
                />
              </Item>
              {/* <Item rounded style={styles.inputWrapper}>
              <Input
                selectionColor="rgba(255,255,255,0.5)"
                placeholder="Contact Number"
                value={this.state.contactNumber}
                onChangeText={val => this.onChange("contactNumber", val)}
              />
            </Item> */}
              {/* <Item rounded style={styles.inputWrapper}>
              <Input
                selectionColor="rgba(255,255,255,0.5)"
                placeholder="Gender"
                value={this.state.gender}
                onChangeText={val => this.onChange("gender", val)}
              />
            </Item> */}
              <Item rounded style={styles.inputWrapper}>
                <Input
                  selectionColor="rgba(255,255,255,0.5)"
                  placeholder="Nationality"
                  value={this.state.nationality}
                  onChangeText={val => this.onChange("nationality", val)}
                />
              </Item>
              <Item rounded style={styles.inputWrapper}>
                <Input
                  selectionColor="rgba(255,255,255,0.5)"
                  placeholder="Religion"
                  value={this.state.religion}
                  onChangeText={val => this.onChange("religion", val)}
                />
              </Item>
              <Button
                backgroundColor="#3F51B5"
                containerViewStyle={styles.loginButtton}
                rounded
                title="Update"
                onPress={() => {
                  const {
                    firstName,
                    lastName,
                    currentAddress,
                    permanentAddress,
                    gender,
                    nationality,
                    religion,
                    dateOfBirth,
                    disability
                  } = this.state;

                  console.log("date: ", dateOfBirth);
                  this.props
                    .updateUser(
                      firstName,
                      lastName,
                      currentAddress,
                      permanentAddress,
                      gender,
                      nationality,
                      religion,
                      dateOfBirth,
                      disability
                    )
                    .then(({ data }) => {
                      console.log("update dat:", data);
                      if (data.updateUser.msg === "success") {
                        const {
                          firstName,
                          lastName,
                          currentAddress,
                          permanentAddress,
                          gender,
                          nationality,
                          religion,
                          dateOfBirth,
                          disability
                        } = data.updateUser.user;

                        this.setState({
                          firstName,
                          lastName,
                          currentAddress,
                          permanentAddress,
                          gender,
                          nationality,
                          religion,
                          dateOfBirth,
                          disability
                        });
                      } else throw new Error(data.updateUser.msg);
                    })
                    .catch(error => {
                      console.log("update error: ", error);
                      // Display Update Error box here i.e PopUp or Something ...
                    });
                }}
              />
            </View>
          </Content>
        </Container>
      );
  }
}

// const styles = StyleSheet.create({
//   contentStyle: {
//     flex: 1,
//     flexDirection: "column",
//     justifyContent: "flex-start",
//     alignItems: "center"
//   }
// });

export default compose(
  withApollo,
  graphql(UPDATE_USER_MUTATION, {
    props: ({ mutate }) => ({
      updateUser: (
        firstName,
        lastName,
        currentAddress,
        permanentAddress,
        gender,
        nationality,
        religion,
        dateOfBirth,
        disability
      ) =>
        mutate({
          variables: {
            firstName,
            lastName,
            currentAddress,
            permanentAddress,
            gender,
            nationality,
            religion,
            dateOfBirth,
            disability
          }
        })
    })
  })
)(PostJobScreen);
