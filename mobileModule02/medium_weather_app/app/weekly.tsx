import { View, Text, StyleSheet } from 'react-native';
import {useLocation} from "@/app/locationContext";

export default function WeeklyScreen() {
	const { location } = useLocation();
	return (
		<View style={styles.container}>
			<Text>Weekly</Text>
			<Text>{location}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
