import React, { Component } from "react";
import { StyleSheet, Text, ActivityIndicator } from "react-native";
import { View } from "native-base";
import BraintreePaymentWebView from "./dependencies/BraintreePaymentWebView";

import { Query, compose, graphql } from "react-apollo";
import { CLIENT_PAYMENT_TOKEN_QUERY } from "../../config/queries";
import { CREATE_PAYMENT_MUTATION } from "../../config/mutations";
import { PAYMENT_REJECTED, PAYMENT_SUCCESS } from "../../config/CONSTANTS";

class BraintreePaymentScreen extends Component {
  state = { clientToken: "", paymentAPIResponse: "" };

  handlePaymentMethod = nonce => {
    console.log("handlepyment methiods: ", nonce);

    const id = this.props.navigation.getParam("id", null);

    console.log("job id paymen: ", id);

    this.props
      .createPayment(id, nonce)
      .then(response => {
        console.log("payment resp_confirm: ", response);
        if (
          response.data.createPayment.status === 200 &&
          response.data.createPayment.msg === "success"
        ) {
          console.log("payment success confirm ");
          this.setState({ paymentAPIResponse: PAYMENT_SUCCESS });

          this.props.navigation.goBack();
        } else throw new Error(response);
      })
      .catch(error => {
        this.setState({ paymentAPIResponse: PAYMENT_REJECTED });

        console.log("erro: ", error);
      });
    // this.props.client
    //   .mutate({
    //     mutation: CREATE_PAYMENT_MUTATION,
    //     variables: { id, nonce }
    //   })
    //   .then(response => {
    //     console.log("create payment response", response);
    //     if (response.data.createPayment.msg === "success") {
    //       this.setState({ paymentAPIResponse: PAYMENT_SUCCESS});
    //     } else throw new Error(response);
    //   })
    //   .catch(error => {
    //     console.log("creat payment error: ", JSON.stringify(error));
    //     this.setState({ paymentAPIResponse: PAYMENT_REJECTED });
    //   });
  };

  purchaseCompleteCallback = response => {
    console.log("purchaseCompleteCallback");
  };

  // enables payment webview to display a button that navigates back
  // to home page even though it doesn't have access to router
  navigationBackCallback = () => {
    console.log("Navigation callback was successful.");
    this.props.navigation.goBack();
  };

  render() {
    return (
      <Query query={CLIENT_PAYMENT_TOKEN_QUERY}>
        {({ loading, error, data }) => {
          if (loading) {
            console.log("loading paymen screen: ", loading);
            return <ActivityIndicator size="large" color="#ff6347" />;
          }
          if (error) {
            console.log("errroso: ", error);
            return (
              <View>
                <Text>Error loading form</Text>
              </View>
            );
          }

          return (
            <BraintreePaymentWebView
              clientToken={data.clientPaymentToken}
              nonceObtainedCallback={this.handlePaymentMethod}
              navigationBackCallback={this.navigationBackCallback}
              paymentAPIResponse={this.state.paymentAPIResponse}
            />
          );
        }}
      </Query>
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
  boldText: {
    fontSize: 20,
    fontWeight: "bold"
  },
  titleStyle: {
    color: "red"
  },
  textStyle: {
    color: "black"
  }
});

export default compose(
  graphql(CREATE_PAYMENT_MUTATION, {
    props: ({ mutate }) => ({
      createPayment: (id, nonce) =>
        mutate({
          variables: {
            id,
            nonce
          }
        })
    })
  })
)(BraintreePaymentScreen);
