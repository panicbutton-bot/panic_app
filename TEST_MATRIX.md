# Panic App Test Matrix

This document records functional verification performed on real devices.

A feature is not considered fully verified merely because the application
builds successfully.

---

# Device Matrix

| Device | Android | Role | Status |
|---|---|---|---|
| Redmi M2101K7BL | Android 13 | Central / Peripheral | Active |
| Lenovo X2-EU | Android 5.0 / API 21 | Legacy test device | Compatibility testing |

---

# BLE GATT Tests

## TEST-001 — BLE Scan

Status: PASS

### Goal

Verify that the application can discover BLE advertising devices.

### Procedure

1. Open Bluetooth Scanner.
2. Start scan.
3. Observe discovered BLE devices.
4. Verify device name / ID / RSSI.

### Expected

BLE peripherals appear in the scanner.

### Result

PASS — BLE devices were discovered successfully.

---

## TEST-002 — BLE Peripheral Advertising

Status: PASS

### Goal

Verify that Panic App can operate as a BLE peripheral.

### Procedure

1. Open Peripheral mode.
2. Start advertising.
3. Search for the device from another phone.

### Expected

`PanicApp` is discoverable.

### Result

PASS — PanicApp advertising was successfully detected.

---

## TEST-003 — GATT Connection

Status: PASS

### Goal

Verify Central → Peripheral GATT connection.

### Procedure

1. Start Peripheral advertising.
2. Start Central scan.
3. Connect to PanicApp.
4. Discover services and characteristics.

### Expected

Connection succeeds and custom GATT service is discovered.

### Result

PASS.

Custom service:

`71f271d0-8f4c-4c4d-8a2d-6f3a9497b41d`

---

## TEST-004 — GATT READ

Status: PASS

### Goal

Verify that Central can read a value from the Peripheral.

### Characteristic

`4ad4a6d2-3f4a-477c-9832-5e0d8f7654d8`

### Test value

ASCII:

`ping`

Base64:

`cGluZw==`

### Expected

Central reads the characteristic successfully.

### Result

PASS.

UI displayed:

`Received: cGluZw==`

---

## TEST-005 — GATT WRITE

Status: PASS

### Goal

Verify that Central can write data to the Peripheral.

### Test value

ASCII:

`hello`

Hex observed on Peripheral:

`68656c6c6f`

### Expected

Peripheral receives the GATT write request.

### Result

PASS.

Peripheral logcat confirmed:

`GATT WRITE RECEIVED`

Service UUID:

`71f271d0-8f4c-4c4d-8a2d-6f3a9497b41d`

Characteristic UUID:

`4ad4a6d2-3f4a-477c-9832-5e0d8f7654d8`

Received value:

`68656c6c6f`

Multiple repeated WRITE operations were also successfully received.

---

## TEST-006 — GATT NOTIFY

Status: TODO

### Goal

Verify that the Peripheral can asynchronously notify the Central.

### Procedure

1. Central connects to Peripheral.
2. Central subscribes to the characteristic.
3. Peripheral generates a notification.
4. Central receives the notification.

### Expected

Central receives the notification without performing READ.

### Result

TODO.

---

# Reliability Tests

| Test | Status |
|---|---|
| Disconnect during connection | TODO |
| Reconnect | TODO |
| Write after reconnect | TODO |
| Repeated message | TODO |
| Duplicate message | TODO |
| Multiple nearby devices | TODO |
| Screen off | TODO |
| Background operation | TODO |
| Battery optimization | TODO |
| Bluetooth restart | TODO |
| Device reboot | TODO |

---

# Emergency Protocol Tests

| Test | Status |
|---|---|
| PANIC message | TODO |
| ACK | TODO |
| CANCEL message | TODO |
| Message ID | TODO |
| Sequence number | TODO |
| Duplicate suppression | TODO |
| Retry | TODO |
| Timeout | TODO |
| TTL | TODO |

---

# Network Fallback Tests

| Test | Status |
|---|---|
| BLE only | TODO |
| Internet only | TODO |
| BLE → Internet | TODO |
| Internet → BLE | TODO |
| Store-and-forward | TODO |
| Network loss during alert | TODO |

---

# Multi-device Tests

| Test | Status |
|---|---|
| Device A → Device B | PASS |
| Device A → B → C | TODO |
| Multiple receivers | TODO |
| Duplicate propagation | TODO |
| TTL propagation | TODO |
| Network convergence | TODO |

---

# Verification Rules

PASS means:

- implementation exists;
- TypeScript/build succeeds;
- feature was tested on a real device;
- observed behavior matches the expected behavior.

TODO means:

- feature has not yet been functionally verified.

FAIL means:

- implementation exists but functional verification produced an
  unexpected result.

A failed test must not be marked PASS merely because the code compiles.
