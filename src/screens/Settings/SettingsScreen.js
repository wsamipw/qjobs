import React, { Component } from "react";
import { StyleSheet, Text, FlatList, ListView } from "react-native";
import { Container, Content, View, Button } from "native-base";
import { connect } from "react-redux";

class SettingsScreen extends Component {
  render() {
    return (
      <Container>
        <Content contentContainerStyle={styles.contentStyle}>
          {/* <FlatList
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
          /> */}

          <Button
            //style={styles.searchButtton}
            rounded
            block
            onPress={() => {
              this.props.navigation.navigate("createUserPro");
            }}
          >
            <Text uppercase={false}>CreateUserPro</Text>
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

const mapStateToProps = ({ myNavigationReducer }) => {
  return { ...myNavigationReducer };
};

export default connect(mapStateToProps)(SettingsScreen);
