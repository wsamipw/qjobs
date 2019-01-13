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
import { compose, graphql } from "react-apollo";

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

    firstName: "",
    lastName: "",
    currentAddress: "",
    permanentAddress: "",
    gender: "Male",
    dateOfBirth: new Date()
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
            ? new Date(user.dateOfBirth)
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
                  defaultDate={new Date(this.state.dateOfBirth)}
                  minimumDate={new Date(1951, 1, 1)}
                  maximumDate={new Date(2051, 12, 31)}
                  locale={"en"}
                  timeZoneOffsetInMinutes={undefined}
                  modalTransparent={false}
                  animationType={"fade"}
                  androidMode={"default"}
                  placeHolderText={moment(this.state.dateOfBirth).format(
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
                  value={this.state.firstName}
                  onChangeText={val => this.onChange("firstName", val)}
                />
              </Item>
              <Item floatingLabel style={styles.inputWraperStyle}>
                <Label>Last Name</Label>
                <Input
                  value={this.state.lastName}
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
                  selectedValue={this.state.gender}
                  style={{ height: 50, width: 200 }}
                  onValueChange={gender => this.setState({ gender })}
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
                  value={this.state.currentAddress}
                  onChangeText={val => this.onChange("currentAddress", val)}
                />
              </Item>
              <Item floatingLabel style={styles.inputWraperStyle}>
                <Label>Permanent Address</Label>
                <Input
                  value={this.state.permanentAddress}
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
