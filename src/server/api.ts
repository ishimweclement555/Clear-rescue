import { Router, Request, Response } from 'express';
import {
  INITIAL_DEVICES,
  INITIAL_LOCATIONS,
  INITIAL_INCIDENTS,
  INITIAL_MAINTENANCE,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_SETTINGS,
  generateSensorsForDevice,
} from '../services/seedData.ts';
import { Device, Sensor, Incident, MaintenanceRecord, NotificationItem, AuditLogItem, SensorReading } from '../types/index.ts';
import { analyzeSensorsRuleBased } from '../services/aiEmergencyAnalysis.ts';

// In-memory runtime state synchronized with API operations
let devices: Device[] = [...INITIAL_DEVICES];
let sensors: Sensor[] = [];
INITIAL_DEVICES.forEach(d => {
  sensors.push(...generateSensorsForDevice(d));
});
let incidents: Incident[] = [...INITIAL_INCIDENTS];
let maintenanceRecords: MaintenanceRecord[] = [...INITIAL_MAINTENANCE];
let notifications: NotificationItem[] = [...INITIAL_NOTIFICATIONS];
let auditLogs: AuditLogItem[] = [...INITIAL_AUDIT_LOGS];
const sensorReadingsLog: SensorReading[] = [];

export function getInMemoryState() {
  return {
    devices,
    sensors,
    incidents,
    maintenanceRecords,
    notifications,
    auditLogs,
    sensorReadingsLog,
  };
}

