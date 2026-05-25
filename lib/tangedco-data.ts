import { createSeededRandom } from '@/lib/seeded-random'

function dateSeed(date: Date): string {
  return date.toISOString().slice(0, 10)
}

// Tamil Nadu Districts and their key details
export const districts = [
  { id: 'chennai', name: 'Chennai', population: 4646732, baseLoad: 2800 },
  { id: 'coimbatore', name: 'Coimbatore', population: 1601438, baseLoad: 1200 },
  { id: 'madurai', name: 'Madurai', population: 1017865, baseLoad: 850 },
  { id: 'trichy', name: 'Tiruchirappalli', population: 916857, baseLoad: 720 },
  { id: 'salem', name: 'Salem', population: 831038, baseLoad: 680 },
  { id: 'tirunelveli', name: 'Tirunelveli', population: 474838, baseLoad: 420 },
  { id: 'erode', name: 'Erode', population: 521776, baseLoad: 480 },
] as const

export type District = (typeof districts)[number]

// Feeders for each district
export const feeders: Record<string, Array<{ id: string; name: string; capacity: number; priority: 'critical' | 'high' | 'medium' | 'low' }>> = {
  chennai: [
    { id: 'ch-f1', name: 'Anna Nagar Feeder', capacity: 450, priority: 'high' },
    { id: 'ch-f2', name: 'T Nagar Feeder', capacity: 520, priority: 'high' },
    { id: 'ch-f3', name: 'Adyar Feeder', capacity: 380, priority: 'medium' },
    { id: 'ch-f4', name: 'Tambaram Feeder', capacity: 420, priority: 'medium' },
    { id: 'ch-f5', name: 'Egmore Hospital Feeder', capacity: 280, priority: 'critical' },
    { id: 'ch-f6', name: 'Guindy Industrial Feeder', capacity: 550, priority: 'high' },
    { id: 'ch-f7', name: 'Royapuram Feeder', capacity: 350, priority: 'low' },
  ],
  coimbatore: [
    { id: 'cb-f1', name: 'RS Puram Feeder', capacity: 280, priority: 'high' },
    { id: 'cb-f2', name: 'Gandhipuram Feeder', capacity: 320, priority: 'high' },
    { id: 'cb-f3', name: 'Saibaba Colony Feeder', capacity: 250, priority: 'medium' },
    { id: 'cb-f4', name: 'Singanallur Industrial Feeder', capacity: 400, priority: 'high' },
    { id: 'cb-f5', name: 'GH Feeder', capacity: 180, priority: 'critical' },
  ],
  madurai: [
    { id: 'md-f1', name: 'Meenakshi Temple Area Feeder', capacity: 220, priority: 'high' },
    { id: 'md-f2', name: 'Anna Nagar Feeder', capacity: 280, priority: 'medium' },
    { id: 'md-f3', name: 'Mattuthavani Feeder', capacity: 200, priority: 'medium' },
    { id: 'md-f4', name: 'GH Feeder', capacity: 150, priority: 'critical' },
  ],
  trichy: [
    { id: 'tr-f1', name: 'Srirangam Feeder', capacity: 200, priority: 'high' },
    { id: 'tr-f2', name: 'Cantonment Feeder', capacity: 250, priority: 'medium' },
    { id: 'tr-f3', name: 'Woraiyur Feeder', capacity: 180, priority: 'medium' },
    { id: 'tr-f4', name: 'BHEL Township Feeder', capacity: 300, priority: 'high' },
  ],
  salem: [
    { id: 'sl-f1', name: 'Junction Feeder', capacity: 220, priority: 'high' },
    { id: 'sl-f2', name: 'Hasthampatti Feeder', capacity: 200, priority: 'medium' },
    { id: 'sl-f3', name: 'Steel Plant Feeder', capacity: 350, priority: 'high' },
    { id: 'sl-f4', name: 'GH Feeder', capacity: 120, priority: 'critical' },
  ],
  tirunelveli: [
    { id: 'tv-f1', name: 'Town Feeder', capacity: 180, priority: 'high' },
    { id: 'tv-f2', name: 'Palayamkottai Feeder', capacity: 150, priority: 'medium' },
    { id: 'tv-f3', name: 'GH Feeder', capacity: 100, priority: 'critical' },
  ],
  erode: [
    { id: 'er-f1', name: 'Bus Stand Feeder', capacity: 160, priority: 'high' },
    { id: 'er-f2', name: 'Perundurai Industrial Feeder', capacity: 280, priority: 'high' },
    { id: 'er-f3', name: 'GH Feeder', capacity: 100, priority: 'critical' },
  ],
}

