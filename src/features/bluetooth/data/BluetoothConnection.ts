import {Device} from 'react-native-ble-plx';
import {bluetoothManager} from './BluetoothManager';

export const PANIC_SERVICE_UUID =
  '71f271d0-8f4c-4c4d-8a2d-6f3a9497b41d';

export const PANIC_CHARACTERISTIC_UUID =
  '4ad4a6d2-3f4a-477c-9832-5e0d8f7654d8';

export class BluetoothConnection {
  async connect(deviceId: string): Promise<Device> {
    const device = await bluetoothManager.connectToDevice(deviceId);

    await device.discoverAllServicesAndCharacteristics();

    return device;
  }

  async readPanicCharacteristic(deviceId: string): Promise<string> {
    const characteristic =
      await bluetoothManager.readCharacteristicForDevice(
        deviceId,
        PANIC_SERVICE_UUID,
        PANIC_CHARACTERISTIC_UUID,
      );

    if (!characteristic.value) {
      throw new Error('Panic characteristic returned no value.');
    }

    return characteristic.value;
  }

  async writePanicCharacteristic(
    deviceId: string,
    value: string,
  ): Promise<void> {
    await bluetoothManager.writeCharacteristicWithResponseForDevice(
      deviceId,
      PANIC_SERVICE_UUID,
      PANIC_CHARACTERISTIC_UUID,
      value,
    );
  }

  async disconnect(deviceId: string): Promise<void> {
    try {
      await bluetoothManager.cancelDeviceConnection(deviceId);
    } catch {
      // Device may already be disconnected.
    }
  }
}