import { StyleSheet, Dimensions } from "react-native";

const styles = StyleSheet.create({
  contentStyle: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover" // or 'stretch'
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "black",
    opacity: 0.4
  },
  mainContent: {
    flex: 1,
    marginTop: Dimensions.get("window").height * 0.1,
    width: Dimensions.get("screen").width * 0.8,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center"
  },

  logo: {
    height: 80,
    width: 80,
    resizeMode: "contain",
    marginBottom: 26
  },
  inputWrapper: {
    marginVertical: 4,
    backgroundColor: "rgba(255,255,255,0.5)"
  },
  inputStyles: {
    paddingLeft: 15,
    color: "white",
    flex: 1,
    borderRadius: 50
  },

  showPassIcon: {
    color: "grey",
    borderBottomRightRadius: 50,
    borderTopRightRadius: 50,
    marginLeft: 0
  },

  loginButtton: {
    width: "100%",
    marginVertical: 15
  },
  socialLoginWrapper: {
    flex: 1,
    width: "100%",
    position: "absolute",
    bottom: 75
  },

  SocialloginButtton: {
    width: "100%",
    marginHorizontal: 0,
    marginBottom: 8
  },
  bottomTextWrapper: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 20
  },
  bottomText: {
    color: "white",
    fontSize: 12
  }
});

export default styles;