// Tamil Nadu festivals with typical dates and load multipliers
export const festivals = [
  { name: 'Pongal', month: 1, day: 14, duration: 4, loadMultiplier: 1.35, type: 'major' },
  { name: 'Tamil New Year', month: 4, day: 14, duration: 1, loadMultiplier: 1.25, type: 'major' },
  { name: 'Deepavali', month: 10, day: 24, duration: 2, loadMultiplier: 1.45, type: 'major' },
  { name: 'Vinayagar Chaturthi', month: 9, day: 7, duration: 1, loadMultiplier: 1.2, type: 'medium' },
  { name: 'Navratri', month: 10, day: 15, duration: 9, loadMultiplier: 1.15, type: 'medium' },
  { name: 'Thai Poosam', month: 1, day: 28, duration: 1, loadMultiplier: 1.18, type: 'medium' },
  { name: 'Chithirai Thiruvizha', month: 4, day: 20, duration: 10, loadMultiplier: 1.22, type: 'local' },
] as const

export type Festival = (typeof festivals)[number]

// Day type classification
export type DayType = 'weekday' | 'weekend' | 'holiday'

export function getDayType(date: Date): DayType {
  const day = date.getDay()
  if (day === 0) return 'weekend' // Sunday
  if (day === 6) return 'weekend' // Saturday (half-day but lower consumption)
  return 'weekday'
}

// Check if a date falls on a festival
export function getActiveFestival(date: Date): Festival | null {
  const month = date.getMonth() + 1
  const day = date.getDate()
  
  for (const festival of festivals) {
    if (month === festival.month) {
      if (day >= festival.day && day < festival.day + festival.duration) {
        return festival
      }
    }
  }
  return null
}

// Weather simulation based on Tamil Nadu climate
export function getWeatherForHour(
  hour: number,
  month: number,
  seedKey = 'default',
): { temperature: number; humidity: number } {
  const rng = createSeededRandom(`${seedKey}-weather-${month}-${hour}`)
  // Base temperature varies by month (Tamil Nadu climate)
  const monthlyBaseTemp: Record<number, number> = {
    1: 26, 2: 28, 3: 31, 4: 34, 5: 36, 6: 34,
    7: 32, 8: 32, 9: 31, 10: 29, 11: 27, 12: 26
  }
  
  const baseTemp = monthlyBaseTemp[month] || 30
  
  // Daily temperature variation
  let hourlyVariation = 0
  if (hour >= 6 && hour < 10) {
    hourlyVariation = (hour - 6) * 1.5 // Morning rise
  } else if (hour >= 10 && hour < 14) {
    hourlyVariation = 6 + (hour - 10) * 0.5 // Peak hours
  } else if (hour >= 14 && hour < 18) {
    hourlyVariation = 8 - (hour - 14) * 1 // Afternoon decline
  } else if (hour >= 18 && hour < 22) {
    hourlyVariation = 4 - (hour - 18) * 1 // Evening cooling
  } else {
    hourlyVariation = 0 // Night baseline
  }
  
  const temperature = baseTemp + hourlyVariation + (rng() * 2 - 1)
  
  // Humidity inversely related to temperature
  const baseHumidity = month >= 10 || month <= 1 ? 75 : 55 // Higher during NE monsoon
  const humidity = baseHumidity - (hourlyVariation * 2) + (rng() * 10 - 5)
  
  return {
    temperature: Math.round(temperature * 10) / 10,
    humidity: Math.max(30, Math.min(95, Math.round(humidity)))
  }
}

