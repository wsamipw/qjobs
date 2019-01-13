import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  ScrollView,
  StatusBar
} from "react-native";

import { Button, ListItem, Text, Container, Content } from "native-base";
import { Card } from "react-native-elements";

import { JOB_STATUS_CHECK_QUERY } from "../../../config/queries";

import { _retrieveData } from "../../../config/utils";
import { USER_DATA, PRIMARY_COLOR } from "../../../config/CONSTANTS";

class MyJobDetailScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: `${navigation.state.params.item.name ||
        navigation.state.params.item.job.name}`,
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
      console.log("error my job detail screen.js: ", err);
    }
  }

  render() {
    const eachItem = this.props.navigation.getParam("item", null);

    return (
      <Content scrollEnabled>
        <StatusBar barStyle="light-content" backgroundColor="#ecf0f1" />
        {eachItem ? (
          <View style={styles.mainWrapper}>
            <Card>
              {/* <Text>Name: {eachItem.name}</Text> */}
              <Text style={styles.headingTextStyles}>Description</Text>
              <Text>{eachItem.description}</Text>
            </Card>
            {eachItem.extraQuestion && eachItem.extraQuestion.length > 0 && (
              <Card>
                <Text style={styles.headingTextStyles}>Extra Questions</Text>
                {eachItem.extraQuestion.map((eachExtraQuestion, index, arr) => {
                  return (
                    <ListItem
                      key={index}
                      first={index === 0}
                      last={index === arr.length - 1}
                    >
                      <Text>{eachExtraQuestion}</Text>
                    </ListItem>
                  );
                })}
              </Card>
            )}
          </View>
        ) : null}

        <Button
          backgroundColor={PRIMARY_COLOR}
          block
          style={{
            marginHorizontal: Dimensions.get("screen").width * 0.04
          }}
          onPress={() => {
            this.props.navigation.navigate("jobApplicationsList", {
              jobId: eachItem.id
            });
          }}
        >
          <Text>See Job Applications</Text>
        </Button>
      </Content>
    );
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

export default MyJobDetailScreen;
