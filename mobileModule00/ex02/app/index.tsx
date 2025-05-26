import {Button, Text, View, StyleSheet, TouchableOpacity, useWindowDimensions } from "react-native";
import React, { useState } from 'react';

const BUTTONS_PORTRAIT = [
    ['7', '8', '9', 'C', 'AC'],
    ['4', '5', '6', '+', '-'],
    ['1', '2', '3', '*', '/'],
    ['0', '.', '00', '='],
];

const BUTTONS_LANDSCAPE = [
    ['5', '6', '7', '8', '9', 'C', 'AC'],
    ['0', '1', '2', '3', '4', '+', '-'],
    ['00', '.', '*', '/', '='],
];

export default function Index() {
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;
    const BUTTONS = isLandscape ? BUTTONS_LANDSCAPE : BUTTONS_PORTRAIT;
    const handlePress = (value) => {
        console.log('Pressed:', value);
    };
    return (
        <View style={styles.container}>
            <View style={styles.display}>
                <Text style={styles.secondaryDisplay}>0</Text>
                <Text style={styles.mainDisplay}>0</Text>
            </View>
            {BUTTONS.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                    {row.map((buttonValue, colIndex) => {
                        const isEqualButton = buttonValue === '=';

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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        justifyContent: 'flex-end',
        flex: 1,
        backgroundColor: '#fff',
    },
    display: {
        paddingVertical: 15,
        borderRadius: 8,
        marginBottom: 24,
        alignItems: 'flex-end',
    },
    secondaryDisplay: {
        paddingVertical: 10,
        borderRadius: 8,
        fontSize: 20,
        color: '#666',
    },
    mainDisplay: {
        paddingVertical: 10,
        borderRadius: 8,
        fontSize: 36,
        fontWeight: 'bold',
        color: '#000',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    button: {
        flex: 1,
        marginHorizontal: 4,
        backgroundColor: '#e0e0e0',
        paddingVertical: 30,
        borderRadius: 8,
        alignItems: 'center',
    },
    equalButton: {
        flex: 2.03,
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});
