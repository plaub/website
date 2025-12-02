<template>
  <div class="pace-rechner summary">
    <table class="pace-calculator-table">
      <tbody>
        <!-- Kumulierte Zeiten Section - nur bei Multi-Sport anzeigen -->
        <template v-if="!currentSportPreset">
          <tr class="section-header">
            <td colspan="2"><strong>Kumulierte Zeiten</strong></td>
          </tr>
          <tr v-if="showSwimData">
            <td>{{ getFirstSportLabel() }}:</td>
            <td>{{ swimCumulativeTimeString }}</td>
          </tr>
          <tr v-if="showTransitionData && showSwimData && showBikeData">
            <td>Nach T1:</td>
            <td>{{ t1CumulativeTimeString }}</td>
          </tr>
          <tr v-if="showBikeData" class="sub-split">
            <td>&nbsp;&nbsp;→ Nach Bike {{ bikeQuarter1Km }}km:</td>
            <td>{{ bike25CumulativeTimeString }}</td>
          </tr>
          <tr v-if="showBikeData" class="sub-split">
            <td>&nbsp;&nbsp;→ Nach Bike {{ bikeHalfKm }}km:</td>
            <td>{{ bike50CumulativeTimeString }}</td>
          </tr>
          <tr v-if="showBikeData" class="sub-split">
            <td>&nbsp;&nbsp;→ Nach Bike {{ bikeThreeQuarterKm }}km:</td>
            <td>{{ bike75CumulativeTimeString }}</td>
          </tr>
          <tr v-if="showBikeData">
            <td>Nach Bike:</td>
            <td>{{ bikeCumulativeTimeString }}</td>
          </tr>
          <tr v-if="showTransitionData && showBikeData && showRunData">
            <td>Nach T2:</td>
            <td>{{ t2CumulativeTimeString }}</td>
          </tr>
          <tr v-if="showRunData" class="sub-split">
            <td>
              &nbsp;&nbsp;→ Nach {{ getThirdSportLabel() }}
              {{ runQuarter1Km }}km:
            </td>
            <td>{{ run25CumulativeTimeString }}</td>
          </tr>
          <tr v-if="showRunData" class="sub-split">
            <td>
              &nbsp;&nbsp;→ Nach {{ getThirdSportLabel() }} {{ runHalfKm }}km:
            </td>
            <td>{{ run50CumulativeTimeString }}</td>
          </tr>
          <tr v-if="showRunData" class="sub-split">
            <td>
              &nbsp;&nbsp;→ Nach {{ getThirdSportLabel() }}
              {{ runThreeQuarterKm }}km:
            </td>
            <td>{{ run75CumulativeTimeString }}</td>
          </tr>
          <tr>
            <td>Gesamt Zeit:</td>
            <td>{{ totalTimeString }}</td>
          </tr>
          <tr class="blank_row">
            <td colspan="2"></td>
          </tr>
        </template>

        <!-- For single sports, also show total time -->
        <template v-if="currentSportPreset">
          <tr>
            <td>Gesamt Zeit:</td>
            <td>{{ getSingleSportTotalTime() }}</td>
          </tr>
          <tr class="blank_row">
            <td colspan="2"></td>
          </tr>
        </template>

        <tr class="section-header">
          <td colspan="2"><strong>Einzelzeiten</strong></td>
        </tr>
        <tr v-if="showSwimData">
          <td>{{ getFirstSportTimeLabel() }}:</td>
          <td>{{ swimTimeString }}</td>
        </tr>
        <tr v-if="showTransitionData && showSwimData && showBikeData">
          <td>T1 Zeit:</td>
          <td>{{ t1TimeString }}</td>
        </tr>
        <tr v-if="showBikeData" class="sub-split">
          <td>&nbsp;&nbsp;→ Bike {{ bikeQuarter1Km }}km:</td>
          <td>{{ bike25TimeString }}</td>
        </tr>
        <tr v-if="showBikeData" class="sub-split">
          <td>&nbsp;&nbsp;→ Bike {{ bikeHalfKm }}km:</td>
          <td>{{ bike50TimeString }}</td>
        </tr>
        <tr v-if="showBikeData" class="sub-split">
          <td>&nbsp;&nbsp;→ Bike {{ bikeThreeQuarterKm }}km:</td>
          <td>{{ bike75TimeString }}</td>
        </tr>
        <tr v-if="showBikeData">
          <td>Bike Zeit:</td>
          <td>{{ bikeTimeString }}</td>
        </tr>
        <tr v-if="showTransitionData && showBikeData && showRunData">
          <td>T2 Zeit:</td>
          <td>{{ t2TimeString }}</td>
        </tr>
        <tr v-if="showRunData" class="sub-split">
          <td>
            &nbsp;&nbsp;→ {{ getThirdSportLabel() }} {{ runQuarter1Km }}km:
          </td>
          <td>{{ run25TimeString }}</td>
        </tr>
        <tr v-if="showRunData" class="sub-split">
          <td>&nbsp;&nbsp;→ {{ getThirdSportLabel() }} {{ runHalfKm }}km:</td>
          <td>{{ run50TimeString }}</td>
        </tr>
        <tr v-if="showRunData" class="sub-split">
          <td>
            &nbsp;&nbsp;→ {{ getThirdSportLabel() }} {{ runThreeQuarterKm }}km:
          </td>
          <td>{{ run75TimeString }}</td>
        </tr>
        <tr v-if="showRunData">
          <td>{{ getThirdSportTimeLabel() }}:</td>
          <td>{{ runTimeString }}</td>
        </tr>

        <!-- New single sports -->
        <tr v-if="showRowData">
          <td>Rudern Zeit:</td>
          <td>{{ rowTimeString }}</td>
        </tr>
        <tr v-if="showHikeData">
          <td>Wandern Zeit:</td>
          <td>{{ hikeTimeString }}</td>
        </tr>
        <tr v-if="showWalkData">
          <td>Gehen Zeit:</td>
          <td>{{ walkTimeString }}</td>
        </tr>

        <tr class="blank_row">
          <td colspan="2"></td>
        </tr>

        <tr class="section-header">
          <td colspan="2"><strong>Uhrzeiten</strong></td>
        </tr>
        <tr>
          <td>Start:</td>
          <td>{{ dayTimeStartString }}</td>
        </tr>
        <tr v-if="showSwimData">
          <td>{{ getFirstSportStartLabel() }}:</td>
          <td>{{ totalTimeAfterSwimString }}</td>
        </tr>
        <tr v-if="showTransitionData && showSwimData && showBikeData">
          <td>Nach T1:</td>
          <td>{{ timeAfterT1String }}</td>
        </tr>
        <tr v-if="showBikeData" class="sub-split">
          <td>&nbsp;&nbsp;→ Uhrzeit Bike {{ bikeQuarter1Km }}km:</td>
          <td>{{ clockTimeBike25String }}</td>
        </tr>
        <tr v-if="showBikeData" class="sub-split">
          <td>&nbsp;&nbsp;→ Uhrzeit Bike {{ bikeHalfKm }}km:</td>
          <td>{{ clockTimeBike50String }}</td>
        </tr>
        <tr v-if="showBikeData" class="sub-split">
          <td>&nbsp;&nbsp;→ Uhrzeit Bike {{ bikeThreeQuarterKm }}km:</td>
          <td>{{ clockTimeBike75String }}</td>
        </tr>
        <tr v-if="showBikeData">
          <td>Nach Bike:</td>
          <td>{{ totalTimeAfterBikeString }}</td>
        </tr>
        <tr v-if="showTransitionData && showBikeData && showRunData">
          <td>Nach T2:</td>
          <td>{{ timeAfterT2String }}</td>
        </tr>
        <tr v-if="showRunData" class="sub-split">
          <td>
            &nbsp;&nbsp;→ Uhrzeit {{ getThirdSportLabel() }}
            {{ runQuarter1Km }}km:
          </td>
          <td>{{ clockTimeRun25String }}</td>
        </tr>
        <tr v-if="showRunData" class="sub-split">
          <td>
            &nbsp;&nbsp;→ Uhrzeit {{ getThirdSportLabel() }} {{ runHalfKm }}km:
          </td>
          <td>{{ clockTimeRun50String }}</td>
        </tr>
        <tr v-if="showRunData" class="sub-split">
          <td>
            &nbsp;&nbsp;→ Uhrzeit {{ getThirdSportLabel() }}
            {{ runThreeQuarterKm }}km:
          </td>
          <td>{{ clockTimeRun75String }}</td>
        </tr>
        <tr v-if="!currentSportPreset">
          <td>Ziel:</td>
          <td>{{ dayTimeFinish }}</td>
        </tr>

        <!-- For single sports, show simple start/finish -->
        <tr v-if="currentSportPreset">
          <td>Ziel ({{ getSingleSportName() }}):</td>
          <td>{{ getSingleSportFinishTime() }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { usePresets } from "../composables/usePresets";

interface Props {
  swimTimeString: string;
  bikeTimeString: string;
  runTimeString: string;
  rowTimeString?: string;
  hikeTimeString?: string;
  walkTimeString?: string;
  t1TimeString: string;
  t2TimeString: string;
  totalTimeString: string;
  swimCumulativeTimeString: string;
  t1CumulativeTimeString: string;
  bikeCumulativeTimeString: string;
  t2CumulativeTimeString: string;
  dayTimeStartString: string;
  totalTimeAfterSwimString: string;
  timeAfterT1String: string;
  totalTimeAfterBikeString: string;
  timeAfterT2String: string;
  dayTimeFinish: string;
  bikeQuarter1Km: number;
  bikeHalfKm: number;
  bikeThreeQuarterKm: number;
  runQuarter1Km: number;
  runHalfKm: number;
  runThreeQuarterKm: number;
  bike25TimeString: string;
  bike50TimeString: string;
  bike75TimeString: string;
  run25TimeString: string;
  run50TimeString: string;
  run75TimeString: string;
  bike25CumulativeTimeString: string;
  bike50CumulativeTimeString: string;
  bike75CumulativeTimeString: string;
  run25CumulativeTimeString: string;
  run50CumulativeTimeString: string;
  run75CumulativeTimeString: string;
  clockTimeBike25String: string;
  clockTimeBike50String: string;
  clockTimeBike75String: string;
  clockTimeRun25String: string;
  clockTimeRun50String: string;
  clockTimeRun75String: string;
  preset?: string;
}

const props = defineProps<Props>();

// Check if current preset is a single sport
const { getSingleSportPresets } = usePresets();
const singleSportPresets = computed(() => getSingleSportPresets());
const currentSportPreset = computed(() => {
  return singleSportPresets.value.find((p) => p.value === props.preset);
});

// Show/hide sections based on preset
const showSwimData = computed(() => {
  if (!currentSportPreset.value) return true; // Show all for triathlon presets
  return currentSportPreset.value.type === "swim";
});

const showBikeData = computed(() => {
  if (!currentSportPreset.value) return true; // Show all for triathlon presets
  return currentSportPreset.value.type === "bike";
});

const showRunData = computed(() => {
  if (!currentSportPreset.value) return true; // Show all for triathlon presets
  return currentSportPreset.value.type === "run";
});

const showRowData = computed(() => {
  if (!currentSportPreset.value) return false; // Don't show for triathlon presets
  return currentSportPreset.value.type === "row";
});

const showHikeData = computed(() => {
  if (!currentSportPreset.value) return false; // Don't show for triathlon presets
  return currentSportPreset.value.type === "hike";
});

const showWalkData = computed(() => {
  if (!currentSportPreset.value) return false; // Don't show for triathlon presets
  return currentSportPreset.value.type === "walk";
});

const showTransitionData = computed(() => {
  return !currentSportPreset.value; // Hide transitions for single sports
});

// Helper functions for dynamic labels
const getFirstSportLabel = () => {
  return props.preset === "duathlon" ? "Nach Run 1" : "Nach Swim";
};

const getFirstSportTimeLabel = () => {
  return props.preset === "duathlon" ? "Run 1 Zeit" : "Swim Zeit";
};

const getFirstSportStartLabel = () => {
  return props.preset === "duathlon" ? "Nach Run 1" : "Nach Swim";
};

const getThirdSportLabel = () => {
  return props.preset === "duathlon" ? "Run 2" : "Run";
};

const getThirdSportTimeLabel = () => {
  return props.preset === "duathlon" ? "Run 2 Zeit" : "Run Zeit";
};

const getSingleSportTotalTime = () => {
  if (!currentSportPreset.value) return props.totalTimeString;

  switch (currentSportPreset.value.type) {
    case "swim":
      return props.swimTimeString;
    case "bike":
      return props.bikeTimeString;
    case "run":
      return props.runTimeString;
    case "row":
      return props.rowTimeString || "00:00:00";
    case "hike":
      return props.hikeTimeString || "00:00:00";
    case "walk":
      return props.walkTimeString || "00:00:00";
    default:
      return props.totalTimeString;
  }
};

const getSingleSportName = () => {
  if (!currentSportPreset.value) return "";

  switch (currentSportPreset.value.type) {
    case "swim":
      return "Schwimmen";
    case "bike":
      return "Radfahren";
    case "run":
      return "Laufen";
    case "row":
      return "Rudern";
    case "hike":
      return "Wandern";
    case "walk":
      return "Gehen";
    default:
      return "";
  }
};

const getSingleSportFinishTime = () => {
  if (!currentSportPreset.value) return props.dayTimeFinish;

  // Parse start time (HH:MM:SS)
  const startTimeParts = props.dayTimeStartString.split(":");
  const startHours = parseInt(startTimeParts[0]);
  const startMinutes = parseInt(startTimeParts[1]);
  const startSeconds = parseInt(startTimeParts[2] || "0");
  const startTotalSeconds =
    startHours * 3600 + startMinutes * 60 + startSeconds;

  // Get sport duration in seconds
  let sportTimeString = "";
  switch (currentSportPreset.value.type) {
    case "swim":
      sportTimeString = props.swimTimeString;
      break;
    case "bike":
      sportTimeString = props.bikeTimeString;
      break;
    case "run":
      sportTimeString = props.runTimeString;
      break;
    case "row":
      sportTimeString = props.rowTimeString || "00:00:00";
      break;
    case "hike":
      sportTimeString = props.hikeTimeString || "00:00:00";
      break;
    case "walk":
      sportTimeString = props.walkTimeString || "00:00:00";
      break;
    default:
      return props.dayTimeFinish;
  }

  // Parse sport time (HH:MM:SS)
  const sportTimeParts = sportTimeString.split(":");
  const sportHours = parseInt(sportTimeParts[0]);
  const sportMinutes = parseInt(sportTimeParts[1]);
  const sportSeconds = parseInt(sportTimeParts[2] || "0");
  const sportTotalSeconds =
    sportHours * 3600 + sportMinutes * 60 + sportSeconds;

  // Calculate finish time
  const finishTotalSeconds = startTotalSeconds + sportTotalSeconds;
  const finishHours = Math.floor(finishTotalSeconds / 3600);
  const finishMinutes = Math.floor((finishTotalSeconds % 3600) / 60);
  const finishSecondsRemainder = finishTotalSeconds % 60;

  // Format as HH:MM:SS
  const pad = (num: number) => num.toString().padStart(2, "0");
  return `${pad(finishHours)}:${pad(finishMinutes)}:${pad(
    finishSecondsRemainder
  )}`;
};
</script>

<style lang="scss" scoped>
.pace-rechner {
  flex-grow: 1;
  border: 4px solid #333;
  border-radius: 28px;
  margin: 8px;

  &.summary {
    padding: 10px;

    /* WordPress-spezifische Tabellen-Styles mit hoher Spezifität */
    table.pace-calculator-table {
      margin: 0 auto !important;
      width: 100% !important;
      border-collapse: collapse !important;
      border-spacing: 0 !important;
      border: none !important;
      background: transparent !important;
      box-shadow: none !important;

      tbody {
        border: none !important;
        background: transparent !important;
      }

      tr {
        border: none !important;
        background: transparent !important;

        &:nth-child(odd),
        &:nth-child(even) {
          background: transparent !important;
        }

        &:hover {
          background: transparent !important;
        }
      }

      .section-header {
        background-color: var(--bg-card) !important;
        font-weight: bold !important;
        border-radius: 28px;

        td {
          text-align: center !important;
          padding: 8px 4px !important;
          border-bottom: 2px solid var(--border-color) !important;
          border-top: none !important;
          border-left: none !important;
          border-right: none !important;
          background-color: var(--bg-card) !important;
          color: var(--text-main) !important;
          border-top-left-radius: 20px;
          border-top-right-radius: 20px;
        }
      }

      .blank_row {
        height: 10px !important;
        background-color: transparent !important;

        td {
          background-color: transparent !important;
          border: none !important;
          padding: 0 !important;
          height: 10px !important;
        }
      }

      .sub-split {
        td {
          font-size: 0.9em !important;
          color: var(--text-muted) !important;
          font-style: italic !important;
          border: none !important;

          &:first-child {
            font-weight: 400 !important;
          }
        }
      }

      td {
        padding: 4px !important;
        border: none !important;
        vertical-align: top !important;
        background: transparent !important;
        color: var(--text-body) !important;

        &:first-child {
          font-weight: 500 !important;
          width: 30% !important;
          color: var(--text-main) !important;
        }

        &:last-child {
          text-align: left !important;
          font-family: monospace !important;
        }
      }
    }
  }
}

/* WordPress Theme Override - Globale Styles mit sehr hoher Spezifität */
:global(.pace-rechner.summary table.pace-calculator-table) {
  margin: 0 auto !important;
  width: 100% !important;
  border-collapse: collapse !important;
  border-spacing: 0 !important;
  border: none !important;
  background: transparent !important;
  box-shadow: none !important;

  tbody {
    border: none !important;
    background: transparent !important;
  }

  tr {
    border: none !important;
    background: transparent !important;

    &:nth-child(odd),
    &:nth-child(even) {
      background: transparent !important;
    }

    &:hover {
      background: transparent !important;
    }
  }

  td {
    padding: 4px !important;
    border: none !important;
    vertical-align: top !important;
    background: transparent !important;
  }
}
</style>
