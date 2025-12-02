<template>
  <div class="pace-rechner">
    <!-- Tab Navigation -->
    <div class="max-w-6xl mx-auto px-4 mb-4">
      <nav class="tab-nav">
        <div class="flex">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="['tab-button', activeTab === tab.id ? 'active' : '']"
          >
            <span class="tab-icon">{{ tab.icon }}</span>
            {{ tab.label }}
          </button>
        </div>
      </nav>
    </div>

    <!-- Tab Content -->
    <div class="max-w-6xl mx-auto">
      <!-- Calculator Tab -->
      <div v-if="activeTab === 'calculator'">
        <PaceRechner />
      </div>

      <!-- History Tab -->
      <div v-if="activeTab === 'history'">
        <HistoryView @load="onLoadCalculation" />
      </div>

      <!-- Settings Tab -->
      <div v-if="activeTab === 'settings'">
        <SettingsView />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from "vue";
import PaceRechner from "./components/PaceRechner.vue";
import HistoryView from "./components/HistoryView.vue";
import type { PaceCalculation } from "./types/PaceRechner";
import { useSettings } from "./composables/useSettings";
import { useCalculationLoader } from "./composables/useCalculationLoader";
import SettingsView from "./components/SettingsView.vue";

export default {
  name: "App",

  components: {
    PaceRechner,
    HistoryView,
    SettingsView,
  },

  setup() {
    // State
    const activeTab = ref("calculator");

    // Initialize settings and calculation loader
    const { loadSettings } = useSettings();
    const { loadCalculation } = useCalculationLoader();

    // Tabs configuration
    const tabs = [
      { id: "calculator", label: "Rechner", icon: "🏃" },
      { id: "history", label: "Verlauf", icon: "📊" },
      { id: "settings", label: "Einstellungen", icon: "⚙️" },
    ];

    // Methods
    const onLoadCalculation = (calculation: PaceCalculation) => {
      console.log("Loading calculation:", calculation);
      // Load the calculation into global state
      loadCalculation(calculation);
      // Switch to calculator tab
      activeTab.value = "calculator";
    };

    // Load settings on app initialization
    onMounted(async () => {
      await loadSettings();
    });

    return {
      activeTab,
      tabs,
      onLoadCalculation,
    };
  },
};
</script>

<style scoped>
.pace-rechner {
  margin: 0;
}

.tab-nav {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 0.5rem;
}

.tab-nav .flex {
  display: flex;
  gap: 0.5rem;
}

.tab-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  background: transparent;
  color: var(--text-main);
  border: 1px solid transparent;
  cursor: pointer;
  font-size: 1rem;
}

.tab-button:hover {
  border-color: var(--text-muted);
  background: var(--bg-card-hover);
  transform: translateY(-1px);
}

.tab-button.active {
  background: rgb(var(--accent));
  color: white;
  border: 1px solid transparent;
}

.tab-button.active:hover {
  background: rgb(var(--accent-dark));
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(var(--accent), 0.3);
}

.tab-icon {
  font-size: 1.25rem;
  margin-right: 0.5rem;
}

@media (max-width: 768px) {
  body {
    padding-bottom: 80px;
  }
}
</style>
