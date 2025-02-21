import { View, StyleSheet } from 'react-native';
import HomeScreen from './homeScreen';

export default function MainLayout() {
  return (
    <View style={styles.container}>
      <HomeScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});
