import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  Dimensions
} from "react-native";
import { Container, Content, Button, Item, Input, Icon } from "native-base";

export default class SearchResultScreen extends Component {
  static navigationOptions = {
    title: "Search Result",
    headerStyle: {
      backgroundColor: "#5968ef"
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold"
    }
  };
  render() {
    return (
      <Container>
        <StatusBar barStyle="light-content" backgroundColor="#ecf0f1" />
        <Content contentContainerStyle={styles.contentStyle}>
          <View style={styles.mainWrapper}>
            <Text>Result Screen</Text>
          </View>
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
  },
  mainWrapper: {
    flex: 1,
    marginTop: Dimensions.get("window").height * 0.1,
    width: Dimensions.get("screen").width * 0.8,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  logo: {
    height: 80,
    width: 80,
    resizeMode: "contain",
    marginBottom: 26
  },
  inputStyles: {
    paddingLeft: 15,
    flex: 1
    // borderRadius: 50
  }
});
