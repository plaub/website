<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-4xl mx-auto px-4 py-4">
        <h1 class="text-2xl font-bold text-center text-gray-800">
          Pace Rechner Pro
        </h1>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-4xl mx-auto">
      <!-- Tab Navigation -->
      <nav class="bg-white shadow-sm">
        <div class="flex">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'flex-1 py-4 px-6 text-center font-medium transition-colors',
              activeTab === tab.id
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50',
            ]"
          >
            <span class="text-xl mr-2">{{ tab.icon }}</span>
            {{ tab.label }}
          </button>
        </div>
      </nav>

      <!-- Tab Content -->
      <div class="min-h-[calc(100vh-140px)]">
        <!-- Calculator Tab -->
        <div v-if="activeTab === 'calculator'">
          <DynamicPaceRechner
            :competition-type="competitionType"
            :loaded-calculation="globalState.currentCalculation.value"
            @calculation-saved="onCalculationSaved"
          />
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
    </main>

    <!-- Bottom Navigation for Mobile -->
    <nav
      class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg"
    >
      <div class="flex">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'flex-1 py-3 px-2 text-center text-xs font-medium transition-colors',
            activeTab === tab.id
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700',
          ]"
        >
          <div class="text-lg mb-1">{{ tab.icon }}</div>
          {{ tab.label }}
        </button>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { PaceCalculation } from "../types/PaceRechner";
import { useGlobalState } from "../composables/useGlobalState";

// State
const activeTab = ref("calculator");
const competitionType = ref("individual");
const globalState = useGlobalState();

// Tabs configuration
const tabs = [
  { id: "calculator", label: "Rechner", icon: "🏃" },
  { id: "history", label: "Verlauf", icon: "📊" },
  { id: "settings", label: "Einstellungen", icon: "⚙️" },
];

// Methods
const onCalculationSaved = (calculation: PaceCalculation) => {
  console.log("Calculation saved:", calculation);
  // Optionally switch to history tab to show the saved calculation
  // activeTab.value = 'history'
};

const onLoadCalculation = (calculation: PaceCalculation) => {
  console.log("Loading calculation:", calculation);
  // Load calculation into global state
  globalState.loadCalculation(calculation);
  // Switch to calculator tab
  activeTab.value = "calculator";
};

// Load settings on mount
onMounted(() => {
  const settings = localStorage.getItem("app-settings");
  if (settings) {
    const parsed = JSON.parse(settings);
    competitionType.value = parsed.defaultCompetitionType || "individual";
  }
});
</script>

<style scoped>
/* Add some padding for mobile bottom navigation */
@media (max-width: 768px) {
  main {
    padding-bottom: 80px;
  }
}
</style>
