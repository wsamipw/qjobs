import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  FlatList,
  View,
  ActivityIndicator
} from "react-native";
import { connect } from "react-redux";
import { Button, Card } from "react-native-elements";

import { WebView } from "react-native-webview-messaging/WebView";
import PropTypes from "prop-types";
import renderIf from "render-if";
import {
  RETRIEVE_NONCE_PENDING,
  RETRIEVE_NONCE_FULFILLED,
  RETRIEVE_NONCE_REJECTED,
  TOKEN_RECEIVED,
  PAYMENT_REJECTED,
  PAYMENT_FULFILLED,
  PAYMENT_SUCCESS
} from "../../../config/CONSTANTS";

class BraintreePaymentWebView extends Component {
  state = {
    paymentAPIResponse: null,
    showGetNonceActivityIndicator: false,
    showSubmitPaymentActivityIndicator: false
  };

  componentDidMount() {
    // register listeners to listen for events from the html
    // we'll receive a nonce once the requestPaymentMethodComplete is completed
    this.registerMessageListeners();
    // console.log("wbvw braintree mounted: ", this.webview);
    console.log("wbvw braintree mounted: ");
  }

  registerMessageListeners = () => {
    const { messagesChannel } = this.webview;

    messagesChannel.on(RETRIEVE_NONCE_PENDING, event => {
      // console.log("returei ninc pending :", event);
      this.setState({ showGetNonceActivityIndicator: true });
      console.log(RETRIEVE_NONCE_PENDING);
    });

    messagesChannel.on(RETRIEVE_NONCE_FULFILLED, event => {
      console.log(RETRIEVE_NONCE_FULFILLED);
      this.setState({ showGetNonceActivityIndicator: false });
      this.setState({ showSubmitPaymentActivityIndicator: true });
      this.props.nonceObtainedCallback(event.payload.response.nonce);
    });

    messagesChannel.on(RETRIEVE_NONCE_REJECTED, event => {
      console.log(RETRIEVE_NONCE_REJECTED);
      this.setState({ showGetNonceActivityIndicator: false });
    });

    // it is passed from the index.html
    messagesChannel.on("GO_BACK", () => {
      this.props.navigationBackCallback();
    });
  };

  // send the client token to HTML file to begin the braintree flow
  // called when the HTML in the webview is loaded
  sendClientTokenToHTML() {
    console.log("send client  token to html");
    this.webview.emit(TOKEN_RECEIVED, {
      payload: {
        clientToken: this.props.clientToken,
        options: this.props.options
      }
    });
  }

  // handle purchase responses that parent component sends after making purchase API call
  handlePurchaseResponse = response => {
    console.log("handlePurchaseResponse");
    if (response === PAYMENT_SUCCESS) {
      console.log("emitting purchaseSuccess");
      this.setState({ showSubmitPaymentActivityIndicator: false });
      this.webview.emit(PAYMENT_FULFILLED);
    } else {
      this.setState({ showSubmitPaymentActivityIndicator: false });
      this.webview.emit(PAYMENT_REJECTED);
    }
  };

  // componentWillReceiveProps = nextProps => {
  //   console.log({ nextProps });
  //   if (nextProps.paymentAPIResponse !== this.state.paymentAPIResponse) {
  //     console.log(nextProps.paymentAPIResponse);
  //     this.setState({ paymentAPIResponse: nextProps.paymentAPIResponse });
  //     this.handlePurchaseResponse(nextProps.paymentAPIResponse);
  //   }
  // };

  componentDidUpdate = prevProps => {
    if (prevProps.paymentAPIResponse !== this.props.paymentAPIResponse) {
      console.log("did update: ", this.props.paymentAPIResponse);
      this.setState({ paymentAPIResponse: this.props.paymentAPIResponse });
      this.handlePurchaseResponse(this.props.paymentAPIResponse);
    }
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "green"
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "blue",
            overflow: "hidden"
          }}
        >
          <WebView
            onLoad={this.sendClientTokenToHTML.bind(this)}
            source={require("./dist/index.html")}
            style={{ flex: 1 }}
            ref={component => (this.webview = component)}
            scalesPageToFit={false}
          />
        </View>
        {this.state.showGetNonceActivityIndicator && (
          <View style={styles.activityOverlayStyle}>
            <View style={styles.activityIndicatorContainer}>
              <ActivityIndicator
                size="large"
                animating={this.state.showGetNonceActivityIndicator}
                color="blue"
              />
            </View>
          </View>
        )}
        {this.state.showSubmitPaymentActivityIndicator && (
          <View style={styles.activityOverlayStyle}>
            <View style={styles.activityIndicatorContainer}>
              <ActivityIndicator
                size="large"
                animating={this.state.showSubmitPaymentActivityIndicator}
                color="green"
              />
            </View>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  activityOverlayStyle: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(150, 150, 150, .55)",
    marginHorizontal: 20,
    marginVertical: 60,
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    borderRadius: 5
  },
  activityIndicatorContainer: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 50,
    alignSelf: "center",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 1.0
  }
});

BraintreePaymentWebView.propTypes = {
  options: PropTypes.object,
  clientToken: PropTypes.string.isRequired,
  paymentAPIResponse: PropTypes.string.isRequired,
  nonceObtainedCallback: PropTypes.func.isRequired,
  navigationBackCallback: PropTypes.func
};

export default BraintreePaymentWebView;
