import { GoogleGenAI } from '@google/genai';
import { Sensor, SensorType, AIAnalysis, IncidentSeverity } from '../types';

export interface TelemetrySnapshot {
  deviceId: string;
  deviceCode: string;
  locationName: string;
  sensors: Sensor[];
  timestamp: string;
}

const DISCLAIMER =
  'CLEAR RESCUE AI is an emergency-monitoring prototype platform. It does not replace certified fire alarms, gas detectors, official security systems, or professional first-responder emergency services.';

export async function runAIEmergencyAnalysis(snapshot: TelemetrySnapshot): Promise<AIAnalysis> {
  const { sensors, locationName, deviceCode } = snapshot;

  // Find triggered or abnormal sensors
  const abnormalSensors = sensors.filter(
    s => s.status === 'WARNING' || s.status === 'CRITICAL' || s.lastReading >= s.warningThreshold
  );

  // If Gemini API key is present in environment, attempt enhanced multimodal/contextual AI reasoning
  const apiKey = typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : undefined;

  if (apiKey && abnormalSensors.length > 0) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are the Clear Rescue AI Emergency Diagnostics Engine for Rwanda & East Africa.
Analyze these sensor readings from ${deviceCode} at ${locationName}:
${JSON.stringify(
  sensors.map(s => ({
    type: s.sensorType,
    reading: s.lastReading,
    unit: s.unit,
    status: s.status,
    warningThreshold: s.warningThreshold,
    criticalThreshold: s.criticalThreshold,
  })),
  null,
  2
)}

Determine:
1. Event type (e.g., Possible Fire Hazard, Possible Gas Leak, Flooding Risk, Security Anomaly, Device Health Degradation, or Normal)
2. Severity: INFO, WARNING, or CRITICAL
3. Confidence: between 0.50 and 0.96 (never state 100% or certainty)
4. Sensors involved: array of sensor type strings
5. Explanation: 2-3 sentences explaining the combination of readings. Always use calibrated phrasing like "Possible emergency detected" and "Verification recommended".
6. Recommended verification action: concise step for onsite personnel or technician.

Respond ONLY with valid JSON with keys: eventType, severity, confidence, sensorsInvolved, explanation, recommendedAction.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.1,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      if (parsed.eventType && parsed.severity) {
        return {
          eventType: parsed.eventType,
          severity: parsed.severity as IncidentSeverity,
          confidence: Math.min(0.96, Math.max(0.4, Number(parsed.confidence) || 0.8)),
          sensorsInvolved: (parsed.sensorsInvolved as SensorType[]) || abnormalSensors.map(s => s.sensorType),
          explanation: parsed.explanation,
          recommendedAction: parsed.recommendedAction,
          timestamp: new Date().toISOString(),
          modelUsed: 'gemini-2.5-flash',
        };
      }
    } catch (e) {
      console.warn('Gemini API call skipped or encountered error, utilizing deterministic AI safety engine:', e);
    }
  }

  // Robust, high-precision deterministic Rule-Based AI Engine
  return analyzeSensorsRuleBased(sensors);
}

