import React, { Component } from "react";
import {
  View,
  Picker,
  RefreshControl,
  ScrollView,
  Image,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  StatusBar
} from "react-native";
import { Card } from "react-native-elements";

import {
  Container,
  Content,
  Item,
  Input,
  DatePicker,
  Label,
  Button,
  Spinner,
  Text
} from "native-base";
import { Divider } from "react-native-elements";
import { compose, graphql, withApollo, Query } from "react-apollo";

import { AirbnbRating } from "react-native-ratings";

import { UPDATE_USER_MUTATION } from "../../config/mutations";
import { USER_DATA, PRIMARY_COLOR } from "../../config/CONSTANTS";
import { _retrieveData, _storeData } from "../../config/utils";
import moment from "moment";
import { MY_REVIEW_LIST_QUERY } from "../../config/queries";

class MyReviews extends Component {
  /* Below navigationOptions need not be called or passed
   * It is static and automatically used by react-navigation
   * For details refer: https://reactnavigation.org/docs/en/headers.html
   */
  static navigationOptions = ({ navigation }) => {
    return {
      headerStyle: {
        backgroundColor: "#5968ef"
      },
      headerTitle: "My Reviews",
      headerTintColor: "#ffffff"
    };
  };

  state = {
    page: 1,
    rows: 4,

    fetchMoreLoading: false
  };

  render() {
    return (
      <Query
        query={MY_REVIEW_LIST_QUERY}
        fetchPolicy="cache-and-network"
        notifyOnNetworkStatusChange
        variables={{
          page: 1,
          rows: 4
        }}
      >
        {({ loading, error, data, refetch, networkStatus, fetchMore }) => {
          // This loading will re-render entire page
          // But we don't want that on Infinite-Scroll page
          // So it is checked below

          if (error) {
            console.log("error my reviews: ", JSON.stringify(error));
            return <Text>Error Fetching Data !</Text>;
          }

          if (data && data.myReviewList && data.myReviewList.data.length) {
            return (
              <View
                style={{
                  flex: 1,
                  marginBottom: 16
                }}
              >
                <FlatList
                  data={data.myReviewList.data}
                  keyExtractor={item => item.id}
                  refreshing={networkStatus === 4}
                  onRefresh={() => {
                    console.log("my reviews refresh pressed");
                    this.setState({ page: 1 }, () => refetch());
                  }}
                  onEndReached={() => {
                    this.setState({ fetchMoreLoading: true }, () => {
                      if (
                        data.myReviewList.data.length <
                        data.myReviewList.rowCount
                      ) {
                        this.setState({ page: this.state.page + 1 }, () => {
                          console.log("state page: ", this.state.page);
                          fetchMore({
                            variables: {
                              page: this.state.page,
                              rows: this.state.rows
                            },
                            updateQuery: (prev, { fetchMoreResult }) => {
                              this.setState({ fetchMoreLoading: false });

                              if (!fetchMoreResult) return prev;
                              return Object.assign({}, prev, {
                                myReviewList: {
                                  ...prev.myReviewList,
                                  data: [
                                    ...prev.myReviewList.data,
                                    ...fetchMoreResult.myReviewList.data
                                  ]
                                }
                              });
                            }
                          });
                        });
                      } else {
                        this.setState({ fetchMoreLoading: false });
                      }
                    });
                  }}
                  onEndReachedThreshold={0.5}
                  renderItem={({ item }) => {
                    return (
                      <Card key={item.id}>
                        <Text style={styles.jobSearchName}>
                          {item.jobTitle.name}
                        </Text>

                        <Text style={styles.headingTextStyles}>
                          Ratings and Review
                        </Text>

                        <AirbnbRating
                          isDisabled
                          count={5}
                          size={20}
                          reviews={["Terrible", "Bad", "Okay", "Good", "Great"]}
                          defaultRating={item.rating}
                        />
                        <Text>{item.review}</Text>
                        <Text>
                          Reviewed By:{" "}
                          {item.reviewer.firstName && item.reviewer.lastName
                            ? `${item.reviewer.firstName} ${
                                item.reviewer.lastName
                              }`
                            : `${item.reviewer.username}`}
                        </Text>
                      </Card>
                    );
                  }}
                />

                {this.state.fetchMoreLoading && <Spinner color="grey" />}
              </View>
            );
          }
          if (loading) {
            console.log("loading my review: ", loading);
            return <ActivityIndicator size="large" color="#ff6347" />;
          }
        }}
      </Query>
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
  inputWraperStyle: {
    marginVertical: 10
  }
});

export default withApollo(MyReviews);
