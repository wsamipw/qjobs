import React from "react";
import { SafeAreaView } from "react-native";
import { Container, StyleProvider } from "native-base";
import Expo from "expo";
import mainNavigator from "./src/config/routes";
import getTheme from "./native-base-theme/components";
import platform from "./native-base-theme/variables/platform";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: true };
  }
  async componentWillMount() {
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
    );
  }
}