export function analyzeSensorsRuleBased(sensors: Sensor[]): AIAnalysis {
  const getSensor = (type: SensorType) => sensors.find(s => s.sensorType === type);

  const fire = getSensor('FIRE');
  const smoke = getSensor('SMOKE');
  const temp = getSensor('TEMPERATURE');
  const gas = getSensor('GAS');
  const water = getSensor('WATER');
  const door = getSensor('DOOR');
  const motion = getSensor('MOTION');
  const sound = getSensor('SOUND');
  const humidity = getSensor('HUMIDITY');
  const battery = getSensor('BATTERY');
  const connectivity = getSensor('CONNECTIVITY');

  const now = new Date().toISOString();

  // 1. Catastrophic Fire / Thermal Threat: Smoke + Temp + Fire
  const isFireTriggered = fire && fire.lastReading > 0;
  const isSmokeCritical = smoke && smoke.lastReading >= smoke.criticalThreshold;
  const isSmokeWarning = smoke && smoke.lastReading >= smoke.warningThreshold;
  const isTempCritical = temp && temp.lastReading >= temp.criticalThreshold;
  const isTempWarning = temp && temp.lastReading >= temp.warningThreshold;

  if (isFireTriggered || (isSmokeCritical && isTempCritical) || (isSmokeWarning && isTempCritical)) {
    const sensorsInvolved: SensorType[] = [];
    if (fire) sensorsInvolved.push('FIRE');
    if (smoke) sensorsInvolved.push('SMOKE');
    if (temp) sensorsInvolved.push('TEMPERATURE');

    return {
      eventType: 'Possible Fire & Thermal Emergency',
      severity: 'CRITICAL',
      confidence: 0.94,
      sensorsInvolved,
      explanation:
        'Possible fire emergency detected. Correlated elevated temperature (>55°C) and dense smoke particulate signatures observed concurrently.',
      recommendedAction:
        'Immediate onsite visual inspection recommended. Check fire suppression zones, trigger facility alert protocol if validated, and contact local fire services (111 in Rwanda).',
      timestamp: now,
      modelUsed: 'ClearRescue-RuleEngine-v2',
    };
  }

  // 2. Pre-Ignition / Electrical Heating or Incipient Smolder
  if (isSmokeWarning && isTempWarning) {
    return {
      eventType: 'Possible Smoldering or Overheating Event',
      severity: 'WARNING',
      confidence: 0.85,
      sensorsInvolved: ['SMOKE', 'TEMPERATURE'],
      explanation:
        'Possible smoldering combustion or severe electrical heating detected. Elevated ambient temperature accompanied by rising smoke particles.',
      recommendedAction:
        'Dispatch facility warden or maintenance team to inspect electrical panels, HVAC ducting, and appliances.',
      timestamp: now,
      modelUsed: 'ClearRescue-RuleEngine-v2',
    };
  }

  // 3. Combustible or Toxic Gas Leak
  const isGasCritical = gas && gas.lastReading >= gas.criticalThreshold;
  const isGasWarning = gas && gas.lastReading >= gas.warningThreshold;

  if (isGasCritical || isGasWarning) {
    const sensorsInvolved: SensorType[] = ['GAS'];
    let severity: IncidentSeverity = isGasCritical ? 'CRITICAL' : 'WARNING';
    let explanation = 'Possible combustible or toxic gas accumulation detected above standard baseline.';

    if (isTempWarning) {
      sensorsInvolved.push('TEMPERATURE');
      severity = 'CRITICAL';
      explanation += ' Co-occurring temperature rise presents heightened flammability risk.';
    }

    return {
      eventType: 'Possible Gas Leak / Air Toxicity Alert',
      severity,
      confidence: isGasCritical ? 0.91 : 0.82,
      sensorsInvolved,
      explanation,
      recommendedAction:
        'Verification recommended. Do NOT toggle electrical switches or open flames. Ventilate area, isolate gas valves, and evacuate vulnerable personnel.',
      timestamp: now,
      modelUsed: 'ClearRescue-RuleEngine-v2',
    };
  }

  // 4. Water Leak / Flooding Hazard
  const isWaterDetected = water && water.lastReading >= 1;
  const isHumidityElevated = humidity && humidity.lastReading >= (humidity.warningThreshold || 75);

  if (isWaterDetected) {
    const sensorsInvolved: SensorType[] = ['WATER'];
    if (isHumidityElevated) sensorsInvolved.push('HUMIDITY');

    return {
      eventType: 'Possible Water Leak or Flooding',
      severity: isHumidityElevated ? 'CRITICAL' : 'WARNING',
      confidence: 0.89,
      sensorsInvolved,
      explanation:
        'Possible water ingress or pipe rupture detected by contact probes. Moisture readings correlate with rising relative humidity.',
      recommendedAction:
        'Check primary water mains, plumbing manifolds, server room sub-floors, and basement drainage pumps immediately.',
      timestamp: now,
      modelUsed: 'ClearRescue-RuleEngine-v2',
    };
  }

  // 5. Physical Security / Intrusion (Door + Motion + Sound)
  const isDoorOpen = door && door.lastReading >= 1;
  const isMotionDetected = motion && motion.lastReading >= 1;
  const isAbnormalSound = sound && sound.lastReading >= (sound.warningThreshold || 75);

  if (isDoorOpen && isMotionDetected) {
    const sensorsInvolved: SensorType[] = ['DOOR', 'MOTION'];
    if (isAbnormalSound) sensorsInvolved.push('SOUND');

    return {
      eventType: 'Possible Unauthorized Entry / Perimeter Breach',
      severity: isAbnormalSound ? 'CRITICAL' : 'WARNING',
      confidence: 0.88,
      sensorsInvolved,
      explanation:
        'Possible security intrusion detected. Access door opened with concurrent active motion and elevated acoustic levels in the monitored zone.',
      recommendedAction:
        'Cross-verify security CCTV feeds, confirm scheduled custodial or staff access, and alert facility guard patrol.',
      timestamp: now,
      modelUsed: 'ClearRescue-RuleEngine-v2',
    };
  }

  if (isDoorOpen && !isMotionDetected) {
    return {
      eventType: 'Door Ajar / Entry Left Unsecured',
      severity: 'INFO',
      confidence: 0.8,
      sensorsInvolved: ['DOOR'],
      explanation: 'Monitored perimeter access door is open or unlatched without active movement detected.',
      recommendedAction: 'Verify if entry door was intentionally propped open or requires manual latching.',
      timestamp: now,
      modelUsed: 'ClearRescue-RuleEngine-v2',
    };
  }

  // 6. Device Hardware Failure / Tamper / Power Loss
  const isBatteryLow = battery && battery.lastReading <= 20;
  const isConnectivityPoor = connectivity && connectivity.lastReading <= 15;

  if (isBatteryLow || isConnectivityPoor) {
    const sensorsInvolved: SensorType[] = [];
    if (isBatteryLow) sensorsInvolved.push('BATTERY');
    if (isConnectivityPoor) sensorsInvolved.push('CONNECTIVITY');

    return {
      eventType: 'Device Power & Connectivity Degradation',
      severity: battery && battery.lastReading <= 10 ? 'WARNING' : 'INFO',
      confidence: 0.87,
      sensorsInvolved,
      explanation:
        'Device diagnostic health warning. Internal LiPo backup battery level or cellular signal link has fallen below operational threshold.',
      recommendedAction:
        'Schedule technician maintenance ticket to inspect AC mains power adapter, battery health, and antenna positioning.',
      timestamp: now,
      modelUsed: 'ClearRescue-RuleEngine-v2',
    };
  }

  // Default: Normal State
  return {
    eventType: 'Normal Environmental Conditions',
    severity: 'INFO',
    confidence: 0.95,
    sensorsInvolved: [],
    explanation: 'All connected sensors report measurements within nominal safety thresholds.',
    recommendedAction: 'No immediate action required. Routine continuous monitoring active.',
    timestamp: now,
    modelUsed: 'ClearRescue-RuleEngine-v2',
  };
}
