import React, { Component } from "react";
import { View, FlatList, ActivityIndicator } from "react-native";

import { Query } from "react-apollo";
import moment from "moment";
import { MY_JOBS_QUERY } from "../../../config/queries";
import { ListItem, Right, Body, Text, Icon } from "native-base";

class MyJobScreen extends Component {
  _renderItem = ({ item }) => {
    return (
      <ListItem
        onPress={() => {
          console.log("key my job: ", this.props.route.key);
          this.props.route.navigation.navigate("myJobDetail", {
            item
            //key: this.props.route.key
          });
        }}
      >
        <Body>
          <Text
            style={{
              fontWeight: "bold"
            }}
          >
            {item.properties.jobTitle && item.properties.jobTitle.name}
          </Text>
          <Text note>
            {" "}
            Deadline: {moment(item.properties.hireBy).fromNow()}
          </Text>
        </Body>
        <Right>
          <Text note>Applicant: {item.properties.applyJobCount}</Text>
          <Icon active name="arrow-forward" />
        </Right>
      </ListItem>
    );
  };

  render() {
    return (
      <View>
        <Query
          query={MY_JOBS_QUERY}
          fetchPolicy="cache-and-network"
          notifyOnNetworkStatusChange
        >
          {({ loading, error, data, refetch, networkStatus }) => {
            if (networkStatus === 4)
              return <ActivityIndicator size="large" color="#ff6347" />;
            if (loading)
              return <ActivityIndicator size="large" color="#ff6347" />;
            if (error) {
              console.log("my jobs screen error: ", error);
              return <Text>Error Fetching Data !</Text>;
            }

            if (data && data.me && data.me.jobSet && data.me.jobSet.length) {
              return (
                <View>
                  <FlatList
                    data={data.me.jobSet}
                    refreshing={networkStatus === 4}
                    onRefresh={() => refetch()}
                    keyExtractor={item => item.id}
                    renderItem={this._renderItem}
                  />
                </View>
              );
            } else {
              return (
                <View style={{ flex: 1 }}>
                  {/* <StatusBar
                      barStyle="light-content"
                      backgroundColor={PRIMARY_COLOR}
                    /> */}
                  <View
                    style={{
                      flex: 1,
                      // height: "100%",
                      marginTop: 200,
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <Icon
                      type="MaterialIcons"
                      name="cloud-off"
                      style={{ fontSize: 50, color: "#d3d3d3" }}
                    />
                    <Text note>
                      You have not created any Jobs!{"\n"} Click on the ' + '
                      plus icon to create a job
                      {/* {this.props.navigation.state.params.query} */}
                    </Text>
                  </View>
                </View>
              );
            }
          }}
        </Query>
      </View>
    );
  }
}

export default MyJobScreen;
