import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import CalculatorFacade from './src/screens/CalculatorFacade';
import { useEffect } from 'react';
import * as Location from 'expo-location';
import { Audio } from 'expo-av';

export default function App() {
  // Pre-request permissions silently so the app is ready for an emergency
  useEffect(() => {
    (async () => {
      await Location.requestForegroundPermissionsAsync();
      await Audio.requestPermissionsAsync();
    })();
  }, []);

  return (
    <View style={styles.container}>
      <CalculatorFacade />
      <StatusBar style="light" hidden />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
