import React, { Component } from "react";
import { StyleSheet, Text } from "react-native";
import { Container, Content, Tab, Tabs, TabHeading, Icon } from "native-base";
import { connect } from "react-redux";

import { ProfileStack, SearchStack, PostStack } from "../config/routes";
import { setMainNavigation } from "../actions";

/*
 * !!!!! CAUTION !!!!!!
 * Currently this file is NOT in USE
 * from the date: 2075/07/19
*/
class HomeScreen extends Component {
  state = { activePage: 1 };

  componentDidMount() {
    this.props.setMainNavigation(this.props.navigation);
  }

  render() {
    return (
      <Container>
        <Content contentContainerStyle={styles.contentStyle}>
          <Tabs
            locked
            tabBarPosition="bottom"
            initialPage={this.state.activePage}
          >
            <Tab
              heading={
                <TabHeading>
                  <Icon type="FontAwesome" name="user" />
                  {/* <Text>Profile</Text> */}
                </TabHeading>
              }
            >
              <ProfileStack />
            </Tab>
            <Tab
              heading={
                <TabHeading>
                  <Icon type="FontAwesome" name="search" />
                  {/* <Text>Search</Text> */}
                </TabHeading>
              }
            >
              <SearchStack />
            </Tab>
            <Tab
              heading={
                <TabHeading>
                  <Icon type="FontAwesome" name="pencil-square-o" />
                  {/* <Text>Post</Text> */}
                </TabHeading>
              }
            >
              <PostStack />
            </Tab>
          </Tabs>
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
  }
});

export default connect(
  null,
  { setMainNavigation }
)(HomeScreen);
