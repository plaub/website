<template>
  <div class="history-container">
    <div class="history-card">
      <h2 class="history-title">Verlauf</h2>

      <div v-if="calculations.length === 0" class="empty-state">
        <p>Keine Berechnungen vorhanden</p>
      </div>

      <div v-else class="calculations-list">
        <div
          v-for="calculation in calculations"
          :key="calculation.id"
          class="calculation-item"
        >
          <div class="calculation-header">
            <h3 class="calculation-name">
              {{ calculation.name }}
            </h3>
            <div class="calculation-actions">
              <button
                @click="loadCalculation(calculation)"
                class="action-button load-button"
              >
                Laden
              </button>
              <button
                @click="deleteCalculation(calculation.id)"
                class="action-button delete-button"
              >
                ×
              </button>
            </div>
          </div>

          <div class="calculation-meta">
            <div class="meta-row">
              <span>{{ formatDate(calculation.timestamp) }}</span>
              <span>{{ secondsToHHMMSS(calculation.totalTime, false) }}</span>
            </div>
            <div
              v-if="calculation.presetType !== 'custom'"
              class="preset-label"
            >
              {{ getPresetLabel(calculation.presetType) }}
            </div>
          </div>

          <!-- Activity breakdown -->
          <div class="activities-breakdown">
            <div
              v-for="(activity, index) in calculation.activities"
              :key="index"
              class="activity-item"
            >
              <span>{{ getSportTitle(activity.type, index) }}</span>
              <span>{{ secondsToHHMMSS(activity.time, true) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="calculations.length > 0" class="clear-all-section">
        <button @click="clearAllCalculations" class="clear-all-button">
          Alle löschen
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { PaceCalculation } from "../types/PaceRechner";
import { SportsType } from "../types/PaceRechner";
import { secondsToHHMMSS } from "../utils/calculations";
import { useHistory } from "../composables/useHistory";

// Emits
const emit = defineEmits<{
  load: [calculation: PaceCalculation];
}>();

// State
const {
  calculations,
  loadCalculations,
  deleteCalculation: deleteCalc,
} = useHistory();

// Methods
const refreshCalculations = () => {
  loadCalculations();
};

const loadCalculation = (calculation: PaceCalculation) => {
  emit("load", calculation);
};

const deleteCalculation = (id: string) => {
  if (confirm("Möchtest du diese Berechnung wirklich löschen?")) {
    deleteCalc(id);
    refreshCalculations(); // Reload the list
  }
};

const clearAllCalculations = () => {
  if (confirm("Möchtest du wirklich alle Berechnungen löschen?")) {
    calculations.value.forEach((calc) => deleteCalc(calc.id));
    refreshCalculations(); // Reload the list
  }
};

const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString("de-DE");
};

const getSportTitle = (type: SportsType, index: number): string => {
  switch (type) {
    case SportsType.Swim:
      return "Schwimmen";
    case SportsType.Bike:
      return "Radfahren";
    case SportsType.Run:
      return "Laufen";
    case SportsType.Rowing:
      return "Rudern";
    case SportsType.Hiking:
      return "Wandern";
    case SportsType.Walking:
      return "Gehen";
    default:
      return type;
  }
};

const getPresetLabel = (presetType: string): string => {
  switch (presetType) {
    case "sprint":
      return "Sprint Triathlon";
    case "olympic":
      return "Olympic Triathlon";
    case "md":
      return "Mitteldistanz";
    case "ld":
      return "Langdistanz";
    case "duathlon":
      return "Duathlon";
    default:
      return "Individuell";
  }
};

// Lifecycle
onMounted(() => {
  refreshCalculations();
});
</script>

<style scoped>
.history-container {
  padding: 1rem;
}

.history-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 2rem;
}

.history-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--text-main);
}

.empty-state {
  text-align: center;
  padding: 3rem 0;
  color: var(--text-muted);
}

.empty-state p {
  font-size: 0.875rem;
}

.calculations-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.calculation-item {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.2s ease;
}

.calculation-item:hover {
  background: var(--bg-card-hover);
  border-color: var(--text-muted);
}

.calculation-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.calculation-name {
  font-weight: 500;
  font-size: 0.875rem;
  color: var(--text-main);
}

.calculation-actions {
  display: flex;
  gap: 0.25rem;
}

.action-button {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
  font-weight: 500;
}

.load-button {
  color: rgb(var(--accent));
  background: transparent;
}

.load-button:hover {
  background: rgba(var(--accent), 0.1);
}

.delete-button {
  color: #ef4444;
  background: transparent;
  font-size: 1rem;
  line-height: 1;
}

.delete-button:hover {
  background: rgba(239, 68, 68, 0.1);
}

.calculation-meta {
  font-size: 0.75rem;
  color: var(--text-muted);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.meta-row {
  display: flex;
  justify-content: space-between;
}

.preset-label {
  color: var(--text-muted);
  opacity: 0.8;
}

.activities-breakdown {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--border-color);
}

.activity-item {
  font-size: 0.75rem;
  color: var(--text-muted);
  display: flex;
  justify-content: space-between;
  padding: 0.25rem 0;
}

.clear-all-section {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.clear-all-button {
  font-size: 0.875rem;
  color: #ef4444;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.2s ease;
}

.clear-all-button:hover {
  color: #dc2626;
}
</style>
