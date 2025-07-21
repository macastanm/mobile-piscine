import {
  Button,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import React, { useState } from "react";
import { evaluate } from "mathjs";
import { SafeAreaView } from "react-native-safe-area-context";

const BUTTONS_PORTRAIT = [
  ["7", "8", "9", "C", "AC"],
  ["4", "5", "6", "+", "-"],
  ["1", "2", "3", "*", "/"],
  ["0", ".", "00", "="],
];

const BUTTONS_LANDSCAPE = [
  ["5", "6", "7", "8", "9", "C", "AC"],
  ["0", "1", "2", "3", "4", "+", "-"],
  ["00", ".", "*", "/", "="],
];

export default function Index() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const BUTTONS = isLandscape ? BUTTONS_LANDSCAPE : BUTTONS_PORTRAIT;
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");
  const handlePress = (value: string) => {
    if (value === "C") {
      setExpression((prev) => prev.slice(0, -1));
    } else if (value === "AC/" || value === "AC") {
      setExpression("");
      setResult("");
    } else if (value === "=") {
      try {
        const evalResult = evaluate(expression);
        setResult(evalResult.toString());
      } catch (e) {
        setResult("Error");
      }
    } else {
      setExpression((prev) => prev + value);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <View style={styles.display}>
        <Text style={styles.secondaryDisplay}>{expression || "0"}</Text>
        <Text style={styles.mainDisplay}>{result || "0"}</Text>
      </View>
      {BUTTONS.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((buttonValue, colIndex) => {
            const isEqualButton = buttonValue === "=";

            return (
              <TouchableOpacity
                key={colIndex}
                style={[
                  styles.button,
                  isLandscape && { paddingVertical: 8 },
                  isEqualButton && styles.equalButton,
                ]}
                onPress={() => handlePress(buttonValue)}
              >
                <Text style={styles.buttonText}>{buttonValue}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    justifyContent: "flex-end",
    flex: 1,
    backgroundColor: "#fff",
  },
  display: {
    // paddingVertical: 15,
    // borderRadius: 2,
    // marginBottom: 1,
    alignItems: "flex-end",
  },
  secondaryDisplay: {
    paddingVertical: 10,
    borderRadius: 2,
    fontSize: 26,
    marginBottom: 1,
    color: "#666",
  },
  mainDisplay: {
    paddingVertical: 10,
    borderRadius: 2,
    fontSize: 32,
    marginBottom: 1,
    fontWeight: "bold",
    color: "#000",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  button: {
    flex: 1,
    marginHorizontal: 2,
    backgroundColor: "#e0e0e0",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  equalButton: {
    flex: 2.03,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
