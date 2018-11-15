import React, { Component } from "react";
import {
  Text,
  ScrollView,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  Animated,
  Modal,
  TouchableHighlight,
  Alert
} from "react-native";
import ParallaxScrollView from "react-native-parallax-scroll-view";

import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { _removeData, _retrieveData } from "../../config/utils";
import { JWT_AUTH_TOKEN, USER_DATA } from "../../config/CONSTANTS";
import CustomToast from "../../config/CustomToast";

class More extends Component {
  static navigationOptions = {
    header: null
    // // headerTitle: "Settings",
    // headerStyle: {
    //   backgroundColor: "#5968ef"
    // },
    // // headerTintColor: "#ffffff"
    // headerTitle: (
    //   <View style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}>
    //     <Image
    //       source={require("../../static/img/logoIconMin.png")}
    //       style={{
    //         width: 50,
    //         height: 50,
    //         resizeMode: "contain",
    //         alignSelf: "center"
    //       }}
    //     />
    //   </View>
    // )
  };

  state = { user: null, modalVisible: false };

  _retrieveUserData = async () => {
    const user = JSON.parse(await _retrieveData(USER_DATA));
    user && this.setState({ user });
  };

  async componentDidMount() {
    await this._retrieveUserData();
  }

  Default_Toast_Bottom = arg => {
    this.refs.defaultToastBottom.ShowToastFunction(arg);
  };

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  _refresh = async () => {
    await this._retrieveUserData();
  };

