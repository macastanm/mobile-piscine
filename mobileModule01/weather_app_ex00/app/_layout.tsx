import React, {useState} from 'react';
import {View, StyleSheet, TextInput} from 'react-native';
import {Tabs} from 'expo-router';
import { Appbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Layout() {
    const [searchQuery, setSearchQuery] = useState('');
    const primaryColor = '#6200ee';

    return (
        <View style={{ flex: 1 }}>
            <Appbar.Header style={{ backgroundColor: primaryColor }}>
                <TextInput
                    style={[styles.searchInput, { backgroundColor: 'white' }]}
                    placeholder="Search city..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <Appbar.Action icon="crosshairs-gps" onPress={() => {}} iconColor="white" />
            </Appbar.Header>

            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: 'white',
                    tabBarInactiveTintColor: '#ccc',
                    tabBarStyle: { backgroundColor: primaryColor },
                    headerShown: false,
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Currently',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="weather-cloudy" color={color} size={size} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="today"
                    options={{
                        title: 'Today',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="calendar-today" color={color} size={size} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="weekly"
                    options={{
                        title: 'Weekly',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="calendar-week" color={color} size={size} />
                        ),
                    }}
                />
            </Tabs>
        </View>
    );
}

const styles = StyleSheet.create({
    searchInput: {
        flex: 1,
        borderRadius: 4,
        marginLeft: 10,
        paddingHorizontal: 10,
        height: 40,
    },
});
