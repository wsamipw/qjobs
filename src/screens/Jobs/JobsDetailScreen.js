import React, { Component } from "react";
import { StyleSheet, Text } from "react-native";
import { Container, Content, Button } from "native-base";

export default class JobsDetailScreen extends Component {
  render() {
    return (
      <Container>
        <Content contentContainerStyle={styles.contentStyle}>
          <Button block onPress={() => this.props.navigation.navigate("login")}>
            <Text>Go to Login</Text>
          </Button>
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
