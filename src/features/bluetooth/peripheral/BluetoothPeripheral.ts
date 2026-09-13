import {
  addEventListener,
  setServices,
  startAdvertising,
  stopAdvertising,
} from 'react-native-bluetooth-ble';

export const PANIC_SERVICE_UUID =
  '71f271d0-8f4c-4c4d-8a2d-6f3a9497b41d';

export const PANIC_CHARACTERISTIC_UUID =
  '4ad4a6d2-3f4a-477c-9832-5e0d8f7654d8';

export class BluetoothPeripheral {
 private writeSubscription?: () => void;

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

    this.writeSubscription = addEventListener(
      'peripheralWriteRequest',
      ({centralId, serviceUUID, characteristicUUID, value}) => {
        console.log('🔵 GATT WRITE RECEIVED');
        console.log('Central:', centralId);
        console.log('Service:', serviceUUID);
        console.log('Characteristic:', characteristicUUID);
        console.log('Value:', value);
      },
    );

    startAdvertising({
      serviceUUIDs: [PANIC_SERVICE_UUID],
      localName: 'PanicApp',
    });

    console.log('🔵 BLE Peripheral started');
  }

  stop(): void {
    this.writeSubscription?.();
    this.writeSubscription = undefined;

    stopAdvertising();

    console.log('🔵 BLE Peripheral stopped');
  }
}