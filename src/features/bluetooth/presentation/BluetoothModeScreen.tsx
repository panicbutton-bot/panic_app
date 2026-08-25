import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {BluetoothScannerScreen} from './BluetoothScannerScreen';
import {BluetoothPeripheralScreen} from '../peripheral/BluetoothPeripheralScreen';

type BluetoothMode = 'menu' | 'scanner' | 'peripheral';

export function BluetoothModeScreen() {
  const [mode, setMode] = useState<BluetoothMode>('menu');

  if (mode === 'scanner') {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setMode('menu')}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <BluetoothScannerScreen />
      </SafeAreaView>
    );
  }

  if (mode === 'peripheral') {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setMode('menu')}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <BluetoothPeripheralScreen />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>PANIC APP</Text>

        <Text style={styles.subtitle}>Bluetooth</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setMode('scanner')}>
          <Text style={styles.buttonText}>Scanner</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setMode('peripheral')}>
          <Text style={styles.buttonText}>Advertising</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },

  title: {
    textAlign: 'center',
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 10,
  },

  subtitle: {
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 40,
  },

  button: {
    marginVertical: 8,
    paddingVertical: 18,
    borderRadius: 12,
    backgroundColor: '#222',
  },

  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },

  backButton: {
    padding: 16,
  },

  backText: {
    fontSize: 17,
  },
});
