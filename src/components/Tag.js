import React from "react";
import { View, StyleSheet } from "react-native";
import { Badge, Text } from "native-base";

const Tag = props => {
  return (
    <View style={styles.tag}>
      <Badge {...props}>
        <Text>{props.text}</Text>
      </Badge>
    </View>
  );
};

const styles = StyleSheet.create({
  tag: {
    position: "absolute",
    right: 0,
    top: 5,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  textStyles: {
    color: "white"
  }
});

export default Tag;
