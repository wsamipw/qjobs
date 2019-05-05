import React, { Component } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { connect } from "react-redux";
import {
  Button,
  Card,
  Text,
  Container,
  Content,
  ListItem,
  Icon
} from "native-base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import HeaderButtons, {
  HeaderButton,
  Item
} from "react-navigation-header-buttons";
import { PRIMARY_COLOR } from "../../config/CONSTANTS";

import { removeSelectedExtraQuestion } from "../../actions";

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
      <Container>
        <Content
          style={{
            padding: 16
          }}
        >
          {this.props.postJobState &&
          this.props.postJobState.extraQuestion &&
          this.props.postJobState.extraQuestion.length > 0 ? (
            <Text
              style={{
                fontWeight: "bold"
              }}
            >
              List of Extra Questions:
            </Text>
          ) : (
            <Text>
              You can add multiple Question from the header above or Skip.
            </Text>
          )}
          <ScrollView scrollEnabled>
            {this.props.postJobState &&
              this.props.postJobState.extraQuestion &&
              this.props.postJobState.extraQuestion.map(
                (eachExtraQuestion, index, arr) => (
                  <ListItem
                    key={index}
                    first={index === 0}
                    last={index === arr.length - 1}
                  >
                    <Text>{eachExtraQuestion}</Text>
                    <Icon
                      style={{ alignSelf: "flex-end" }}
                      type="MaterialIcons"
                      name="edit"
                      onPress={() => {
                        this.props.navigation.navigate("postJob41", {
                          index,
                          eachExtraQuestion
                        });
                      }}
                    />

                    <Icon
                      style={{ alignSelf: "flex-end" }}
                      type="SimpleLineIcons"
                      name="minus"
                      onPress={() => {
                        this.props.removeSelectedExtraQuestion({ index });
                      }}
                    />
                  </ListItem>
                )
              )}

            <Button
              backgroundColor={PRIMARY_COLOR}
              block
              rounded
              style={{
                marginTop: 15
              }}
              onPress={() => {
                this.props.navigation.navigate("postJob6");
              }}
            >
              <Text>
                {this.props.postJobState &&
                this.props.postJobState.extraQuestion &&
                this.props.postJobState.extraQuestion.length > 0
                  ? "Next"
                  : "Skip"}
              </Text>
            </Button>
          </ScrollView>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  containerToolbar: {
    flex: 1,
    justifyContent: "flex-start",
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

export default connect(
  mapStateToProps,
  { removeSelectedExtraQuestion }
)(PostJobScreen4);
