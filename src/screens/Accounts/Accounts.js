import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  Picker,
  Image,
  Alert
} from "react-native";
import { Container, Content, View, Button } from "native-base";
import { ImagePicker } from "expo";
import { connect } from "react-redux";
import { Query, compose, graphql } from "react-apollo";
import { CREATE_USER_PRO_MUTATION } from "../../config/mutations";

import { TYPES_OF_JOB_QUERY } from "../../config/queries";

import { SELECT_A_JOB_TITLE } from "../../config/CONSTANTS";

const jobTitles = ["job1", "job2", "job3", "job4"];

class Accounts extends Component {
  state = {
    jobTitle: SELECT_A_JOB_TITLE,
    verifyingDoc1Image: null,
    verifyingDoc2Image: null,
    verifyingDoc1Base64: "",
    verifyingDoc2Base64: ""
  };

  _pickImage = async (image, base64) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      base64: true
    });

    if (!result.cancelled) {
      this.setState({ [image]: result.uri, [base64]: result.base64 });
    }
  };

  render() {
    const { verifyingDoc1Image, verifyingDoc2Image } = this.state;

    return (
      <ScrollView scrollEnabled>
        <Container>
          <Content scrollEnabled>
            <Button
              rounded
              block
              onPress={() => {
                const {
                  jobTitle,
                  verifyingDoc1Base64,
                  verifyingDoc2Base64
                } = this.state;

                if (
                  (jobTitle !== SELECT_A_JOB_TITLE && verifyingDoc1Base64,
                  verifyingDoc2Base64)
                ) {
                  this.props
                    .createUserPro(
                      jobTitle,
                      verifyingDoc1Base64,
                      verifyingDoc2Base64
                    )
                    .then(response => {
                      console.log("response use pros: ", response);
                    })
                    .catch(error =>
                      console.log("data error: ", JSON.stringify(error))
                    );
                } else {
                  Alert.alert(
                    "JobTitle Empty or Image not Uploaded",
                    "Please give title and upload both images",
                    [{ text: "OK" }]
                  );
                }
              }}
            >
              <Text>Submit</Text>
            </Button>
            <Query query={TYPES_OF_JOB_QUERY}>
              {({ loading, error, data }) => {
                {
                  /* const jobTitles = [SELECT_A_JOB_TITLE, ...data]; */
                }

                if (loading) return <Text>Fetching Data ...</Text>;
                if (error) return <Text>Error Fetching Data !</Text>;

                return (
                  <ScrollView scrollEnabled>
                    {/* <Text>asdasdasdsad</Text> */}
                    <Picker
                      selectedValue={this.state.jobTitle}
                      style={styles.pickerStyle}
                      onValueChange={jobTitle => this.setState({ jobTitle })}
                    >
                      {jobTitles &&
                        jobTitles.map(jobTitle => (
                          <Picker.Item
                            key={jobTitle}
                            label={jobTitle}
                            value={jobTitle}
                          />
                        ))}
                    </Picker>
                  </ScrollView>
                );
              }}
            </Query>
            <Text>Verifying Document 1: </Text>
            <Button
              rounded
              block
              onPress={this._pickImage.bind(
                this,
                "verifyingDoc1Image",
                "verifyingDoc1Base64"
              )}
            >
              <Text>Upload Image</Text>
            </Button>
            {verifyingDoc1Image && (
              <Image
                source={{ uri: verifyingDoc1Image }}
                style={{ width: 200, height: 200 }}
              />
            )}

            <Text>Verifying Document 2: </Text>
            <Button
              rounded
              block
              onPress={this._pickImage.bind(
                this,
                "verifyingDoc2Image",
                "verifyingDoc2Base64"
              )}
            >
              <Text>Upload Image</Text>
            </Button>
            {verifyingDoc2Image && (
              <Image
                source={{ uri: verifyingDoc2Image }}
                style={{ width: 200, height: 200 }}
              />
            )}
          </Content>
        </Container>
      </ScrollView>
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
  pickerStyle: {
    height: 50,
    width: "100%"
  }
});

const mapStateToProps = ({ myNavigationReducer }) => {
  return { ...myNavigationReducer };
};

export default compose(
  connect(mapStateToProps),
  graphql(CREATE_USER_PRO_MUTATION, {
    props: ({ mutate }) => ({
      createUserPro: (jobTitle, verifyingDoc1Base64, verifyingDoc2Base64) =>
        mutate({
          variables: { jobTitle, verifyingDoc1Base64, verifyingDoc2Base64 }
        })
    })
  })
)(Accounts);
