<script setup>
import numberField from './components/atoms/numberField.vue'
import selectField from './components/atoms/selectField.vue'
import buttonPush from './components/atoms/buttonPush.vue'
import numberFieldAdvanced from './components/molecules/numberFieldAdvance.vue'
</script>

<template>
  <main>
    <h1 class="font-title">Hola mundo</h1>
    <select-field label="Element"></select-field>
    <number-field label="Length" unit="m"></number-field>
    <button-push> Hey there </button-push>
    <number-field-advanced></number-field-advanced>
  </main>
</template>

<style scoped>
main {
  position: relative;
}
</style>
