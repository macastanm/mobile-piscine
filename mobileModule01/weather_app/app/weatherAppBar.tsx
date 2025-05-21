import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar, TextInput, IconButton } from 'react-native-paper';
import * as Location from 'expo-location';

const WeatherAppBar = ({ onSearch, onLocationFetch }) => {
	const [searchQuery, setSearchQuery] = useState('');

	const handleLocationPress = async () => {
		try {
			let { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== 'granted') {
				console.log('Permission to access location was denied');
				return;
			}

			let location = await Location.getCurrentPositionAsync({});
			onLocationFetch(location.coords);
		} catch (error) {
			console.log('Error getting location', error);
		}
	};

	return (
		<Appbar.Header style={styles.header}>
			<TextInput
				placeholder="Search city"
				value={searchQuery}
				onChangeText={setSearchQuery}
				onSubmitEditing={() => onSearch(searchQuery)}
				style={styles.input}
				mode="outlined"
				left={<TextInput.Icon icon="magnify" />}
			/>
			<IconButton icon="crosshairs-gps" onPress={handleLocationPress} />
		</Appbar.Header>
	);
};

const styles = StyleSheet.create({
	header: {
		backgroundColor: '#87cefa',
		paddingHorizontal: 10,
		paddingBottom: 10,
		alignItems: 'center',
	},
	input: {
		flex: 1,
		marginRight: 8,
		backgroundColor: 'white',
		height: 40,
		borderRadius: 25,
		paddingHorizontal: 15,
	},
});

export default WeatherAppBar;
