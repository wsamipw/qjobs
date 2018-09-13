import React, { Component } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { Container, Content, Item, Input, Icon } from "native-base";
import { Button } from "react-native-elements";
import styles from "../../Styles/LoginRegisterStyles";

export default class RegisterScreen extends Component {
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
                placeholder="Full name"
                style={styles.inputStyles}
              />
            </Item>
            <Item rounded style={styles.inputWrapper}>
              <Input
                selectionColor="rgba(255,255,255,0.5)"
                placeholder="Email"
                style={styles.inputStyles}
              />
            </Item>
            <Item rounded style={styles.inputWrapper}>
              <Input
                selectionColor="rgba(255,255,255,0.5)"
                placeholder="Username"
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
            {this.state.hidePass ? (
              <Item rounded style={styles.inputWrapper}>
                <Input
                  selectionColor="rgba(255,255,255,0.5)"
                  placeholder="Confirm Password"
                  secureTextEntry={this.state.hidePass}
                  style={styles.inputStyles}
                />
              </Item>
            ) : null}

            <Button
              backgroundColor="#3F51B5"
              containerViewStyle={styles.loginButtton}
              rounded
              title="Register"
              onPress={() => this.props.navigation.navigate("home")}
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
