import React, {useEffect, useRef, useState} from 'react';
import {
  PermissionsAndroid,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Device} from 'react-native-ble-plx';
import {BluetoothScanner} from '../data/BluetoothScanner';

async function requestBluetoothPermissions(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return true;
  }

  const apiLevel = Number(Platform.Version);

  if (apiLevel >= 31) {
    const result = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    ]);

    return (
      result[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] ===
        PermissionsAndroid.RESULTS.GRANTED &&
      result[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] ===
        PermissionsAndroid.RESULTS.GRANTED
    );
  }

  const result = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  return result === PermissionsAndroid.RESULTS.GRANTED;
}

export function BluetoothScannerScreen() {
  const scanner = useRef(new BluetoothScanner()).current;

  const [devices, setDevices] = useState<Device[]>([]);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startScan = async () => {
    setError(null);

    const permissionGranted = await requestBluetoothPermissions();

    if (!permissionGranted) {
      setError('Bluetooth permissions were not granted.');
      return;
    }

    setDevices([]);
    setScanning(true);

    scanner.scan(
      device => {
        setDevices(current => {
          if (current.some(item => item.id === device.id)) {
            return current;
          }

          return [...current, device];
        });
      },
      scanError => {
        setError(scanError.message);
        setScanning(false);
      },
    );

    setTimeout(() => {
      scanner.stop();
      setScanning(false);
    }, 10000);
  };

  const stopScan = () => {
    scanner.stop();
    setScanning(false);
  };

  useEffect(() => {
    return () => {
      scanner.stop();
      scanner.destroy();
    };
  }, [scanner]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Bluetooth Scanner</Text>

      <Pressable
        style={styles.button}
        onPress={scanning ? stopScan : startScan}>
        <Text style={styles.buttonText}>
          {scanning ? 'STOP SCAN' : 'SCAN'}
        </Text>
      </Pressable>

      {error && <Text style={styles.error}>{error}</Text>}

      <Text style={styles.count}>
        Found devices: {devices.length}
      </Text>

      <ScrollView>
        {devices.map(device => (
          <View key={device.id} style={styles.device}>
            <Text style={styles.deviceName}>
              {device.name || 'Unknown device'}
            </Text>

            <Text style={styles.deviceId}>{device.id}</Text>

            <Text style={styles.rssi}>
              RSSI: {device.rssi ?? 'unknown'}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
  },

  button: {
    padding: 18,
    borderRadius: 12,
    backgroundColor: '#d71920',
    alignItems: 'center',
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },

  count: {
    marginVertical: 20,
    fontSize: 18,
  },

  device: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
  },

  deviceName: {
    fontSize: 17,
    fontWeight: '600',
  },

  deviceId: {
    marginTop: 5,
    fontSize: 12,
  },

  rssi: {
    marginTop: 5,
    fontSize: 13,
  },

  error: {
    marginTop: 15,
    fontSize: 14,
  },
});