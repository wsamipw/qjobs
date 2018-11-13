import React, { Component } from "react";
import {
  Text,
  ScrollView,
  TouchableOpacity,
  View,
  StyleSheet,
  Image
} from "react-native";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { _removeData } from "../../config/utils";
import { JWT_AUTH_TOKEN } from "../../config/CONSTANTS";
import CustomToast from "../../config/CustomToast";

class More extends Component {
  static navigationOptions = {
    // headerTitle: "Settings",
    headerStyle: {
      backgroundColor: "#5968ef"
    },
    // headerTintColor: "#ffffff"
    headerTitle: (
      <View style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}>
        <Image
          source={require("../../static/img/logoIconMin.png")}
          style={{
            width: 50,
            height: 50,
            resizeMode: "contain",
            alignSelf: "center"
          }}
        />
      </View>
    )
  };

  Default_Toast_Bottom = arg => {
    this.refs.defaultToastBottom.ShowToastFunction(arg);
  };

  render() {
    return (
      <ScrollView scrollEnabled style={styles.container}>
        {/* Each Row Starts Here */}
        <TouchableOpacity
          style={{
            flex: 1,
            flexDirection: "row",
            backgroundColor: "#fff"
          }}
          onPress={() => {
            console.log("user details pressed");
            this.props.navigation.navigate("userDetail");
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
        <CustomToast ref="defaultToastBottom" position="bottom" />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5"
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
