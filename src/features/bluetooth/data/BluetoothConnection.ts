import {Device} from 'react-native-ble-plx';
import {bluetoothManager} from './BluetoothManager';

export class BluetoothConnection {
  async connect(deviceId: string): Promise<Device> {
    const device = await bluetoothManager.connectToDevice(deviceId);

    await device.discoverAllServicesAndCharacteristics();

    return device;
  }

  async disconnect(deviceId: string): Promise<void> {
    try {
      await bluetoothManager.cancelDeviceConnection(deviceId);
    } catch {
      // Device may already be disconnected.
    }
  }
}