// Load curve pattern for different day types (percentage of base load)
const loadPatterns: Record<DayType, number[]> = {
  weekday: [
    0.55, 0.50, 0.48, 0.47, 0.50, 0.60, // 00:00 - 05:00
    0.75, 0.85, 0.92, 0.95, 0.98, 1.00, // 06:00 - 11:00
    0.95, 0.90, 0.92, 0.95, 0.98, 1.02, // 12:00 - 17:00
    1.10, 1.15, 1.12, 1.05, 0.90, 0.70, // 18:00 - 23:00
  ],
  weekend: [
    0.50, 0.48, 0.45, 0.44, 0.45, 0.50, // 00:00 - 05:00
    0.60, 0.70, 0.80, 0.88, 0.92, 0.95, // 06:00 - 11:00
    0.92, 0.88, 0.85, 0.88, 0.92, 0.98, // 12:00 - 17:00
    1.05, 1.08, 1.05, 0.95, 0.80, 0.62, // 18:00 - 23:00
  ],
  holiday: [
    0.52, 0.50, 0.48, 0.47, 0.48, 0.55, // 00:00 - 05:00
    0.65, 0.75, 0.85, 0.92, 0.98, 1.02, // 06:00 - 11:00
    1.00, 0.95, 0.92, 0.95, 1.00, 1.08, // 12:00 - 17:00
    1.12, 1.15, 1.10, 1.00, 0.85, 0.65, // 18:00 - 23:00
  ],
}

// Temperature impact on load (AC usage increases with temperature)
function getTemperatureLoadFactor(temperature: number): number {
  if (temperature < 25) return 0.95
  if (temperature < 30) return 1.0
  if (temperature < 35) return 1.0 + (temperature - 30) * 0.03
  if (temperature < 40) return 1.15 + (temperature - 35) * 0.04
  return 1.35
}

// Generate hourly demand forecast
export function generateHourlyDemand(
  districtId: string,
  date: Date
): Array<{
  hour: number
  demand: number
  temperature: number
  humidity: number
  baseLoad: number
  festival: string | null
  dayType: DayType
}> {
  const district = districts.find(d => d.id === districtId)
  if (!district) return []
  
  const dayType = getDayType(date)
  const festival = getActiveFestival(date)
  const month = date.getMonth() + 1
  const pattern = loadPatterns[dayType]
  const seed = `${districtId}-${dateSeed(date)}`
  
  return Array.from({ length: 24 }, (_, hour) => {
    const weather = getWeatherForHour(hour, month, seed)
    const rng = createSeededRandom(`${seed}-demand-${hour}`)
    const baseMultiplier = pattern[hour]
    const tempFactor = getTemperatureLoadFactor(weather.temperature)
    const festivalFactor = festival ? festival.loadMultiplier : 1.0
    
    // Add some realistic variance
    const variance = 0.95 + rng() * 0.1
    
    const demand = Math.round(
      district.baseLoad * baseMultiplier * tempFactor * festivalFactor * variance
    )
    
    return {
      hour,
      demand,
      temperature: weather.temperature,
      humidity: weather.humidity,
      baseLoad: district.baseLoad,
      festival: festival?.name || null,
      dayType,
    }
  })
}

