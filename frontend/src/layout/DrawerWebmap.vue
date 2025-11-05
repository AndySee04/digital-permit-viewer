<template>
  <div class="web-map-drawer-container">
    <!-- Trigger Buttons -->
    <div class="drawer-trigger" @click="toggleDrawer('Layer')">
      <button v-tooltip="'Layer'" :class="{ 'active-drawer': isDrawerOpen && drawerTitle === 'Layer' }">
        <span class="material-symbols-outlined drawer-icon">
          stacks
        </span>
      </button>
    </div>
    <!-- <div class="drawer-trigger" @click="toggleDrawer('Legend')">
      <button v-tooltip="'Legend'" :class="{ 'active-drawer': isDrawerOpen && drawerTitle === 'Legend' }">
        <span class="material-symbols-outlined drawer-icon">
          legend_toggle
        </span>
      </button>
    </div> -->

    <div class="drawer-trigger" @click="toggleDrawer('Permit')">
      <button v-tooltip="'Permit'" :class="{ 'active-drawer': isDrawerOpen && drawerTitle === 'Permit' }">
        <span class="material-symbols-outlined drawer-icon">
          license
        </span>
      </button>
    </div>

    <!-- Drawer Overlay -->
    <Transition name="slide-fade">
      <div v-if="isDrawerOpen" class="web-map-drawer" :class="{ 'drawer-open': isDrawerOpen }">
        <div class="drawer-content">
          <!-- Drawer Header -->
          <div class="drawer-header">
            <h2>{{ drawerTitle }}</h2>
            <button type="button" class="close-button" @click="closeDrawer" aria-label="Close">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
            </button>
          </div>

          <!-- Drawer Body -->
          <div class="drawer-body">
            <slot :drawer-title="drawerTitle">No content provided</slot>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

// Props for customization
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  }
});

// Emits for v-model support
const emit = defineEmits(['update:modelValue', 'close-drawers']);

// Drawer state
const isDrawerOpen = ref(false);
const drawerTitle = ref('');

// Toggle drawer method
const toggleDrawer = (title) => {
  if (!isDrawerOpen.value || drawerTitle.value !== title) {
    isDrawerOpen.value = true;
    drawerTitle.value = title;
    // emit('update:modelValue', isDrawerOpen.value);
  }
};

// Close drawer method
const closeDrawer = () => {
  isDrawerOpen.value = false;
  emit('update:modelValue', false);
  emit('close-drawers');
};

// Watch for external control of drawer and title
watch(() => props.modelValue, (newValue) => {
  isDrawerOpen.value = newValue;
});

watch(() => props.title, (newTitle) => {
  if (newTitle) {
    drawerTitle.value = newTitle;
    if (props.modelValue) {
      isDrawerOpen.value = true;
    }
  }
});
</script>

<style scoped>
.web-map-drawer-container {
  position: fixed;
  top: 10;
  left: 0;
  padding: 10px;
  background: var(--surface-card);
  height: 100%;
  width: 60px;
  z-index: 10;
  /* Ensure it appears above the map */
  cursor: auto;
}

.drawer-trigger {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 5px 0 5px 0;
}

.web-map-drawer {
  position: absolute;
  top: 0;
  left: 60px;
  /* Align next to the drawer container */
  width: 40vw;
  /* Width of the drawer */
  max-width: 350px;
  height: 100%;
  background-color: var(--surface-card);
  border-left: 1px solid var(--surface-border);
  transition: transform 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
}

.drawer-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  font-size: 1.5rem;
  font-weight: 500;
  border-bottom: 1px solid var(--surface-border);
}

.drawer-body {
  flex-grow: 1;
  overflow: hidden;
  /* padding: 15px; */
}

.drawer-icon {
  font-size: 2rem;
  line-height: 1.5rem;
  color: var(--primary-color);
}

.close-button {
  margin-left: auto;
  background: transparent;
  border: 2px solid #ef4444;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  color: #ef4444;
  transition: all 0.2s ease;
}

.close-button svg {
  stroke: currentColor;
}

.close-button:hover {
  color: #dc2626;
  border-color: #dc2626;
  background-color: rgba(239, 68, 68, 0.1);
}

/* Style for the active drawer trigger button */
/* .active-drawer {
  display: flex;
  align-items: center;
  color: white; 
  padding: 5px 20px 5px 20px; 
} */

.active-drawer .material-symbols-outlined {
  color: var(--text-color);
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .web-map-drawer-container {
    width: 60px;
    /* Keep the width fixed */
  }

  .web-map-drawer {
    width: 60vw;
    /* Adjust the drawer width */
  }
}

@media (max-width: 480px) {
  .web-map-drawer-container {
    width: 60px;
    /* Keep the width fixed */
  }

  .web-map-drawer {
    width: 80vw;
    /* Adjust the drawer width */
  }
}

/* Transition effects */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(0%);
  opacity: 0;
}
</style>