import React, { Component } from "react";
import { StyleSheet, Text, FlatList, ScrollView } from "react-native";
import { Container, Content, View } from "native-base";
import { connect } from "react-redux";
import { Button } from "react-native-elements";

import { compose, graphql, withApollo, Query } from "react-apollo";
import gql from "graphql-tag";
import { Card } from "react-native-elements";
import { WORK_EXPERIENCE_MUTATION } from "./WorkExperienceFormScreen";

export const WORK_EXPERIENCE_DETAILS_QUERY = gql`
  {
    me {
      workExperience
    }
  }
`;

class WorkExperienceScreen extends Component {
  render() {
    return (
      <ScrollView scrollEnabled>
        <Container>
          <Content scrollEnabled contentContainerStyle={styles.contentStyle}>
            <Query
              query={WORK_EXPERIENCE_DETAILS_QUERY}
              fetchPolicy="cache-and-network"
            >
              {({ loading, error, data }) => {
                if (loading) return <Text>Fetching Data ...</Text>;
                if (error) return <Text>Error Fetching Data !</Text>;

                let workExperienceDetailsList = JSON.parse(
                  data.me.workExperience
                );

                if (!Array.isArray(workExperienceDetailsList))
                  workExperienceDetailsList = [];

                return workExperienceDetailsList.length ? (
                  <View>
                    {workExperienceDetailsList.map((each, index) => (
                      <Card key={index}>
                        <Text style={styles.boldText}>
                          <Text style={styles.titleStyle}>
                            Organisation Name:{" "}
                          </Text>
                          <Text style={styles.textStyle}>
                            {each.organisationName}
                            {"\n"}
                          </Text>

                          <Text style={styles.titleStyle}>Location: </Text>
                          <Text tyle={styles.textStyle}>
                            {each.location}
                            {"\n"}
                          </Text>

                          <Text style={styles.titleStyle}>Field: </Text>
                          <Text tyle={styles.textStyle}>
                            {each.field}
                            {"\n"}
                          </Text>

                          <Text style={styles.titleStyle}>Designation: </Text>
                          <Text style={styles.textStyle}>
                            {each.designation}
                            {"\n"}
                          </Text>

                          <Text style={styles.titleStyle}>Start Date: </Text>
                          <Text style={styles.textStyle}>
                            {each.startDate}
                            {"\n"}
                          </Text>

                          <Text style={styles.titleStyle}>End Date: </Text>
                          <Text style={styles.textStyle}>
                            {each.endDate}
                            {"\n"}
                          </Text>
                        </Text>
                        <Button
                          backgroundColor="green"
                          title="Edit"
                          onPress={() =>
                            this.props.navigation.navigate(
                              "workExperienceForm",
                              {
                                workExperiences: workExperienceDetailsList,
                                selectedWorkExperience: each
                              }
                            )
                          }
                        />
                        <Button
                          backgroundColor="red"
                          title="Delete"
                          onPress={() => {
                            const id = each.id;
                            const filteredWorkExperienceList = workExperienceDetailsList.filter(
                              eachWorkExperience => eachWorkExperience.id !== id
                            );

                            this.props
                              .updateUser(
                                JSON.stringify(filteredWorkExperienceList)
                              )
                              .then(({ data }) => {
                                if (data.updateUser.msg === "success") {
                                  console.log("workExperience deleted");
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
                      title="Add Work Experience"
                      onPress={() =>
                        this.props.navigation.navigate("workExperienceForm", {
                          workExperiences: workExperienceDetailsList
                        })
                      }
                    />
                  </View>
                ) : (
                  <View>
                    <Text>No Work Experience Details Found</Text>
                    <Button
                      backgroundColor="#3F51B5"
                      title="Add Work Experience"
                      onPress={() =>
                        this.props.navigation.navigate("workExperienceForm", {
                          workExperiences: workExperienceDetailsList
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
  graphql(WORK_EXPERIENCE_MUTATION, {
    props: ({ mutate }) => ({
      updateUser: workExperience =>
        mutate({
          variables: {
            workExperience
          },
          refetchQueries: [{ query: WORK_EXPERIENCE_DETAILS_QUERY }]
        })
    })
  })
)(WorkExperienceScreen);
