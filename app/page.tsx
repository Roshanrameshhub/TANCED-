'use client'

import { useState, useCallback } from 'react'
import { useClientNow } from '@/hooks/use-client-now'
import { DashboardHeader } from '@/components/dashboard/header'
import { DistrictSelector } from '@/components/dashboard/district-selector'
import { SummaryCards } from '@/components/dashboard/summary-cards'
import { DemandForecastChart } from '@/components/dashboard/demand-forecast-chart'
import { FeederStatusPanel } from '@/components/dashboard/feeder-status-panel'
import { AlertsPanel } from '@/components/dashboard/alerts-panel'
import { ComparisonChart } from '@/components/dashboard/comparison-chart'
import { SolarGenerationChart } from '@/components/dashboard/solar-generation-chart'
import { TransformerStress } from '@/components/dashboard/transformer-stress'
import { ShutdownPlanner } from '@/components/dashboard/shutdown-planner'
import { PeakAnalysisChart } from '@/components/dashboard/peak-analysis-chart'
import { FestivalCalendar } from '@/components/dashboard/festival-calendar'
import { DayTypeIndicator } from '@/components/dashboard/day-type-indicator'
import {
  districts,
  generateHourlyDemand,
  generateFeederLoads,
  generateAlerts,
  generateComparisonData,
  generateShutdownPlan,
  getSolarGeneration,
  getActiveFestival,
} from '@/lib/tangedco-data'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Info, LayoutDashboard, Cable, BarChart3, Route } from 'lucide-react'

