import { View, Text, StyleSheet } from 'react-native';
import {useLocation} from "@/app/locationContext";
import {useEffect, useState} from "react";
import {getWeatherDescription} from "@/app/utils";

export default function CurrentlyScreen() {
    const { location } = useLocation();
    const isError = location.name === 'Error';
    const [temperature, setTemperature] = useState<number | null>(null);
    const [windSpeed, setWindSpeed] = useState<number | null>(null);
    const [weatherCode, setWeatherCode] = useState<number | null>(null);

    useEffect(() => {
        const fetchWeather = async () => {
            if (location.latitude && location.longitude && location.name !== 'Error') {
                try {
                    const response = await fetch(
                        `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current_weather=true`
                    );
                    const data = await response.json();
                    const current = data.current_weather;

                    setTemperature(current.temperature);
                    setWindSpeed(current.windspeed);
                    setWeatherCode(current.weathercode);
                } catch (error) {
                    console.error('Weather fetch error:', error);
                }
            }
        };

        fetchWeather();
    }, [location]);

    return (
        <View style={styles.container}>
            { isError ? (
                <View style={{ alignItems: 'center' }}>
                    <Text style={styles.errorText}>{location.latitude}</Text>
                    <Text style={styles.errorText}>{location.longitude}</Text>
                </View>
            ) : (
                <View style={{ flex: 1 }}>
                    <Text style={styles.title}>{location.name !== '' ? `${location.name}` : 'Currently'}</Text>
                    <Text>{temperature !== null ? `${temperature}°C` : ''}</Text>
                    <Text>{getWeatherDescription(weatherCode)}</Text>
                    <Text>{windSpeed !== null ? `${windSpeed} km/h` : ''}</Text>
                </View>

            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16, backgroundColor: 'transparent', },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
    errorText: { color: 'red', fontSize: 16, textAlign: 'center' },
});
