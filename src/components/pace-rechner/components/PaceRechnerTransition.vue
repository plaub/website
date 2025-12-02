<template>
  <div class="wrapper">
    <span class="title">T</span>

    <div class="row">
      <div class="picker">
        <DurationPicker
          uKey="transitionTime1"
          :modelValue="time"
          @update:modelValue="onChangeTime"
          lazy
          backgroundColor="#6b7280"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DurationPicker from "./DurationPicker.vue";

interface Props {
  time?: number;
}

withDefaults(defineProps<Props>(), {
  time: 1,
});

const emit = defineEmits<{
  "update:time": [value: number];
}>();

const onChangeTime = (newTime: number) => {
  emit("update:time", newTime);
};
</script>

<style lang="scss" scoped>
.wrapper {
  color: #2d3436;

  .row {
    text-align: center;
  }
}
</style>
