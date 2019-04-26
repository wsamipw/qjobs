import React, { Component } from "react";
import {
  View,
  Picker,
  RefreshControl,
  ScrollView,
  Image,
  ActivityIndicator,
  StyleSheet,
  StatusBar
} from "react-native";
import {
  Container,
  Content,
  Item,
  Input,
  DatePicker,
  Label,
  Button,
  Text
} from "native-base";
import { Divider } from "react-native-elements";
import { compose, graphql, withApollo } from "react-apollo";

import { UPDATE_USER_MUTATION } from "../../config/mutations";
import { USER_DATA, PRIMARY_COLOR } from "../../config/CONSTANTS";
import { _retrieveData, _storeData } from "../../config/utils";
import moment from "moment";

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

    user: {
      firstName: "",
      lastName: "",
      currentAddress: "",
      permanentAddress: "",
      gender: "Male",
      dateOfBirth: new Date().toJSON().slice(0, 10)
    }
  };

  async componentDidMount() {
    try {
      const user = JSON.parse(await _retrieveData(USER_DATA));

      console.log("user detai; data: ", user);

      user &&
        this.setState({
          user: {
            firstName: user.firstName ? user.firstName : "",
            lastName: user.lastName ? user.lastName : "",
            currentAddress: user.currentAddress ? user.currentAddress : "",
            permanentAddress: user.permanentAddress
              ? user.permanentAddress
              : "",
            gender: user.gender
              ? user.gender.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
              : this.state.user.gender,
            dateOfBirth: user.dateOfBirth
              ? new Date(user.dateOfBirth)
              : this.state.user.dateOfBirth
          }
        });
    } catch (err) {
      console.log("user fetch async error userdetailscreen.js: ", err);
    }
  }

  onChange = (key, val) => this.setState({ user: { [key]: val } });

  render() {
    return (
      <ScrollView scrollEnabled>
        <StatusBar barStyle="light-content" backgroundColor={PRIMARY_COLOR} />
        <Container>
          <Content scrollEnabled padder>
            <View>
              <View
                style={{
                  marginVertical: 10,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center"
                }}
              >
                <Text style={{ fontWeight: "bold" }}>Date of Birth: </Text>
                <DatePicker
                  defaultDate={new Date(this.state.user.dateOfBirth)}
                  minimumDate={new Date(1951, 1, 1)}
                  maximumDate={new Date(2051, 12, 31)}
                  locale={"en"}
                  timeZoneOffsetInMinutes={undefined}
                  modalTransparent={false}
                  animationType={"fade"}
                  androidMode={"default"}
                  placeHolderText={moment(this.state.user.dateOfBirth).format(
                    "DD/MM/YYYY"
                  )}
                  textStyle={{ color: "green" }}
                  placeHolderTextStyle={{ color: "#d3d3d3" }}
                  onDateChange={val =>
                    this.onChange("dateOfBirth", val.toJSON().slice(0, 10))
                  }
                />
              </View>
              <Divider />

              <Item floatingLabel style={styles.inputWraperStyle}>
                <Label>First Name</Label>
                <Input
                  value={this.state.user.firstName}
                  onChangeText={val => this.onChange("firstName", val)}
                />
              </Item>
              <Item floatingLabel style={styles.inputWraperStyle}>
                <Label>Last Name</Label>
                <Input
                  value={this.state.user.lastName}
                  onChangeText={val => this.onChange("lastName", val)}
                />
              </Item>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center"
                }}
              >
                <Text style={{ fontWeight: "bold" }}>Gender:</Text>
                <Picker
                  selectedValue={this.state.user.gender}
                  style={{ height: 50, width: 200 }}
                  onValueChange={gender => this.setState({ user: { gender } })}
                >
                  <Picker.Item label="Male" value="Male" />
                  <Picker.Item label="Female" value="Female" />
                  <Picker.Item label="Other" value="Other" />
                </Picker>
              </View>
              <Divider />
              <Item floatingLabel style={styles.inputWraperStyle}>
                <Label>Current Address</Label>
                <Input
                  value={this.state.user.currentAddress}
                  onChangeText={val => this.onChange("currentAddress", val)}
                />
              </Item>
              <Item floatingLabel style={styles.inputWraperStyle}>
                <Label>Permanent Address</Label>
                <Input
                  value={this.state.user.permanentAddress}
                  onChangeText={val => this.onChange("permanentAddress", val)}
                />
              </Item>

              <Button
                backgroundColor={PRIMARY_COLOR}
                disabled={this.state.loading}
                rounded
                block
                style={{
                  marginVertical: 15
                }}
                onPress={() => {
                  const { user } = this.state;

                  console.log("user state: ", user);
                  const nonNullValues = {};

                  // Iterating over objects
                  // for..in is faster than using map function
                  for (var key in user) {
                    if (user[key]) nonNullValues[key] = user[key];
                  }

                  console.log("nonNullvalue:", nonNullValues);

                  this.setState({ loading: true });

                  this.props.client
                    .mutate({
                      mutation: UPDATE_USER_MUTATION,
                      variables: nonNullValues
                    })
                    .then(async ({ data }) => {
                      console.log("response data: ", data);
                      if (data.updateUser.status === 200) {
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
                            user: {
                              firstName,
                              lastName,
                              currentAddress,
                              permanentAddress,
                              gender,
                              dateOfBirth
                            }
                          });

                          await _storeData(
                            USER_DATA,
                            JSON.stringify(data.updateUser.user)
                          );
                          this.props.navigation.state.params.refresh();
                          this.props.navigation.goBack();
                        } else throw new Error(data.updateUser.msg);
                      } else throw new Error(data.updateUser.msg);
                    })
                    .catch(error => {
                      this.setState({ loading: false });
                      console.log(
                        "user update error: ",
                        JSON.parse(error.message)
                      );
                      // Display Update Error box here i.e PopUp or Something ...
                    });
                }}
              >
                <Text>Update</Text>
              </Button>
            </View>
          </Content>
        </Container>
      </ScrollView>
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
  inputWraperStyle: {
    marginVertical: 10
  }
});

export default withApollo(UserDetailScreen);
