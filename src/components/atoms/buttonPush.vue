<template>
  <button class="pushable">
    <span class="shadow"></span>
    <span class="edge"></span>
    <span class="front font-body-big">
      <slot></slot>
    </span>
  </button>
</template>

<script setup>
/**
 * A big pushable button.
 * @onclick methods must be apply by parent component
 */

const props = defineProps({
  width: {
    required: false,
    type: String,
    default: 'auto'
  }
})
</script>

<style scoped>
.front {
  display: block;
  padding: 1ch 1ch;
  border-radius: 12px;
  background-color: var(--orange-accent);
  color: var(--on-orange-accent);
  border: 7px solid var(--on-orange-accent);
  transform: translateY(-4px);
  transition: transform 250ms;
}

.pushable {
  position: relative;
  background: transparent;
  width: v-bind(width);
  border: none;
  padding: 0;
  cursor: pointer;
  outline-offset: 5px;
  height: fit-content;
  -webkit-tap-highlight-color: transparent;
}

.shadow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  background-color: hsl(0deg 0% 0% / 0.25);
  transform: translateY(2px);
}
.edge {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  background: var(--orange-accent-dark);
}

.pushable:focus:not(:focus-visible) {
  outline: none;
}
.pushable:hover .front {
  transform: translateY(-6px);
  transition: transform 250ms cubic-bezier(0.3, 0.7, 0.4, 1.5);
}
.pushable:active .front {
  transform: translateY(-2px);
  transition: transform 34ms;
}
.pushable:hover .shadow {
  transform: translateY(4px);
  transition: transform 250ms cubic-bezier(0.3, 0.7, 0.4, 1.5);
}
.pushable:active .shadow {
  transform: translateY(1px);
  transition: transform 34ms;
}
</style>
