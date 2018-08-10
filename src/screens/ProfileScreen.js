import React, { Component } from "react";
import { StyleSheet, Text } from "react-native";
import { Container, Content, Button } from "native-base";

export default class ProfileScreen extends Component {
  static navigationOptions = { header: null };
  render() {
    return (
      <Container>
        <Content contentContainerStyle={styles.contentStyle}>
          <Text>Profile Screen</Text>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  contentStyle: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center"
  }
});
