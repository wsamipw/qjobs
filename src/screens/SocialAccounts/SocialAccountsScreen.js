import React, { Component } from "react";
import { StyleSheet, Text, FlatList, ScrollView } from "react-native";
import { Container, Content, View } from "native-base";
import { connect } from "react-redux";
import { Button } from "react-native-elements";

import { compose, graphql, withApollo, Query } from "react-apollo";
import gql from "graphql-tag";
import { Card } from "react-native-elements";
import { SOCIAL_ACCOUNTS_MUTATION } from "./SocialAccountsFormScreen";

export const SOCIAL_ACCOUNTS_DETAILS_QUERY = gql`
  {
    me {
      socialAccounts
    }
  }
`;

class SocialAccountsScreen extends Component {
  render() {
    return (
      <ScrollView scrollEnabled>
        <Container>
          <Content scrollEnabled contentContainerStyle={styles.contentStyle}>
            <Query
              query={SOCIAL_ACCOUNTS_DETAILS_QUERY}
              fetchPolicy="cache-and-network"
            >
              {({ loading, error, data }) => {
                if (loading) return <Text>Fetching Data ...</Text>;
                if (error) return <Text>Error Fetching Data !</Text>;

                let socialAccountsDetailsList = JSON.parse(
                  data.me.socialAccounts
                );

                if (!Array.isArray(socialAccountsDetailsList))
                  socialAccountsDetailsList = [];

                return socialAccountsDetailsList.length ? (
                  <View>
                    {socialAccountsDetailsList.map((each, index) => (
                      <Card key={index}>
                        <Text style={styles.boldText}>
                          <Text style={styles.titleStyle}>Social Site: </Text>
                          <Text style={styles.textStyle}>
                            {each.socialSite}
                            {"\n"}
                          </Text>

                          <Text style={styles.titleStyle}>URL: </Text>
                          <Text tyle={styles.textStyle}>
                            {each.url}
                            {"\n"}
                          </Text>
                        </Text>
                        <Button
                          backgroundColor="green"
                          title="Edit"
                          onPress={() =>
                            this.props.navigation.navigate(
                              "socialAccountsForm",
                              {
                                socialAccountss: socialAccountsDetailsList,
                                selectedSocialAccounts: each
                              }
                            )
                          }
                        />
                        <Button
                          backgroundColor="red"
                          title="Delete"
                          onPress={() => {
                            const id = each.id;
                            const filteredSocialAccountsList = socialAccountsDetailsList.filter(
                              eachSocialAccounts => eachSocialAccounts.id !== id
                            );

                            this.props
                              .updateUser(
                                JSON.stringify(filteredSocialAccountsList)
                              )
                              .then(({ data }) => {
                                if (data.updateUser.msg === "success") {
                                  console.log("socialAccounts deleted");
                                } else throw new Error(data.updateUser.msg);
                              })
                              .catch(error => {
                                console.log("update error: ", error);
                              });
                          }}
                        />
                      </Card>
                    ))}
                    <Button
                      backgroundColor="#3F51B5"
                      title="Add socialAccounts"
                      onPress={() =>
                        this.props.navigation.navigate("socialAccountsForm", {
                          socialAccountss: socialAccountsDetailsList
                        })
                      }
                    />
                  </View>
                ) : (
                  <View>
                    <Text>No Social Accounts Found</Text>
                    <Button
                      backgroundColor="#3F51B5"
                      title="Add socialAccounts"
                      onPress={() =>
                        this.props.navigation.navigate("socialAccountsForm", {
                          socialAccountss: socialAccountsDetailsList
                        })
                      }
                    />
                  </View>
                );
              }}
            </Query>
          </Content>
        </Container>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  contentStyle: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  boldText: {
    fontSize: 20,
    fontWeight: "bold"
  },
  titleStyle: {
    color: "red"
  },
  textStyle: {
    color: "black"
  }
});

const mapStateToProps = ({ myNavigation }) => {
  return { ...myNavigation };
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
)(SocialAccountsScreen);