  renderContent = () => (
    <View style={styles.container}>
      {/* Each Row Starts Here */}
      <TouchableOpacity
        style={{
          flex: 1,
          flexDirection: "row",
          backgroundColor: "#fff"
        }}
        onPress={() => {
          console.log("user details pressed");
          this.props.navigation.navigate("userDetail", {
            refresh: this._refresh
          });
        }}
      >
        <SimpleLineIcons name="people" style={styles.actionButtonIcon} />
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            padding: 20,
            marginLeft: 5
          }}
        >
          <Text style={styles.textStyle}>User Detail</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.borderViewStyle} />
      {/* Each Row Ends Here */}

      <TouchableOpacity
        style={{
          flex: 1,
          flexDirection: "row",
          backgroundColor: "#fff"
        }}
        onPress={() => {
          console.log("Accounts pressed");
          this.props.navigation.navigate("accounts");
        }}
      >
        <SimpleLineIcons name="energy" style={styles.actionButtonIcon} />
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            padding: 20,
            marginLeft: 5
          }}
        >
          <Text style={styles.textStyle}>Register as Pro User</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.borderViewStyle} />

      <Text
        style={{
          marginLeft: 15,
          marginBottom: 10,
          marginTop: 10,
          fontWeight: "bold"
        }}
      >
        Support
      </Text>
      <TouchableOpacity
        style={{
          flex: 1,
          flexDirection: "row",
          backgroundColor: "#fff"
        }}
        onPress={() => {
          console.log("about us pressed");
          this.Default_Toast_Bottom("about us pressed");
        }}
      >
        <SimpleLineIcons name="exclamation" style={styles.actionButtonIcon} />
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            padding: 20,
            marginLeft: 5
          }}
        >
          <Text style={styles.textStyle}>About Us</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.borderViewStyle} />

      <TouchableOpacity
        style={{
          flex: 1,
          flexDirection: "row",
          backgroundColor: "#fff"
        }}
        onPress={() => {
          console.log("contact us pressed");
          this.Default_Toast_Bottom("contact us pressed");
        }}
      >
        <SimpleLineIcons name="phone" style={styles.actionButtonIcon} />
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            padding: 20,
            marginLeft: 5
          }}
        >
          <Text style={styles.textStyle}>Contact Us</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.borderViewStyle} />

      <TouchableOpacity
        style={{
          flex: 1,
          flexDirection: "row",
          backgroundColor: "#fff"
        }}
        onPress={() => {
          console.log("terms and condition pressed");
          this.Default_Toast_Bottom("terms and condition pressed");
        }}
      >
        <SimpleLineIcons name="notebook" style={styles.actionButtonIcon} />
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            padding: 20,
            marginLeft: 5
          }}
        >
          <Text style={styles.textStyle}>Terms and Condition</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.borderViewStyle} />

      <TouchableOpacity
        style={{
          flex: 1,
          flexDirection: "row",
          backgroundColor: "#fff"
        }}
        onPress={() => {
          console.log("FAQ pressed");
          this.Default_Toast_Bottom("FAQ pressed");
        }}
      >
        <SimpleLineIcons name="question" style={styles.actionButtonIcon} />
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            padding: 20,
            marginLeft: 5
          }}
        >
          <Text style={styles.textStyle}>FAQ</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.borderViewStyle} />

      <TouchableOpacity
        style={{
          flex: 1,
          flexDirection: "row",
          backgroundColor: "#fff"
        }}
        onPress={() => {
          console.log("Privacy Policy pressed");
          this.Default_Toast_Bottom("Privacy Policy pressed");
        }}
      >
        <SimpleLineIcons name="shield" style={styles.actionButtonIcon} />
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            padding: 20,
            marginLeft: 5
          }}
        >
          <Text style={styles.textStyle}>Privacy Policy</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.borderViewStyle} />

      <TouchableOpacity
        style={{
          flex: 1,
          flexDirection: "row",
          backgroundColor: "#fff",
          marginTop: 30
        }}
        onPress={async () => {
          try {
            await _removeData(JWT_AUTH_TOKEN);

            console.log("logout pressed");
            this.props.navigation.navigate("login");
          } catch (err) {
            console.log("unsuccessfull logout: ", err);
          }
        }}
      >
        <SimpleLineIcons name="logout" style={styles.actionButtonIcon} />
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            padding: 20,
            marginLeft: 5
          }}
        >
          <Text style={styles.textStyle}>Logout</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.borderViewStyle} />
    </View>
  );

  renderForeground = () => (
    <View
      style={{
        height: 300,
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <TouchableOpacity
        style={{
          borderWidth: 1,
          borderColor: "rgba(0,0,0,0.2)",
          alignItems: "center",
          justifyContent: "center",
          width: 140,
          height: 140,
          backgroundColor: "#fff",
          borderRadius: 100
        }}
        onPress={() => {
          this.setModalVisible(true);
        }}
      >
        <Image
          style={{ width: 140, height: 140, borderRadius: 100 }}
          source={require("../../static/img/profile_female.png")}
        />
      </TouchableOpacity>
      {this.state.user && (
        <View>
          <Text
            style={{
              color: "#ffffff",
              fontWeight: "bold",
              fontSize: 20
            }}
          >
            {this.state.user.firstName && this.state.user.lastName
              ? `${this.state.user.firstName} ${this.state.user.lastName}`
              : this.state.user.username
                ? this.state.user.username
                : ""}
          </Text>
          <Text
            style={{
              color: "#ffffff"
            }}
          >
            {this.state.user.email ? this.state.user.email : ""}
          </Text>
        </View>
      )}
    </View>
  );

  renderProfilePictureModal = () => (
    <Modal
      animationType="slide"
      transparent={false}
      visible={this.state.modalVisible}
      onRequestClose={() => {
        this.setModalVisible(!this.state.modalVisible);
      }}
    >
      <View
        style={{
          backgroundColor: "black",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%"
        }}
      >
        <Image source={require("../../static/img/profile_female.png")} />
      </View>
    </Modal>
  );

  render() {
    return (
      <ParallaxScrollView
        backgroundColor="#5968ef"
        contentBackgroundColor="#ffffff"
        parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
        stickyHeaderHeight={STICKY_HEADER_HEIGHT}
        renderStickyHeader={() => (
          <View key="sticky-header" style={styles.stickySection}>
            {/* <Text style={styles.stickySectionText}>Rich Hickey Talks</Text> */}
            <SimpleLineIcons name="energy" style={styles.actionButtonIcon} />
            {/* <Image source={require("../../static/img/logoIconMin.png")} /> */}
          </View>
        )}
        renderForeground={this.renderForeground}
      >
        {this.renderContent()}
        {this.renderProfilePictureModal()}
        <CustomToast ref="defaultToastBottom" position="bottom" />
      </ParallaxScrollView>
    );
  }
}
const PARALLAX_HEADER_HEIGHT = 250;
const STICKY_HEADER_HEIGHT = 80;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5"
  },
  stickySection: {
    height: 70,
    width: 300,
    justifyContent: "flex-end"
  },
  stickySectionText: {
    color: "white",
    fontSize: 20,
    margin: 10
  },
  actionButtonIcon: {
    fontSize: 25,
    marginTop: 12,
    marginLeft: 10,
    padding: 5,
    color: "#313838"
  },
  textStyle: {
    fontSize: 16,
    color: "#313838"
  },
  borderViewStyle: { height: 1, width: "100%", backgroundColor: "#c4bcbd" }
});

export default More;
