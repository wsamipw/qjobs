import React, { Component } from "react";
import { StyleSheet, Image, Dimensions, TouchableOpacity } from "react-native";
import { Container, Content, Text, View, Input, Item, Icon } from "native-base";
import { Button, SocialIcon } from "react-native-elements";
import styles from "../../Styles/LoginRegisterStyles";
export default class LoginScreen extends Component {
  state = {
    hidePass: true
  };
  togglePassVisisble = () => {
    this.setState({
      hidePass: !this.state.hidePass
    });
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
              />
            </Item>
            <Item rounded style={styles.inputWrapper}>
              <Input
                selectionColor="rgba(255,255,255,0.5)"
                placeholder="Password"
                secureTextEntry={this.state.hidePass}
                style={styles.inputStyles}
              />
              <TouchableOpacity onPress={this.togglePassVisisble}>
                <Icon
                  name={this.state.hidePass ? "eye" : "eye-off"}
                  style={styles.showPassIcon}
                />
              </TouchableOpacity>
            </Item>
            <Button
              backgroundColor="#3F51B5"
              containerViewStyle={styles.loginButtton}
              rounded
              title="Login"
              onPress={() => this.props.navigation.navigate("home")}
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
