import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Dimensions,
  FlatList,
  TouchableOpacity
} from "react-native";
import { Container, Content, Item, Input, Icon } from "native-base";
import { Button, Card } from "react-native-elements";

import { Query, compose, withApollo, graphql } from "react-apollo";

import { JOBS_QUERY } from "../../config/queries";

class SearchResultScreen extends Component {
  static navigationOptions = {
    title: "Search Result",
    headerStyle: {
      backgroundColor: "#5968ef"
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold"
    }
  };

  val = { page: 1, rows: 4 };

  render() {
    const query = this.props.navigation.getParam("query", undefined);

    return (
      <Container>
        <StatusBar barStyle="light-content" backgroundColor="#ecf0f1" />
        <Content contentContainerStyle={styles.contentStyle}>
          <View style={styles.mainWrapper}>
            <Query
              query={JOBS_QUERY}
              fetchPolicy="cache-and-network"
              variables={{ page: this.val.page, rows: this.val.rows, query }}
              notifyOnNetworkStatusChange
            >
              {({
                loading,
                error,
                data,
                refetch,
                fetchMore,
                networkStatus
              }) => {
                console.log("data: ", data);
                console.log("loading: ", loading);
                let displayText = "";

                if (error) {
                  console.log("error search job: ", JSON.stringify(error));
                  return <Text>Error Fetching Data !</Text>;
                }

                if (data && data.jobs && data.jobs.data.length) {
                  return (
                    <View>
                      <FlatList
                        data={data.jobs.data}
                        keyExtractor={item => item.id}
                        onEndReached={() => {
                          this.val.page += 1;

                          if (this.val.page <= data.jobs.pages) {
                            fetchMore({
                              variables: {
                                page: this.val.page,
                                rows: this.val.rows
                              },
                              updateQuery: (prev, { fetchMoreResult }) => {
                                if (!fetchMoreResult) return prev;
                                return Object.assign({}, prev, {
                                  jobs: {
                                    ...prev.jobs,
                                    data: [
                                      ...prev.jobs.data,
                                      ...fetchMoreResult.jobs.data
                                    ]
                                  }
                                });
                              }
                            });
                          }
                        }}
                        onEndReachedThreshold={0.1}
                        renderItem={({ item }) => {
                          return (
                            <TouchableOpacity
                              onPress={() =>
                                this.props.navigation.navigate("searchDetail", {
                                  item
                                })
                              }
                              key={item.id}
                            >
                              <Card>
                                <Text>Id: {item.id}</Text>
                                <Text>Name: {item.name}</Text>
                                <Text>Type of Job: {item.typeOfJob}</Text>
                              </Card>
                            </TouchableOpacity>
                          );
                        }}
                      />
                    </View>
                  );
                } else {
                  if (loading) displayText = "Loading ...";
                  else displayText = "No Data Found";

                  return (
                    <View>
                      <Text>{displayText}</Text>
                    </View>
                  );
                }
              }}
            </Query>
          </View>
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
  },
  mainWrapper: {
    flex: 1,
    marginTop: Dimensions.get("window").height * 0.1,
    width: Dimensions.get("screen").width * 0.8,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  logo: {
    height: 80,
    width: 80,
    resizeMode: "contain",
    marginBottom: 26
  },
  inputStyles: {
    paddingLeft: 15,
    flex: 1
    // borderRadius: 50
  }
});

export default SearchResultScreen;
