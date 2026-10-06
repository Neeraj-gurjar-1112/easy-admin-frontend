"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import type { DeliveryAgent, DeliveryAgentPayload, VehicleType } from "@/types/delivery-agent";
import { ApiError } from "@/types/api";
import { AGENT_RULES, VEHICLE_OPTIONS } from "@/utils/constants";

export interface AgentFormValues {
  name: string;
  email: string;
  phone: string;
  vehicle_type: VehicleType;
  license_number: string;
  password: string;
  approved: boolean;
  active: boolean;
  available: boolean;
}

interface AgentFormProps {
  mode: "create" | "edit";
  /** Existing agent for edit mode. */
  agent?: DeliveryAgent | null;
  onSubmit: (payload: DeliveryAgentPayload) => Promise<void>;
  onCancel: () => void;
  /** Last API error, so field messages land under the right input and the rest shows on top. */
  serverError?: ApiError | null;
  submitting?: boolean;
}

const EMPTY: AgentFormValues = {
  name: "",
  email: "",
  phone: "",
  vehicle_type: "bike",
  license_number: "",
  password: "",
  approved: false,
  active: true,
  available: true,
};

const FIELD_KEYS: (keyof AgentFormValues)[] = ["name", "email", "phone", "vehicle_type", "license_number", "password", "approved", "active", "available"];

/** Edit mode starts from the agent's current values; password is always blank (never echoed). */
function toFormValues(agent?: DeliveryAgent | null): AgentFormValues {
  if (!agent) return EMPTY;
  return {
    name: agent.name,
    email: agent.email,
    phone: agent.phone,
    vehicle_type: agent.vehicle_type,
    license_number: agent.license_number ?? "",
    password: "",
    approved: agent.approved,
    active: agent.active,
    available: agent.available,
  };
}

/** Form values → API body. Blank optional strings become null (edit) or are dropped (create). */
function toPayload(values: AgentFormValues, mode: AgentFormProps["mode"]): DeliveryAgentPayload {
  const payload: DeliveryAgentPayload = {
    name: values.name.trim(),
    email: values.email.trim().toLowerCase(),
    phone: values.phone.trim(),
    vehicle_type: values.vehicle_type,
    license_number: values.license_number.trim() || null,
    approved: values.approved,
    active: values.active,
    available: values.available,
  };
  if (values.password) payload.password = values.password;
  if (mode === "create" && payload.license_number === null) delete payload.license_number;
  return payload;
}

