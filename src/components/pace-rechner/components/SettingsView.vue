<template>
  <div class="settings-container">
    <div class="settings-card">
      <h2 class="settings-title">Einstellungen</h2>

      <div class="settings-content">
        <!-- Default Competition Type -->
        <div class="setting-group">
          <label class="setting-label">Standard-Wettkampfformat</label>
          <select
            v-model="settings.defaultCompetitionType"
            @change="saveSettings"
            class="setting-select"
          >
            <option value="Sprint">Sprint Triathlon</option>
            <option value="Olympic">Olympic Triathlon</option>
            <option value="Middle Distance">Mitteldistanz</option>
            <option value="Long Distance">Langdistanz</option>
            <option value="Duathlon">Duathlon</option>
          </select>
        </div>

        <!-- Default Start Time -->
        <div class="setting-group">
          <label class="setting-label">Standard-Startzeit</label>
          <div class="time-picker">
            <select
              v-model="startTimeHours"
              @change="updateStartTime"
              class="setting-select"
            >
              <option v-for="hour in 24" :key="hour - 1" :value="hour - 1">
                {{ String(hour - 1).padStart(2, "0") }}
              </option>
            </select>
            <span class="time-separator">:</span>
            <select
              v-model="startTimeMinutes"
              @change="updateStartTime"
              class="setting-select"
            >
              <option
                v-for="minute in 60"
                :key="minute - 1"
                :value="minute - 1"
              >
                {{ String(minute - 1).padStart(2, "0") }}
              </option>
            </select>
          </div>
        </div>

        <!-- Units -->
        <div class="setting-group">
          <label class="setting-label">Einheiten</label>
          <div class="radio-group">
            <label class="radio-label">
              <input
                type="radio"
                v-model="settings.units"
                value="metric"
                @change="saveSettings"
                class="radio-input"
              />
              <span>Metrisch (km, m, km/h)</span>
            </label>
            <label class="radio-label disabled">
              <input
                type="radio"
                v-model="settings.units"
                value="imperial"
                @change="saveSettings"
                class="radio-input"
                disabled
              />
              <span>Imperial (mi, yd, mph) - bald verfügbar</span>
            </label>
          </div>
        </div>

        <!-- Language (Coming Soon) -->
        <div class="setting-group">
          <label class="setting-label">Sprache</label>
          <select disabled class="setting-select disabled">
            <option>Deutsch (aktuell)</option>
            <option>English - bald verfügbar</option>
          </select>
        </div>

        <!-- Reset Settings -->
        <div class="reset-section">
          <button @click="handleResetSettings" class="reset-button">
            Einstellungen zurücksetzen
          </button>
        </div>
      </div>
    </div>

    <!-- App Info -->
    <div class="settings-card">
      <h3 class="settings-title">App-Info</h3>
      <div class="info-content">
        <p><span class="info-label">Version:</span> 2.0.0</p>
        <p>
          <span class="info-label">Features:</span> Multi-Sport Support,
          Triathlon Templates, History
        </p>
        <p>
          <span class="info-label">Entwickelt mit:</span> Nuxt 3, Vue 3,
          TypeScript
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useSettings } from "../composables/useSettings";

// Use the global settings composable
const { settings, loadSettings, saveSettings, updateSetting, resetSettings } =
  useSettings();

// Computed for start time
const startTimeHours = computed({
  get: () => Math.floor(settings.value.defaultStartTime / 3600),
  set: (value: number) => {
    const minutes = Math.floor((settings.value.defaultStartTime % 3600) / 60);
    updateSetting("defaultStartTime", value * 3600 + minutes * 60);
  },
});

const startTimeMinutes = computed({
  get: () => Math.floor((settings.value.defaultStartTime % 3600) / 60),
  set: (value: number) => {
    const hours = Math.floor(settings.value.defaultStartTime / 3600);
    updateSetting("defaultStartTime", hours * 3600 + value * 60);
  },
});

// Methods
const updateStartTime = () => {
  // This is handled by the computed setters now
};

const handleResetSettings = () => {
  if (confirm("Möchtest du wirklich alle Einstellungen zurücksetzen?")) {
    resetSettings();
  }
};

// Lifecycle
onMounted(async () => {
  await loadSettings();
});
</script>

<style scoped>
.settings-container {
  padding: 1rem;
}

.settings-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 1rem;
}

.settings-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--text-main);
}

.settings-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.setting-group {
  display: flex;
  flex-direction: column;
}

.setting-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--text-main);
}

.setting-select {
  width: 100%;
  padding: 0.5rem;
  background: var(--bg-body);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-main);
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.setting-select:focus {
  outline: none;
  border-color: rgb(var(--accent));
  box-shadow: 0 0 0 3px rgba(var(--accent), 0.1);
}

.setting-select.disabled {
  background: var(--bg-card-hover);
  color: var(--text-muted);
  cursor: not-allowed;
  opacity: 0.6;
}

.time-picker {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.time-picker .setting-select {
  flex: 1;
}

.time-separator {
  color: var(--text-muted);
  font-weight: 600;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.radio-label {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: var(--text-body);
  cursor: pointer;
}

.radio-label.disabled {
  color: var(--text-muted);
  cursor: not-allowed;
  opacity: 0.6;
}

.radio-input {
  margin-right: 0.5rem;
  accent-color: rgb(var(--accent));
}

.reset-section {
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.reset-button {
  font-size: 0.875rem;
  color: #ef4444;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.2s ease;
}

.reset-button:hover {
  color: #dc2626;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-muted);
}

.info-label {
  color: var(--text-body);
  font-weight: 500;
}
</style>
