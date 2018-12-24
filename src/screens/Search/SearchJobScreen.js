import React, { Component } from "react";
import {
  Alert,
  StyleSheet,
  View,
  Image,
  StatusBar,
  Dimensions
} from "react-native";
import {
  Container,
  Content,
  Text,
  Item,
  Input,
  Icon,
  Button
} from "native-base";
import Slider from "react-native-slider";
import PopupDialog, {
  DialogTitle,
  ScaleAnimation
} from "react-native-popup-dialog";

const scaleAnimation = new ScaleAnimation();

export default class SearchJobScreen extends Component {
  static navigationOptions = { header: null };
  state = {
    dialogShow: false,
    proximity: 0,
    query: ""
  };

  componentWillUnmount() {
    this.setState({
      dialogShow: false,
      proximity: 0,
      query: ""
    });
  }

  showScaleAnimationDialog = () => {
    this.scaleAnimationDialog.show();
  };

  render() {
    return (
      <Container>
        <StatusBar barStyle="dark-content" backgroundColor="#ecf0f1" />
        <Content contentContainerStyle={styles.contentStyle}>
          <View style={styles.mainWrapper}>
            <Image
              source={require("../../static/img/logoIcon.png")}
              style={styles.logo}
            />
            <Item rounded>
              <Input
                placeholder="Enter Job title or keyword"
                value={this.state.query}
                onChangeText={query => this.setState({ query })}
                style={styles.inputStyles}
              />
            </Item>
            <Button
              style={styles.searchButtton}
              rounded
              block
              onPress={() => {
                if (this.state.query)
                  this.props.navigation.navigate("result", {
                    query: this.state.query
                  });
                else {
                  console.log("query is empty");
                  Alert.alert(
                    "Search Field Empty",
                    "Please enter a keyword in Search Field ",
                    [{ text: "OK" }]
                  );
                }
              }}
            >
              <Text uppercase={false}>Find Job</Text>
            </Button>
          </View>
          <View style={styles.filterWrapper}>
            <Button
              onPress={this.showScaleAnimationDialog}
              style={styles.fabButton}
            >
              <Icon name="funnel" />
            </Button>
          </View>
          <PopupDialog
            containerStyle={{
              zIndex: 999
            }}
            width={0.8}
            ref={popupDialog => {
              this.scaleAnimationDialog = popupDialog;
            }}
            dialogAnimation={scaleAnimation}
            dialogTitle={<DialogTitle title="Search Filters" />}
          >
            <View style={styles.dialogContentView}>
              <Text>Select Proximity of your search</Text>
              <View
                style={{
                  flex: 1,
                  marginVertical: 15,
                  alignItems: "stretch",
                  justifyContent: "center"
                }}
              >
                <Slider
                  animateTransitions
                  animationType="spring"
                  minimumValue={0}
                  maximumValue={10}
                  step={1}
                  value={this.state.proximity}
                  onValueChange={proximity => this.setState({ proximity })}
                />
              </View>
              <Text style={{ marginVertical: 15 }}>
                {this.state.proximity === 0
                  ? `Proximity: Search everywhere`
                  : `Proximity: ${this.state.proximity} KM`}
              </Text>
              <Item rounded>
                <Input
                  placeholder="Enter location"
                  style={styles.inputStyles}
                />
              </Item>
              <Button
                block
                rounded
                style={styles.filterApplyButtton}
                onPress={() => {
                  this.scaleAnimationDialog.dismiss();
                }}
              >
                <Text uppercase={false}>Apply</Text>
              </Button>
            </View>
          </PopupDialog>
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
    alignItems: "center",
    zIndex: 1
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
  },
  searchButtton: {
    zIndex: 1,
    marginVertical: 15
  },
  fabButton: {
    height: 55,
    width: 55,
    borderRadius: 55,
    alignItems: "center",
    justifyContent: "center"
  },
  filterWrapper: {
    width: Dimensions.get("window").width,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 20,
    marginRight: Dimensions.get("window").width * 0.1
  },
  dialogContentView: {
    flex: 1,
    padding: 15
  },
  filterApplyButtton: {
    marginVertical: 15,
    marginHorizontal: 0
  }
});
