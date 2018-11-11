import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Dimensions,
  FlatList,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { Card } from "react-native-elements";

import { Query } from "react-apollo";

import { JOBS_QUERY } from "../../config/queries";
import { _retrieveData } from "../../config/utils";
import { LOCATION } from "../../config/CONSTANTS";

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

  state = { location: null, queryDisable: true };
  val = { page: 1, rows: 4 };

  async componentDidMount() {
    try {
      const location = await _retrieveData(LOCATION);
      console.log("locarioN :;, ", location);
      location &&
        this.setState({ location: JSON.parse(location), queryDisable: false });
    } catch (err) {
      console.log("error in try catch location: ", err);
    }
  }

  render() {
    const query = this.props.navigation.getParam("query", undefined);
    console.log("this ttate: ", this.state);

    return !this.state.queryDisable ? (
      <View>
        <Query
          query={JOBS_QUERY}
          variables={{
            page: this.val.page,
            rows: this.val.rows,
            query,
            latitude:
              this.state.location &&
              this.state.location.coords &&
              this.state.location.coords.latitude
                ? this.state.location.coords.latitude
                : undefined,
            longitude:
              this.state.location &&
              this.state.location.coords &&
              this.state.location.coords.longitude
                ? this.state.location.coords.longitude
                : undefined
          }}
        >
          {({ loading, error, data, fetchMore }) => {
            // This loading will re-render entire page
            // But we don't want that on Infinite-Scroll page
            // So it is checked below
            {
              /* if (loading)
              return <ActivityIndicator size="large" color="#ff6347" />; */
            }

            console.log("cnsdfsdjfjsdifjdsf: ", loading);

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
              if (loading)
                return <ActivityIndicator size="large" color="#ff6347" />;

              return (
                <View>
                  <Text>No Data Found</Text>
                </View>
              );
            }
          }}
        </Query>
      </View>
    ) : (
      <ActivityIndicator size="large" color="#ff6347" />
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
