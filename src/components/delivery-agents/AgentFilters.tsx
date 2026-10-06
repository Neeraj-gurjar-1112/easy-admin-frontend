"use client";

import { Button } from "primereact/button";
import { Dropdown, type DropdownChangeEvent } from "primereact/dropdown";
import FilterBar, { FilterBarItem } from "@/components/FilterBar";
import SearchInput from "@/components/SearchInput";
import type { ApprovalFilter, Presence, VehicleType } from "@/types/delivery-agent";
import { APPROVAL_OPTIONS, PRESENCE_OPTIONS, VEHICLE_OPTIONS } from "@/utils/constants";

export interface AgentFilterValues {
  q: string;
  vehicle_type: VehicleType | "";
  approval: ApprovalFilter | "";
  presence: Presence | "";
}

export const EMPTY_FILTERS: AgentFilterValues = { q: "", vehicle_type: "", approval: "", presence: "" };

export function hasActiveFilters(values: AgentFilterValues): boolean {
  return Boolean(values.q.trim() || values.vehicle_type || values.approval || values.presence);
}

interface AgentFiltersProps {
  values: AgentFilterValues;
  onChange: (next: AgentFilterValues) => void;
  onReset: () => void;
}

// Search + three dropdowns. Owns no data: every change goes up to the screen,
// which puts it into the query params.
export default function AgentFilters({ values, onChange, onReset }: AgentFiltersProps) {
  const set = <K extends keyof AgentFilterValues>(key: K, value: AgentFilterValues[K]) =>
    onChange({ ...values, [key]: value });

  return (
    <FilterBar
      end={
        <Button
          type="button"
          label="Reset"
          icon="pi pi-filter-slash"
          outlined
          severity="secondary"
          disabled={!hasActiveFilters(values)}
          onClick={onReset}
        />
      }
    >
      <FilterBarItem search>
        <SearchInput
          value={values.q}
          onChange={(q) => set("q", q)}
          placeholder="Search name, phone or email"
          ariaLabel="Search delivery agents"
        />
      </FilterBarItem>
      <FilterBarItem>
        <Dropdown
          value={values.vehicle_type || null}
          options={VEHICLE_OPTIONS}
          optionLabel="label"
          optionValue="value"
          placeholder="All vehicles"
          showClear
          aria-label="Vehicle type"
          onChange={(e: DropdownChangeEvent) => set("vehicle_type", (e.value as VehicleType | null) ?? "")}
        />
      </FilterBarItem>
      <FilterBarItem>
        <Dropdown
          value={values.approval || null}
          options={APPROVAL_OPTIONS}
          optionLabel="label"
          optionValue="value"
          placeholder="Any approval"
          showClear
          aria-label="Approval"
          onChange={(e: DropdownChangeEvent) => set("approval", (e.value as ApprovalFilter | null) ?? "")}
        />
      </FilterBarItem>
      <FilterBarItem>
        <Dropdown
          value={values.presence || null}
          options={PRESENCE_OPTIONS}
          optionLabel="label"
          optionValue="value"
          placeholder="Any status"
          showClear
          aria-label="Status"
          onChange={(e: DropdownChangeEvent) => set("presence", (e.value as Presence | null) ?? "")}
        />
      </FilterBarItem>
    </FilterBar>
  );
}
