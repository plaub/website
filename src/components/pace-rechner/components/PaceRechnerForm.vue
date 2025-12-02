<template>
  <div
    class="wrapper"
    :style="{ backgroundColor: backgroundColor, color: color }"
  >
    <span class="title">{{ title }}</span>

    <div class="row">
      <div class="label">
        Distanz

        <br />
        <small class="unit">{{ distanceUnit }}</small>
      </div>

      <div class="picker">
        <input
          type="number"
          :value="distance"
          @blur="onChangeDistance"
          @keydown.enter="onChangeDistance"
        />
      </div>
    </div>

    <div class="row">
      <div class="label">Zeit</div>

      <div class="picker">
        <DurationPicker
          lazy
          :modelValue="time"
          @update:modelValue="onChangeTime"
          uKey="runTime"
          :backgroundColor="backgroundColor"
        />
      </div>
    </div>

    <div v-if="paceType === PaceType.Pace" class="row">
      <div class="label">
        Pace
        <br />
        <small class="unit">{{ paceUnit }}</small>
      </div>

      <div class="picker">
        <DurationPicker
          lazy
          :modelValue="pace"
          @update:modelValue="onChangePace"
          uKey="runPace"
          :backgroundColor="backgroundColor"
        />
      </div>
    </div>

    <div v-if="paceType === PaceType.Speed" class="row">
      <div class="label">
        Speed
        <br />
        <small class="unit">km / h</small>
      </div>

      <div class="picker">
        <input
          type="number"
          :value="speed"
          @blur="onChangeSpeed"
          @keydown.enter="onChangeSpeed"
          min="1"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs, onMounted } from "vue";
import DurationPicker from "./DurationPicker.vue";
import { DistanceUnit, PaceType, PaceUnit } from "../types/PaceRechner";

interface Props {
  title?: string;
  backgroundColor?: string;
  color?: string;
  paceUnit?: PaceUnit;
  distance?: number;
  time?: number;
  pace?: number;
  speed?: number;
  paceType?: PaceType;
  distanceUnit?: DistanceUnit;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Run",
  backgroundColor: "#ffffff",
  color: "#ffffff",
  paceUnit: PaceUnit.Run,
  distance: 1,
  time: 1,
  pace: 1,
  speed: 1,
  paceType: PaceType.Pace,
  distanceUnit: DistanceUnit.Run,
});

const emit = defineEmits<{
  "update:time": [value: number];
  "update:pace": [value: number];
  "update:speed": [value: number];
  "update:distance": [value: number];
}>();

const { distance, time, pace, speed, paceType, paceUnit } = toRefs(props);

onMounted(() => {
  if (paceType.value === PaceType.Pace) {
    onChangePace(pace.value);
  } else {
    // Create a mock event for initial calculation
    const mockEvent = { target: { value: speed.value.toString() } } as any;
    onChangeSpeed(mockEvent);
  }
});

const onChangePace = (newPace: number) => {
  if (paceUnit.value === PaceUnit.Run) {
    emit("update:time", Math.round((newPace * distance.value) / 1000));
  } else {
    emit("update:time", Math.round((newPace * distance.value) / 100));
  }

  emit("update:pace", newPace);
};

const onChangeTime = (newTime: number) => {
  if (paceType.value === PaceType.Pace) {
    if (paceUnit.value === PaceUnit.Run) {
      emit("update:pace", Math.round((newTime * 1000) / distance.value));
    } else {
      emit("update:pace", Math.round((newTime * 100) / distance.value));
    }
  } else {
    const h = newTime / 3600;

    emit("update:speed", Math.round((distance.value / h) * 10) / 10);
  }

  emit("update:time", newTime);
};

const onChangeDistance = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const distance = target.value.toString().replace(/,/g, ".");

  const d = parseFloat(distance);
  if (isNaN(d) || d < 10) {
    return;
  }

  if (paceType.value === PaceType.Pace) {
    if (paceUnit.value === PaceUnit.Run) {
      emit("update:time", Math.round((pace.value * d) / 1000));
    } else {
      emit("update:time", Math.round((pace.value * d) / 100));
    }
  } else {
    // bike (speed)
    emit("update:time", Math.round((d / speed.value) * 3600));
  }

  emit("update:distance", d);
};

const onChangeSpeed = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const p = parseFloat(target.value);
  if (isNaN(p)) {
    return;
  }

  emit("update:time", Math.round((distance.value / p) * 3600));
  emit("update:speed", p);
};
</script>

<style lang="scss" scoped>
.wrapper {
  .row {
    display: flex;
    flex-flow: row;
    align-items: center;
  }

  .picker input[type="number"] {
    display: flex;
    align-items: center;
    background: white;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    padding: 8px 12px;
    transition: all 0.2s ease;
    width: 103.58px;
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    font-family: monospace;

    &:hover {
      border-color: #9ca3af;
    }

    &:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    &:disabled {
      opacity: 0.6;
      pointer-events: none;
      background: #f9fafb;
      color: #6b7280;
    }

    // Remove default number input arrows
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    &[type="number"] {
      appearance: textfield;
      -moz-appearance: textfield;
    }
  }
}

// Mobile optimizations
@media (max-width: 768px) {
  .wrapper {
    input[type="number"] {
      padding: 12px 16px;
      font-size: 16px;
    }
  }
}
</style>
