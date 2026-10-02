# CLEAR RESCUE AI — System Architecture

This document describes the high-level system design, data structures, and operational boundaries of CLEAR RESCUE AI.

---

## 1. High-Level Architecture Diagram

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        PHYSICAL ENVIRONMENT                            │
│  [Flame IR]   [MQ-2 Smoke]   [SHT40 Temp]   [Gas MOX]   [Water Probe] │
│  [Door Reed]  [Motion PIR]   [MEMS Mic]     [Humidity]  [Air Quality] │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │ Analog ADC / Digital Interrupts / I2C Bus
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     CLEAR RESCUE AI HARDWARE UNIT                      │
│  - Microcontroller: Espressif ESP32-WROVER-E (Dual-core 240MHz)       │
│  - Cellular Transceiver: SIMCom A7670E 4G LTE Cat-1 (Micro-SIM)       │
│  - Wi-Fi Transceiver: 802.11 b/g/n 2.4GHz with WPA3                   │
│  - Power Management: LiPo 3.7V Uninterruptible Backup Battery          │
│  - Flash Storage: 16MB Local SPI Flash Telemetry Buffer                │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │ HTTPS REST / MQTT TLS 1.3
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   BACKEND CLOUD & TELEMETRY ENGINE                     │
│  - Express REST Router (/api/*, /health)                               │
│  - Rate Limiting, Input Sanitization & Authentication Middleware       │
│  - Ingestion Controller: POST /api/sensor-readings                     │
│  - Hardware Security: Device Bearer Token Validation                   │
└──────────────────┬─────────────────┬─────────────────┬─────────────────┘
                   │                 │                 │
                   ▼                 ▼                 ▼
         ┌──────────────────┐ ┌───────────────┐ ┌───────────────┐
         │ FIRESTORE DB     │ │ AI CORRELATION│ │ EMERGENCY     │
         │ - devices        │ │ ENGINE        │ │ EVENT ENGINE  │
         │ - sensors        │ │ - Gemini 2.5  │ │ - INFO        │
         │ - sensor_readings│ │ - Multi-sensor│ │ - WARNING     │
         │ - incidents      │ │   rule matrix │ │ - CRITICAL    │
         │ - maintenance    │ │ - Confidence  │ │ - Lifecycle:  │
         │ - audit_logs     │ │   scoring     │ │   OPEN/ACK/   │
         │ - system_settings│ │ - Action recs │ │   INVESTIGATE/│
         └──────────────────┘ └───────────────┘ │   RESOLVE/    │
                                                │   FALSE_ALARM │
                                                └───────┬───────┘
                                                        │
                                                        ▼
┌────────────────────────────────────────────────────────────────────────┐
│                         MULTI-CHANNEL RESPONSE                         │
│  - Flashing In-App Red Siren Alert Modal (Audio Loop & Visuals)       │
│  - Field Technician Ticket Dispatch & Assignment                       │
│  - SMS / Email Simulator Integration Logs                             │
│  - Rwanda Emergency Services Hotline Protocol (Fire 111 / Police 112) │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    DASHBOARDS & MANAGEMENT CONSOLES                    │
│  - Customer Portal: 12 Sensor Cards, Device Management, Reports       │
│  - Technician Portal: Diagnostics, Calibrations, Maintenance Tickets   │
│  - Admin Center: Full Fleet Control, RBAC, Audit Ledger, Locations    │
│  - Live Interactive Sensor Simulator for End-to-End Testing            │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Multi-Sensor AI Diagnostics Logic

Unlike legacy systems that trigger alarms whenever a single threshold is breached, CLEAR RESCUE AI evaluates correlated signatures:

1. **Fire & Thermal Emergency (CRITICAL):**
   - Correlated factors: Flame IR optical trigger (>0) OR (Smoke obscuration > 5% obs/m AND Temperature > 55°C).
   - Reasoning: Dense smoke paired with steep thermal rise confirms active combustion, dramatically suppressing dust/steam false alarms.

2. **Smoldering / Electrical Hazard (WARNING):**
   - Correlated factors: Smoke rising (>2.5%) AND Temperature elevated (>45°C) with Flame = 0.
   - Reasoning: Electrical conduits or appliance wiring overheating before open flames erupt.

3. **Combustible Gas Leak (CRITICAL / WARNING):**
   - Correlated factors: Catalytic gas reading > 80 ppm.
   - Elevated to CRITICAL if temperature is simultaneously elevated due to flammability risks.

4. **Flooding / Pipe Ingress (CRITICAL / WARNING):**
   - Correlated factors: Sub-floor conductive water probe activated (Wet = 1) AND relative humidity rising (>80% RH).

5. **Security Intrusion (CRITICAL / WARNING):**
   - Correlated factors: Perimeter magnetic door contact opened (Open = 1) AND PIR motion detected (>0) AND acoustic levels elevated (>85 dB).

6. **Device Power & Link Degradation (INFO / WARNING):**
   - Correlated factors: Internal LiPo battery < 15% OR cellular CSQ signal < 10.
