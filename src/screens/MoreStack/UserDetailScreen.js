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

import { compose, graphql } from "react-apollo";

import styles from "../../Styles/LoginRegisterStyles";

import { UPDATE_USER_MUTATION } from "../../config/mutations";
import { USER_DATA } from "../../config/CONSTANTS";
import { _retrieveData, _storeData } from "../../config/utils";

class UserDetailScreen extends Component {
  /* Below navigationOptions need not be called or passed
   * It is static and automatically used by react-navigation
   * For details refer: https://reactnavigation.org/docs/en/headers.html
   */
  static navigationOptions = ({ navigation }) => {
    return {
      headerStyle: {
        backgroundColor: "#5968ef"
      },
      headerTitle: "User Detail",
      headerTintColor: "#ffffff"
    };
  };

  state = {
    loading: false,

    firstName: "",
    lastName: "",
    currentAddress: "",
    permanentAddress: "",
    gender: "Male",
    dateOfBirth: new Date().toJSON().slice(0, 10)
  };

  async componentDidMount() {
    try {
      const user = JSON.parse(await _retrieveData(USER_DATA));

      user &&
        this.setState({
          firstName: user.firstName ? user.firstName : "",
          lastName: user.lastName ? user.lastName : "",
          currentAddress: user.currentAddress ? user.currentAddress : "",
          permanentAddress: user.permanentAddress ? user.permanentAddress : "",
          gender: user.gender ? user.gender : this.state.gender,
          dateOfBirth: user.dateOfBirth
            ? user.dateOfBirth
            : this.state.dateOfBirth
        });
    } catch (err) {
      console.log("user fetch async error userdetailscreen.js: ", err);
    }
  }

  onChange = (key, val) => this.setState({ [key]: val });

  render() {
    return (
      <ScrollView scrollEnabled>
        <Container>
          <Content scrollEnabled contentContainerStyle={styles.contentStyle}>
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

              <Item rounded style={styles.inputWrapper}>
                <Input
                  placeholder="First Name"
                  value={this.state.firstName}
                  onChangeText={val => this.onChange("firstName", val)}
                />
              </Item>
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

              <Button
                backgroundColor="#3F51B5"
                containerViewStyle={styles.loginButtton}
                disabled={this.state.loading}
                rounded
                title="Update"
                onPress={() => {
                  const {
                    firstName,
                    lastName,
                    currentAddress,
                    permanentAddress,
                    gender,

                    dateOfBirth
                  } = this.state;

                  this.setState({ loading: true });

                  this.props
                    .updateUser(
                      firstName,
                      lastName,
                      currentAddress,
                      permanentAddress,
                      gender,

                      dateOfBirth
                    )
                    .then(async ({ data }) => {
                      if (data.updateUser.msg === "success") {
                        const {
                          firstName,
                          lastName,
                          currentAddress,
                          permanentAddress,
                          gender,
                          dateOfBirth
                        } = data.updateUser.user;

                        this.setState({
                          loading: false,
                          firstName,
                          lastName,
                          currentAddress,
                          permanentAddress,
                          gender,
                          dateOfBirth
                        });

                        await _storeData(
                          USER_DATA,
                          JSON.stringify(data.updateUser.user)
                        );
                        this.props.navigation.state.params.refresh();
                        this.props.navigation.goBack();
                      } else throw new Error(data.updateUser.msg);
                    })
                    .catch(error => {
                      this.setState({ loading: false });
                      console.log("update error: ", JSON.stringify(error));
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
  graphql(UPDATE_USER_MUTATION, {
    props: ({ mutate }) => ({
      updateUser: (
        firstName,
        lastName,
        currentAddress,
        permanentAddress,
        gender,
        dateOfBirth
      ) =>
        mutate({
          variables: {
            firstName,
            lastName,
            currentAddress,
            permanentAddress,
            gender,
            dateOfBirth
          }
        })
    })
  })
)(UserDetailScreen);
