<template>
  <div 
    class="game relative w-96 h-96 flex justify-center items-center bg-base-300 rounded-xl" 
    id="gamecontainer" 
    :data-theme="theme"
  >
    <!-- Skeleton Loader for the entire container -->
    <div v-if="loading" class="skeleton w-full h-full rounded-xl"></div>

    <!-- Game Content (Button and Score) with transition effect -->
    <transition name="fade" @before-enter="beforeEnter" @enter="enter" @leave="leave">
      <div v-show="!loading" class="absolute inset-0 flex justify-center items-center">
        <!-- Game Button -->
        <div 
          :style="{
            top: `${buttonPosition.y}px`,
            left: `${buttonPosition.x}px`,
          }" 
          class="click-me-button bg-primary" 
          @click="handleClick"
        ></div>

        <!-- Score Display -->
        <div class="absolute text-2xl top-4 left-4 text-primary font-semibold">
          Score: {{ score }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";

export default {
  name: "Game",
  setup() {
    const score = ref<number>(0);
    const buttonPosition = ref({ x: 0, y: 0 });
    const loading = ref(true);
    const theme = ref<string>(window.getTheme()); // Default theme is fetched from window.getTheme()

    // Watch the theme to update the DOM attribute whenever it changes
    watch(theme, (newTheme) => {
      document.documentElement.setAttribute("data-theme", newTheme); // Update the root theme
      triggerReload(); // Trigger skeleton reload
    });

    const updateTheme = () => {
      const currentTheme = window.getTheme();
      if (currentTheme && currentTheme !== theme.value) {
        theme.value = currentTheme; // Update the reactive theme
      }
    };

    let themeChangeTimeout: number | null = null;

    // Handle the theme on mounted
    onMounted(() => {
      updateTheme(); // Initial theme update
      themeChangeTimeout = window.setInterval(updateTheme, 1); // Check theme every millisecond for instant update

      setTimeout(() => {
        buttonPosition.value = getRandomPosition();
        loading.value = false; // Hide skeleton and show the game content
      }, 2000); // Simulate a 2-second loading time
    });

    onBeforeUnmount(() => {
      if (themeChangeTimeout) {
        clearInterval(themeChangeTimeout);
      }
    });

    const getRandomPosition = () => {
      const minX = 50;
      const minY = 50;
      const maxX = 352 - 20 - minX;
      const maxY = 352 - 20 - minY;
      return { x: Math.random() * maxX + minX, y: Math.random() * maxY + minY };
    };

    const handleClick = () => {
      score.value++;
      buttonPosition.value = getRandomPosition();
    };

    const triggerReload = () => {
      loading.value = true; // Reset to skeleton loader
      setTimeout(() => {
        loading.value = false; // Show the game content after a short delay
      }, 2000); // Simulate a 2-second loading time
    };

    return {
      score,
      buttonPosition,
      theme, // Return the theme to be used in the template
      handleClick,
      loading,
    };
  },

  methods: {
    beforeEnter(el: Element) {
      (el as HTMLElement).style.opacity = "0";
      (el as HTMLElement).style.transform = "scale(0.8)";
    },
    enter(el: Element, done: Function) {
      (el as HTMLElement).offsetHeight; // Trigger a reflow to restart the animation
      (el as HTMLElement).style.transition = "opacity 0.5s ease, transform 0.5s ease";
      (el as HTMLElement).style.opacity = "1";
      (el as HTMLElement).style.transform = "scale(1)";
      done();
    },
    leave(el: Element, done: Function) {
      (el as HTMLElement).style.transition = "opacity 0.5s ease, transform 0.5s ease";
      (el as HTMLElement).style.opacity = "0";
      (el as HTMLElement).style.transform = "scale(0.8)";
      done();
    },
  },
};
</script>

<style scoped>
.click-me-button {
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.2s ease-in-out, opacity 0.3s ease-in-out;
}

.click-me-button:hover {
  transform: scale(1.2);
}

.click-me-button:active {
  transform: scale(0.8);
}

@media screen and (max-width: 1024px) {
  .game {
    display: none;
  }
}

/* Smooth fade-in transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