// Create / edit form. Validation rules are the backend's (Joi + Mongoose) written once in
// AGENT_RULES; server messages are mapped back onto fields via setError.
export default function AgentForm({ mode, agent, onSubmit, onCancel, serverError, submitting = false }: AgentFormProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<AgentFormValues>({ defaultValues: toFormValues(agent), mode: "onBlur" });

  // Edit mode: fill in once the agent arrives
  useEffect(() => {
    reset(toFormValues(agent));
  }, [agent, reset]);

  // Server validation → under the right field; anything else stays as the banner
  useEffect(() => {
    if (!serverError) return;
    for (const [field, message] of Object.entries(serverError.fieldErrors)) {
      if (FIELD_KEYS.includes(field as keyof AgentFormValues)) setError(field as keyof AgentFormValues, { type: "server", message });
    }
  }, [serverError, setError]);

  const bannerMessage = serverError && Object.keys(serverError.fieldErrors).length === 0 ? serverError.message : null;

  return (
    <form className="form-card" onSubmit={handleSubmit((values) => onSubmit(toPayload(values, mode)))} noValidate>
      {bannerMessage && <Message severity="error" text={bannerMessage} className="form-message" />}

      {/* Identity */}
      <div className="form-grid">
        <div className="form-field">
          <label className="form-label" htmlFor="agent-name">
            Full name <span className="form-required">*</span>
          </label>
          <InputText
            id="agent-name"
            className={errors.name ? "p-invalid" : undefined}
            maxLength={AGENT_RULES.name.maxLength}
            {...register("name", {
              required: "Name is required",
              minLength: { value: AGENT_RULES.name.minLength, message: `Name must be at least ${AGENT_RULES.name.minLength} characters long` },
              maxLength: { value: AGENT_RULES.name.maxLength, message: `Name cannot exceed ${AGENT_RULES.name.maxLength} characters` },
              validate: (v) => v.trim().length >= AGENT_RULES.name.minLength || "Name is required",
            })}
          />
          {errors.name && <small className="form-error">{errors.name.message}</small>}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="agent-email">
            Email <span className="form-required">*</span>
          </label>
          <InputText
            id="agent-email"
            type="email"
            autoComplete="off"
            className={errors.email ? "p-invalid" : undefined}
            {...register("email", {
              required: "Email is required",
              pattern: { value: AGENT_RULES.email.pattern, message: "Please provide a valid email address" },
            })}
          />
          {errors.email && <small className="form-error">{errors.email.message}</small>}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="agent-phone">
            Phone <span className="form-required">*</span>
          </label>
          <InputText
            id="agent-phone"
            type="tel"
            placeholder={AGENT_RULES.phone.example}
            className={errors.phone ? "p-invalid" : undefined}
            {...register("phone", {
              required: "Phone is required",
              pattern: { value: AGENT_RULES.phone.pattern, message: "Phone may only contain digits, spaces, +, -, ( and )" },
              validate: (v) => v.replace(/\D/g, "").length >= AGENT_RULES.phone.minDigits || `Phone must contain at least ${AGENT_RULES.phone.minDigits} digits`,
            })}
          />
          {errors.phone && <small className="form-error">{errors.phone.message}</small>}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="agent-vehicle">
            Vehicle <span className="form-required">*</span>
          </label>
          <Controller
            name="vehicle_type"
            control={control}
            rules={{ required: "Vehicle type is required" }}
            render={({ field }) => (
              <Dropdown
                inputId="agent-vehicle"
                value={field.value}
                options={VEHICLE_OPTIONS}
                optionLabel="label"
                optionValue="value"
                onChange={(e) => field.onChange(e.value as VehicleType)}
                onBlur={field.onBlur}
                className={errors.vehicle_type ? "p-invalid" : undefined}
              />
            )}
          />
          {errors.vehicle_type && <small className="form-error">{errors.vehicle_type.message}</small>}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="agent-license">
            License number
          </label>
          <InputText
            id="agent-license"
            placeholder="MH12 20250001"
            className={errors.license_number ? "p-invalid" : undefined}
            {...register("license_number", { maxLength: { value: 50, message: "License number cannot exceed 50 characters" } })}
          />
          {errors.license_number && <small className="form-error">{errors.license_number.message}</small>}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="agent-password">
            {mode === "create" ? "Password" : "New password"} {mode === "create" && <span className="form-required">*</span>}
          </label>
          <InputText
            id="agent-password"
            type="password"
            autoComplete="new-password"
            placeholder={mode === "edit" ? "Leave blank to keep the current one" : undefined}
            className={errors.password ? "p-invalid" : undefined}
            {...register("password", {
              required: mode === "create" ? "Password is required" : false,
              minLength: { value: AGENT_RULES.password.minLength, message: `Password must be at least ${AGENT_RULES.password.minLength} characters long` },
            })}
          />
          {errors.password ? (
            <small className="form-error">{errors.password.message}</small>
          ) : (
            <small className="form-hint">Used by the agent in the partner app. At least {AGENT_RULES.password.minLength} characters.</small>
          )}
        </div>
      </div>

      {/* Account flags */}
      <div className="form-switches">
        <Controller
          name="approved"
          control={control}
          render={({ field }) => (
            <label className="form-switch-row">
              <InputSwitch inputId="agent-approved" checked={field.value} onChange={(e) => field.onChange(Boolean(e.value))} />
              <span>
                <strong>Approved</strong>
                <small>Can accept orders. Pending agents only see the waiting screen.</small>
              </span>
            </label>
          )}
        />
        <Controller
          name="active"
          control={control}
          render={({ field }) => (
            <label className="form-switch-row">
              <InputSwitch inputId="agent-active" checked={field.value} onChange={(e) => field.onChange(Boolean(e.value))} />
              <span>
                <strong>Active account</strong>
                <small>Off = suspended; the agent cannot go online.</small>
              </span>
            </label>
          )}
        />
        <Controller
          name="available"
          control={control}
          render={({ field }) => (
            <label className="form-switch-row">
              <InputSwitch inputId="agent-available" checked={field.value} onChange={(e) => field.onChange(Boolean(e.value))} />
              <span>
                <strong>Available for new orders</strong>
                <small>Off while the agent is on a delivery.</small>
              </span>
            </label>
          )}
        />
      </div>

      {/* Actions — submit is disabled while saving so it cannot be clicked twice */}
      <div className="form-actions">
        <Button type="button" label="Cancel" outlined severity="secondary" onClick={onCancel} disabled={submitting} />
        <Button type="submit" label={mode === "create" ? "Create agent" : "Save changes"} icon="pi pi-check" loading={submitting} disabled={submitting} />
      </div>
    </form>
  );
}
