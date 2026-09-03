# From RS485 & OCPP 1.6 to Cloud Backends: Industrial IoT Telemetry Lessons

**Published:** February 20, 2025  
**Author:** Eugenio Tesio  
**Read Time:** 6 min read  
**Topic:** Embedded Systems, IoT & Cloud Distributed Architecture  

---

Before building cloud-native microservices and banking applications, my roots began in **Electrical & Electronics Engineering** at **UTN San Francisco**. My graduation project — **Smart Lub** for Vulcano Lubricación — was an industrial telemetry device designed to capture lubrication equipment metrics over an **RS485** serial bus, transmit it over Ethernet or Wi-Fi, and ingest it into cloud databases for real-time visualization.

Later in my career, I applied those exact principles to integrate **OCPP 1.6** (Open Charge Point Protocol) EV charging networks.

```
+---------------------------+       +---------------------------+
| Industrial Machinery / EV |       | Smart Lub / EV Gateway    |
| (RS485 Modbus / OCPP 1.6) | ----> | (Microcontroller / Linux) |
+---------------------------+       +-------------+-------------+
                                                  |
                                      TLS WebSocket / MQTT / HTTP
                                                  |
                                    +-------------v-------------+
                                    |     Cloud Ingestion       |
                                    |  (GCP Cloud Run / Python) |
                                    +-------------+-------------+
                                                  |
                                    +-------------v-------------+
                                    | Real-time Telemetry & DB  |
                                    | (Flutter Dashboard / PG)  |
                                    +---------------------------+
```

## Lesson 1: Respect Physical Layer Noise & Parity

On factory floors or outdoor EV charging bays, electromagnetic interference (EMI) is brutal. RS485 differential signaling excels at common-mode noise rejection, but your firmware and driver code must handle:
- CRC16 / Checksum calculation on every single packet frame.
- Automatic baud rate stabilization and hardware timeout recovery.
- Hardware watchdog timers to reset stuck serial transceivers.

## Lesson 2: Handling Intermittent Connectivity Gracefully

In mobile devices, intermittent connectivity causes slow page loads. In industrial and EV charging systems, network drops can cause missed billing cycles or overfilled machinery:
- **Local Storage Buffering:** Store unsynced telemetry in local flash or non-volatile EEPROM.
- **Idempotent Ingestion APIs:** When connectivity restores, replay packets with unique sequence IDs so backend services can deduplicate seamlessly.
- **Backpressure & Jittered Exponential Backoff:** Prevent thousands of reconnecting edge nodes from bringing down your cloud gateway simultaneously.

## The Full-Stack Advantage

Having deep hardware comprehension allows software engineers to design vastly better mobile and backend software. When you understand memory allocation at the register level and packet transmission down to the physical wire, building resilient Flutter apps, WebSockets, and distributed Python APIs becomes second nature.
