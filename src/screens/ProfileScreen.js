import React, { Component } from "react";
import { StyleSheet, Text, FlatList, ListView } from "react-native";
import { Container, Content, View } from "native-base";
import { Button, List, ListItem, Card } from "react-native-elements";
import { connect } from "react-redux";
import { _removeData } from "../config/utils";
import { JWT_AUTH_TOKEN } from "../config/CONSTANTS";

class ProfileScreen extends Component {
  static navigationOptions = { header: null };

  render() {
    return (
      <Container>
        <Content contentContainerStyle={styles.contentStyle}>
          <Text>Profile Screen</Text>
          <Button
            backgroundColor="red"
            title="Logout"
            onPress={async () => {
              await _removeData(JWT_AUTH_TOKEN);
              this.props.mainNavigation.navigate("login");
            }}
          />
          <FlatList
            data={[
              { title: "Education", key: "education" },
              { title: "Language", key: "language" },
              { title: "Social Accounts", key: "socialAccounts" },
              { title: "Reference", key: "reference" },
              { title: "Training", key: "training" },
              { title: "Work Experience", key: "workExperience" }
            ]}
            renderItem={({ item }) => {
              return (
                <View style={styles.contentStyle}>
                  <Text
                    onPress={() => {
                      console.log(item.title, " pressed");
                      this.props.navigation.navigate(item.key);
                    }}
                  >
                    {item.title}
                  </Text>
                </View>
              );
            }}
          />
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

const mapStateToProps = ({ myNavigation }) => {
  return { ...myNavigation };
};

export default connect(mapStateToProps)(ProfileScreen);