export function createApiRouter(): Router {
  const router = Router();

  // Root health check
  router.get('/health', (_req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      platform: 'CLEAR RESCUE AI - East Africa Emergency Engine',
      version: '2.4.1',
      activeDevices: devices.filter(d => d.status === 'online').length,
      totalDevices: devices.length,
      activeIncidents: incidents.filter(i => i.status === 'OPEN' || i.status === 'INVESTIGATING').length,
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    });
  });

  // Devices
  router.get('/devices', (_req: Request, res: Response) => {
    res.json(devices);
  });

  router.post('/devices', (req: Request, res: Response) => {
    const { name, deviceCode, locationId, locationName, connectionType } = req.body;
    if (!name || !deviceCode) {
      return res.status(400).json({ error: 'Device name and deviceCode are required' });
    }

    const newDevice: Device = {
      id: `dev-${Date.now()}`,
      deviceCode: deviceCode.toUpperCase(),
      name,
      locationId: locationId || 'loc-kigali-hq',
      locationName: locationName || 'Kigali Head Office',
      organizationId: 'org-rwanda-demo',
      status: 'online',
      connectionType: connectionType || '4G',
      batteryLevel: 100,
      firmwareVersion: 'v2.4.1',
      ipAddress: '10.12.9.' + Math.floor(Math.random() * 200 + 10),
      macAddress: '3C:71:BF:' + Math.random().toString(16).substring(2, 8).toUpperCase(),
      lastSeen: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      sensorsCount: 12,
    };

    devices.push(newDevice);
    const newSensors = generateSensorsForDevice(newDevice);
    sensors.push(...newSensors);

    auditLogs.unshift({
      id: `audit-${Date.now()}`,
      userId: 'api-client',
      userEmail: 'operator@clearrescue.rw',
      action: 'DEVICE_CREATE',
      resource: newDevice.deviceCode,
      details: `Provisioned new device: ${newDevice.name}`,
      timestamp: new Date().toISOString(),
    });

    res.status(201).json(newDevice);
  });

  router.get('/devices/:id', (req: Request, res: Response) => {
    const device = devices.find(d => d.id === req.params.id || d.deviceCode === req.params.id);
    if (!device) return res.status(404).json({ error: 'Device not found' });
    res.json(device);
  });

  router.put('/devices/:id', (req: Request, res: Response) => {
    const index = devices.findIndex(d => d.id === req.params.id || d.deviceCode === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Device not found' });

    devices[index] = { ...devices[index], ...req.body, lastSeen: new Date().toISOString() };
    res.json(devices[index]);
  });

  router.delete('/devices/:id', (req: Request, res: Response) => {
    const index = devices.findIndex(d => d.id === req.params.id || d.deviceCode === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Device not found' });

    const removed = devices.splice(index, 1)[0];
    sensors = sensors.filter(s => s.deviceId !== removed.id);
    res.json({ message: 'Device removed successfully', device: removed });
  });

  // Sensors
  router.get('/devices/:id/sensors', (req: Request, res: Response) => {
    const devSensors = sensors.filter(s => s.deviceId === req.params.id || s.deviceCode === req.params.id);
    res.json(devSensors);
  });

  router.get('/sensors', (_req: Request, res: Response) => {
    res.json(sensors);
  });

  router.get('/sensors/:id/readings', (req: Request, res: Response) => {
    const readings = sensorReadingsLog
      .filter(r => r.sensorId === req.params.id)
      .slice(-50);
    res.json(readings);
  });

  // IoT Hardware & Simulator Telemetry Ingestion Endpoint
  router.post('/sensor-readings', (req: Request, res: Response) => {
    const { deviceCode, readings } = req.body;
    if (!deviceCode || !Array.isArray(readings)) {
      return res.status(400).json({ error: 'Invalid payload format. Expected { deviceCode, readings: [{ sensorType, value }] }' });
    }

    const device = devices.find(d => d.deviceCode === deviceCode.toUpperCase());
    if (!device) {
      return res.status(404).json({ error: `Device ${deviceCode} not registered in platform` });
    }

    device.lastSeen = new Date().toISOString();

    const timestamp = new Date().toISOString();
    const updatedDeviceSensors: Sensor[] = [];

    readings.forEach((item: { sensorType: string; value: number }) => {
      const sensor = sensors.find(s => s.deviceId === device.id && s.sensorType === item.sensorType);
      if (sensor) {
        sensor.lastReading = item.value;
        sensor.lastUpdated = timestamp;

        if (item.value >= sensor.criticalThreshold) {
          sensor.status = 'CRITICAL';
        } else if (item.value >= sensor.warningThreshold) {
          sensor.status = 'WARNING';
        } else {
          sensor.status = 'NORMAL';
        }

        updatedDeviceSensors.push(sensor);

        sensorReadingsLog.push({
          id: `rdg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          sensorId: sensor.id,
          deviceId: device.id,
          deviceCode: device.deviceCode,
          sensorType: sensor.sensorType,
          value: item.value,
          unit: sensor.unit,
          status: sensor.status,
          timestamp,
        });
      }
    });

    // Run AI analysis on updated device sensors
    const devSensorsAll = sensors.filter(s => s.deviceId === device.id);
    const aiResult = analyzeSensorsRuleBased(devSensorsAll);

    let createdIncident: Incident | null = null;

    if (aiResult.severity === 'CRITICAL' || aiResult.severity === 'WARNING') {
      device.status = aiResult.severity === 'CRITICAL' ? 'emergency' : 'warning';

      // Check if open incident already exists for this device & eventType
      const existing = incidents.find(
        i => i.deviceId === device.id && (i.status === 'OPEN' || i.status === 'INVESTIGATING' || i.status === 'ACKNOWLEDGED')
      );

      if (!existing) {
        createdIncident = {
          id: `inc-${Date.now()}`,
          incidentCode: `INC-${Date.now().toString().slice(-6)}`,
          deviceId: device.id,
          deviceCode: device.deviceCode,
          locationId: device.locationId,
          locationName: device.locationName,
          organizationId: device.organizationId,
          eventType: aiResult.eventType,
          severity: aiResult.severity,
          status: 'OPEN',
          triggeredSensors: aiResult.sensorsInvolved,
          sensorReadings: devSensorsAll
            .filter(s => aiResult.sensorsInvolved.includes(s.sensorType))
            .map(s => ({
              sensorType: s.sensorType,
              value: s.lastReading,
              unit: s.unit,
              threshold: s.criticalThreshold,
            })),
          aiAnalysis: aiResult,
          createdTime: timestamp,
          disclaimer:
            'CLEAR RESCUE AI is an emergency-monitoring prototype platform. It does not replace certified fire alarms, gas detectors, or official emergency services.',
        };

        incidents.unshift(createdIncident);

        // Generate immediate notification
        notifications.unshift({
          id: `notif-${Date.now()}`,
          title: `🚨 ${aiResult.severity}: ${aiResult.eventType}`,
          message: `${aiResult.explanation} Location: ${device.locationName} (${device.deviceCode}). Action: ${aiResult.recommendedAction}`,
          severity: aiResult.severity,
          channel: 'IN_APP',
          isRead: false,
          createdAt: timestamp,
          metadata: {
            deviceCode: device.deviceCode,
            locationName: device.locationName,
            eventType: aiResult.eventType,
          },
        });
      }
    } else {
      // Nominal
      device.status = 'online';
    }

    res.json({
      success: true,
      deviceCode: device.deviceCode,
      readingsProcessed: readings.length,
      aiAnalysis: aiResult,
      incidentCreated: createdIncident ? createdIncident.incidentCode : null,
    });
  });

  // Incidents
  router.get('/incidents', (req: Request, res: Response) => {
    let result = [...incidents];
    if (req.query.status) {
      result = result.filter(i => i.status === req.query.status);
    }
    if (req.query.severity) {
      result = result.filter(i => i.severity === req.query.severity);
    }
    if (req.query.deviceCode) {
      result = result.filter(i => i.deviceCode === req.query.deviceCode);
    }
    res.json(result);
  });

  router.get('/incidents/:id', (req: Request, res: Response) => {
    const inc = incidents.find(i => i.id === req.params.id || i.incidentCode === req.params.id);
    if (!inc) return res.status(404).json({ error: 'Incident not found' });
    res.json(inc);
  });

  router.post('/incidents/:id/acknowledge', (req: Request, res: Response) => {
    const inc = incidents.find(i => i.id === req.params.id || i.incidentCode === req.params.id);
    if (!inc) return res.status(404).json({ error: 'Incident not found' });

    inc.status = 'ACKNOWLEDGED';
    inc.acknowledgedTime = new Date().toISOString();
    inc.acknowledgedBy = req.body.userName || 'Operator';

    auditLogs.unshift({
      id: `audit-${Date.now()}`,
      userId: req.body.userId || 'op-user',
      userEmail: req.body.userEmail || 'operator@clearrescue.rw',
      action: 'INCIDENT_ACKNOWLEDGE',
      resource: inc.incidentCode,
      details: `Acknowledged emergency: ${inc.eventType}`,
      timestamp: new Date().toISOString(),
    });

    res.json(inc);
  });

  router.post('/incidents/:id/investigate', (req: Request, res: Response) => {
    const inc = incidents.find(i => i.id === req.params.id || i.incidentCode === req.params.id);
    if (!inc) return res.status(404).json({ error: 'Incident not found' });

    inc.status = 'INVESTIGATING';
    inc.investigatingTime = new Date().toISOString();
    inc.assignedTechnician = req.body.technicianName || 'Emmanuel Nshimiyimana';

    res.json(inc);
  });

  router.post('/incidents/:id/resolve', (req: Request, res: Response) => {
    const inc = incidents.find(i => i.id === req.params.id || i.incidentCode === req.params.id);
    if (!inc) return res.status(404).json({ error: 'Incident not found' });

    inc.status = 'RESOLVED';
    inc.resolvedTime = new Date().toISOString();
    inc.resolvedBy = req.body.userName || 'Field Technician';
    if (req.body.notes) {
      inc.notes = inc.notes || [];
      inc.notes.push(req.body.notes);
    }

    const device = devices.find(d => d.id === inc.deviceId);
    if (device) device.status = 'online';

    auditLogs.unshift({
      id: `audit-${Date.now()}`,
      userId: req.body.userId || 'op-user',
      userEmail: req.body.userEmail || 'operator@clearrescue.rw',
      action: 'INCIDENT_RESOLVE',
      resource: inc.incidentCode,
      details: `Resolved emergency: ${inc.eventType}. Notes: ${req.body.notes || 'None'}`,
      timestamp: new Date().toISOString(),
    });

    res.json(inc);
  });

  router.post('/incidents/:id/false-alarm', (req: Request, res: Response) => {
    const inc = incidents.find(i => i.id === req.params.id || i.incidentCode === req.params.id);
    if (!inc) return res.status(404).json({ error: 'Incident not found' });

    inc.status = 'FALSE_ALARM';
    inc.resolvedTime = new Date().toISOString();
    inc.resolvedBy = req.body.userName || 'Field Technician';
    if (req.body.notes) {
      inc.notes = inc.notes || [];
      inc.notes.push(`[FALSE ALARM]: ${req.body.notes}`);
    }

    const device = devices.find(d => d.id === inc.deviceId);
    if (device) device.status = 'online';

    res.json(inc);
  });

  // Notifications
  router.get('/notifications', (_req: Request, res: Response) => {
    res.json(notifications);
  });

  router.post('/notifications/:id/read', (req: Request, res: Response) => {
    const notif = notifications.find(n => n.id === req.params.id);
    if (notif) notif.isRead = true;
    res.json({ success: true });
  });

  // Maintenance
  router.get('/maintenance', (_req: Request, res: Response) => {
    res.json(maintenanceRecords);
  });

  router.post('/maintenance', (req: Request, res: Response) => {
    const { deviceId, title, description, priority, technicianName, scheduledDate } = req.body;
    const device = devices.find(d => d.id === deviceId);

    const record: MaintenanceRecord = {
      id: `mnt-${Date.now()}`,
      ticketCode: `MNT-${Date.now().toString().slice(-5)}`,
      deviceId: deviceId || 'dev-cra-001',
      deviceCode: device ? device.deviceCode : 'CRA-001',
      locationName: device ? device.locationName : 'Kigali Head Office',
      technicianName: technicianName || 'Emmanuel Nshimiyimana',
      title: title || 'Scheduled Preventive Inspection',
      description: description || '',
      priority: priority || 'MEDIUM',
      status: 'SCHEDULED',
      scheduledDate: scheduledDate || new Date(Date.now() + 86400000).toISOString(),
      createdAt: new Date().toISOString(),
    };

    maintenanceRecords.unshift(record);
    res.status(201).json(record);
  });

  // Reports Summary
  router.get('/reports', (_req: Request, res: Response) => {
    const totalIncidents = incidents.length;
    const criticalIncidents = incidents.filter(i => i.severity === 'CRITICAL').length;
    const warningIncidents = incidents.filter(i => i.severity === 'WARNING').length;
    const resolvedIncidents = incidents.filter(i => i.status === 'RESOLVED').length;
    const falseAlarms = incidents.filter(i => i.status === 'FALSE_ALARM').length;

    res.json({
      period: 'Last 30 Days',
      stats: {
        totalIncidents,
        criticalIncidents,
        warningIncidents,
        resolvedIncidents,
        falseAlarms,
        meanTimeToResolveMinutes: 34.5,
        deviceFleetUptimePercent: 99.82,
        sensorsOperationalPercent: 99.1,
      },
      incidentsByType: {
        'Fire / Thermal': incidents.filter(i => i.eventType.includes('Fire') || i.eventType.includes('Thermal')).length,
        'Gas Leak': incidents.filter(i => i.eventType.includes('Gas')).length,
        'Water Ingress': incidents.filter(i => i.eventType.includes('Water')).length,
        'Physical Intrusion': incidents.filter(i => i.eventType.includes('Unauthorized') || i.eventType.includes('Entry')).length,
        'Power / Network': incidents.filter(i => i.eventType.includes('Power') || i.eventType.includes('Connectivity')).length,
      },
      devicesUptime: devices.map(d => ({
        deviceCode: d.deviceCode,
        name: d.name,
        uptime: '99.9%',
        battery: `${d.batteryLevel}%`,
        status: d.status,
      })),
    });
  });

  // Audit Logs
  router.get('/audit-logs', (_req: Request, res: Response) => {
    res.json(auditLogs);
  });

  // IoT Hardware Specifications & Integration Documentation API
  router.get('/iot/hardware-specs', (_req: Request, res: Response) => {
    res.json({
      controller: 'Espressif ESP32-WROVER-E (Dual-core 240MHz, 8MB PSRAM, 16MB Flash)',
      connectivity: {
        cellular: 'SIMCom A7670E / Quectel EC200U 4G LTE Cat-1 with Micro-SIM (Airtel / MTN Rwanda support)',
        wifi: '802.11 b/g/n 2.4GHz with WPA3-Enterprise support',
        lorawanPlaceholder: 'SX1262 868MHz EU/East Africa spectrum ready',
      },
      sensorsPinout: [
        { type: 'SMOKE', model: 'MQ-2 / Optical Chamber EN54-7', interface: 'Analog ADC1_CH0 (GPIO36)' },
        { type: 'TEMPERATURE', model: 'Sensirion SHT40 / DS18B20', interface: 'I2C Bus (SDA GPIO21, SCL GPIO22)' },
        { type: 'GAS', model: 'Figaro TGS2602 / MQ-9 Catalytic', interface: 'Analog ADC1_CH3 (GPIO39)' },
        { type: 'WATER', model: 'Gold Conductive Spot / Rope Leak', interface: 'Digital Interrupt (GPIO34)' },
        { type: 'FIRE', model: 'Infrared Flame Receiver 760nm-1100nm', interface: 'Digital Comparator (GPIO35)' },
        { type: 'DOOR', model: 'Magnetic Reed Switch Contact', interface: 'GPIO32 (Internal Pull-Up)' },
        { type: 'MOTION', model: 'Fresnel Lens PIR Quad Element', interface: 'GPIO33 (Digital Interrupt)' },
        { type: 'SOUND', model: 'MEMS Acoustic Microphone', interface: 'I2S / Analog ADC1_CH4 (GPIO32)' },
      ],
      apiEndpoint: '/api/sensor-readings',
      mqttTopic: 'v1/clearrescue/devices/{deviceCode}/telemetry',
      sampleJsonPayload: {
        deviceCode: 'CRA-001',
        firmware: 'v2.4.1',
        battery: 94,
        readings: [
          { sensorType: 'SMOKE', value: 0.8 },
          { sensorType: 'TEMPERATURE', value: 22.4 },
          { sensorType: 'FIRE', value: 0 },
          { sensorType: 'GAS', value: 12 },
          { sensorType: 'WATER', value: 0 },
          { sensorType: 'DOOR', value: 0 },
          { sensorType: 'MOTION', value: 0 },
        ],
      },
    });
  });

  return router;
}
