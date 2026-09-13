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
import {BluetoothConnection} from '../data/BluetoothConnection';

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
  const connection = useRef(new BluetoothConnection()).current;
  const [devices, setDevices] = useState<Device[]>([]);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectingDeviceId, setConnectingDeviceId] = useState<string | null>(
  null,
);

  const [connectedDeviceId, setConnectedDeviceId] = useState<string | null>(
  null,
);

  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
  const [readResult, setReadResult] = useState<string | null>(null);
  const [reading, setReading] = useState(false);

  const [writing, setWriting] = useState(false);
const [writeResult, setWriteResult] = useState<string | null>(null);
  
  
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

const connectToDevice = async (device: Device) => {
  try {
    setError(null);
    setConnectionStatus(`Connecting to ${device.name || device.id}...`);
    setConnectingDeviceId(device.id);

    scanner.stop();
    setScanning(false);

    const connectedDevice = await connection.connect(device.id);

    setConnectedDeviceId(connectedDevice.id);
    setConnectionStatus(
      `Connected to ${connectedDevice.name || connectedDevice.id}`,
    );
  } catch (connectError) {
    const message =
      connectError instanceof Error
        ? connectError.message
        : 'Failed to connect to device.';

    setError(message);
    setConnectionStatus(null);
  } finally {
    setConnectingDeviceId(null);
  }
};

  const writePanicCharacteristic = async () => {
    if (!connectedDeviceId) {
      return;
    }

    try {
      setError(null);
      setWriting(true);
      setWriteResult(null);

      // "hello" in Base64
      const value = 'aGVsbG8=';

      await connection.writePanicCharacteristic(
        connectedDeviceId,
        value,
      );

      setWriteResult(`Sent: ${value}`);
    } catch (writeError) {
      const message =
        writeError instanceof Error
          ? writeError.message
          : 'Failed to write panic characteristic.';

      setError(message);
    } finally {
      setWriting(false);
    }
  };

const readPanicCharacteristic = async () => {
  if (!connectedDeviceId) {
    return;
  }

  try {
    setError(null);
    setReading(true);
    setReadResult(null);

    const value = await connection.readPanicCharacteristic(
      connectedDeviceId,
    );

    setReadResult(`Received: ${value}`);
  } catch (readError) {
    const message =
      readError instanceof Error
        ? readError.message
        : 'Failed to read panic characteristic.';

    setError(message);
  } finally {
    setReading(false);
  }
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

{connectionStatus && (
  <Text style={styles.connectionStatus}>{connectionStatus}</Text>
)}

{connectedDeviceId && (
  <View style={styles.readSection}>
    <Pressable
      style={styles.button}
      onPress={readPanicCharacteristic}
      disabled={reading}>
      <Text style={styles.buttonText}>
        {reading ? 'READING...' : 'READ PING'}
      </Text>
    </Pressable>

    {readResult && (
      <Text style={styles.readResult}>
        {readResult}
      </Text>
    )}
  </View>
)}

{connectedDeviceId && (
  <View style={styles.writeSection}>
    <Pressable
      style={styles.button}
      onPress={writePanicCharacteristic}
      disabled={writing}>
      <Text style={styles.buttonText}>
        {writing ? 'WRITING...' : 'WRITE HELLO'}
      </Text>
    </Pressable>

    {writeResult && (
      <Text style={styles.writeResult}>
        {writeResult}
      </Text>
    )}
  </View>
)}

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

    <Pressable
      style={styles.connectButton}
      onPress={() => connectToDevice(device)}
      disabled={connectingDeviceId !== null}>
      <Text style={styles.connectButtonText}>
        {connectingDeviceId === device.id
          ? 'CONNECTING...'
          : connectedDeviceId === device.id
          ? 'CONNECTED'
          : 'CONNECT'}
      </Text>
    </Pressable>
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
  connectButton: {
  marginTop: 12,
  paddingVertical: 10,
  paddingHorizontal: 16,
  borderRadius: 8,
  backgroundColor: '#333333',
  alignItems: 'center',
},

connectButtonText: {
  color: '#ffffff',
  fontSize: 14,
  fontWeight: '700',
},

connectionStatus: {
  marginTop: 15,
  fontSize: 15,
  fontWeight: '600',
},

readSection: {
  marginTop: 15,
},

readResult: {
  marginTop: 12,
  fontSize: 16,
  fontWeight: '600',
},

  writeSection: {
    marginTop: 15,
  },

  writeResult: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
  },

});