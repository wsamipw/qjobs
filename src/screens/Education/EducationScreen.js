import React, { Component } from "react";
import { StyleSheet, Text, FlatList, ScrollView } from "react-native";
import { Container, Content, View } from "native-base";
import { connect } from "react-redux";
import { Button } from "react-native-elements";

import { compose, graphql, withApollo, Query } from "react-apollo";
import { Card } from "react-native-elements";
import {
  EDUCATION_MUTATION,
  EDUCATION_DETAILS_QUERY
} from "../../config/mutations";

class EducationScreen extends Component {
  render() {
    return (
      <ScrollView scrollEnabled>
        <Container>
          <Content scrollEnabled contentContainerStyle={styles.contentStyle}>
            <Query
              query={EDUCATION_DETAILS_QUERY}
              fetchPolicy="cache-and-network"
            >
              {({ loading, error, data }) => {
                if (loading) return <Text>Fetching Data ...</Text>;
                if (error) return <Text>Error Fetching Data !</Text>;

                let educationDetailsList = JSON.parse(data.me.education);

                if (!Array.isArray(educationDetailsList))
                  educationDetailsList = [];

                return educationDetailsList.length ? (
                  <View>
                    {educationDetailsList.map((each, index) => (
                      <Card key={index}>
                        <Text style={styles.boldText}>
                          <Text style={styles.titleStyle}>
                            Education Level:{" "}
                          </Text>
                          <Text style={styles.textStyle}>
                            {each.levelOfEducation}
                            {"\n"}
                          </Text>

                          <Text style={styles.titleStyle}>Institute: </Text>
                          <Text tyle={styles.textStyle}>
                            {each.nameOfInstitute}
                            {"\n"}
                          </Text>

                          <Text style={styles.titleStyle}>Field: </Text>
                          <Text style={styles.textStyle}>
                            {each.subject}
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
                            this.props.navigation.navigate("educationForm", {
                              educations: educationDetailsList,
                              selectedEducation: each
                            })
                          }
                        />
                        <Button
                          backgroundColor="red"
                          title="Delete"
                          onPress={() => {
                            const id = each.id;
                            const filteredEducationList = educationDetailsList.filter(
                              eachEducation => eachEducation.id !== id
                            );

                            this.props
                              .updateUser(JSON.stringify(filteredEducationList))
                              .then(({ data }) => {
                                if (data.updateUser.msg === "success") {
                                  console.log("education deleted");
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
                      title="Add Education"
                      onPress={() =>
                        this.props.navigation.navigate("educationForm", {
                          educations: educationDetailsList
                        })
                      }
                    />
                  </View>
                ) : (
                  <View>
                    <Text>No Education Details Found</Text>
                    <Button
                      backgroundColor="#3F51B5"
                      title="Add Education"
                      onPress={() =>
                        this.props.navigation.navigate("educationForm", {
                          educations: educationDetailsList
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
  graphql(EDUCATION_MUTATION, {
    props: ({ mutate }) => ({
      updateUser: education =>
        mutate({
          variables: {
            education
          },
          refetchQueries: [{ query: EDUCATION_DETAILS_QUERY }]
        })
    })
  })
)(EducationScreen);
