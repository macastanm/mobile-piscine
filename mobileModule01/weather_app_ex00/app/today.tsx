import { View, Text, StyleSheet } from 'react-native';

export default function TodayScreen() {
	return (
		<View style={styles.container}>
			<Text>Today</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
