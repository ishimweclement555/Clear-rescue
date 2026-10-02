# CLEAR RESCUE AI
### AI-Powered Emergency Detection & Response Platform
**Engineered for Rwanda and East Africa**

---

## 1. Executive Summary

**CLEAR RESCUE AI** is an intelligent, full-stack multi-sensor environmental safety and emergency response platform designed for commercial offices, schools, hotels, logistics warehouses, and healthcare facilities across Rwanda and East Africa.

The platform continuously processes telemetry from connected IoT sensor arrays and applies AI multi-sensor correlation to detect:
- 🔥 **Fire & Flame Optical Infrared**
- 💨 **Smoke Obscuration (EN 54-7 optical chamber)**
- 🌡 **Excessive Temperature & Rate-of-Rise Heat**
- 🛢 **Combustible & Toxic Gas Leaks (LPG, CO, Methane)**
- 💧 **Sub-floor Water Ingress & Pipe Leaks**
- 🚪 **Unauthorized Door Openings & Ajar Hatches**
- 👁 **Physical Motion / Intrusion**
- 🎤 **Abnormal Acoustic Sound & Glass Breakage**
- 🌧 **Relative Humidity Saturation**
- 🌬 **Air Quality Index (PM2.5 / VOC)**
- 🔋 **Backup Battery Discharge**
- 📡 **4G Cellular / Wi-Fi Signal Degradation**

---

## 2. Regulatory Safety Disclaimer

> **IMPORTANT NOTICE:**
> CLEAR RESCUE AI is an emergency-monitoring prototype platform and intelligent software decision-support system. It does **not** claim to replace certified fire alarms, certified life-safety gas detectors, security apparatus, or official public first-responder dispatch services (such as the Rwanda National Police Fire & Rescue Brigade, Hotline: 111). Physical production deployments must be tested and certified according to applicable Rwanda Standards Board (RSB) guidelines and local building regulations.

---

## 3. Technology Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Motion.
- **Backend:** Node.js, Express REST API (`/api/*`), HTTP bearer authorization.
- **Database & Persistence:** Firebase Firestore (`/firebase-blueprint.json` & `firestore.rules`).
- **Authentication:** Firebase Authentication with Google Sign-In and Role-Based Access Control (Customer, Technician, Admin, Super Admin).
- **AI Diagnostics:** Gemini 2.5 Flash via `@google/genai` paired with the deterministic `ClearRescue-RuleEngine-v2`.
- **IoT Firmware Architecture:** Espressif ESP32-WROVER-E with SIMCom A7670E 4G LTE modem and WPA3 Wi-Fi.

---

## 4. Hardware Architecture Pipeline

```text
  [ Physical Sensors ]
  (Flame IR, MQ-2 Smoke, SHT40 Temp, TGS2602 Gas, Water Rope, Reed Door, PIR Motion, MEMS Mic)
            │
            ▼
  [ ESP32-WROVER-E Edge Controller ]
  (Dual-core 240MHz, ADC1 sampling, I2C bus reader, local SPI flash buffer)
            │
            ▼
  [ 4G LTE Cat-1 / Wi-Fi Bridge ]
  (SIMCom A7670E dual-SIM: MTN Rwanda / Airtel Rwanda fallback)
            │
            ▼
  [ Secure REST API / MQTT TLS 1.3 ]
  (POST /api/sensor-readings with Device Bearer Token)
            │
            ▼
  [ Backend Platform Engine ]
  (Express router, schema validation, rate-limiting, audit logging)
            │
            ▼
  [ Database Persistence Layer ]
  (Firestore Enterprise: devices, sensors, readings, incidents, audit_logs)
            │
            ▼
  [ AI Multi-Sensor Correlation Engine ]
  (Correlates cross-sensor signatures, calculates confidence, outputs recommendations)
            │
            ▼
  [ Emergency & Alert Engine ]
  (Incident lifecycle: OPEN -> ACKNOWLEDGED -> INVESTIGATING -> RESOLVED -> FALSE_ALARM)
            │
            ▼
  [ Multi-Channel Notifications ]
  (In-app siren banners, SMS gateway simulator, technician work orders)
            │
            ▼
  [ Customer / Technician / Admin Dashboards ]
```

---

## 5. Getting Started & Running Locally

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Runs on `http://localhost:3000`.

### Production Build & Server
```bash
npm run build
npm start
```
Runs `server.ts` listening on port 3000.

### Health Check Endpoint
```bash
curl http://localhost:3000/health
```
Returns:
```json
{
  "status": "healthy",
  "platform": "CLEAR RESCUE AI - East Africa Emergency Engine",
  "version": "2.4.1",
  "activeDevices": 4,
  "uptimeSeconds": 120
}
```

---

## 6. Demo Organizations & Seed Locations

The system comes pre-configured with realistic East African facilities:
1. **Kigali Head Office** — KN 3 Ave, Downtown CBD, Nyarugenge, Kigali
2. **Masaka Logistics Hub & Warehouse** — Masaka Industrial Zone, RN3 Highway, Kicukiro, Kigali
3. **Green Hills Academy Campus** — KG 278 St, Nyarutarama, Gasabo, Kigali
4. **Musanze Mountain Eco-Lodge** — Kinigi Foothills Road, Volcanoes Zone, Musanze, Northern Province

Use the **Demo Role Switcher** in the top navigation to instantly switch between:
- **Customer:** Jean-Paul Mugisha (`facilities@kigalihq.rw`)
- **Technician:** Emmanuel Nshimiyimana (`emmanuel.tech@clearrescue.rw`)
- **Admin:** Clement Ishimwe (`ishimweclement537@gmail.com`)
- **Super Admin:** Aline Mukamana (`admin.super@clearrescue.rw`)