// Generate feeder-level load distribution
export function generateFeederLoads(
  districtId: string,
  totalDemand: number,
  referenceDate: Date = new Date(2024, 0, 15),
): Array<{
  feederId: string
  feederName: string
  capacity: number
  currentLoad: number
  loadPercentage: number
  status: 'normal' | 'high' | 'critical' | 'overload'
  priority: 'critical' | 'high' | 'medium' | 'low'
}> {
  const districtFeeders = feeders[districtId]
  if (!districtFeeders) return []
  
  const totalCapacity = districtFeeders.reduce((sum, f) => sum + f.capacity, 0)
  
  const seed = `${districtId}-${dateSeed(referenceDate)}-feeders`

  return districtFeeders.map(feeder => {
    // Distribute load proportionally with some variance
    const baseShare = feeder.capacity / totalCapacity
    const rng = createSeededRandom(`${seed}-${feeder.id}`)
    const variance = 0.85 + rng() * 0.3
    const currentLoad = Math.round(totalDemand * baseShare * variance)
    const loadPercentage = Math.round((currentLoad / feeder.capacity) * 100)
    
    let status: 'normal' | 'high' | 'critical' | 'overload' = 'normal'
    if (loadPercentage > 100) status = 'overload'
    else if (loadPercentage > 90) status = 'critical'
    else if (loadPercentage > 75) status = 'high'
    
    return {
      feederId: feeder.id,
      feederName: feeder.name,
      capacity: feeder.capacity,
      currentLoad,
      loadPercentage,
      status,
      priority: feeder.priority,
    }
  })
}

// Solar generation simulation (MW)
export function getSolarGeneration(
  hour: number,
  month: number,
  districtBaseLoad: number,
  seedKey = 'solar',
): number {
  // Solar only generates during daylight hours
  if (hour < 6 || hour > 18) return 0
  
  // Peak solar at noon, follows a bell curve
  const solarPeak = districtBaseLoad * 0.15 // 15% of base load from solar
  const hourFromNoon = Math.abs(hour - 12)
  const solarFactor = Math.max(0, 1 - (hourFromNoon / 6) ** 2)
  
  // Seasonal variation (better in summer months)
  const monthFactor = month >= 3 && month <= 6 ? 1.1 : 0.9
  
  // Cloud cover randomness
  const rng = createSeededRandom(`${seedKey}-${month}-${hour}`)
  const cloudFactor = 0.7 + rng() * 0.3
  
  return Math.round(solarPeak * solarFactor * monthFactor * cloudFactor)
}

// Generate comparison data (today vs last week)
export function generateComparisonData(
  districtId: string,
  currentDate: Date
): {
  today: Array<{ hour: number; demand: number }>
  lastWeek: Array<{ hour: number; demand: number }>
} {
  const today = generateHourlyDemand(districtId, currentDate)
  
  const lastWeekDate = new Date(currentDate)
  lastWeekDate.setDate(lastWeekDate.getDate() - 7)
  const lastWeek = generateHourlyDemand(districtId, lastWeekDate)
  
  return {
    today: today.map(d => ({ hour: d.hour, demand: d.demand })),
    lastWeek: lastWeek.map(d => ({ hour: d.hour, demand: d.demand })),
  }
}

// Transformer stress calculation
export function calculateTransformerStress(
  loadPercentage: number,
  hoursAtHighLoad: number
): {
  stressLevel: 'low' | 'moderate' | 'high' | 'critical'
  recommendation: string
} {
  const stressScore = (loadPercentage / 100) * (1 + hoursAtHighLoad * 0.1)
  
  if (stressScore < 0.7) {
    return { stressLevel: 'low', recommendation: 'Normal operation. No action required.' }
  } else if (stressScore < 0.85) {
    return { stressLevel: 'moderate', recommendation: 'Monitor closely. Consider load redistribution if trend continues.' }
  } else if (stressScore < 0.95) {
    return { stressLevel: 'high', recommendation: 'High stress detected. Prepare contingency measures and consider partial load shedding.' }
  } else {
    return { stressLevel: 'critical', recommendation: 'Critical stress level. Initiate emergency load management protocol immediately.' }
  }
}

