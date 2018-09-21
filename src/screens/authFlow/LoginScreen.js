import React, { Component } from "react";
import { StyleSheet, Image, Dimensions, TouchableOpacity } from "react-native";
import { Container, Content, Text, View, Input, Item, Icon } from "native-base";
import { Button, SocialIcon } from "react-native-elements";

import { graphql } from "react-apollo";

import styles from "../../Styles/LoginRegisterStyles";
import { JWT_AUTH_TOKEN } from "../../config/CONSTANTS";
import { LOGIN_MUTATION } from "../../config/mutations";

import { _storeData, _retrieveData } from "../../config/utils";

class LoginScreen extends Component {
  state = {
    hidePass: true,

    username: "",
    password: "",

    errorUsername: "",
    errorPassword: ""
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
            <Item rounded style={styles.inputWrapper}>
              <Input
                selectionColor="rgba(255,255,255,0.5)"
                placeholder="Email/Username"
                style={styles.inputStyles}
                value={this.state.username}
                onChangeText={val => this.onChange("username", val)}
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

            <Button
              backgroundColor="#3F51B5"
              containerViewStyle={styles.loginButtton}
              rounded
              title="Login"
              onPress={() => {
                const { username, password } = this.state;

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

                if (username && password)
                  this.props
                    .tokenAuth(username, password)
                    .then(({ data }) => {
                      console.log("data: ", data);
                      _storeData(JWT_AUTH_TOKEN, data.tokenAuth.token);
                      _retrieveData(JWT_AUTH_TOKEN);
                      this.props.navigation.navigate("home");
                    })
                    .catch(error => console.log("data error: ", error));

                {
                  /* this.props.navigation.navigate("home"); */
                }
              }}
            />

            <View style={styles.socialLoginWrapper}>
              <SocialIcon
                style={styles.SocialloginButtton}
                title="Sign In With Facebook"
                button
                type="facebook"
              />
              <SocialIcon
                style={styles.SocialloginButtton}
                title="Sign In With Google"
                button
                type="google-plus-official"
              />
            </View>
            <View style={styles.bottomTextWrapper}>
              <Text style={styles.bottomText}>Forgot Password</Text>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("register")}
              >
                <Text style={styles.bottomText}>New here? Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Content>
      </Container>
    );
  }
}

export default graphql(LOGIN_MUTATION, {
  props: ({ mutate }) => ({
    tokenAuth: (username, password) =>
      mutate({ variables: { username, password } })
  })
})(LoginScreen);
