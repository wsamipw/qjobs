import React, { Component } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { Container, Content, Item, Input, Icon } from "native-base";
import { Button } from "react-native-elements";
import styles from "../../Styles/LoginRegisterStyles";

import { compose, graphql } from "react-apollo";

import { JWT_AUTH_TOKEN } from "../../config/CONSTANTS";
import { REGISTER_MUTATION } from "../../config/mutations";

import { _storeData, _retrieveData } from "../../config/utils";

class RegisterScreen extends Component {
  state = {
    hidePass: true,

    username: "Dudeeee",
    password: "asdf1234567",
    confirm_password: "asdf1234567",
    email: "apq@asda.adasd",

    errorUsername: "",
    errorPassword: "",
    errorEmail: "",
    errorPasswordMismatch: ""
  };

  togglePassVisisble = () => {
    this.setState({
      hidePass: !this.state.hidePass
    });
  };

  onChange = (key, val) => this.setState({ [key]: val });

  render() {
    return (
      <Container>
        <Content contentContainerStyle={styles.contentStyle}>
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%"
            }}
          >
            <Image
              source={require("../../static/img/loginBg.jpg")}
              style={styles.backgroundImage}
            />
          </View>
          <View style={styles.overlay} />
          <View style={styles.mainContent}>
            <Image
              source={require("../../static/img/logoIconWhite.png")}
              style={styles.logo}
            />
            {/* <Item rounded style={styles.inputWrapper}>
              <Input
                selectionColor="rgba(255,255,255,0.5)"
                placeholder="Full name"
                style={styles.inputStyles}
              />
            </Item> */}
            <Item rounded style={styles.inputWrapper}>
              <Input
                selectionColor="rgba(255,255,255,0.5)"
                placeholder="Email"
                style={styles.inputStyles}
                value={this.state.email}
                onChangeText={val => this.onChange("email", val)}
              />
            </Item>
            <Text>{this.state.errorEmail}</Text>

            <Item rounded style={styles.inputWrapper}>
              <Input
                selectionColor="rgba(255,255,255,0.5)"
                placeholder="Username"
                value={this.state.username}
                onChangeText={val => this.onChange("username", val)}
                style={styles.inputStyles}
              />
            </Item>
            <Text>{this.state.errorUsername}</Text>

            <Item rounded style={styles.inputWrapper}>
              <Input
                selectionColor="rgba(255,255,255,0.5)"
                placeholder="Password"
                secureTextEntry={this.state.hidePass}
                style={styles.inputStyles}
                value={this.state.password}
                onChangeText={val => this.onChange("password", val)}
              />
              <TouchableOpacity onPress={this.togglePassVisisble}>
                <Icon
                  name={this.state.hidePass ? "eye" : "eye-off"}
                  style={styles.showPassIcon}
                />
              </TouchableOpacity>
            </Item>
            <Text>{this.state.errorPassword}</Text>

            {this.state.hidePass ? (
              <Item rounded style={styles.inputWrapper}>
                <Input
                  selectionColor="rgba(255,255,255,0.5)"
                  placeholder="Confirm Password"
                  secureTextEntry={this.state.hidePass}
                  style={styles.inputStyles}
                  value={this.state.confirm_password}
                  onChangeText={val => this.onChange("confirm_password", val)}
                />
              </Item>
            ) : null}
            <Text>{this.state.errorPasswordMismatch}</Text>

            <Button
              backgroundColor="#3F51B5"
              containerViewStyle={styles.loginButtton}
              rounded
              title="Register"
              onPress={() => {
                const {
                  username,
                  password,
                  confirm_password,
                  email
                } = this.state;

                if (!username)
                  this.setState({
                    errorUsername: "Please Enter Your Username"
                  });
                else
                  this.setState({
                    errorUsername: ""
                  });

                if (!password)
                  this.setState({
                    errorPassword: "Please Enter Your Password"
                  });
                else
                  this.setState({
                    errorPassword: ""
                  });

                if (!email)
                  this.setState({
                    errorEmail: "Please Enter Your Email"
                  });
                else
                  this.setState({
                    errorEmail: ""
                  });
                if (password !== confirm_password)
                  this.setState({
                    errorPasswordMismatch: "Password do not match"
                  });
                else
                  this.setState({
                    errorPasswordMismatch: ""
                  });

                if (username && password && email)
                  if (password === confirm_password)
                    this.props
                      .createUser(email, password, username)
                      .then(response => {
                        console.log("data: ", response.data);
                        if (response.data.createUser.msg === "success") {
                          _storeData(
                            JWT_AUTH_TOKEN,
                            response.data.createUser.token
                          );
                          _retrieveData(JWT_AUTH_TOKEN);

                          this.props.navigation.navigate("home");
                        } else throw new Error(response);
                      })
                      .catch(error =>
                        console.log("data error: ", JSON.stringify(error))
                      );
              }}
            />
            <View style={styles.bottomTextWrapper}>
              <Text style={styles.bottomText}>Privacy Policy</Text>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("login")}
              >
                <Text style={styles.bottomText}>
                  Already Registered? Sign in
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Content>
      </Container>
    );
  }
}

export default compose(
  graphql(REGISTER_MUTATION, {
    props: ({ mutate }) => ({
      createUser: (email, password, username) =>
        mutate({ variables: { email, password, username } })
    })
  })
)(RegisterScreen);
