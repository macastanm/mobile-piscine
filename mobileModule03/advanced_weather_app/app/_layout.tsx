import React, {useCallback, useEffect, useState} from 'react';
import {Text, View, StyleSheet, TextInput, TouchableOpacity, Animated, ImageBackground} from 'react-native';
import {Tabs} from 'expo-router';
import { Appbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import {LocationProvider, useLocation} from "@/app/locationContext";
import {debounce} from "@react-navigation/native-stack/src/utils/debounce";
import FlatList = Animated.FlatList;

export default function Layout() {
    return (
        <LocationProvider>
            <MainLayout />
        </LocationProvider>
    );
}

function MainLayout() {
    const [searchQuery, setSearchQuery] = useState('');
    const primaryColor = '#6200ee';
    const { setLocation } = useLocation();
    const [suggestions, setSuggestions] = useState([]);
    const handleLocationPress = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                setLocation({
                    name: 'Error',
                    latitude: 'Geolocation is not available,',
                    longitude: 'please enable it in your App settings',
                });
                return;
            }
            let coordinates = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = coordinates.coords;

            //const locationString = `Lat: ${latitude.toFixed(5)}, Lon: ${longitude.toFixed(5)}`;
            setLocation({
                name: 'Geolocation',
                latitude: `${latitude.toFixed(5)}`,
                longitude: `${longitude.toFixed(5)}`,
            });
            setSearchQuery('');
            //console.log(coordinates.coords);
        } catch (error) {
            console.log('Error getting location', error);
            setLocation({
                name: 'Error',
                latitude: 'Error getting location',
                longitude: 'Please try again',
            });
        }
    };

    async function onSearch(searchQuery: string) {
        //setLocation(searchQuery);
        try {
            const response = await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=1&language=en`
            );
            const data = await response.json();
            if (data.results) {
                handleCitySelect(data.results[0]);
            } else {
                setLocation({
                    name: 'Error',
                    latitude: 'Could not find any result for the supplied',
                    longitude: 'address or coordinates',
                });
            }
        } catch (error) {
            console.error('Error fetching cities:', error);
            setLocation({
                name: 'Error',
                latitude: 'The service connection is lost,',
                longitude: 'please check your internet connection or try again later',
            });
        }
        setSuggestions([]);
    }

    const fetchCitySuggestions = useCallback(
        debounce(async (query) => {
            if (!query.trim()) {
                setSuggestions([]);
                return;
            }
            try {
                const response = await fetch(
                    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en`
                );
                const data = await response.json();
                if (data.results) {
                    setSuggestions(data.results);
                } else {
                    setSuggestions([]);
                }
            } catch (error) {
                console.error('Error fetching cities:', error);
                setLocation({
                    name: 'Error',
                    latitude: 'The service connection is lost,',
                    longitude: 'please check your internet connection or try again later',
                });
                setSuggestions([]);
            }
        }, 300),
        []
    );

    useEffect(() => {
        fetchCitySuggestions(searchQuery);
    }, [searchQuery]);
    function handleCitySelect(city) {
        //const locationString = `Lat: ${city.latitude}, Lon: ${city.longitude}`;
        setLocation({
            name: `${city.name}, ${city.admin1}, ${city.country}`,
            latitude: `${city.latitude}`,
            longitude: `${city.longitude}`,
        });
        setSearchQuery('');
        setSuggestions([]);
    }


    return (
        <ImageBackground
            source={require('@/assets/images/background.jpg')}
            style={styles.background}
            resizeMode="cover"
        >
        <View style={{ flex: 1, backgroundColor: 'transparent' }}>
            <Appbar.Header style={{ backgroundColor: primaryColor }}>
                <TextInput
                    style={[styles.searchInput, { backgroundColor: 'white' }]}
                    placeholder="Search city..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={() => onSearch(searchQuery)}
                />
                <Appbar.Action icon="crosshairs-gps" onPress={handleLocationPress} iconColor="white" />
            </Appbar.Header>
            {suggestions.length > 0 && (
                <FlatList
                    data={suggestions}
                    keyExtractor={(item) => item.id.toString()}
                    style={{ backgroundColor: 'white', maxHeight: 200 }}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => handleCitySelect(item)}
                            style={{
                                padding: 10,
                                borderBottomColor: '#eee',
                                borderBottomWidth: 1,
                            }}
                        >
                            <Text>{item.name}, {item.admin1}, {item.country}</Text>
                        </TouchableOpacity>
                    )}
                />
            )}
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
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    searchInput: {
        flex: 1,
        borderRadius: 4,
        marginLeft: 10,
        paddingHorizontal: 10,
        height: 40,
    },
});
