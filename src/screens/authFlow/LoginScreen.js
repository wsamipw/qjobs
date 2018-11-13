import React, { Component } from "react";
import {
  Platform,
  Image,
  TouchableOpacity,
  BackHandler,
  Alert
} from "react-native";
import { Container, Content, Text, View, Input, Item, Icon } from "native-base";
import { Button, SocialIcon } from "react-native-elements";

import { Constants, Location, Permissions } from "expo";
import { connect } from "react-redux";

import { compose, graphql } from "react-apollo";

import styles from "../../Styles/LoginRegisterStyles";
import { JWT_AUTH_TOKEN, LOCATION, USER_DATA } from "../../config/CONSTANTS";
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

  componentDidMount() {
    if (Platform.OS === "android" && !Constants.isDevice) {
      BackHandler.exitApp();
    } else {
      this._getLocationAsync();
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);

    if (status !== "granted") {
      console.log("not granted");
      // Alert.alert(
      //   "No Location Permission",
      //   "Please Allow the location permission to the app. Reopen the App again.",
      //   [{ text: "OK", onPress: () => BackHandler.exitApp() }]
      // );
    } else {
      console.log("granted");

      try {
        let location = await Location.getCurrentPositionAsync({});
        _storeData(LOCATION, JSON.stringify(location));
      } catch (error) {
        console.log("error location fetch login screen: ", error);
      }
    }
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
                    .then(response => {
                      console.log("data: ", response.data);

                      _storeData(JWT_AUTH_TOKEN, response.data.tokenAuth.token);
                      _storeData(
                        USER_DATA,
                        JSON.stringify(response.data.tokenAuth.user)
                      );

                      _retrieveData(USER_DATA);

                      this.props.navigation.navigate("home");
                    })
                    .catch(error =>
                      console.log("data error: ", JSON.stringify(error))
                    );

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

const mapStateToProps = ({ extraReducer }) => ({ ...extraReducer });

export default compose(
  connect(mapStateToProps),
  graphql(LOGIN_MUTATION, {
    props: ({ mutate }) => ({
      tokenAuth: (username, password) =>
        mutate({ variables: { username, password } })
    })
  })
)(LoginScreen);
