# Panic App Roadmap

## Project Status

Current branch: `feature/bluetooth-gatt`

Current milestone: **BLE GATT Foundation**

Goal of this milestone:

> Establish a reliable phone-to-phone BLE transport using GATT before
> integrating emergency alert logic.

---

## 1. BLE Foundation

- [x] React Native BLE project setup
- [x] BLE scanning
- [x] BLE peripheral advertising
- [x] Central → Peripheral connection
- [x] GATT service discovery
- [x] GATT READ
- [x] GATT WRITE
- [ ] GATT NOTIFY
- [ ] GATT subscribe/unsubscribe handling
- [ ] Connection state handling
- [ ] Disconnect/reconnect handling
- [ ] RSSI / proximity information

---

## 2. Emergency BLE Protocol

- [ ] Define message format
- [ ] Define message types
- [ ] PANIC message
- [ ] CANCEL message
- [ ] ACK message
- [ ] Message ID
- [ ] Sequence number
- [ ] Timestamp
- [ ] TTL
- [ ] Duplicate protection
- [ ] Retry mechanism
- [ ] Timeout handling
- [ ] Maximum packet size / fragmentation strategy

---

## 3. BLE Reliability

- [ ] Test connection loss during transmission
- [ ] Test reconnection
- [ ] Test repeated messages
- [ ] Test duplicate messages
- [ ] Test multiple nearby devices
- [ ] Test device with screen off
- [ ] Test application in background
- [ ] Test Android battery restrictions
- [ ] Test BLE restart/recovery
- [ ] Test phone reboot recovery

---

## 4. Emergency Alert Architecture

- [ ] Integrate BLE transport with Alert Queue
- [ ] Integrate with Emergency Service
- [ ] Local persistent queue
- [ ] Alert state machine
- [ ] Alert propagation between devices
- [ ] ACK propagation
- [ ] Alert expiration
- [ ] Cancel propagation

---

## 5. Internet Fallback

- [ ] Internet transport
- [ ] Detect BLE-only / Internet-available state
- [ ] BLE → Internet fallback
- [ ] Internet → BLE propagation
- [ ] Store-and-forward
- [ ] Retry policy
- [ ] Network failure handling

Target architecture:

    PANIC
      │
      ├── BLE
      │
      └── Internet
            │
            ▼
       Alert Queue

---

## 6. Multi-device Network

- [ ] Two-device test
- [ ] Three-device test
- [ ] Multi-hop propagation
- [ ] Duplicate suppression
- [ ] Message TTL
- [ ] Network convergence
- [ ] Device discovery
- [ ] Device expiration
- [ ] Routing strategy

---

## 7. Security

- [ ] Threat model
- [ ] Device identity
- [ ] Message authentication
- [ ] Replay protection
- [ ] Encryption strategy
- [ ] Key exchange
- [ ] Key storage
- [ ] Unauthorized device handling

---

## 8. Production Readiness

- [ ] Background BLE operation
- [ ] Battery optimization
- [ ] Crash recovery
- [ ] Persistent state recovery
- [ ] Logging strategy
- [ ] Error reporting
- [ ] Automated tests
- [ ] Android compatibility matrix
- [ ] Real-device test matrix
- [ ] Release build
- [ ] Release checklist

---

# Definition of Done

A task is considered **Done** only when all applicable criteria are satisfied.

## Code

- [ ] Implementation is complete
- [ ] No known TypeScript errors
- [ ] Code follows project architecture
- [ ] No unnecessary debug code
- [ ] Error handling is present

## Build

- [ ] `npx tsc --noEmit` passes
- [ ] Android debug build succeeds
- [ ] Application starts successfully

## Functional verification

- [ ] Feature tested on a real device
- [ ] Expected UI result confirmed
- [ ] Expected BLE/GATT behavior confirmed
- [ ] Relevant logcat output checked when applicable

## Regression

- [ ] Existing BLE functionality still works
- [ ] Existing application functionality still works

## Git

- [ ] Logical commit created
- [ ] Commit message describes the change
- [ ] Branch pushed to GitHub
- [ ] Working tree is clean

---

# Development Workflow

For each logical feature:

    1. Define task
    2. Implement smallest useful change
    3. Run TypeScript check
    4. Build/run on real device
    5. Perform functional test
    6. Record result in TEST_MATRIX.md
    7. Commit
    8. Push
    9. Move to next task

The project should prefer **small verified milestones** over large
unverified implementations.
