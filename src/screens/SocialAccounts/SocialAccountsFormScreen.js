import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { Container, Content, Item, Input, DatePicker } from "native-base";
import { Button } from "react-native-elements";
import { connect } from "react-redux";
import { SOCIAL_ACCOUNTS_MUTATION } from "../../config/mutations";

import { SOCIAL_ACCOUNTS_DETAILS_QUERY } from "../../config/queries";

import { compose, graphql } from "react-apollo";

import { v4 } from "uuid";

class SocialAccountsFormScreen extends Component {
  state = {
    socialSite: "",
    url: ""
  };

  componentDidMount() {
    const data = this.props.navigation.getParam("selectedSocialAccounts", null);

    if (data) {
      const { socialSite, url } = data;

      this.setState({
        socialSite,
        url
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
              placeholder="Social Site"
              value={this.state.socialSite}
              onChangeText={val => this.onChange("socialSite", val)}
            />
          </Item>
          <Item rounded>
            <Input
              placeholder="URL"
              value={this.state.url}
              onChangeText={val => this.onChange("url", val)}
            />
          </Item>
        </Content>
        <Button
          backgroundColor="#3F51B5"
          containerViewStyle={styles.loginButtton}
          rounded
          title={
            this.props.navigation.getParam("selectedSocialAccounts", null)
              ? "Update"
              : "Add"
          }
          onPress={() => {
            let socialAccounts = "";

            const socialAccountssList = this.props.navigation.getParam(
              "socialAccountss",
              []
            );
            const selectedSocialAccounts = this.props.navigation.getParam(
              "selectedSocialAccounts",
              null
            );

            if (selectedSocialAccounts) {
              const deletedSocialAccountsList = socialAccountssList.filter(
                eachsocialAccounts =>
                  eachsocialAccounts.id !== selectedSocialAccounts.id
              );

              socialAccounts = JSON.stringify([
                ...deletedSocialAccountsList,
                { ...this.state, id: selectedSocialAccounts.id }
              ]);
            } else {
              socialAccounts = JSON.stringify([
                ...socialAccountssList,
                { ...this.state, id: v4() }
              ]);
            }

            this.props
              .updateUser(socialAccounts)
              .then(({ data }) => {
                if (data.updateUser.msg === "success") {
                  console.log("add socialAccounts success");
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
  graphql(SOCIAL_ACCOUNTS_MUTATION, {
    props: ({ mutate }) => ({
      updateUser: socialAccounts =>
        mutate({
          variables: {
            socialAccounts
          },
          refetchQueries: [{ query: SOCIAL_ACCOUNTS_DETAILS_QUERY }]
        })
    })
  })
)(SocialAccountsFormScreen);
