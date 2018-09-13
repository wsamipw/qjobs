import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { Container, Content, Item, Input, DatePicker } from "native-base";
import { Button } from "react-native-elements";
import { connect } from "react-redux";
import { LANGUAGE_DETAILS_QUERY } from "./LanguageScreen";

import { compose, graphql } from "react-apollo";
import gql from "graphql-tag";

import { v4 } from "uuid";

export const LANGUAGE_MUTATION = gql`
  mutation LanguageMutation($language: JSONString!) {
    updateUser(language: $language) {
      msg
      status
    }
  }
`;

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
              selectionColor="rgba(255,255,255,0.5)"
              placeholder="Language"
              value={this.state.language}
              onChangeText={val => this.onChange("language", val)}
            />
          </Item>
          <Item rounded>
            <Input
              selectionColor="rgba(255,255,255,0.5)"
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

const mapStateToProps = ({ myNavigation }) => {
  return { ...myNavigation };
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
