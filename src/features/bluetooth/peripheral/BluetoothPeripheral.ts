import {
  setServices,
  startAdvertising,
  stopAdvertising,
} from 'react-native-bluetooth-ble';

export const PANIC_SERVICE_UUID =
  '71f271d0-8f4c-4c4d-8a2d-6f3a9497b41d';

export const PANIC_CHARACTERISTIC_UUID =
  '4ad4a6d2-3f4a-477c-9832-5e0d8f7654d8';

export class BluetoothPeripheral {
  start(): void {
    setServices([
      {
        uuid: PANIC_SERVICE_UUID,
        characteristics: [
          {
            uuid: PANIC_CHARACTERISTIC_UUID,
            properties: [
              'read',
              'write',
              'writeWithoutResponse',
              'notify',
            ],
            value: '70696e67',
          },
        ],
      },
    ]);

    startAdvertising({
      serviceUUIDs: [PANIC_SERVICE_UUID],
      localName: 'PanicApp',
    });
  }

  stop(): void {
    stopAdvertising();
  }
}
