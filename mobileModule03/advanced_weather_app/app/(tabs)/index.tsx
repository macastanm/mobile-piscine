import { View, Text, StyleSheet } from 'react-native';
import {useLocation} from "@/app/locationContext";
import {useEffect, useState} from "react";
import {getWeatherDescription , getWeatherIcon} from "@/app/utils";

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
            {isError ? (
                <View style={{ alignItems: 'center' }}>
                    <Text style={styles.errorText}>{location.latitude}</Text>
                    <Text style={styles.errorText}>{location.longitude}</Text>
                </View>
            ) : (
                <View style={styles.content}>
                    <Text style={styles.locationText}>
                        {location.name !== '' ? location.name : 'Currently'}
                    </Text>

                    <Text style={styles.temperatureText}>
                        {temperature !== null ? `🌡️ ${temperature}°C` : ''}
                    </Text>

                    <View style={styles.weatherRow}>
                        <Text style={styles.weatherIcon}>
                            {getWeatherIcon(weatherCode)}
                        </Text>
                        <Text style={styles.weatherDescription}>
                            {getWeatherDescription(weatherCode)}
                        </Text>
                    </View>

                    <Text style={styles.windText}>
                        {windSpeed !== null ? `🌬️ ${windSpeed} km/h` : ''}
                    </Text>
                </View>
            )}
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'transparent',
    },
    content: {
        alignItems: 'center',
        gap: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
    },
    locationText: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    temperatureText: {
        fontSize: 40,
        fontWeight: '600',
    },
    weatherRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    weatherIcon: {
        fontSize: 36,
        marginRight: 8,
    },
    weatherDescription: {
        fontSize: 24,
    },
    windText: {
        fontSize: 24,
        marginTop: 10,
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
    },
});

