import {Button, Text, View, StyleSheet} from "react-native";
import React, { useState } from 'react';

export default function Index() {
    const [text, setText] = useState('a simple text');
    const handlePress = () => {
        //console.log('Button was pressed!');
        setText(prevText =>
            prevText === 'a simple text' ? 'hello world' : 'a simple text'
        );
    };
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{text}</Text>
            <View style={styles.buttonContainer}>
                <Button title="Click me" onPress={handlePress} />
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 20,
        marginBottom: 20,
    },
    buttonContainer: {
        width: 150,
    },
});