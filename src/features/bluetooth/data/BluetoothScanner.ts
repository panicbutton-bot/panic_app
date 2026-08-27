import {Device} from 'react-native-ble-plx';
import {bluetoothManager} from './BluetoothManager';

export class BluetoothScanner {
  scan(
    onDeviceFound: (device: Device) => void,
    onError: (error: Error) => void,
  ): void {
    bluetoothManager.startDeviceScan(
      null,
      null,
      (error, device) => {
        if (error) {
          onError(error);
          return;
        }

        if (device) {
          onDeviceFound(device);
        }
      },
    );
  }

  stop(): void {
    bluetoothManager.stopDeviceScan();
  }

  destroy(): void {
    // The shared BLE manager must not be destroyed here.
  }
}
