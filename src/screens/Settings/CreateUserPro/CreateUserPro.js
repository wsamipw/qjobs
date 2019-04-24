import React, { Component } from "react";
import {
  StyleSheet,
  ScrollView,
  Picker,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
  StatusBar
} from "react-native";
import { Container, Content, Button, Text, View, Toast } from "native-base";
import { ImagePicker } from "expo";
import { connect } from "react-redux";
import { Query, compose, graphql } from "react-apollo";
// import DropdownAlert from "react-native-dropdownalert";

import { CREATE_USER_PRO_MUTATION } from "../../../config/mutations";

import { JOB_TITLES_QUERY } from "../../../config/queries";

import { SELECT_A_JOB_TITLE, PRIMARY_COLOR } from "../../../config/CONSTANTS";

class CreateUserPro extends Component {
  static navigationOptions = {
    headerTitle: "Register as Pro User",
    headerStyle: {
      backgroundColor: "#5968ef"
    },
    headerTintColor: "#ffffff"
  };

  state = {
    jobTitle: SELECT_A_JOB_TITLE,
    verifyingDoc1Image: null,
    verifyingDoc2Image: null,
    verifyingDoc1Base64: null,
    verifyingDoc2Base64: null,

    loading: false
  };

  componentWillUnmount() {
    // Toast.toastInstance = null;

    this.setState({
      jobTitle: SELECT_A_JOB_TITLE,
      verifyingDoc1Image: null,
      verifyingDoc2Image: null,
      verifyingDoc1Base64: null,
      verifyingDoc2Base64: null
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

  render() {
    const { verifyingDoc1Image, verifyingDoc2Image } = this.state;

    return (
      <Container>
        <Content
          scrollEnabled
          style={{
            padding: 16
          }}
        >
          <StatusBar barStyle="light-content" backgroundColor={PRIMARY_COLOR} />
          <Text
            style={{
              fontWeight: "bold"
            }}
          >
            Select The Job Title you want to Upgrade:
          </Text>
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
          <View style={styles.docUploadWrapper}>
            <Text
              style={{
                fontWeight: "bold"
              }}
            >
              Verifying Document I
            </Text>
            {verifyingDoc1Image && (
              <Image
                source={{ uri: verifyingDoc1Image }}
                style={{ width: 200, height: 200, marginVertical: 10 }}
              />
            )}
            <Button
              rounded
              bordered
              block
              style={{
                marginTop: 8
              }}
              onPress={this._pickImage.bind(
                this,
                "verifyingDoc1Image",
                "verifyingDoc1Base64"
              )}
            >
              <Text>{verifyingDoc1Image ? "Change" : "Upload"}</Text>
            </Button>
          </View>
          <View style={styles.docUploadWrapper}>
            <Text
              style={{
                fontWeight: "bold"
              }}
            >
              Verifying Document II
            </Text>
            {verifyingDoc2Image && (
              <Image
                source={{ uri: verifyingDoc2Image }}
                style={{ width: 200, height: 200, marginVertical: 10 }}
              />
            )}
            <Button
              rounded
              bordered
              block
              style={{
                marginTop: 8
              }}
              onPress={this._pickImage.bind(
                this,
                "verifyingDoc2Image",
                "verifyingDoc2Base64"
              )}
            >
              <Text>{verifyingDoc2Image ? "Change" : "Upload"}</Text>
            </Button>
          </View>
          <Button
            rounded
            backgroundColor={PRIMARY_COLOR}
            block
            disabled={this.state.loading}
            style={{
              marginBottom: 20
            }}
            onPress={() => {
              const {
                jobTitle,
                verifyingDoc1Base64,
                verifyingDoc2Base64
              } = this.state;

              if (
                jobTitle !== SELECT_A_JOB_TITLE &&
                (verifyingDoc1Base64 || verifyingDoc2Base64)
              ) {
                this.setState({ loading: true }, () => {
                  this.props
                    .createUserPro(
                      jobTitle,
                      verifyingDoc1Base64,
                      verifyingDoc2Base64
                    )
                    .then(response => {
                      console.log("response use pros: ", response);
                      if (
                        response.data.createUserpro.status === 200 &&
                        response.data.createUserpro.msg === "success"
                      ) {
                        this.setState({ loading: false });
                        // this.dropdown.alertWithType(
                        //   "success",
                        //   "Success",
                        //   "Successfully Updated"
                        // );
                        Toast.show({
                          text: "Successfully Registered",
                          buttonText: "Okay",
                          duration: 3000,
                          position: "bottom",
                          type: "success"
                        });
                      } else throw new Error(response.data.createUserpro.msg);
                    })
                    .catch(error => {
                      this.setState({ loading: false });
                      console.log(
                        "register pro error: ",
                        JSON.stringify(error)
                      );

                      Toast.show({
                        text: error.message,
                        buttonText: "Okay",
                        duration: 3000,
                        position: "bottom",
                        type: "danger"
                      });

                      // this.dropdown.alertWithType(
                      //   "error",
                      //   "Error",
                      //   error.message
                      // );
                    });
                });
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
        </Content>
        {/* <DropdownAlert ref={ref => (this.dropdown = ref)} /> */}
      </Container>
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
  },
  docUploadWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
    borderWidth: 2,
    borderColor: "#d3d3d3",
    borderRadius: 10,
    borderStyle: "dashed",
    padding: 15
    // minHeight: 150
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
)(CreateUserPro);
