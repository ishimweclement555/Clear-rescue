# CLEAR RESCUE AI — REST API Documentation

Base URL: `https://<domain>/api` (or `http://localhost:3000/api`)

All endpoints accept and return JSON (`Content-Type: application/json`).

---

### 1. Health Probe
- **Method:** `GET /health`
- **Auth:** Public
- **Description:** Returns service heartbeat, active fleet size, and version.
- **Response (200 OK):**
```json
{
  "status": "healthy",
  "platform": "CLEAR RESCUE AI - East Africa Emergency Engine",
  "version": "2.4.1",
  "activeDevices": 4,
  "totalDevices": 4,
  "activeIncidents": 0,
  "uptimeSeconds": 3600
}
```

---

### 2. Telemetry Ingestion (IoT Hardware / Simulator)
- **Method:** `POST /api/sensor-readings`
- **Auth:** Bearer Device Token (`Authorization: Bearer <TOKEN>`)
- **Request Body:**
```json
{
  "deviceCode": "CRA-001",
  "firmware": "v2.4.1",
  "battery": 94,
  "readings": [
    { "sensorType": "SMOKE", "value": 0.8 },
    { "sensorType": "TEMPERATURE", "value": 22.4 },
    { "sensorType": "FIRE", "value": 0 },
    { "sensorType": "GAS", "value": 12 },
    { "sensorType": "WATER", "value": 0 },
    { "sensorType": "DOOR", "value": 0 },
    { "sensorType": "MOTION", "value": 0 }
  ]
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "deviceCode": "CRA-001",
  "readingsProcessed": 7,
  "aiAnalysis": {
    "eventType": "Normal Environmental Conditions",
    "severity": "INFO",
    "confidence": 0.95,
    "sensorsInvolved": [],
    "explanation": "All connected sensors report measurements within nominal safety thresholds.",
    "recommendedAction": "No immediate action required. Routine continuous monitoring active."
  },
  "incidentCreated": null
}
```

---

### 3. Devices
- `GET /api/devices`: List all registered devices
- `POST /api/devices`: Register new hardware unit
  - Body: `{ "deviceCode": "CRA-005", "name": "East Wing Server Room", "locationId": "loc-kigali-hq", "connectionType": "4G" }`
- `GET /api/devices/:id`: Get device details
- `PUT /api/devices/:id`: Update device parameters
- `DELETE /api/devices/:id`: Decommission device
- `GET /api/devices/:id/sensors`: Retrieve all 12 sensor channels for this device

---

### 4. Incidents & Emergency Lifecycle
- `GET /api/incidents`: Retrieve incidents (Query params: `?status=OPEN&severity=CRITICAL`)
- `GET /api/incidents/:id`: Incident details
- `POST /api/incidents/:id/acknowledge`: Acknowledge incident
  - Body: `{ "userName": "Jean-Paul Mugisha" }`
- `POST /api/incidents/:id/investigate`: Mark incident as investigating
  - Body: `{ "technicianName": "Emmanuel Nshimiyimana" }`
- `POST /api/incidents/:id/resolve`: Resolve incident
  - Body: `{ "userName": "Emmanuel Nshimiyimana", "notes": "Gas line fitting replaced and tested." }`
- `POST /api/incidents/:id/false-alarm`: Classify false trigger
  - Body: `{ "userName": "Jean-Paul Mugisha", "notes": "Toast smoke in kitchen pantry." }`

---

### 5. Maintenance Tickets
- `GET /api/maintenance`: List all technician maintenance tickets
- `POST /api/maintenance`: Create maintenance service order
  - Body: `{ "deviceId": "dev-cra-001", "title": "Quarterly Thermopile Calibration", "priority": "MEDIUM" }`

---

### 6. Reports & Audit
- `GET /api/reports`: Aggregated 30-day incident frequency and fleet uptime stats
- `GET /api/audit-logs`: Chronological security and operational audit trail
- `GET /api/iot/hardware-specs`: Complete microcontroller pinout and hardware specification schema
