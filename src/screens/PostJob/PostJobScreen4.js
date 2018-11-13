import React, { Component } from "react";
import { StyleSheet, Text, ScrollView } from "react-native";
import { connect } from "react-redux";
import { Button, Card } from "react-native-elements";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import HeaderButtons, {
  HeaderButton,
  Item
} from "react-navigation-header-buttons";

/*
 * This Screen/Page is changed from `experience` to `extraquestion`
 * currently from date: 2075/07/15
 */

const MaterialIconsHeaderButton = passMeFurther => (
  // the `passMeFurther` variable here contains props from <Item .../> as well as <HeaderButtons ... />
  // and it is important to pass those props to `HeaderButton`
  // then you may add some information like icon size or color (if you use icons)
  <HeaderButton
    {...passMeFurther}
    IconComponent={MaterialCommunityIcons}
    iconSize={23}
    color="white"
  />
);
class PostJobScreen4 extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: "Extra Question",
      headerStyle: {
        backgroundColor: "#5968ef"
      },
      headerTintColor: "#ffffff",
      headerRight: (
        <HeaderButtons HeaderButtonComponent={MaterialIconsHeaderButton}>
          <Item
            title="Add Job"
            iconName="plus-circle"
            onPress={() => {
              navigation.navigate("postJob41");
            }}
          />
        </HeaderButtons>
      )
    };
  };

  render() {
    return (
      <ScrollView scrollEnabled>
        {this.props.postJobState &&
          this.props.postJobState.extraQuestion &&
          this.props.postJobState.extraQuestion.map(
            (eachExtraQuestion, index) => (
              <Card key={index}>
                <Text>Name: {eachExtraQuestion}</Text>
              </Card>
            )
          )}

        <Button
          backgroundColor="#3F51B5"
          title="Next"
          onPress={() => {
            this.props.navigation.navigate("postJob6");
          }}
        />
      </ScrollView>
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
