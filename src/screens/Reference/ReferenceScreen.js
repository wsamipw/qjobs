import React, { Component } from "react";
import { StyleSheet, Text, FlatList, ScrollView } from "react-native";
import { Container, Content, View } from "native-base";
import { connect } from "react-redux";
import { Button } from "react-native-elements";

import { compose, graphql, withApollo, Query } from "react-apollo";
import gql from "graphql-tag";
import { Card } from "react-native-elements";
import { REFERENCE_MUTATION } from "./ReferenceFormScreen";

export const REFERENCE_DETAILS_QUERY = gql`
  {
    me {
      reference
    }
  }
`;

class ReferenceScreen extends Component {
  render() {
    return (
      <ScrollView scrollEnabled>
        <Container>
          <Content scrollEnabled contentContainerStyle={styles.contentStyle}>
            <Query
              query={REFERENCE_DETAILS_QUERY}
              fetchPolicy="cache-and-network"
            >
              {({ loading, error, data }) => {
                if (loading) return <Text>Fetching Data ...</Text>;
                if (error) return <Text>Error Fetching Data !</Text>;

                let referenceDetailsList = JSON.parse(data.me.reference);

                if (!Array.isArray(referenceDetailsList))
                  referenceDetailsList = [];

                return referenceDetailsList && referenceDetailsList.length ? (
                  <View>
                    {referenceDetailsList.map((each, index) => (
                      <Card key={index}>
                        <Text style={styles.boldText}>
                          <Text style={styles.titleStyle}>Person Name: </Text>
                          <Text style={styles.textStyle}>
                            {each.name}
                            {"\n"}
                          </Text>

                          <Text style={styles.titleStyle}>Organisation: </Text>
                          <Text tyle={styles.textStyle}>
                            {each.organisation}
                            {"\n"}
                          </Text>

                          <Text style={styles.titleStyle}>Designation: </Text>
                          <Text style={styles.textStyle}>
                            {each.designation}
                            {"\n"}
                          </Text>

                          <Text style={styles.titleStyle}>Email: </Text>
                          <Text style={styles.textStyle}>
                            {each.email}
                            {"\n"}
                          </Text>

                          <Text style={styles.titleStyle}>
                            Contact Number:{" "}
                          </Text>
                          <Text style={styles.textStyle}>
                            {each.contactNumber}
                            {"\n"}
                          </Text>
                        </Text>
                        <Button
                          backgroundColor="green"
                          title="Edit"
                          onPress={() =>
                            this.props.navigation.navigate("referenceForm", {
                              references: referenceDetailsList,
                              selectedReference: each
                            })
                          }
                        />
                        <Button
                          backgroundColor="red"
                          title="Delete"
                          onPress={() => {
                            const id = each.id;
                            const filteredReferenceList = referenceDetailsList.filter(
                              eachReference => eachReference.id !== id
                            );

                            this.props
                              .updateUser(JSON.stringify(filteredReferenceList))
                              .then(({ data }) => {
                                if (data.updateUser.msg === "success") {
                                  console.log("reference deleted");
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
                      title="Add Reference"
                      onPress={() =>
                        this.props.navigation.navigate("referenceForm", {
                          references: referenceDetailsList
                        })
                      }
                    />
                  </View>
                ) : (
                  <View>
                    <Text>No Reference Details Found</Text>
                    <Button
                      backgroundColor="#3F51B5"
                      title="Add Reference"
                      onPress={() =>
                        this.props.navigation.navigate("referenceForm", {
                          references: referenceDetailsList
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
  graphql(REFERENCE_MUTATION, {
    props: ({ mutate }) => ({
      updateUser: reference =>
        mutate({
          variables: {
            reference
          },
          refetchQueries: [{ query: REFERENCE_DETAILS_QUERY }]
        })
    })
  })
)(ReferenceScreen);
