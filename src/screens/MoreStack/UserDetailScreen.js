import React, { Component } from "react";
import {
  View,
  Picker,
  RefreshControl,
  ScrollView,
  Text,
  Image,
  ActivityIndicator
} from "react-native";
import { Container, Content, Item, Input, DatePicker } from "native-base";
import { Button } from "react-native-elements";

import { compose, graphql, withApollo } from "react-apollo";

import styles from "../../Styles/LoginRegisterStyles";

import { UPDATE_USER_MUTATION } from "../../config/mutations";
import { USER_DETAILS_QUERY } from "../../config/queries";

class UserDetailScreen extends Component {
  /* Below navigationOptions need not be called or passed
   * It is static and automatically used by react-navigation
   * For details refer: https://reactnavigation.org/docs/en/headers.html
   */
  static navigationOptions = ({ navigation }) => {
    return {
      // `headerLeft` and `headerRight` needed to align `headerTitle` exactly at center
      headerLeft: <View />,
      headerRight: <View />,
      headerStyle: {
        backgroundColor: "#5968ef"
      },
      headerTitle: (
        <View
          style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}
        >
          <Image
            source={require("../../static/img/logoIconMin.png")}
            style={{
              width: 50,
              height: 50,
              resizeMode: "contain",
              alignSelf: "center"
            }}
          />
        </View>
      )
    };
  };

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
    // nationality: "",
    // religion: "",
    dateOfBirth: new Date().toJSON().slice(0, 10)
    // disability: false
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
          // nationality,
          // religion,
          dateOfBirth
          // disability
        } = response.data.me;

        this.setState({
          loading: false,
          fetchError: false,

          firstName,
          lastName,
          currentAddress,
          permanentAddress,
          gender,
          // nationality,
          // religion,
          dateOfBirth
          // disability
        });

        // A Callback function to change ``refreshing`` state status ...
        if (callback) callback();
      })
      .catch(error => {
        console.log("error fetchting data: ", JSON.stringify(error));
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
      return <ActivityIndicator size="large" color="#ff6347" />;
    }

    if (this.state.fetchError) {
      // Display Error Message PopUp or Something ...
      console.log("fetch errror: ", this.state.fetchError);
      return null;
    } else
      return (
        <ScrollView scrollEnabled>
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
                    this.onChange("dateOfBirth", val.toJSON().slice(0, 10))
                  }
                />
                {/* <CheckBox
                  title="Disability: "
                  checked={this.state.disability}
                  onPress={() =>
                    this.setState({ disability: !this.state.disability })
                  }
                /> */}
                {/* <Item rounded style={styles.inputWrapper}>
                <Input
                  placeholder="First Name"
                  value={this.state.firstName}
                  onChangeText={val => this.onChange("firstName", val)}
                />
              </Item> */}
                <Item rounded style={styles.inputWrapper}>
                  <Input
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
                    placeholder="Current Address"
                    value={this.state.currentAddress}
                    onChangeText={val => this.onChange("currentAddress", val)}
                  />
                </Item>
                <Item rounded style={styles.inputWrapper}>
                  <Input
                    placeholder="Permanent Address"
                    value={this.state.permanentAddress}
                    onChangeText={val => this.onChange("permanentAddress", val)}
                  />
                </Item>
                {/* <Item rounded style={styles.inputWrapper}>
              <Input
                placeholder="Contact Number"
                value={this.state.contactNumber}
                onChangeText={val => this.onChange("contactNumber", val)}
              />
            </Item> */}
                {/* <Item rounded style={styles.inputWrapper}>
              <Input
                placeholder="Gender"
                value={this.state.gender}
                onChangeText={val => this.onChange("gender", val)}
              />
            </Item> */}
                {/* <Item rounded style={styles.inputWrapper}>
                  <Input
                    placeholder="Nationality"
                    value={this.state.nationality}
                    onChangeText={val => this.onChange("nationality", val)}
                  />
                </Item> */}
                {/* <Item rounded style={styles.inputWrapper}>
                  <Input
                    placeholder="Religion"
                    value={this.state.religion}
                    onChangeText={val => this.onChange("religion", val)}
                  />
                </Item> */}
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
                      //nationality,
                      //religion,
                      dateOfBirth
                      //disability
                    } = this.state;

                    console.log("date: ", dateOfBirth);
                    this.props
                      .updateUser(
                        firstName,
                        lastName,
                        currentAddress,
                        permanentAddress,
                        gender,
                        //nationality,
                        //religion,
                        dateOfBirth
                        //disability
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
                            //nationality,
                            //religion,
                            dateOfBirth
                            //disability
                          } = data.updateUser.user;

                          this.setState({
                            firstName,
                            lastName,
                            currentAddress,
                            permanentAddress,
                            gender,
                            //nationality,
                            //religion,
                            dateOfBirth
                            //disability
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
        </ScrollView>
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
        //nationality,
        //religion,
        dateOfBirth
        //disability
      ) =>
        mutate({
          variables: {
            firstName,
            lastName,
            currentAddress,
            permanentAddress,
            gender,
            //nationality,
            //religion,
            dateOfBirth
            //disability
          }
        })
    })
  })
)(UserDetailScreen);
