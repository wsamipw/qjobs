import React, { Component } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { Button } from "native-base";
import ParallaxScrollView from "react-native-parallax-scroll-view";

class SearchDetailScreen extends Component {
  // To disable the default header
  // static navigationOptions = { header: null };

  render() {
    const item = this.props.navigation.getParam("item", null);
    const key = this.props.navigation.getParam("key", null);
    console.log('key, ", ', key);
    return (
      <View style={{ height: 500 }}>
        <Text>Id: {item.id}</Text>
        <Text>Name: {item.name}</Text>
        <Text>Type of Job: {item.typeOfJob}</Text>

        {key !== "myJobs" && (
          <Button
            rounded
            block
            onPress={() => this.props.navigation.navigate("applyJob", { item })}
          >
            <Text>Apply Job</Text>
          </Button>
        )}
      </View>
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

export default SearchDetailScreen;
