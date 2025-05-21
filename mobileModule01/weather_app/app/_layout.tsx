import React from 'react';
import { SafeAreaView } from 'react-native';
import WeatherAppBar from "@/app/weatherAppBar";


export default function Index() {
    const handleSearch = (city) => {
        console.log('Search for city:', city);
        // Trigger weather API call
    };

    const handleLocationFetch = (coords) => {
        console.log('Current location coords:', coords);
        // Trigger weather API call using coords.latitude & coords.longitude
    };

    return (
        <SafeAreaView>
            <WeatherAppBar onSearch={handleSearch} onLocationFetch={handleLocationFetch} />
        </SafeAreaView>
    );
}
