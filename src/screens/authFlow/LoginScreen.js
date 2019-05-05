import React, { Component } from "react";
import {
  Platform,
  Image,
  TouchableOpacity,
  BackHandler,
  StatusBar
} from "react-native";
import {
  Container,
  Content,
  Text,
  View,
  Input,
  Item,
  Icon,
  Toast
} from "native-base";
// import DropdownAlert from "react-native-dropdownalert";
import { Button, SocialIcon } from "react-native-elements";
import { Facebook } from "expo";

import { Constants, Location, Permissions } from "expo";
import { connect } from "react-redux";

import { compose, graphql, withApollo } from "react-apollo";

import styles from "../../Styles/LoginRegisterStyles";
import { JWT_AUTH_TOKEN, LOCATION, USER_DATA } from "../../config/CONSTANTS";
import { LOGIN_MUTATION, SOCIAL_AUTH_MUTATION } from "../../config/mutations";

import { _storeData, _retrieveData } from "../../config/utils";

class LoginScreen extends Component {
  state = {
    hidePass: true,
    showToast: false,

    loading: false,

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

  // componentWillUnmount() {
  //   Toast.toastInstance = null;
  // }

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

  facebookLogIn = async () => {
    try {
      const {
        type,
        token,
        expires,
        permissions,
        declinedPermissions
      } = await Facebook.logInWithReadPermissionsAsync("672251063134173", {
        permissions: ["public_profile"]
      });

      if (type === "success") {
        // Get the user's name using Facebook's Graph API
        console.log("type facebook: ", type);
        console.log("token facebook: ", token);

        this.props.client
          .mutate({
            mutation: SOCIAL_AUTH_MUTATION,
            variables: {
              accessToken: token,
              provider: "facebook"
            }
          })
          .then(response => {
            console.log("response faceboook: ", response);

            _storeData(JWT_AUTH_TOKEN, response.data.socialAuth.token);
            _storeData(
              USER_DATA,
              JSON.stringify(response.data.socialAuth.user)
            );

            _retrieveData(JWT_AUTH_TOKEN);
            _retrieveData(USER_DATA);

            this.props.navigation.navigate("home");
          })
          .catch(error => {
            console.log("facebook errro:", error);

            Toast.show({
              text: "Error Logging Facebook !",
              buttonText: "Okay",
              duration: 5000,
              position: "bottom",
              type: "danger"
            });
          });
      } else {
        // type === 'cancel'
        console.log("err type: ", type);
      }
    } catch ({ message }) {
      console.log(`Facebook Login Error: ${message}`);
    }
  };

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
              loading={this.state.loading}
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

                if (username && password) {
                  this.setState({ loading: true }, () => {
                    this.props.client
                      .mutate({
                        mutation: LOGIN_MUTATION,
                        variables: {
                          username,
                          password
                        }
                      })
                      .then(response => {
                        console.log("data: ", response.data);

                        _storeData(
                          JWT_AUTH_TOKEN,
                          response.data.tokenAuth.token
                        );
                        _storeData(
                          USER_DATA,
                          JSON.stringify(response.data.tokenAuth.user)
                        );

                        // _retrieveData(JWT_AUTH_TOKEN);
                        // _retrieveData(USER_DATA);

                        this.setState({ loading: false });

                        this.props.navigation.navigate("home");
                      })
                      .catch(error => {
                        console.log("data error: ", JSON.stringify(error));
                        // this.dropdown.alertWithType(
                        //   "error",
                        //   "Login Error",
                        //   "Please, enter valid credentials"
                        // );

                        this.setState({ loading: false });

                        Toast.show({
                          text: "Please enter valid credentials!",
                          buttonText: "Okay",
                          duration: 3000,
                          position: "bottom",
                          type: "danger"
                        });
                      });

                    {
                      /* this.props.navigation.navigate("home"); */
                    }
                  });
                }
              }}
            />

            <View style={styles.socialLoginWrapper}>
              <SocialIcon
                style={styles.SocialloginButtton}
                title="Sign In With Facebook"
                button
                type="facebook"
                onPress={async () => {
                  console.log("facebbok login presed");
                  await this.facebookLogIn();
                }}
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
          {/* <DropdownAlert
            // zIndex={99}
            elevation={1}
            translucent={false}
            defaultContainer={{
              padding: 8,
              paddingTop: StatusBar.currentHeight,
              flexDirection: "row"
            }}
            containerStyle={{
              backgroundColor: "#cc3232",
              padding: 20,
              elevation: 1
            }}
            ref={ref => (this.dropdown = ref)}
          /> */}
        </Content>
        {/* <DropdownAlert ref={ref => (this.dropdown = ref)} /> */}
      </Container>
    );
  }
}

const mapStateToProps = ({ extraReducer }) => ({ ...extraReducer });

export default compose(
  connect(mapStateToProps),
  withApollo
)(LoginScreen);
