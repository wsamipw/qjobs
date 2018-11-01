import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { Container, Content, Item, Input, DatePicker } from "native-base";
import { Button } from "react-native-elements";
import { connect } from "react-redux";
import { LANGUAGE_MUTATION } from "../../config/mutations";

import { LANGUAGE_DETAILS_QUERY } from "../../config/queries";
import { compose, graphql } from "react-apollo";

import { v4 } from "uuid";

class LanguageFormScreen extends Component {
  state = {
    language: "",
    proficiency: ""
  };

  componentDidMount() {
    const data = this.props.navigation.getParam("selectedLanguage", null);

    if (data) {
      const { language, proficiency } = data;

      this.setState({
        language,
        proficiency
      });
    }
  }

  onChange = (key, val) => this.setState({ [key]: val });

  render() {
    return (
      <Container>
        <Content scrollEnabled contentContainerStyle={styles.contentStyle}>
          <Item rounded>
            <Input
              placeholder="Language"
              value={this.state.language}
              onChangeText={val => this.onChange("language", val)}
            />
          </Item>
          <Item rounded>
            <Input
              placeholder="Proficiency"
              value={this.state.proficiency}
              onChangeText={val => this.onChange("proficiency", val)}
            />
          </Item>
        </Content>
        <Button
          backgroundColor="#3F51B5"
          containerViewStyle={styles.loginButtton}
          rounded
          title={
            this.props.navigation.getParam("selectedLanguage", null)
              ? "Update"
              : "Add"
          }
          onPress={() => {
            let language = "";

            const languagesList = this.props.navigation.getParam(
              "languages",
              []
            );
            console.log("language: ", languagesList);

            const selectedLanguage = this.props.navigation.getParam(
              "selectedLanguage",
              null
            );

            if (selectedLanguage) {
              const deletedLanguageList = languagesList.filter(
                eachlanguage => eachlanguage.id !== selectedLanguage.id
              );

              language = JSON.stringify([
                ...deletedLanguageList,
                { ...this.state, id: selectedLanguage.id }
              ]);
            } else {
              language = JSON.stringify([
                ...languagesList,
                { ...this.state, id: v4() }
              ]);
            }

            this.props
              .updateUser(language)
              .then(({ data }) => {
                if (data.updateUser.msg === "success") {
                  console.log("add language success");
                  this.props.navigation.goBack();
                } else throw new Error(data.updateUser.msg);
              })
              .catch(error => {
                console.log("update error: ", error);
              });
          }}
        />
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

export default compose(
  connect(mapStateToProps),
  graphql(LANGUAGE_MUTATION, {
    props: ({ mutate }) => ({
      updateUser: language =>
        mutate({
          variables: {
            language
          },
          refetchQueries: [{ query: LANGUAGE_DETAILS_QUERY }]
        })
    })
  })
)(LanguageFormScreen);
