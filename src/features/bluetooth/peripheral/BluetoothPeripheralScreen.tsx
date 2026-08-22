import React, {useEffect, useRef, useState} from 'react';
import {
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {BluetoothPeripheral} from './BluetoothPeripheral';

async function requestPermissions(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return false;
  }

  if (Number(Platform.Version) >= 31) {
    const result = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    ]);

    return (
      result[PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE] ===
        PermissionsAndroid.RESULTS.GRANTED &&
      result[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] ===
        PermissionsAndroid.RESULTS.GRANTED
    );
  }

  return true;
}

export function BluetoothPeripheralScreen() {
  const peripheral = useRef(new BluetoothPeripheral()).current;
  const [status, setStatus] = useState('Starting...');

  useEffect(() => {
    let active = true;

    const start = async () => {
      const granted = await requestPermissions();

      if (!granted) {
        if (active) {
          setStatus('Bluetooth permission denied');
        }
        return;
      }

      try {
        peripheral.start();

        if (active) {
          setStatus('Advertising as PanicApp');
        }
      } catch (error) {
        if (active) {
          setStatus(
            error instanceof Error
              ? error.message
              : 'Failed to start advertising',
          );
        }
      }
    };

    start();

    return () => {
      active = false;
      peripheral.stop();
    };
  }, [peripheral]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BLE Peripheral</Text>
      <Text style={styles.status}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
  },

  status: {
    marginTop: 20,
    fontSize: 16,
  },
});