// Generate early warning alerts
export function generateAlerts(
  feederLoads: ReturnType<typeof generateFeederLoads>,
  hourlyDemand: ReturnType<typeof generateHourlyDemand>,
  currentHour: number,
  referenceDate: Date,
): Array<{
  id: string
  type: 'warning' | 'critical' | 'info'
  title: string
  message: string
  timestamp: string
  feeder?: string
}> {
  const alerts: Array<{
    id: string
    type: 'warning' | 'critical' | 'info'
    title: string
    message: string
    timestamp: string
    feeder?: string
  }> = []
  
  // Check for overloaded feeders
  feederLoads.forEach(feeder => {
    if (feeder.status === 'overload') {
      alerts.push({
        id: `alert-${feeder.feederId}-overload`,
        type: 'critical',
        title: 'Feeder Overload Detected',
        message: `${feeder.feederName} is operating at ${feeder.loadPercentage}% capacity. Immediate action required.`,
        timestamp: referenceDate.toISOString(),
        feeder: feeder.feederName,
      })
    } else if (feeder.status === 'critical') {
      alerts.push({
        id: `alert-${feeder.feederId}-critical`,
        type: 'warning',
        title: 'High Load Warning',
        message: `${feeder.feederName} approaching capacity at ${feeder.loadPercentage}%. Monitor closely.`,
        timestamp: referenceDate.toISOString(),
        feeder: feeder.feederName,
      })
    }
  })
  
  // Early warning for upcoming peak hours
  if (currentHour >= 16 && currentHour <= 17) {
    const nextHourDemand = hourlyDemand.find(d => d.hour === currentHour + 2)
    if (nextHourDemand) {
      alerts.push({
        id: 'alert-peak-warning',
        type: 'info',
        title: 'Peak Hour Approaching',
        message: `Evening peak expected in 1-2 hours. Estimated demand: ${nextHourDemand.demand} MW. Consider preemptive load management.`,
        timestamp: referenceDate.toISOString(),
      })
    }
  }
  
  // Festival alert
  const festival = getActiveFestival(referenceDate)
  if (festival) {
    alerts.push({
      id: 'alert-festival',
      type: 'info',
      title: `Festival Period: ${festival.name}`,
      message: `Load expected to be ${Math.round((festival.loadMultiplier - 1) * 100)}% higher than normal. Additional capacity measures activated.`,
      timestamp: referenceDate.toISOString(),
    })
  }
  
  return alerts
}

// Rotational shutdown planning
export function generateShutdownPlan(
  feederLoads: ReturnType<typeof generateFeederLoads>,
  deficitMW: number,
  referenceDate: Date,
): Array<{
  feederId: string
  feederName: string
  scheduledStart: string
  duration: number
  loadReduction: number
  priority: string
}> {
  if (deficitMW <= 0) return []
  
  // Sort feeders by priority (low priority first for shutdown)
  const sortedFeeders = [...feederLoads]
    .filter(f => f.priority !== 'critical')
    .sort((a, b) => {
      const priorityOrder = { low: 0, medium: 1, high: 2, critical: 3 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })
  
  const plan: Array<{
    feederId: string
    feederName: string
    scheduledStart: string
    duration: number
    loadReduction: number
    priority: string
  }> = []
  
  let remainingDeficit = deficitMW
  let slotHour = referenceDate.getHours()

  for (const feeder of sortedFeeders) {
    if (remainingDeficit <= 0) break
    
    const reduction = Math.min(feeder.currentLoad * 0.5, remainingDeficit)
    
    plan.push({
      feederId: feeder.feederId,
      feederName: feeder.feederName,
      scheduledStart: `${slotHour.toString().padStart(2, '0')}:00`,
      duration: 60, // 1 hour rotational
      loadReduction: Math.round(reduction),
      priority: feeder.priority,
    })
    
    remainingDeficit -= reduction
    slotHour = (slotHour + 1) % 24
  }
  
  return plan
}
