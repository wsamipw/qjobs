import React, { Component } from "react";
import { StyleSheet, Text, FlatList, ScrollView } from "react-native";
import { Container, Content, View } from "native-base";
import { connect } from "react-redux";
import { Button } from "react-native-elements";

import { compose, graphql, withApollo, Query } from "react-apollo";
import { Card } from "react-native-elements";
import { LANGUAGE_MUTATION } from "../../config/mutations";

import { LANGUAGE_DETAILS_QUERY } from "../../config/queries";

class LanguageScreen extends Component {
  render() {
    return (
      <ScrollView scrollEnabled>
        <Container>
          <Content scrollEnabled contentContainerStyle={styles.contentStyle}>
            <Query
              query={LANGUAGE_DETAILS_QUERY}
              fetchPolicy="cache-and-network"
            >
              {({ loading, error, data }) => {
                if (loading) return <Text>Fetching Data ...</Text>;
                if (error) return <Text>Error Fetching Data !</Text>;

                let languageDetailsList = JSON.parse(data.me.language);

                if (!Array.isArray(languageDetailsList))
                  languageDetailsList = [];

                return languageDetailsList.length ? (
                  <View>
                    {languageDetailsList.map((each, index) => (
                      <Card key={index}>
                        <Text style={styles.boldText}>
                          <Text style={styles.titleStyle}>Language: </Text>
                          <Text style={styles.textStyle}>
                            {each.language}
                            {"\n"}
                          </Text>

                          <Text style={styles.titleStyle}>Proficiency: </Text>
                          <Text tyle={styles.textStyle}>
                            {each.proficiency}
                            {"\n"}
                          </Text>
                        </Text>
                        <Button
                          backgroundColor="green"
                          title="Edit"
                          onPress={() =>
                            this.props.navigation.navigate("languageForm", {
                              languages: languageDetailsList,
                              selectedLanguage: each
                            })
                          }
                        />
                        <Button
                          backgroundColor="red"
                          title="Delete"
                          onPress={() => {
                            const id = each.id;
                            const filteredLanguageList = languageDetailsList.filter(
                              eachLanguage => eachLanguage.id !== id
                            );

                            this.props
                              .updateUser(JSON.stringify(filteredLanguageList))
                              .then(({ data }) => {
                                if (data.updateUser.msg === "success") {
                                  console.log("Language deleted");
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
                      title="Add Language"
                      onPress={() =>
                        this.props.navigation.navigate("languageForm", {
                          languages: languageDetailsList
                        })
                      }
                    />
                  </View>
                ) : (
                  <View>
                    <Text>No Language Details Found</Text>
                    <Button
                      backgroundColor="#3F51B5"
                      title="Add Language"
                      onPress={() =>
                        this.props.navigation.navigate("languageForm", {
                          languages: languageDetailsList
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
)(LanguageScreen);
