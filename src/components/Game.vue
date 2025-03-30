<template>
  <div
    ref="containerRef"
    class="game relative flex h-96 w-96 items-center justify-center overflow-hidden rounded-xl bg-base-300 shadow-lg"
    id="gamecontainer"
  >
    <!-- Skeleton Loader -->
    <div v-if="loading" class="skeleton h-full w-full rounded-xl bg-base-200"></div>

    <!-- Game Content -->
    <transition
      name="fade"
      @before-enter="beforeEnter"
      @enter="enter"
      @leave="leave"
    >
      <div
        v-show="!loading"
        class="absolute inset-0 flex items-center justify-center"
      >
        <!-- Game Button -->
        <button
          type="button"
          ref="buttonRef"
          :style="{
            position: 'absolute', // Ensure position is absolute
            top: `${buttonPosition.y}px`,
            left: `${buttonPosition.x}px`,
            width: '24px', // Explicit size needed for calculation
            height: '24px' // Explicit size needed for calculation
          }"
          class="click-me-button cursor-pointer rounded-full bg-primary text-primary-content shadow-md hover:shadow-lg active:shadow-sm"
          @click="handleClick"
          aria-label="Click me button"
        ></button>

        <!-- Score Display -->
        <div
          class="absolute left-4 top-4 text-2xl font-bold text-primary drop-shadow-sm"
        >
          Score: {{ score }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, nextTick } from "vue";

export default {
  name: "Game",
  setup() {
    const score = ref<number>(0);
    const buttonPosition = ref({ x: 150, y: 150 }); // Initial placeholder
    const loading = ref(true);
    const containerRef = ref<HTMLElement | null>(null);
    const buttonRef = ref<HTMLElement | null>(null);

    // --- Helper to check for overlap ---
    const checkOverlap = (rect1: {x: number, y: number, width: number, height: number}, rect2: {x: number, y: number, width: number, height: number}): boolean => {
      return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
      );
    };

    const getRandomPosition = () => {
      if (!containerRef.value) {
        console.warn("Container dimensions not available for positioning.");
        return { x: 150, y: 150 }; // Fallback
      }

      const containerWidth = containerRef.value.offsetWidth;
      const containerHeight = containerRef.value.offsetHeight;
      // Use the explicitly set size, fallback needed before buttonRef is ready
      const buttonSize = buttonRef.value?.offsetWidth || 24;
      const padding = 30; // Padding from container edges

      // Define the score area (top-left corner) - adjust size as needed
      const scoreAreaPadding = 10; // Extra buffer around score
      const scoreAreaRect = {
        x: 0, // Score starts near left edge
        y: 0, // Score starts near top edge
        width: 100 + scoreAreaPadding,  // Estimated width of "Score: XX" + padding
        height: 40 + scoreAreaPadding, // Estimated height of score text + padding
      };

      const minX = padding;
      const minY = padding;
      const maxX = Math.max(minX, containerWidth - buttonSize - padding);
      const maxY = Math.max(minY, containerHeight - buttonSize - padding);

      const rangeX = Math.max(0, maxX - minX);
      const rangeY = Math.max(0, maxY - minY);

      let randomX, randomY, buttonRect, attempts = 0;

      // Loop until a non-overlapping position is found (or max attempts reached)
      do {
        randomX = Math.random() * rangeX + minX;
        randomY = Math.random() * rangeY + minY;

        // Define the potential button position
        buttonRect = {
            x: randomX,
            y: randomY,
            width: buttonSize,
            height: buttonSize,
        };
        attempts++;
        if (attempts > 50) { // Prevent infinite loop in edge cases
            console.warn("Could not find non-overlapping position for button.");
            break;
        }
      } while (checkOverlap(buttonRect, scoreAreaRect));


      return { x: Math.floor(randomX), y: Math.floor(randomY) };
    };

    onMounted(() => {
      nextTick(() => {
        if (containerRef.value) {
          // Call once to set initial position correctly after mount
          // buttonRef should be available here due to nextTick
          buttonPosition.value = getRandomPosition();
        } else {
          buttonPosition.value = { x: 150, y: 150 };
        }
        loading.value = false;
      });
    });

    const handleClick = () => {
      score.value++;
      buttonPosition.value = getRandomPosition();
    };

    // --- Transition Hooks (remain the same) ---
    const beforeEnter = (el: Element) => {
      (el as HTMLElement).style.opacity = "0";
      (el as HTMLElement).style.transform = "scale(0.8)";
    };

    const enter = (el: Element, done: () => void) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          (el as HTMLElement).style.transition =
            "opacity 0.5s ease, transform 0.5s ease";
          (el as HTMLElement).style.opacity = "1";
          (el as HTMLElement).style.transform = "scale(1)";
        });
      });
      setTimeout(done, 500);
    };

    const leave = (el: Element, done: () => void) => {
      (el as HTMLElement).style.transition =
        "opacity 0.5s ease, transform 0.5s ease";
      (el as HTMLElement).style.opacity = "0";
      (el as HTMLElement).style.transform = "scale(0.8)";
      setTimeout(done, 500);
    };

    return {
      score,
      buttonPosition,
      handleClick,
      loading,
      containerRef,
      buttonRef,
      beforeEnter,
      enter,
      leave,
    };
  },
};
</script>

<style scoped>
.click-me-button {
  /* position: absolute; no longer needed here, set via :style */
  /* width: 24px; no longer needed here */
  /* height: 24px; no longer needed here */
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    transform 0.2s cubic-bezier(0.68, -0.55, 0.27, 1.55),
    /* Elastic bounce effect */ top 0.15s ease-out,
    left 0.15s ease-out,
    box-shadow 0.2s ease-in-out;
  will-change: transform, top, left, box-shadow;
}

.click-me-button:hover {
  transform: scale(1.2);
}

.click-me-button:active {
  transform: scale(0.9);
}

/* Hide game component on smaller screens */
@media screen and (max-width: 1023px) {
  .game {
    display: none;
  }
}

.skeleton {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  border-radius: inherit;
}

@keyframes pulse {
  50% {
    opacity: 0.6;
  }
}

.drop-shadow-sm {
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.1));
}
</style>