# CLEAR RESCUE AI — IoT Hardware Integration Guide

This guide details how physical sensor hardware and microcontrollers connect to the CLEAR RESCUE AI platform.

---

## 1. Controller Architecture

- **Main Board:** Espressif ESP32-WROVER-E (Dual-core 240MHz Xtensa 32-bit LX6, 8MB PSRAM, 16MB Flash)
- **Cellular Modem:** SIMCom A7670E (or Quectel EC200U) 4G LTE Cat-1 with Micro-SIM (supports MTN Rwanda & Airtel Rwanda LTE Bands 3, 7, 20)
- **Wi-Fi:** 802.11 b/g/n 2.4GHz with WPA3-Personal and WPA2-Enterprise
- **Backup Battery:** 3.7V 3000mAh 18650 Li-ion cell with TP4056 charging IC and MAX17048 fuel gauge

---

## 2. Sensor Pinout & Channel Mapping

| Sensor Function | Physical Part / Transducer | Interface | ESP32 GPIO | Nominal Baseline |
| :--- | :--- | :--- | :--- | :--- |
| **Flame Optical IR** | 760nm–1100nm Phototransistor | Digital Interrupt | `GPIO 35` | 0 (Clear) |
| **Smoke Obscuration** | EN 54-7 Optical Light Chamber | Analog ADC1_CH0 | `GPIO 36 (SENSOR_VP)` | < 2.0 % obs/m |
| **Temperature** | Sensirion SHT40 Digital Thermopile | I2C Bus | `SDA: GPIO 21, SCL: GPIO 22` | 18°C – 32°C |
| **Combustible Gas** | Figaro TGS2602 / MQ-9 Catalytic | Analog ADC1_CH3 | `GPIO 39 (SENSOR_VN)` | < 50 ppm |
| **Water Ingress** | Gold Trace Rope / Sub-floor Contact | Digital Comparator | `GPIO 34` | 0 (Dry) |
| **Door Access Latch** | Magnetic Reed Switch | Digital GPIO | `GPIO 32 (Pull-up)` | 0 (Closed) |
| **Motion Detection** | Fresnel Lens Quad-Element PIR | Digital Pulse | `GPIO 33` | 0 (No Motion) |
| **Sound / Glassbreak** | MEMS Acoustic Sensor | Analog ADC1_CH4 | `GPIO 32` | 35 – 65 dB(A) |

---

## 3. Communication Protocols

Hardware units can push telemetry using two supported mechanisms:

### Mechanism A: Secure HTTPS REST (Default)
Periodically pushes telemetry every 10 seconds (or immediately on hardware interrupt):
```http
POST /api/sensor-readings HTTP/1.1
Host: your-clearrescue-domain.com
Content-Type: application/json
Authorization: Bearer CRA_DEVICE_SECRET_TOKEN

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

### Mechanism B: MQTT over TLS 1.3
For constrained bandwidth networks:
- **Broker:** `mqtt.clearrescue.rw:8883`
- **Telemetry Topic:** `v1/clearrescue/devices/{deviceCode}/telemetry`
- **Command Topic:** `v1/clearrescue/devices/{deviceCode}/commands`

---

## 4. ESP32 Arduino C++ Firmware Template

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid = "RWANDA_FACILITY_WIFI";
const char* password = "SECRET_WIFI_PASSWORD";
const char* endpoint = "https://your-domain.com/api/sensor-readings";
const char* token = "YOUR_DEVICE_TOKEN";

void setup() {
  Serial.begin(115200);
  pinMode(35, INPUT); // Flame IR
  pinMode(34, INPUT); // Water probe
  pinMode(32, INPUT_PULLUP); // Door reed switch
  pinMode(33, INPUT); // Motion PIR

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nCRA Node Connected to Cloud.");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(endpoint);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("Authorization", String("Bearer ") + token);

    StaticJsonDocument<512> doc;
    doc["deviceCode"] = "CRA-001";
    doc["battery"] = 94;

    JsonArray readings = doc.createNestedArray("readings");

    // Read flame detector (inverted logic: LOW = flame detected)
    JsonObject rFlame = readings.createNestedObject();
    rFlame["sensorType"] = "FIRE";
    rFlame["value"] = digitalRead(35) == LOW ? 1.0 : 0.0;

    // Read smoke obscuration
    JsonObject rSmoke = readings.createNestedObject();
    rSmoke["sensorType"] = "SMOKE";
    rSmoke["value"] = (analogRead(36) / 4095.0) * 12.0;

    // Read temperature
    JsonObject rTemp = readings.createNestedObject();
    rTemp["sensorType"] = "TEMPERATURE";
    rTemp["value"] = 22.8;

    String jsonString;
    serializeJson(doc, jsonString);

    int httpCode = http.POST(jsonString);
    Serial.printf("Response Code: %d\n", httpCode);
    http.end();
  }
  delay(10000); // 10s telemetry interval
}
```
