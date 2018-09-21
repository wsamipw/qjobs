import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { Container, Content, Item, Input, DatePicker } from "native-base";
import { Button } from "react-native-elements";
import { connect } from "react-redux";
import {
  WORK_EXPERIENCE_DETAILS_QUERY,
  WORK_EXPERIENCE_MUTATION
} from "../../config/mutations";

import { compose, graphql } from "react-apollo";

import { v4 } from "uuid";

class WorkExperienceFormScreen extends Component {
  state = {
    organisationName: "",
    location: "",
    field: "",
    designation: "",
    startDate: null,
    endDate: null
  };

  componentDidMount() {
    const data = this.props.navigation.getParam("selectedWorkExperience", null);

    if (data) {
      const {
        organisationName,
        location,
        field,
        designation,
        startDate,
        endDate
      } = data;

      this.setState({
        organisationName,
        location,
        field,
        designation,
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
              placeholder="Organisation Name"
              value={this.state.organisationName}
              onChangeText={val => this.onChange("organisationName", val)}
            />
          </Item>
          <Item rounded>
            <Input
              placeholder="Location"
              value={this.state.location}
              onChangeText={val => this.onChange("location", val)}
            />
          </Item>
          <Item rounded>
            <Input
              placeholder="Field"
              value={this.state.field}
              onChangeText={val => this.onChange("field", val)}
            />
          </Item>
          <Item rounded>
            <Input
              placeholder="Designation"
              value={this.state.designation}
              onChangeText={val => this.onChange("designation", val)}
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
            this.props.navigation.getParam("selectedWorkExperience", null)
              ? "Update"
              : "Add"
          }
          onPress={() => {
            let workExperience = "";

            const workExperiencesList = this.props.navigation.getParam(
              "workExperiences",
              []
            );
            const selectedWorkExperience = this.props.navigation.getParam(
              "selectedWorkExperience",
              null
            );

            if (selectedWorkExperience) {
              const deletedWorkExperienceList = workExperiencesList.filter(
                eachWorkExperience =>
                  eachWorkExperience.id !== selectedWorkExperience.id
              );

              workExperience = JSON.stringify([
                ...deletedWorkExperienceList,
                { ...this.state, id: selectedWorkExperience.id }
              ]);
            } else {
              workExperience = JSON.stringify([
                ...workExperiencesList,
                { ...this.state, id: v4() }
              ]);
            }

            this.props
              .updateUser(workExperience)
              .then(({ data }) => {
                if (data.updateUser.msg === "success") {
                  console.log("add work experience success");
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
  graphql(WORK_EXPERIENCE_MUTATION, {
    props: ({ mutate }) => ({
      updateUser: workExperience =>
        mutate({
          variables: {
            workExperience
          },
          refetchQueries: [{ query: WORK_EXPERIENCE_DETAILS_QUERY }]
        })
    })
  })
)(WorkExperienceFormScreen);
