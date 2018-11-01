import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { Container, Content, Item, Input, DatePicker } from "native-base";
import { Button } from "react-native-elements";
import { connect } from "react-redux";
import { REFERENCE_MUTATION } from "../../config/mutations";

import { REFERENCE_DETAILS_QUERY } from "../../config/queries";

import { compose, graphql } from "react-apollo";

import { v4 } from "uuid";

class ReferenceFormScreen extends Component {
  state = {
    name: "",
    organisation: "",
    designation: "",
    email: "",
    contactNumber: ""
  };

  componentDidMount() {
    const data = this.props.navigation.getParam("selectedReference", null);

    if (data) {
      const { name, organisation, designation, email, contactNumber } = data;

      this.setState({
        name,
        organisation,
        designation,
        email,
        contactNumber
      });
    }
  }

  onChange = (key, val) => this.setState({ [key]: val });

  render() {
    return (
      <Container>
        <Content scrollEnabled contentContainerStyle={styles.contentStyle}>
          <Item rounded>
            <Input
              placeholder="Referencer Name"
              value={this.state.name}
              onChangeText={val => this.onChange("name", val)}
            />
          </Item>
          <Item rounded>
            <Input
              placeholder="Organisation"
              value={this.state.organisation}
              onChangeText={val => this.onChange("organisation", val)}
            />
          </Item>
          <Item rounded>
            <Input
              placeholder="Designation"
              value={this.state.designation}
              onChangeText={val => this.onChange("designation", val)}
            />
          </Item>
          <Item rounded>
            <Input
              placeholder="Email"
              value={this.state.email}
              onChangeText={val => this.onChange("email", val)}
            />
          </Item>
          <Item rounded>
            <Input
              placeholder="Contact Number"
              value={this.state.contactNumber}
              onChangeText={val => this.onChange("contactNumber", val)}
            />
          </Item>
        </Content>
        <Button
          backgroundColor="#3F51B5"
          containerViewStyle={styles.loginButtton}
          rounded
          title={
            this.props.navigation.getParam("selectedReference", null)
              ? "Update"
              : "Add"
          }
          onPress={() => {
            let reference = "";

            const referencesList = this.props.navigation.getParam(
              "references",
              []
            );
            const selectedReference = this.props.navigation.getParam(
              "selectedReference",
              null
            );

            if (selectedReference) {
              const deletedReferenceList = referencesList.filter(
                eachReference => eachReference.id !== selectedReference.id
              );

              reference = JSON.stringify([
                ...deletedReferenceList,
                { ...this.state, id: selectedReference.id }
              ]);
            } else {
              reference = JSON.stringify([
                ...referencesList,
                { ...this.state, id: v4() }
              ]);
            }

            this.props
              .updateUser(reference)
              .then(({ data }) => {
                if (data.updateUser.msg === "success") {
                  console.log("add reference success");
                  this.props.navigation.goBack();
                } else throw new Error(data.updateUser.msg);
              })
              .catch(error => {
                console.log("update error: ", error);
              });
          }}
        />
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

const mapStateToProps = ({ myNavigationReducer }) => {
  return { ...myNavigationReducer };
};

export default compose(
  connect(mapStateToProps),
  graphql(REFERENCE_MUTATION, {
    props: ({ mutate }) => ({
      updateUser: reference =>
        mutate({
          variables: {
            reference
          },
          refetchQueries: [{ query: REFERENCE_DETAILS_QUERY }]
        })
    })
  })
)(ReferenceFormScreen);
