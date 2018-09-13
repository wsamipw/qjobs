import React, { Component } from "react";
import { StyleSheet, Text, FlatList, ScrollView } from "react-native";
import { Container, Content, View } from "native-base";
import { connect } from "react-redux";
import { Button } from "react-native-elements";

import { compose, graphql, withApollo, Query } from "react-apollo";
import gql from "graphql-tag";
import { Card } from "react-native-elements";
import { TRAINING_MUTATION } from "./TrainingFormScreen";

export const TRAINING_DETAILS_QUERY = gql`
  {
    me {
      training
    }
  }
`;

class TrainingScreen extends Component {
  render() {
    return (
      <ScrollView scrollEnabled>
        <Container>
          <Content scrollEnabled contentContainerStyle={styles.contentStyle}>
            <Query
              query={TRAINING_DETAILS_QUERY}
              fetchPolicy="cache-and-network"
            >
              {({ loading, error, data }) => {
                if (loading) return <Text>Fetching Data ...</Text>;
                if (error) return <Text>Error Fetching Data !</Text>;

                let trainingDetailsList = JSON.parse(data.me.training);

                if (!Array.isArray(trainingDetailsList))
                  trainingDetailsList = [];

                return trainingDetailsList.length ? (
                  <View>
                    {trainingDetailsList.map((each, index) => (
                      <Card key={index}>
                        <Text style={styles.boldText}>
                          <Text style={styles.titleStyle}>Training: </Text>
                          <Text style={styles.textStyle}>
                            {each.training}
                            {"\n"}
                          </Text>

                          <Text style={styles.titleStyle}>
                            Training Institute:{" "}
                          </Text>
                          <Text tyle={styles.textStyle}>
                            {each.trainingInstitute}
                            {"\n"}
                          </Text>
                        </Text>
                        <Button
                          backgroundColor="green"
                          title="Edit"
                          onPress={() =>
                            this.props.navigation.navigate("trainingForm", {
                              trainings: trainingDetailsList,
                              selectedTraining: each
                            })
                          }
                        />
                        <Button
                          backgroundColor="red"
                          title="Delete"
                          onPress={() => {
                            const id = each.id;
                            const filteredTrainingList = trainingDetailsList.filter(
                              eachTraining => eachTraining.id !== id
                            );

                            this.props
                              .updateUser(JSON.stringify(filteredTrainingList))
                              .then(({ data }) => {
                                if (data.updateUser.msg === "success") {
                                  console.log("training deleted");
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
                      title="Add Training"
                      onPress={() =>
                        this.props.navigation.navigate("trainingForm", {
                          trainings: trainingDetailsList
                        })
                      }
                    />
                  </View>
                ) : (
                  <View>
                    <Text>No Training Details Found</Text>
                    <Button
                      backgroundColor="#3F51B5"
                      title="Add Training"
                      onPress={() =>
                        this.props.navigation.navigate("trainingForm", {
                          trainings: trainingDetailsList
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
  graphql(TRAINING_MUTATION, {
    props: ({ mutate }) => ({
      updateUser: training =>
        mutate({
          variables: {
            training
          },
          refetchQueries: [{ query: TRAINING_DETAILS_QUERY }]
        })
    })
  })
)(TrainingScreen);
