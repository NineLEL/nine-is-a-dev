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
        <div
          ref="buttonRef"
          :style="{
            top: `${buttonPosition.y}px`,
            left: `${buttonPosition.x}px`,
          }"
          class="click-me-button cursor-pointer rounded-full bg-primary text-primary-content shadow-md hover:shadow-lg active:shadow-sm"
          @click="handleClick"
          aria-label="Click me button"
        ></div>

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
    const buttonPosition = ref({ x: 150, y: 150 }); // Initial placeholder before mount
    const loading = ref(true);
    const containerRef = ref<HTMLElement | null>(null); // Ref for the game container div
    const buttonRef = ref<HTMLElement | null>(null);    // Ref for the clickable button div

    const getRandomPosition = () => {
      if (!containerRef.value) {
        console.warn("Container dimensions not available for positioning.");
        return { x: 150, y: 150 }; // Fallback
      }

      const containerWidth = containerRef.value.offsetWidth;
      const containerHeight = containerRef.value.offsetHeight;
      const buttonSize = buttonRef.value?.offsetWidth || 24; // Get actual button size or fallback
      const padding = 30; // Padding from container edges

      const minX = padding;
      const minY = padding;
      const maxX = Math.max(minX, containerWidth - buttonSize - padding);
      const maxY = Math.max(minY, containerHeight - buttonSize - padding);

      const rangeX = Math.max(0, maxX - minX);
      const rangeY = Math.max(0, maxY - minY);

      const randomX = Math.random() * rangeX + minX;
      const randomY = Math.random() * rangeY + minY;

      return { x: Math.floor(randomX), y: Math.floor(randomY) };
    };

    onMounted(() => {
      // Ensure DOM is ready for dimension calculations
      nextTick(() => {
        if (containerRef.value) {
          buttonPosition.value = getRandomPosition();
        } else {
          // Fallback if ref somehow failed
          buttonPosition.value = { x: 150, y: 150 };
        }
        loading.value = false; // Show game content
      });
    });

    const handleClick = () => {
      score.value++;
      buttonPosition.value = getRandomPosition();
    };

    // --- Transition Hooks ---
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
      setTimeout(done, 500); // Corresponds to transition duration
    };

    const leave = (el: Element, done: () => void) => {
      (el as HTMLElement).style.transition =
        "opacity 0.5s ease, transform 0.5s ease";
      (el as HTMLElement).style.opacity = "0";
      (el as HTMLElement).style.transform = "scale(0.8)";
      setTimeout(done, 500); // Corresponds to transition duration
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
  position: absolute;
  width: 24px;
  height: 24px;
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
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.1)); /* Example generic shadow */
  /* filter: drop-shadow(0 1px 1px hsl(var(--b1) / 0.4)); /* Example using DaisyUI base color variable */
}
</style>