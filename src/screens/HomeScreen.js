import React, { Component } from "react";
import { StyleSheet, Text } from "react-native";
import { Container, Content, Tab, Tabs, TabHeading, Icon } from "native-base";
import { connect } from "react-redux";

import { ProfileStack, SearchStack, PostStack } from "../config/routes";
import { setMainNavigation } from "../actions";

class HomeScreen extends Component {
  state = { activePage: 1 };
  componentWillMount() {
    this.props.setMainNavigation(this.props.navigation);
    // setTimeout(() => this.setState({ activePage: 2 }), 0);
  }
  render() {
    return (
      <Container>
        <Content contentContainerStyle={styles.contentStyle}>
          <Tabs page={this.state.activePage} tabBarPosition="bottom">
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
