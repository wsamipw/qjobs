import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  ScrollView,
  StatusBar
} from "react-native";

import { Button, ListItem, Text } from "native-base";
import { Card } from "react-native-elements";

import { _retrieveData } from "../../config/utils";
import { USER_DATA, PRIMARY_COLOR } from "../../config/CONSTANTS";

class SearchDetailScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: `${navigation.state.params.item.properties.name ||
        navigation.state.params.item.properties.jobTitle.name}`,
      headerStyle: {
        backgroundColor: "#5968ef"
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold"
      }
    };
  };

  state = {
    // LoggedIn user id
    id: ""
  };

  async componentDidMount() {
    try {
      const user = JSON.parse(await _retrieveData(USER_DATA));
      user && this.setState({ id: user.id });
    } catch (err) {
      console.log("error searchdetailscreen.js: ", err);
    }
  }

  render() {
    const eachItem = this.props.navigation.getParam("item", null);
    const jobStatus = this.props.navigation.getParam("jobStatus", null);

    return eachItem ? (
      <ScrollView scrollEnabled>
        <View style={styles.mainWrapper}>
          <StatusBar barStyle="light-content" backgroundColor={PRIMARY_COLOR} />
          <Card>
            {/* <Text>Name: {eachItem.name}</Text> */}
            <Text style={styles.headingTextStyles}>Description</Text>
            <Text>{eachItem.properties.description}</Text>
          </Card>
          {eachItem.properties.extraQuestion &&
            eachItem.properties.extraQuestion.length > 0 && (
              <Card>
                <Text style={styles.headingTextStyles}>Extra Questions</Text>
                {eachItem.properties.extraQuestion.map(
                  (eachExtraQuestion, index, arr) => {
                    return (
                      <ListItem
                        key={index}
                        first={index === 0}
                        last={index === arr.length - 1}
                      >
                        <Text>{eachExtraQuestion}</Text>
                      </ListItem>
                    );
                  }
                )}
              </Card>
            )}

          {eachItem.properties.applyjobquestionsSet &&
            eachItem.properties.applyjobquestionsSet.length > 0 && (
              <Card>
                <Text style={styles.headingTextStyles}>Extra Questions</Text>
                {eachItem.properties.applyjobquestionsSet.map(
                  (eachExtraQuestion, index, arr) => {
                    return (
                      <ListItem
                        key={index}
                        first={index === 0}
                        last={index === arr.length - 1}
                      >
                        <Text>Question: {eachExtraQuestion.question}</Text>
                        <Text>Answer: {eachExtraQuestion.answer}</Text>
                      </ListItem>
                    );
                  }
                )}
              </Card>
            )}

          {!jobStatus ? (
            <View
              style={{
                marginTop: 10,
                marginHorizontal: Dimensions.get("screen").width * 0.05
              }}
            >
              <Button
                rounded
                block
                onPress={() =>
                  this.props.navigation.navigate("applyJob", { item: eachItem })
                }
              >
                <Text>Apply</Text>
              </Button>
            </View>
          ) : (
            <View
              style={{
                marginTop: 10,
                marginHorizontal: Dimensions.get("screen").width * 0.05
              }}
            >
              <Button rounded block>
                <Text>{jobStatus}</Text>
              </Button>
            </View>
          )}
        </View>
      </ScrollView>
    ) : null;
  }
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    marginBottom: 10
    // marginTop: Dimensions.get("window").height * 0.05,
    // marginLeft: Dimensions.get("screen").width * 0.05,
    // marginRight: Dimensions.get("screen").width * 0.05
  },
  headingTextStyles: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 8
  },
  renderCheckmarksWrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  statusBtnStyles: {
    marginVertical: 6
  },
  statusBtnStylesAppliedJobs: {
    marginVertical: 6,
    marginHorizontal: Dimensions.get("screen").width * 0.04
  }
});

export default SearchDetailScreen;
