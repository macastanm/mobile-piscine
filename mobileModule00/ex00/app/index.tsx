// import { Text, View } from "react-native";
//
// export default function Index() {
//   return (
//     <View
//       style={{
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <Text>Edit app/index.tsx to edit this screen.</Text>
//     </View>
//   );
// }

import {Button, Text, View, StyleSheet} from "react-native";
import React from 'react';

export default function Index() {
    const handlePress = () => {
        console.log('Button was pressed!');
    };
    return (
        <View style={styles.container}>
            <Text style={styles.text}>A simple text</Text>
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