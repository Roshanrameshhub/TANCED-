'use client'

import { districts, feeders } from '@/lib/tangedco-data'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { MapPin, GitBranch } from 'lucide-react'
import { formatInteger } from '@/lib/format-time'

interface DistrictSelectorProps {
  selectedDistrict: string
  selectedFeeder: string | null
  onDistrictChange: (districtId: string) => void
  onFeederChange: (feederId: string | null) => void
}

export function DistrictSelector({
  selectedDistrict,
  selectedFeeder,
  onDistrictChange,
  onFeederChange,
}: DistrictSelectorProps) {
  const districtFeeders = feeders[selectedDistrict] || []
  const selectedDistrictData = districts.find(d => d.id === selectedDistrict)

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-end">
      <div className="flex-1 space-y-2">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <MapPin className="h-4 w-4 text-primary" />
          District
        </Label>
        <Select value={selectedDistrict} onValueChange={onDistrictChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select District" />
          </SelectTrigger>
          <SelectContent>
            {districts.map(district => (
              <SelectItem key={district.id} value={district.id}>
                {district.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedDistrictData && (
          <p className="text-xs text-muted-foreground">
            Base Load: {selectedDistrictData.baseLoad} MW | Population:{' '}
            {formatInteger(selectedDistrictData.population)}
          </p>
        )}
      </div>

      <div className="flex-1 space-y-2">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <GitBranch className="h-4 w-4 text-primary" />
          Feeder (Optional)
        </Label>
        <Select
          value={selectedFeeder || 'all'}
          onValueChange={value => onFeederChange(value === 'all' ? null : value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Feeders" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Feeders ({districtFeeders.length})</SelectItem>
            {districtFeeders.map(feeder => (
              <SelectItem key={feeder.id} value={feeder.id}>
                {feeder.name} ({feeder.capacity} MW)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