export default function Dashboard() {
  const [selectedDistrict, setSelectedDistrict] = useState('chennai')
  const [selectedFeeder, setSelectedFeeder] = useState<string | null>(null)
  const { now: currentDate, hour: currentHour } = useClientNow()
  const [isSimulatingShutdown, setIsSimulatingShutdown] = useState(false)
  const [showShutdownPlan, setShowShutdownPlan] = useState(false)
  const district = districts.find(d => d.id === selectedDistrict)

  // Generate data
  const hourlyDemand = generateHourlyDemand(selectedDistrict, currentDate)
  const currentDemandData = hourlyDemand.find(d => d.hour === currentHour)
  const peakDemandData = hourlyDemand.reduce((max, d) => (d.demand > max.demand ? d : max), hourlyDemand[0])
  const feederLoads = generateFeederLoads(
    selectedDistrict,
    currentDemandData?.demand || 0,
    currentDate,
  )
  const alerts = generateAlerts(feederLoads, hourlyDemand, currentHour, currentDate)
  const comparisonData = generateComparisonData(selectedDistrict, currentDate)
  const solarGeneration = getSolarGeneration(
    currentHour,
    currentDate.getMonth() + 1,
    district?.baseLoad || 0,
    `${selectedDistrict}-${currentDate.toISOString().slice(0, 10)}`,
  )
  const festival = getActiveFestival(currentDate)

  // Calculate grid utilization
  const totalCapacity = feederLoads.reduce((sum, f) => sum + f.capacity, 0)
  const totalLoad = feederLoads.reduce((sum, f) => sum + f.currentLoad, 0)
  const gridUtilization = Math.round((totalLoad / totalCapacity) * 100)

  // Calculate transformer stress metrics
  const hoursAtHighLoad = hourlyDemand
    .filter(d => d.hour <= currentHour)
    .filter(d => (d.demand / (district?.baseLoad || 1)) > 1.0)
    .length

  // Shutdown plan
  const deficitMW = totalLoad > totalCapacity ? totalLoad - totalCapacity : 0
  const shutdownPlan = showShutdownPlan
    ? generateShutdownPlan(feederLoads, deficitMW > 0 ? deficitMW : 100, currentDate)
    : []

  const handleSimulateShutdown = useCallback(() => {
    setIsSimulatingShutdown(true)
    setTimeout(() => {
      setShowShutdownPlan(true)
      setIsSimulatingShutdown(false)
    }, 1500)
  }, [])

  const handleDistrictChange = useCallback((districtId: string) => {
    setSelectedDistrict(districtId)
    setSelectedFeeder(null)
    setShowShutdownPlan(false)
  }, [])

  const tabItems = [
    { value: 'overview', label: 'Overview', icon: LayoutDashboard },
    { value: 'feeders', label: 'Feeders', icon: Cable },
    { value: 'analysis', label: 'Analysis', icon: BarChart3 },
    { value: 'planning', label: 'Planning', icon: Route },
  ] as const

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="p-4 md:p-6">
        {/* System Notice */}
        <div className="mb-4 flex items-start gap-3 rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm">
          <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
          <div>
            <p className="font-medium text-foreground">Decision Support System - Advisory Only</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              This system provides forecasts and recommendations to assist grid operators. All data is simulated
              based on realistic TNEB operational patterns. Actual load management decisions require operator
              authorization and follow standard operating procedures.
            </p>
          </div>
        </div>

        {/* District Selector */}
        <div className="mb-6">
          <DistrictSelector
            selectedDistrict={selectedDistrict}
            selectedFeeder={selectedFeeder}
            onDistrictChange={handleDistrictChange}
            onFeederChange={setSelectedFeeder}
          />
        </div>

        {/* Day Type Indicator */}
        <div className="mb-6">
          <DayTypeIndicator currentDate={currentDate} />
        </div>

        {/* Summary Cards */}
        <div className="mb-6">
          <SummaryCards
            currentDemand={currentDemandData?.demand || 0}
            peakDemand={peakDemandData.demand}
            peakHour={peakDemandData.hour}
            solarGeneration={solarGeneration}
            gridUtilization={gridUtilization}
            dayType={currentDemandData?.dayType || 'weekday'}
            festival={festival?.name || null}
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid h-auto w-full grid-cols-2 gap-2 rounded-xl border border-border bg-muted p-2 sm:grid-cols-4">
            {tabItems.map(tab => {
              const TabIcon = tab.icon
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="h-auto w-full min-w-0 flex-none justify-center gap-2 rounded-lg px-3 py-2.5 data-[state=active]:border-border data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                >
                  <TabIcon className="h-4 w-4 shrink-0" />
                  <span className="truncate text-sm font-medium">{tab.label}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <DemandForecastChart
                  data={hourlyDemand}
                  districtName={district?.name || ''}
                  currentHour={currentHour}
                />
              </div>
              <div>
                <AlertsPanel alerts={alerts} />
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <ComparisonChart
                today={comparisonData.today}
                lastWeek={comparisonData.lastWeek}
                districtName={district?.name || ''}
              />
              <SolarGenerationChart
                districtBaseLoad={district?.baseLoad || 0}
                currentHour={currentHour}
                month={currentDate.getMonth() + 1}
                seedKey={`${selectedDistrict}-${currentDate.toISOString().slice(0, 10)}`}
              />
            </div>
          </TabsContent>

          {/* Feeders Tab */}
          <TabsContent value="feeders" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <FeederStatusPanel
                feederLoads={feederLoads}
                districtName={district?.name || ''}
              />
              <TransformerStress
                loadPercentage={gridUtilization}
                hoursAtHighLoad={hoursAtHighLoad}
                districtName={district?.name || ''}
              />
            </div>
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <PeakAnalysisChart
                data={hourlyDemand.map(d => ({ hour: d.hour, demand: d.demand }))}
                baseLoad={district?.baseLoad || 0}
                districtName={district?.name || ''}
                currentHour={currentHour}
              />
              <FestivalCalendar currentDate={currentDate} />
            </div>
            <ComparisonChart
              today={comparisonData.today}
              lastWeek={comparisonData.lastWeek}
              districtName={district?.name || ''}
            />
          </TabsContent>

          {/* Planning Tab */}
          <TabsContent value="planning" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <ShutdownPlanner
                shutdownPlan={shutdownPlan}
                deficitMW={deficitMW}
                isSimulating={isSimulatingShutdown}
                onSimulate={handleSimulateShutdown}
              />
              <div className="space-y-6">
                <TransformerStress
                  loadPercentage={gridUtilization}
                  hoursAtHighLoad={hoursAtHighLoad}
                  districtName={district?.name || ''}
                />
                <AlertsPanel alerts={alerts} />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <footer className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          <p>
            TANGEDCO Load Management System - Decision Support Dashboard
          </p>
          <p className="mt-1">
            Tamil Nadu Generation and Distribution Corporation Limited | For Planning and Advisory Purposes Only
          </p>
          <p className="mt-2 text-[10px]">
            Data shown is simulated based on realistic operational patterns. Not connected to actual SCADA/EMS systems.
          </p>
        </footer>
      </main>
    </div>
  )
}
