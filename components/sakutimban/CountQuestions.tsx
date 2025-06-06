import React from "react";
import { View, Text, ViewStyle } from "react-native";

interface CountBadgeProps {
  current?: number;
  total?: number;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  borderWidth?: number;
  fontSize?: number;
  fontWeight?:
    | "bold"
    | "normal"
    | "100"
    | "200"
    | "300"
    | "400"
    | "500"
    | "600"
    | "700"
    | "800"
    | "900";
  borderRadius?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  containerStyle?: ViewStyle;
  separator?: string;
  showBorder?: boolean;
}

const CountBadge: React.FC<CountBadgeProps> = ({
  current = 0,
  total = 0,
  backgroundColor = "#4CAF50",
  textColor = "#112164",
  fontSize = 16,
  fontWeight = "bold",
  borderRadius = 8,
  paddingHorizontal = 12,
  paddingVertical = 6,
  containerStyle = {},
  separator = "/",
  showBorder = true,
}) => {
  const isCompleted = current >= total;

  const getBadgeStyle = () => {
    const baseStyle: ViewStyle = {
      height: 34,
      backgroundColor,
      borderRadius,
      paddingHorizontal,
      paddingVertical,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "flex-start",
    };

    return {
      ...baseStyle,
    } as ViewStyle;
  };

  return (
    <View style={[getBadgeStyle(), containerStyle]}>
      <Text style={{ fontSize, fontWeight }}>
        {current}
        {separator}
        {total}
      </Text>
    </View>
  );
};

export default CountBadge;
