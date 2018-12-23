import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  Picker,
  Image,
  Alert,
  ActivityIndicator,
  Platform
} from "react-native";
import { Container, Content, Button } from "native-base";
import { ImagePicker } from "expo";
import { connect } from "react-redux";
import { Query, compose, graphql } from "react-apollo";
import { CREATE_USER_PRO_MUTATION } from "../../../config/mutations";

import { JOB_TITLES_QUERY } from "../../../config/queries";

import { SELECT_A_JOB_TITLE } from "../../../config/CONSTANTS";
import CustomToast from "../../../config/CustomToast";
// const jobTitles = ["job1", "job2", "job3", "job4"];

class Accounts extends Component {
  static navigationOptions = {
    headerTitle: "Pro User",
    headerStyle: {
      backgroundColor: "#5968ef"
    },
    headerTintColor: "#ffffff"
  };

  state = {
    jobTitle: SELECT_A_JOB_TITLE,
    verifyingDoc1Image: null,
    verifyingDoc2Image: null,
    verifyingDoc1Base64: "",
    verifyingDoc2Base64: ""
  };

  componentWillUnmount() {
    this.setState({
      jobTitle: SELECT_A_JOB_TITLE,
      verifyingDoc1Image: null,
      verifyingDoc2Image: null,
      verifyingDoc1Base64: "",
      verifyingDoc2Base64: ""
    });
  }

  _getImageExtension = uri => {
    let name;
    let extension;

    try {
      [name, extension] = uri
        .split("/")
        .pop()
        .split(".");
    } catch (error) {
      name = "image";
      extension = "jpeg";
    }

    return extension;
  };

  _pickImage = async (image, base64) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      base64: true
    });

    if (!result.cancelled) {
      const extension = this._getImageExtension(result.uri);
      console.log("extension: ", extension);
      this.setState({
        [image]: result.uri,
        [base64]: `data:image/${extension};base64,${result.base64}`
      });
    }
  };

  Default_Toast_Bottom = () => {
    this.refs.defaultToastBottom.ShowToastFunction(
      "Default Toast Bottom Message."
    );
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
                  (jobTitle !== SELECT_A_JOB_TITLE && (verifyingDoc1Base64 || 
                  verifyingDoc2Base64))
                ) {
                  this.props
                    .createUserPro(
                      jobTitle,
                      verifyingDoc1Base64,
                      verifyingDoc2Base64
                    )
                    .then(response => {
                      console.log("response use pros: ", response);
                      if (
                        (response.data.createUserpro.status === 200) &
                        (response.data.createUserpro.msg === "success")
                      ) {
                        this.Default_Toast_Bottom();
                      } else throw new Error(response);
                    })
                    .catch(error =>
                      console.log("data error: ", JSON.stringify(error))
                    );
                } else {
                  Alert.alert(
                    "JobTitle Not Selected or Image not Uploaded",
                    "Please give title and upload both images",
                    [{ text: "OK" }]
                  );
                }
              }}
            >
              <Text>Submit</Text>
            </Button>
            <Query query={JOB_TITLES_QUERY}>
              {({ loading, error, data }) => {
                if (loading)
                  return <ActivityIndicator size="large" color="#ff6347" />;
                if (error) return <Text>Error Fetching Data !</Text>;

                const jobTitles = [
                  { id: SELECT_A_JOB_TITLE, name: SELECT_A_JOB_TITLE },
                  ...data.jobTitle
                ];
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
                            key={jobTitle.id}
                            label={jobTitle.name}
                            value={jobTitle.id}
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
        <CustomToast ref="defaultToastBottom" position="bottom" />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  // For CustomToast
  MainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: Platform.OS == "ios" ? 20 : 0,
    margin: 10
  },
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
