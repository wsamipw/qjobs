import React from "react";
import { SafeAreaView } from "react-native";
import { Container, StyleProvider } from "native-base";
import { Provider } from "react-redux";
import Expo from "expo";
import mainNavigator from "./src/config/routes";
import getTheme from "./native-base-theme/components";
import platform from "./native-base-theme/variables/platform";
import store from "./src/store";
import { uri } from "./Settings";

// Apollo Requirements
import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

const httpLink = new createHttpLink({ uri });

const client = new ApolloClient({ link: httpLink, cache: new InMemoryCache() });

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  async componentDidMount() {
    await Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
    this.setState({ loading: false });
  }

  render() {
    const MainNavigator = mainNavigator("login");

    if (this.state.loading) {
      return <Expo.AppLoading />;
    }
    return (
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
    );
  }
}

export default () => (
  <Provider store={store}>
    <App />
  </Provider>
);
