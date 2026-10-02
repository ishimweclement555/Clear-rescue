import React, { useState } from 'react';
import { X, Cpu, Copy, Check, Terminal, ShieldCheck, Wifi, Radio, Server, FileCode } from 'lucide-react';

interface IoTDocsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IoTDocsModal: React.FC<IoTDocsProps> = ({ isOpen, onClose }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const sampleJson = `{
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
    { "sensorType": "MOTION", "value": 0 },
    { "sensorType": "SOUND", "value": 46 },
    { "sensorType": "HUMIDITY", "value": 54 },
    { "sensorType": "AIR_QUALITY", "value": 32 }
  ]
}`;

  const sampleCurl = `curl -X POST https://your-domain.com/api/sensor-readings \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer CRA_DEVICE_SECRET_TOKEN" \\
  -d '${sampleJson.replace(/\n\s*/g, ' ')}'`;

  const sampleArduinoCode = `#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid = "RWANDA_OFFICE_WIFI";
const char* password = "SECRET_PASSWORD";
const char* serverUrl = "https://your-domain.com/api/sensor-readings";
const char* deviceToken = "CRA_DEVICE_SECRET_TOKEN";

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) { delay(500); }
  Serial.println("CLEAR RESCUE AI Unit Online!");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("Authorization", String("Bearer ") + deviceToken);

    StaticJsonDocument<512> doc;
    doc["deviceCode"] = "CRA-001";
    doc["battery"] = 92;
    JsonArray readings = doc.createNestedArray("readings");

    JsonObject s1 = readings.createNestedObject();
    s1["sensorType"] = "SMOKE";
    s1["value"] = analogRead(36) * (100.0 / 4095.0);

    JsonObject s2 = readings.createNestedObject();
    s2["sensorType"] = "TEMPERATURE";
    s2["value"] = 23.4; // Read via I2C Sensirion SHT40

    String jsonOutput;
    serializeJson(doc, jsonOutput);

    int httpResponseCode = http.POST(jsonOutput);
    Serial.printf("Telemetry status: %d\\n", httpResponseCode);
    http.end();
  }
  delay(10000); // 10-second sample interval
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                IoT Hardware Architecture &amp; Integration Guide
              </h3>
              <p className="text-xs text-slate-400">
                ESP32 Microcontroller, SIMCom 4G Cellular Modem, and REST/MQTT Telemetry Specifications
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          {/* Architecture Pipeline Diagram */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3 flex items-center gap-2">
              <Server className="w-4 h-4 text-blue-400" /> End-to-End System Pipeline
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 text-center text-[10px] font-bold">
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                <span className="text-orange-400 block mb-1">1. Sensors</span>
                <span className="text-slate-400 font-normal">MQ-2, SHT40, PIR, Sound, Flame</span>
              </div>
              <div className="flex items-center justify-center text-slate-600 hidden sm:flex">&rarr;</div>
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                <span className="text-blue-400 block mb-1">2. ESP32 Unit</span>
                <span className="text-slate-400 font-normal">Dual-Core ADC &amp; I2C Collector</span>
              </div>
              <div className="flex items-center justify-center text-slate-600 hidden sm:flex">&rarr;</div>
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                <span className="text-emerald-400 block mb-1">3. 4G / Wi-Fi</span>
                <span className="text-slate-400 font-normal">A7670E 4G LTE with Micro-SIM</span>
              </div>
              <div className="flex items-center justify-center text-slate-600 hidden sm:flex">&rarr;</div>
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                <span className="text-purple-400 block mb-1">4. AI Engine</span>
                <span className="text-slate-400 font-normal">Multi-Sensor Correlation</span>
              </div>
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 col-span-2 sm:col-span-1">
                <span className="text-red-400 block mb-1">5. Alert Response</span>
                <span className="text-slate-400 font-normal">Dashboards &amp; Notifications</span>
              </div>
            </div>
          </div>

          {/* Pinout Mapping Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Hardware Sensor Pinout Table (ESP32-WROVER-E)
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                    <th className="pb-2">Sensor Function</th>
                    <th className="pb-2">Hardware Part / Model</th>
                    <th className="pb-2">Interface Type</th>
                    <th className="pb-2">GPIO Assignment</th>
                    <th className="pb-2">Nominal Range</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                  <tr>
                    <td className="py-2 text-white font-semibold font-sans">Smoke Obscuration</td>
                    <td>EN 54-7 Optical Chamber / MQ-2</td>
                    <td>Analog ADC1</td>
                    <td className="text-orange-400">GPIO 36 (SENSOR_VP)</td>
                    <td>0.0 – 2.0 % obs/m</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-white font-semibold font-sans">Ambient Temperature</td>
                    <td>Sensirion SHT40 / DS18B20</td>
                    <td>I2C Bus</td>
                    <td className="text-blue-400">SDA: GPIO 21, SCL: GPIO 22</td>
                    <td>18°C – 32°C</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-white font-semibold font-sans">Combustible Gas</td>
                    <td>Figaro TGS2602 / MQ-9 Catalytic</td>
                    <td>Analog ADC1</td>
                    <td className="text-orange-400">GPIO 39 (SENSOR_VN)</td>
                    <td>&lt; 50 ppm</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-white font-semibold font-sans">Flame Optical IR</td>
                    <td>760nm–1100nm Phototransistor</td>
                    <td>Digital Interrupt</td>
                    <td className="text-red-400">GPIO 35</td>
                    <td>0 (Clear) / 1 (Flame)</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-white font-semibold font-sans">Sub-floor Water Ingress</td>
                    <td>Gold-plated Conductive Trace Cable</td>
                    <td>Digital Comparator</td>
                    <td className="text-blue-400">GPIO 34</td>
                    <td>0 (Dry) / 1 (Wet)</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-white font-semibold font-sans">Door Magnetic Reed</td>
                    <td>Hermetic Reed Contact</td>
                    <td>Digital GPIO</td>
                    <td className="text-purple-400">GPIO 32 (Internal Pullup)</td>
                    <td>0 (Closed) / 1 (Open)</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-white font-semibold font-sans">PIR Motion Detector</td>
                    <td>Fresnel Lens Quad Element</td>
                    <td>Digital Pulse</td>
                    <td className="text-amber-400">GPIO 33</td>
                    <td>0 (Quiet) / 1 (Movement)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* REST API Telemetry Ingestion Spec */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>REST API Ingestion: POST /api/sensor-readings</span>
              </h4>
              <button
                onClick={() => copyToClipboard(sampleCurl, 'curl')}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1 cursor-pointer"
              >
                {copiedSection === 'curl' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'curl' ? 'Copied' : 'Copy cURL'}</span>
              </button>
            </div>
            <pre className="bg-slate-950 p-3 rounded-lg font-mono text-[11px] text-emerald-400 overflow-x-auto border border-slate-800">
              {sampleCurl}
            </pre>
          </div>

          {/* ESP32 Arduino C++ Firmware Sample */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <FileCode className="w-4 h-4 text-orange-400" />
                <span>Embedded C++ Arduino Firmware Template</span>
              </h4>
              <button
                onClick={() => copyToClipboard(sampleArduinoCode, 'arduino')}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1 cursor-pointer"
              >
                {copiedSection === 'arduino' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'arduino' ? 'Copied' : 'Copy C++'}</span>
              </button>
            </div>
            <pre className="bg-slate-950 p-3 rounded-lg font-mono text-[11px] text-slate-300 overflow-x-auto border border-slate-800 max-h-56">
              {sampleArduinoCode}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
