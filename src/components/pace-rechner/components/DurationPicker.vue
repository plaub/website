<template>
  <div class="custom-time-picker" :class="{ disabled: disabled }">
    <div
      class="time-inputs"
      @click="toggleDropdown"
      :class="{ open: isDropdownOpen }"
    >
      <div class="time-display">
        <span class="time-value">{{ formattedTime }}</span>
        <svg
          class="dropdown-icon"
          :class="{ rotate: isDropdownOpen }"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
    </div>

    <div v-if="isDropdownOpen" class="dropdown-overlay" @click="closeDropdown">
      <div class="dropdown-content" @click.stop>
        <div class="dropdown-header">Zeit eingeben</div>
        <div class="time-selectors">
          <div class="time-column">
            <div class="column-header">Std</div>
            <div class="options-list hours-list">
              <button
                v-for="h in hourOptions"
                :key="h"
                @click="selectHour(h)"
                :class="{ selected: hours === padZero(h) }"
                class="option-button"
              >
                {{ padZero(h) }}
              </button>
            </div>
          </div>
          <div class="time-column">
            <div class="column-header">Min</div>
            <div class="options-list minutes-list">
              <button
                v-for="m in minuteOptions"
                :key="m"
                @click="selectMinute(m)"
                :class="{ selected: minutes === padZero(m) }"
                class="option-button"
              >
                {{ padZero(m) }}
              </button>
            </div>
          </div>
          <div class="time-column">
            <div class="column-header">Sek</div>
            <div class="options-list seconds-list">
              <button
                v-for="s in secondOptions"
                :key="s"
                @click="selectSecond(s)"
                :class="{ selected: seconds === padZero(s) }"
                class="option-button"
              >
                {{ padZero(s) }}
              </button>
            </div>
          </div>
        </div>
        <div class="dropdown-footer">
          <button @click="closeDropdown" class="done-button">Fertig</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, onMounted, computed } from "vue";
import { secondsToHHMMSS } from "../utils/calculations";

interface Props {
  modelValue?: number | null;
  disabled?: boolean;
  uKey?: string;
  lazy?: boolean;
  backgroundColor?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  disabled: false,
  uKey: "XXX",
  lazy: false,
  backgroundColor: "#3b82f6",
});

const emit = defineEmits<{
  "update:modelValue": [value: number];
}>();

const hours = ref<string>("00");
const minutes = ref<string>("01");
const seconds = ref<string>("30");
const isDropdownOpen = ref<boolean>(false);

// Generate options for dropdowns
const hourOptions = computed(() => Array.from({ length: 24 }, (_, i) => i));
const minuteOptions = computed(() => Array.from({ length: 60 }, (_, i) => i));
const secondOptions = computed(() => Array.from({ length: 60 }, (_, i) => i));

// Computed formatted time display
const formattedTime = computed(
  () => `${hours.value}:${minutes.value}:${seconds.value}`
);

const padZero = (value: string | number): string => {
  const num = typeof value === "string" ? parseInt(value) : value;
  return isNaN(num) ? "00" : num.toString().padStart(2, "0");
};

const emitValue = () => {
  const totalSeconds =
    parseInt(hours.value || "0") * 3600 +
    parseInt(minutes.value || "0") * 60 +
    parseInt(seconds.value || "0");

  console.log(
    "Emitting value:",
    totalSeconds,
    `${hours.value}:${minutes.value}:${seconds.value}`
  );
  emit("update:modelValue", totalSeconds);
};

// Dropdown functions
const toggleDropdown = () => {
  if (!props.disabled) {
    isDropdownOpen.value = !isDropdownOpen.value;
    if (isDropdownOpen.value) {
      scrollToSelected();
    }
  }
};

const closeDropdown = () => {
  isDropdownOpen.value = false;
};

const selectHour = (h: number) => {
  hours.value = padZero(h);
  emitValue();
};

const selectMinute = (m: number) => {
  minutes.value = padZero(m);
  emitValue();
};

const selectSecond = (s: number) => {
  seconds.value = padZero(s);
  emitValue();
};

// Auto-scroll to center selected values
const scrollToSelected = () => {
  setTimeout(() => {
    // Scroll selected hour into view
    const selectedHour = document.querySelector(".hours-list .selected");
    if (selectedHour) {
      selectedHour.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }

    // Scroll selected minute into view
    const selectedMinute = document.querySelector(".minutes-list .selected");
    if (selectedMinute) {
      selectedMinute.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }

    // Scroll selected second into view
    const selectedSecond = document.querySelector(".seconds-list .selected");
    if (selectedSecond) {
      selectedSecond.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, 50);
};

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== null && newValue !== undefined && newValue > 0) {
      const hhmmss = secondsToHHMMSS(newValue, false).split(":");
      hours.value = hhmmss[0] || "00";
      minutes.value = hhmmss[1] || "00";
      seconds.value = hhmmss[2] || "00";

      if (isDropdownOpen.value) {
        scrollToSelected();
      }
    }
  }
);

onMounted(() => {
  if (props.modelValue) {
    const hhmmss = secondsToHHMMSS(props.modelValue, false).split(":");
    hours.value = hhmmss[0] || "00";
    minutes.value = hhmmss[1] || "00";
    seconds.value = hhmmss[2] || "00";
  } else {
    // Emit initial default value (01:30 = 90 seconds)
    emitValue();
  }
});
</script>
<style lang="scss" scoped>
.custom-time-picker {
  position: relative;
  display: inline-block;

  &.disabled {
    opacity: 0.6;
    pointer-events: none;
  }
}

.time-inputs {
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 100px;

  &:hover {
    border-color: #9ca3af;
  }

  &.open {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
}

.time-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.time-value {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  font-family: monospace;
}

.dropdown-icon {
  width: 16px;
  height: 16px;
  color: #6b7280;
  transition: transform 0.2s ease;

  &.rotate {
    transform: rotate(180deg);
  }
}

.dropdown-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dropdown-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  padding: 20px;
  max-width: 90vw;
  max-height: 80vh;
  overflow: hidden;
}

.dropdown-header {
  text-align: center;
  font-weight: 600;
  font-size: 16px;
  color: #374151;
  margin-bottom: 16px;
}

.time-selectors {
  display: flex;
  gap: 12px;
}

.time-column {
  flex: 1;
  min-width: 80px;
}

.column-header {
  text-align: center;
  font-weight: 600;
  font-size: 12px;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
  padding: 4px;
  background: #f9fafb;
  border-radius: 4px;
}

.options-list {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #e5e7eb;
  border-radius: 6px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;

    &:hover {
      background: #94a3b8;
    }
  }
}

.option-button {
  display: block;
  width: 100%;
  padding: 8px 12px;
  border: none;
  background: none;
  text-align: center;
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: 14px;
  color: #374151;

  &:hover {
    background: #f3f4f6;
  }

  &.selected {
    background: #3b82f6;
    color: white;
    font-weight: 600;
  }
}

.dropdown-footer {
  margin-top: 16px;
  text-align: center;
}

.done-button {
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 24px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #2563eb;
  }
}
</style>
