import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Device,
  Sensor,
  Incident,
  MaintenanceRecord,
  NotificationItem,
  AuditLogItem,
  LocationItem,
  SystemSettings,
  SensorType,
} from '../types';
import {
  INITIAL_DEVICES,
  INITIAL_LOCATIONS,
  INITIAL_INCIDENTS,
  INITIAL_MAINTENANCE,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_SETTINGS,
  generateSensorsForDevice,
} from '../services/seedData';
import { analyzeSensorsRuleBased } from '../services/aiEmergencyAnalysis';

export type SimulationScenario =
  | 'NORMAL'
  | 'SMOKE_SURGE'
  | 'TEMP_SPIKE'
  | 'FIRE_COMBINED'
  | 'GAS_LEAK'
  | 'WATER_FLOOD'
  | 'DOOR_BREACH'
  | 'MOTION_INTRUSION'
  | 'LOW_BATTERY'
  | 'DEVICE_OFFLINE';

interface EmergencyContextType {
  devices: Device[];
  sensors: Sensor[];
  locations: LocationItem[];
  incidents: Incident[];
  maintenanceRecords: MaintenanceRecord[];
  notifications: NotificationItem[];
  auditLogs: AuditLogItem[];
  settings: SystemSettings;
  activeEmergency: Incident | null;
  selectedDeviceId: string;
  setSelectedDeviceId: (id: string) => void;
  // Actions
  injectSimulation: (scenario: SimulationScenario, targetDeviceId?: string) => Promise<void>;
  updateSensorReading: (sensorId: string, value: number) => Promise<void>;
  updateSensorThreshold: (sensorId: string, warning: number, critical: number) => void;
  acknowledgeIncident: (incidentId: string, userName: string) => void;
  investigateIncident: (incidentId: string, technicianName: string) => void;
  resolveIncident: (incidentId: string, userName: string, notes?: string) => void;
  markFalseAlarm: (incidentId: string, userName: string, notes?: string) => void;
  addDevice: (device: Partial<Device>) => void;
  updateDevice: (id: string, updates: Partial<Device>) => void;
  deleteDevice: (id: string) => void;
  createMaintenanceRecord: (record: Partial<MaintenanceRecord>) => void;
  updateMaintenanceRecord: (id: string, updates: Partial<MaintenanceRecord>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  updateSettings: (updates: Partial<SystemSettings>) => void;
  logAuditAction: (action: string, resource: string, details: string) => void;
  dismissEmergencyBanner: () => void;
  isBannerDismissed: boolean;
}

const EmergencyContext = createContext<EmergencyContextType | undefined>(undefined);

export const EmergencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [devices, setDevices] = useState<Device[]>(() => {
    const saved = localStorage.getItem('cra_devices');
    return saved ? JSON.parse(saved) : INITIAL_DEVICES;
  });

  const [sensors, setSensors] = useState<Sensor[]>(() => {
    const saved = localStorage.getItem('cra_sensors');
    if (saved) return JSON.parse(saved);
    const initialList: Sensor[] = [];
    INITIAL_DEVICES.forEach(d => initialList.push(...generateSensorsForDevice(d)));
    return initialList;
  });

  const [locations, setLocations] = useState<LocationItem[]>(() => {
    const saved = localStorage.getItem('cra_locations');
    return saved ? JSON.parse(saved) : INITIAL_LOCATIONS;
  });

