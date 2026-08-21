import {BleManager, Device} from 'react-native-ble-plx';

export class BluetoothScanner {
  private manager: BleManager;

  constructor() {
    this.manager = new BleManager();
  }

  scan(
    onDeviceFound: (device: Device) => void,
    onError: (error: Error) => void,
  ): void {
    this.manager.startDeviceScan(
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
    this.manager.stopDeviceScan();
  }

  destroy(): void {
    this.manager.destroy();
  }
}
