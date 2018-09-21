import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  ToolbarAndroid,
  View
} from "react-native";
import { connect } from "react-redux";
import { Button, Card } from "react-native-elements";

class PostJobScreen4 extends Component {
  onActionSelected = position => {
    if (position === 0) {
      this.props.navigation.navigate("postJob41");
    }
  };

  render() {
    return (
      <View>
        <ToolbarAndroid
          style={styles.toolbar}
          //logo={require("../static/img/logoIcon.png")}
          title="Add Experience"
          actions={[
            {
              title: "Add",
              icon: require("../../static/img/add.png"),
              show: "always"
            }
          ]}
          onActionSelected={this.onActionSelected}
        />

        <ScrollView scrollEnabled>
          {this.props.postJobState &&
            this.props.postJobState.experience &&
            this.props.postJobState.experience.map((eachExperience, index) => (
              <Card key={index}>
                <Text>Name: {eachExperience.name}</Text>
                <Text>Time: {eachExperience.time}</Text>
              </Card>
            ))}

          <Button
            backgroundColor="#3F51B5"
            title="Next"
            onPress={() => {
              this.props.navigation.navigate("postJob5");
            }}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerToolbar: {
    flex: 1,
    //justifyContent: 'center',
    justifyContent: "flex-start",
    // https://github.com/facebook/react-native/issues/2957#event-417214498
    alignItems: "stretch",
    backgroundColor: "#F5FCFF"
  },
  toolbar: {
    backgroundColor: "#95a2b2",
    height: 30
  }
});

const mapStateToProps = ({ postJobReducer }) => {
  return { ...postJobReducer };
};

export default connect(mapStateToProps)(PostJobScreen4);