  const [incidents, setIncidents] = useState<Incident[]>(() => {
    const saved = localStorage.getItem('cra_incidents');
    return saved ? JSON.parse(saved) : INITIAL_INCIDENTS;
  });

  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>(() => {
    const saved = localStorage.getItem('cra_maintenance');
    return saved ? JSON.parse(saved) : INITIAL_MAINTENANCE;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('cra_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => {
    const saved = localStorage.getItem('cra_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [settings, setSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem('cra_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(devices[0]?.id || 'dev-cra-001');
  const [isBannerDismissed, setIsBannerDismissed] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('cra_devices', JSON.stringify(devices));
  }, [devices]);

  useEffect(() => {
    localStorage.setItem('cra_sensors', JSON.stringify(sensors));
  }, [sensors]);

  useEffect(() => {
    localStorage.setItem('cra_incidents', JSON.stringify(incidents));
  }, [incidents]);

  useEffect(() => {
    localStorage.setItem('cra_maintenance', JSON.stringify(maintenanceRecords));
  }, [maintenanceRecords]);

  useEffect(() => {
    localStorage.setItem('cra_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('cra_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('cra_settings', JSON.stringify(settings));
  }, [settings]);

  // Determine active emergency (CRITICAL or WARNING incident open)
  const activeEmergency = incidents.find(
    i => (i.severity === 'CRITICAL' || i.severity === 'WARNING') && (i.status === 'OPEN' || i.status === 'INVESTIGATING')
  ) || null;

  // Audit logger helper
  const logAuditAction = useCallback((action: string, resource: string, details: string) => {
    const newLog: AuditLogItem = {
      id: `audit-${Date.now()}`,
      userId: 'user-active',
      userEmail: 'operator@clearrescue.rw',
      action,
      resource,
      details,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs(prev => [newLog, ...prev]);
  }, []);

  // Simulator Engine - Sends payload to API or evaluates locally
  const injectSimulation = async (scenario: SimulationScenario, targetDeviceId?: string) => {
    const devId = targetDeviceId || selectedDeviceId;
    const targetDevice = devices.find(d => d.id === devId) || devices[0];
    if (!targetDevice) return;

    setIsBannerDismissed(false); // reset banner so alert is visible

    let newSensorValues: Array<{ sensorType: SensorType; value: number }> = [];

    switch (scenario) {
      case 'NORMAL':
        newSensorValues = [
          { sensorType: 'FIRE', value: 0 },
          { sensorType: 'SMOKE', value: 0.8 },
          { sensorType: 'TEMPERATURE', value: 23.2 },
          { sensorType: 'GAS', value: 14 },
          { sensorType: 'WATER', value: 0 },
          { sensorType: 'DOOR', value: 0 },
          { sensorType: 'MOTION', value: 0 },
          { sensorType: 'SOUND', value: 45 },
          { sensorType: 'HUMIDITY', value: 52 },
          { sensorType: 'AIR_QUALITY', value: 34 },
          { sensorType: 'BATTERY', value: 92 },
          { sensorType: 'CONNECTIVITY', value: 28 },
        ];
        break;

      case 'FIRE_COMBINED':
        newSensorValues = [
          { sensorType: 'FIRE', value: 1.0 },
          { sensorType: 'SMOKE', value: 8.6 },
          { sensorType: 'TEMPERATURE', value: 78.5 },
          { sensorType: 'AIR_QUALITY', value: 280 },
        ];
        break;

      case 'SMOKE_SURGE':
        newSensorValues = [
          { sensorType: 'SMOKE', value: 6.2 },
          { sensorType: 'AIR_QUALITY', value: 210 },
        ];
        break;

      case 'TEMP_SPIKE':
        newSensorValues = [
          { sensorType: 'TEMPERATURE', value: 62.0 },
        ];
        break;

      case 'GAS_LEAK':
        newSensorValues = [
          { sensorType: 'GAS', value: 240 },
          { sensorType: 'AIR_QUALITY', value: 185 },
        ];
        break;

      case 'WATER_FLOOD':
        newSensorValues = [
          { sensorType: 'WATER', value: 1.0 },
          { sensorType: 'HUMIDITY', value: 88 },
        ];
        break;

      case 'DOOR_BREACH':
        newSensorValues = [
          { sensorType: 'DOOR', value: 1.0 },
          { sensorType: 'MOTION', value: 1.0 },
          { sensorType: 'SOUND', value: 88 },
        ];
        break;

      case 'MOTION_INTRUSION':
        newSensorValues = [
          { sensorType: 'MOTION', value: 1.0 },
          { sensorType: 'SOUND', value: 78 },
        ];
        break;

      case 'LOW_BATTERY':
        newSensorValues = [
          { sensorType: 'BATTERY', value: 8 },
        ];
        break;

      case 'DEVICE_OFFLINE':
        newSensorValues = [
          { sensorType: 'CONNECTIVITY', value: 0 },
        ];
        break;
    }

    // Call backend API endpoint to persist and trigger backend emergency pipeline
    try {
      await fetch('/api/sensor-readings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceCode: targetDevice.deviceCode,
          readings: newSensorValues,
        }),
      });
    } catch (e) {
      console.warn('API call failed or in standalone preview mode, applying local state update:', e);
    }

    // Update local sensors state
    const timestamp = new Date().toISOString();
    setSensors(prevSensors =>
      prevSensors.map(sensor => {
        if (sensor.deviceId !== targetDevice.id) return sensor;
        const matching = newSensorValues.find(v => v.sensorType === sensor.sensorType);
        if (!matching) return sensor;

        let status: 'NORMAL' | 'WARNING' | 'CRITICAL' = 'NORMAL';
        if (matching.value >= sensor.criticalThreshold) {
          status = 'CRITICAL';
        } else if (matching.value >= sensor.warningThreshold) {
          status = 'WARNING';
        }

        return {
          ...sensor,
          lastReading: matching.value,
          lastUpdated: timestamp,
          status,
        };
      })
    );

    // Update device status & battery if applicable
    setDevices(prevDevices =>
      prevDevices.map(d => {
        if (d.id !== targetDevice.id) return d;
        let newStatus = d.status;
        let newBattery = d.batteryLevel;

        if (scenario === 'NORMAL') {
          newStatus = 'online';
        } else if (scenario === 'DEVICE_OFFLINE') {
          newStatus = 'offline';
        } else if (scenario === 'FIRE_COMBINED' || scenario === 'GAS_LEAK' || scenario === 'WATER_FLOOD' || scenario === 'DOOR_BREACH') {
          newStatus = 'emergency';
        } else if (scenario === 'SMOKE_SURGE' || scenario === 'TEMP_SPIKE' || scenario === 'LOW_BATTERY') {
          newStatus = 'warning';
        }

        if (scenario === 'LOW_BATTERY') newBattery = 8;
        if (scenario === 'NORMAL') newBattery = 92;

        return {
          ...d,
          status: newStatus,
          batteryLevel: newBattery,
          lastSeen: timestamp,
        };
      })
    );

    // Run AI Analysis on current snapshot
    const updatedDeviceSensors = sensors
      .map(s => {
        if (s.deviceId !== targetDevice.id) return s;
        const matching = newSensorValues.find(v => v.sensorType === s.sensorType);
        return matching ? { ...s, lastReading: matching.value } : s;
      })
      .filter(s => s.deviceId === targetDevice.id);

    const aiResult = analyzeSensorsRuleBased(updatedDeviceSensors);

    if (aiResult.severity === 'CRITICAL' || aiResult.severity === 'WARNING') {
      const newIncident: Incident = {
        id: `inc-${Date.now()}`,
        incidentCode: `INC-${Date.now().toString().slice(-6)}`,
        deviceId: targetDevice.id,
        deviceCode: targetDevice.deviceCode,
        locationId: targetDevice.locationId,
        locationName: targetDevice.locationName,
        organizationId: targetDevice.organizationId,
        eventType: aiResult.eventType,
        severity: aiResult.severity,
        status: 'OPEN',
        triggeredSensors: aiResult.sensorsInvolved,
        sensorReadings: updatedDeviceSensors
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

      setIncidents(prev => [newIncident, ...prev]);

      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: `🚨 ${aiResult.severity}: ${aiResult.eventType}`,
        message: `${aiResult.explanation} Location: ${targetDevice.locationName} (${targetDevice.deviceCode}). ${aiResult.recommendedAction}`,
        severity: aiResult.severity,
        channel: 'IN_APP',
        isRead: false,
        createdAt: timestamp,
        metadata: {
          deviceCode: targetDevice.deviceCode,
          locationName: targetDevice.locationName,
          eventType: aiResult.eventType,
        },
      };

      setNotifications(prev => [newNotif, ...prev]);
      logAuditAction('SIMULATION_TRIGGERED', targetDevice.deviceCode, `Scenario injected: ${scenario} (${aiResult.eventType})`);
    } else if (scenario === 'NORMAL') {
      logAuditAction('SIMULATION_RESET', targetDevice.deviceCode, 'Reset all telemetry channels to nominal safety state.');
    }
  };

  const updateSensorReading = async (sensorId: string, value: number) => {
    const sensor = sensors.find(s => s.id === sensorId);
    if (!sensor) return;

    let status: 'NORMAL' | 'WARNING' | 'CRITICAL' = 'NORMAL';
    if (value >= sensor.criticalThreshold) status = 'CRITICAL';
    else if (value >= sensor.warningThreshold) status = 'WARNING';

    const timestamp = new Date().toISOString();
    setSensors(prev =>
      prev.map(s => (s.id === sensorId ? { ...s, lastReading: value, status, lastUpdated: timestamp } : s))
    );

    logAuditAction('SENSOR_MANUAL_ADJUST', sensor.sensorCode, `Set reading to ${value} ${sensor.unit} (Status: ${status})`);
  };

  const updateSensorThreshold = (sensorId: string, warning: number, critical: number) => {
    setSensors(prev =>
      prev.map(s =>
        s.id === sensorId
          ? {
              ...s,
              warningThreshold: warning,
              criticalThreshold: critical,
              calibrationStatus: 'CALIBRATED',
            }
          : s
      )
    );
    logAuditAction('THRESHOLD_MODIFIED', sensorId, `Warning threshold: ${warning}, Critical: ${critical}`);
  };

  const acknowledgeIncident = (incidentId: string, userName: string) => {
    setIncidents(prev =>
      prev.map(i =>
        i.id === incidentId
          ? {
              ...i,
              status: 'ACKNOWLEDGED',
              acknowledgedTime: new Date().toISOString(),
              acknowledgedBy: userName,
            }
          : i
      )
    );
    logAuditAction('INCIDENT_ACKNOWLEDGE', incidentId, `Acknowledged by ${userName}`);
  };

  const investigateIncident = (incidentId: string, technicianName: string) => {
    setIncidents(prev =>
      prev.map(i =>
        i.id === incidentId
          ? {
              ...i,
              status: 'INVESTIGATING',
              investigatingTime: new Date().toISOString(),
              assignedTechnician: technicianName,
            }
          : i
      )
    );
    logAuditAction('INCIDENT_INVESTIGATE', incidentId, `Assigned to technician ${technicianName}`);
  };

  const resolveIncident = (incidentId: string, userName: string, notes?: string) => {
    setIncidents(prev =>
      prev.map(i => {
        if (i.id !== incidentId) return i;
        const currentNotes = i.notes || [];
        return {
          ...i,
          status: 'RESOLVED',
          resolvedTime: new Date().toISOString(),
          resolvedBy: userName,
          notes: notes ? [...currentNotes, notes] : currentNotes,
        };
      })
    );

    // Reset device status
    const targetIncident = incidents.find(i => i.id === incidentId);
    if (targetIncident) {
      setDevices(prev =>
        prev.map(d => (d.id === targetIncident.deviceId ? { ...d, status: 'online' } : d))
      );
    }

    logAuditAction('INCIDENT_RESOLVE', incidentId, `Resolved by ${userName}. Notes: ${notes || 'None'}`);
  };

  const markFalseAlarm = (incidentId: string, userName: string, notes?: string) => {
    setIncidents(prev =>
      prev.map(i => {
        if (i.id !== incidentId) return i;
        const currentNotes = i.notes || [];
        return {
          ...i,
          status: 'FALSE_ALARM',
          resolvedTime: new Date().toISOString(),
          resolvedBy: userName,
          notes: notes ? [...currentNotes, `[FALSE ALARM]: ${notes}`] : currentNotes,
        };
      })
    );

    const targetIncident = incidents.find(i => i.id === incidentId);
    if (targetIncident) {
      setDevices(prev =>
        prev.map(d => (d.id === targetIncident.deviceId ? { ...d, status: 'online' } : d))
      );
    }

    logAuditAction('INCIDENT_FALSE_ALARM', incidentId, `Marked false alarm by ${userName}. Reason: ${notes || 'Sensor false spike'}`);
  };

  const addDevice = (deviceData: Partial<Device>) => {
    const newDevice: Device = {
      id: `dev-${Date.now()}`,
      deviceCode: (deviceData.deviceCode || `CRA-${Math.floor(Math.random() * 900 + 100)}`).toUpperCase(),
      name: deviceData.name || 'New Sector Monitor',
      locationId: deviceData.locationId || locations[0]?.id || 'loc-kigali-hq',
      locationName: deviceData.locationName || locations[0]?.name || 'Kigali Head Office',
      organizationId: 'org-rwanda-demo',
      status: 'online',
      connectionType: deviceData.connectionType || '4G',
      batteryLevel: 100,
      firmwareVersion: 'v2.4.1',
      ipAddress: '10.12.9.' + Math.floor(Math.random() * 200 + 10),
      macAddress: '3C:71:BF:' + Math.random().toString(16).substring(2, 8).toUpperCase(),
      lastSeen: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      sensorsCount: 12,
    };

    setDevices(prev => [...prev, newDevice]);
    const newSensors = generateSensorsForDevice(newDevice);
    setSensors(prev => [...prev, ...newSensors]);
    logAuditAction('DEVICE_ADD', newDevice.deviceCode, `Added new device: ${newDevice.name}`);
  };

  const updateDevice = (id: string, updates: Partial<Device>) => {
    setDevices(prev =>
      prev.map(d => (d.id === id ? { ...d, ...updates, lastSeen: new Date().toISOString() } : d))
    );
    logAuditAction('DEVICE_UPDATE', id, `Updated device attributes: ${Object.keys(updates).join(', ')}`);
  };

  const deleteDevice = (id: string) => {
    const dev = devices.find(d => d.id === id);
    setDevices(prev => prev.filter(d => d.id !== id));
    setSensors(prev => prev.filter(s => s.deviceId !== id));
    if (dev) {
      logAuditAction('DEVICE_REMOVE', dev.deviceCode, `Removed device ${dev.name}`);
    }
  };

  const createMaintenanceRecord = (record: Partial<MaintenanceRecord>) => {
    const newRecord: MaintenanceRecord = {
      id: `mnt-${Date.now()}`,
      ticketCode: `MNT-${Date.now().toString().slice(-5)}`,
      deviceId: record.deviceId || devices[0]?.id || 'dev-cra-001',
      deviceCode: record.deviceCode || devices[0]?.deviceCode || 'CRA-001',
      locationName: record.locationName || 'Kigali Head Office',
      technicianName: record.technicianName || 'Emmanuel Nshimiyimana',
      title: record.title || 'General Maintenance Inspection',
      description: record.description || '',
      priority: record.priority || 'MEDIUM',
      status: 'SCHEDULED',
      scheduledDate: record.scheduledDate || new Date(Date.now() + 86400000).toISOString(),
      createdAt: new Date().toISOString(),
    };

    setMaintenanceRecords(prev => [newRecord, ...prev]);
    logAuditAction('MAINTENANCE_CREATED', newRecord.ticketCode, `Created ticket: ${newRecord.title}`);
  };

  const updateMaintenanceRecord = (id: string, updates: Partial<MaintenanceRecord>) => {
    setMaintenanceRecords(prev =>
      prev.map(m => (m.id === id ? { ...m, ...updates } : m))
    );
    logAuditAction('MAINTENANCE_UPDATED', id, `Updated ticket status: ${updates.status || 'Updated'}`);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const updateSettings = (updates: Partial<SystemSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
    logAuditAction('SETTINGS_MODIFIED', 'System Settings', `Updated configuration options: ${Object.keys(updates).join(', ')}`);
  };

  const dismissEmergencyBanner = () => {
    setIsBannerDismissed(true);
  };

  return (
    <EmergencyContext.Provider
      value={{
        devices,
        sensors,
        locations,
        incidents,
        maintenanceRecords,
        notifications,
        auditLogs,
        settings,
        activeEmergency,
        selectedDeviceId,
        setSelectedDeviceId,
        injectSimulation,
        updateSensorReading,
        updateSensorThreshold,
        acknowledgeIncident,
        investigateIncident,
        resolveIncident,
        markFalseAlarm,
        addDevice,
        updateDevice,
        deleteDevice,
        createMaintenanceRecord,
        updateMaintenanceRecord,
        markNotificationRead,
        markAllNotificationsRead,
        updateSettings,
        logAuditAction,
        dismissEmergencyBanner,
        isBannerDismissed,
      }}
    >
      {children}
    </EmergencyContext.Provider>
  );
};

export const useEmergency = () => {
  const context = useContext(EmergencyContext);
  if (!context) {
    throw new Error('useEmergency must be used within an EmergencyProvider');
  }
  return context;
};
