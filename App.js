import React from "react";
import { SafeAreaView, StatusBar } from "react-native";
import { Container, StyleProvider, Root } from "native-base";
import { Provider } from "react-redux";

// Apollo Requirements
import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { setContext } from "apollo-link-context";

import Expo from "expo";
import mainNavigator from "./src/config/routes";
import getTheme from "./native-base-theme/components";
import platform from "./native-base-theme/variables/platform";
import store from "./src/store";
import { uri } from "./Settings";
import { _retrieveData } from "./src/config/utils";
import { JWT_AUTH_TOKEN } from "./src/config/CONSTANTS";

// Middleware for passing token in the Request Headers
const authLink = setContext(async (_, { headers }) => {
  const token = await _retrieveData(JWT_AUTH_TOKEN);
  console.log("token: ", token);
  return {
    headers: {
      ...headers,
      authorization: token ? `JWT ${token}` : ""
    }
  };
});

const httpLink = new createHttpLink({
  uri
});

// const defaultOptions = {
//   watchQuery: {
//     fetchPolicy: "network-only",
//     errorPolicy: "ignore"
//   },
//   query: {
//     fetchPolicy: "network-only",
//     errorPolicy: "all"
//   }
// };

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
  // onError: ({ graphQLErrors, networkError }) => {
  //   if (graphQLErrors) return console.error("GrahQL Errors:", graphQLErrors);
  //   if (networkError) return console.error("Network Error: ", networkError);
  // }
  // defaultOptions: defaultOptions
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: true, navigateTo: "login" };
  }

  async componentDidMount() {
    await Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });

    const token = await _retrieveData(JWT_AUTH_TOKEN);
    console.log("token: ", token);
    this.setState({ navigateTo: token ? "home" : "login" });

    // This is used for Expo.Font.loadAsync and
    // thus kept this piece of code separate
    // to avoid future confusions.
    this.setState({ loading: false });
  }

  render() {
    StatusBar.setBarStyle("dark-content", true);
    const MainNavigator = mainNavigator(this.state.navigateTo);

    if (this.state.loading) {
      return <Expo.AppLoading />;
    }
    return (
      <Root>
        <ApolloProvider client={client}>
          <StyleProvider style={getTheme(platform)}>
            <SafeAreaView style={{ flex: 1 }}>
              <Container>
                <MainNavigator
                  ref={navigatorRef => {
                    this.navigatorEl = navigatorRef;
                  }}
                />
              </Container>
            </SafeAreaView>
          </StyleProvider>
        </ApolloProvider>
      </Root>
    );
  }
}

export default () => (
  <Provider store={store}>
    <App />
  </Provider>
);
