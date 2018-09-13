import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { Container, Content, Item, Input, DatePicker } from "native-base";
import { Button } from "react-native-elements";
import { connect } from "react-redux";
import { EDUCATION_DETAILS_QUERY } from "./EducationScreen";

import { compose, graphql } from "react-apollo";
import gql from "graphql-tag";

import { v4 } from "uuid";

export const EDUCATION_MUTATION = gql`
  mutation AddEducationMutation($education: JSONString!) {
    updateUser(education: $education) {
      msg
      status
    }
  }
`;

class EducationFormScreen extends Component {
  state = {
    levelOfEducation: "",
    nameOfInstitute: "",
    subject: "",
    startDate: null,
    endDate: null
  };

  componentDidMount() {
    const data = this.props.navigation.getParam("selectedEducation", null);

    if (data) {
      const {
        levelOfEducation,
        nameOfInstitute,
        subject,
        startDate,
        endDate
      } = data;

      this.setState({
        levelOfEducation,
        nameOfInstitute,
        subject,
        startDate,
        endDate
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
              selectionColor="rgba(255,255,255,0.5)"
              placeholder="Education Level"
              value={this.state.levelOfEducation}
              onChangeText={val => this.onChange("levelOfEducation", val)}
            />
          </Item>
          <Item rounded>
            <Input
              selectionColor="rgba(255,255,255,0.5)"
              placeholder="Institute"
              value={this.state.nameOfInstitute}
              onChangeText={val => this.onChange("nameOfInstitute", val)}
            />
          </Item>
          <Item rounded>
            <Input
              selectionColor="rgba(255,255,255,0.5)"
              placeholder="Field"
              value={this.state.subject}
              onChangeText={val => this.onChange("subject", val)}
            />
          </Item>
          <DatePicker
            defaultDate={new Date()}
            minimumDate={new Date(1951, 1, 1)}
            maximumDate={new Date(2051, 12, 31)}
            locale={"en"}
            timeZoneOffsetInMinutes={undefined}
            modalTransparent={false}
            animationType={"fade"}
            androidMode={"default"}
            placeHolderText="Select date"
            textStyle={{ color: "green" }}
            placeHolderTextStyle={{ color: "#d3d3d3" }}
            onDateChange={val =>
              this.onChange("startDate", val.toJSON().slice(0, 10))
            }
          />
          <DatePicker
            defaultDate={new Date()}
            minimumDate={new Date(1951, 1, 1)}
            maximumDate={new Date(2051, 12, 31)}
            locale={"en"}
            timeZoneOffsetInMinutes={undefined}
            modalTransparent={false}
            animationType={"fade"}
            androidMode={"default"}
            placeHolderText="Select date"
            textStyle={{ color: "green" }}
            placeHolderTextStyle={{ color: "#d3d3d3" }}
            onDateChange={val =>
              this.onChange("endDate", val.toJSON().slice(0, 10))
            }
          />
        </Content>
        <Button
          backgroundColor="#3F51B5"
          containerViewStyle={styles.loginButtton}
          rounded
          title={
            this.props.navigation.getParam("selectedEducation", null)
              ? "Update"
              : "Add"
          }
          onPress={() => {
            let education = "";

            const educationsList = this.props.navigation.getParam(
              "educations",
              []
            );
            const selectedEducation = this.props.navigation.getParam(
              "selectedEducation",
              null
            );

            if (selectedEducation) {
              const deletedEducationList = educationsList.filter(
                eachEducation => eachEducation.id !== selectedEducation.id
              );

              education = JSON.stringify([
                ...deletedEducationList,
                { ...this.state, id: selectedEducation.id }
              ]);
            } else {
              education = JSON.stringify([
                ...educationsList,
                { ...this.state, id: v4() }
              ]);
            }

            this.props
              .updateUser(education)
              .then(({ data }) => {
                if (data.updateUser.msg === "success") {
                  console.log("add education success");
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

const mapStateToProps = ({ myNavigation }) => {
  return { ...myNavigation };
};

export default compose(
  connect(mapStateToProps),
  graphql(EDUCATION_MUTATION, {
    props: ({ mutate }) => ({
      updateUser: education =>
        mutate({
          variables: {
            education
          },
          refetchQueries: [{ query: EDUCATION_DETAILS_QUERY }]
        })
    })
  })
)(EducationFormScreen);
