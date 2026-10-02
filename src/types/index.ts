export type UserRole = 'customer' | 'technician' | 'admin' | 'superadmin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  organizationId?: string;
  organizationName?: string;
  phone?: string;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type DeviceStatus = 'online' | 'offline' | 'warning' | 'emergency';
export type ConnectionType = '4G' | 'WiFi' | 'Ethernet';

export interface Device {
  id: string;
  deviceCode: string;
  name: string;
  locationId: string;
  locationName: string;
  organizationId: string;
  status: DeviceStatus;
  connectionType: ConnectionType;
  batteryLevel: number; // percentage 0 - 100
  firmwareVersion: string;
  ipAddress?: string;
  macAddress?: string;
  assignedTechnicianId?: string;
  assignedTechnicianName?: string;
  lastSeen: string;
  createdAt: string;
  sensorsCount?: number;
  apiKey?: string;
}

export type SensorType =
  | 'FIRE'
  | 'SMOKE'
  | 'TEMPERATURE'
  | 'GAS'
  | 'WATER'
  | 'DOOR'
  | 'MOTION'
  | 'SOUND'
  | 'HUMIDITY'
  | 'AIR_QUALITY'
  | 'BATTERY'
  | 'CONNECTIVITY';

export type SensorStatus = 'NORMAL' | 'WARNING' | 'CRITICAL' | 'OFFLINE';

export interface Sensor {
  id: string;
  sensorCode: string;
  deviceId: string;
  deviceCode?: string;
  locationId?: string;
  locationName?: string;
  sensorType: SensorType;
  measurement: string;
  unit: string;
  status: SensorStatus;
  lastReading: number;
  warningThreshold: number;
  criticalThreshold: number;
  lastUpdated: string;
  calibrationStatus: 'CALIBRATED' | 'CALIBRATION_DUE' | 'UNVERIFIED';
  normalRangeText?: string;
  description?: string;
}

export interface SensorReading {
  id: string;
  sensorId: string;
  deviceId: string;
  deviceCode?: string;
  sensorType: SensorType;
  value: number;
  unit: string;
  status: SensorStatus;
  timestamp: string;
  rawPayload?: Record<string, unknown>;
}

export type IncidentSeverity = 'INFO' | 'WARNING' | 'CRITICAL';
export type IncidentStatus = 'OPEN' | 'ACKNOWLEDGED' | 'INVESTIGATING' | 'RESOLVED' | 'FALSE_ALARM';

export interface AIAnalysis {
  eventType: string;
  severity: IncidentSeverity;
  confidence: number; // 0.0 - 1.0
  sensorsInvolved: SensorType[];
  explanation: string;
  recommendedAction: string;
  timestamp: string;
  modelUsed?: string;
}

export interface Incident {
  id: string;
  incidentCode: string;
  deviceId: string;
  deviceCode: string;
  locationId: string;
  locationName: string;
  organizationId: string;
  eventType: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  triggeredSensors: SensorType[];
  sensorReadings: Array<{
    sensorType: SensorType;
    value: number;
    unit: string;
    threshold: number;
  }>;
  aiAnalysis: AIAnalysis;
  createdTime: string;
  acknowledgedTime?: string;
  acknowledgedBy?: string;
  investigatingTime?: string;
  resolvedTime?: string;
  resolvedBy?: string;
  assignedTechnician?: string;
  notes?: string[];
  disclaimer: string;
}

export type NotificationChannel = 'IN_APP' | 'EMAIL' | 'SMS' | 'PUSH';

export interface NotificationItem {
  id: string;
  userId?: string;
  organizationId?: string;
  incidentId?: string;
  title: string;
  message: string;
  severity: IncidentSeverity;
  channel: NotificationChannel;
  isRead: boolean;
  createdAt: string;
  metadata?: {
    deviceCode?: string;
    locationName?: string;
    eventType?: string;
  };
}

export interface MaintenanceRecord {
  id: string;
  ticketCode: string;
  deviceId: string;
  deviceCode: string;
  locationName: string;
  technicianId?: string;
  technicianName: string;
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  partsReplaced?: string;
  scheduledDate: string;
  completedDate?: string;
  notes?: string;
  createdAt: string;
}

export interface LocationItem {
  id: string;
  name: string;
  organizationId: string;
  address: string;
  city: string;
  district: string;
  province: string;
  country: string;
  buildingType: 'Office' | 'Warehouse' | 'School' | 'Hotel' | 'Factory' | 'Residential';
  contactPerson: string;
  contactPhone: string;
  deviceCount: number;
  activeAlertsCount: number;
}

export interface AuditLogItem {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  resource: string;
  details: string;
  ipAddress?: string;
  timestamp: string;
}

export interface SystemSettings {
  smsGatewayEnabled: boolean;
  emailAlertsEnabled: boolean;
  pushNotificationsEnabled: boolean;
  aiAnalysisSensitivity: 'LOW' | 'BALANCED' | 'HIGH';
  emergencyCallAutomationPlaceholder: boolean;
  rwandaEmergencyNumber: string; // e.g. 111 (Fire), 112 (Police)
  soundAlertEnabled: boolean;
  simulationModeActive: boolean;
  dataRetentionDays: number;
}
