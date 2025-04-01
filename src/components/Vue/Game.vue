<template>
    <div ref="containerRef"
        class="game relative mx-auto flex w-[90vw] max-w-sm aspect-square items-center justify-center overflow-hidden rounded-xl bg-base-300 shadow-lg sm:w-96"
        id="gamecontainer">
        <!-- Skeleton Loader -->
        <div v-if="loading" class="skeleton h-full w-full rounded-xl bg-base-200"></div>

        <!-- Game Content -->
        <transition name="fade" @before-enter="beforeEnter" @enter="enter" @leave="leave">
            <div v-show="!loading" class="absolute inset-0 flex items-center justify-center">
                <!-- Game Button -->
                <button type="button" ref="buttonRef" :style="{
                    position: 'absolute',
                    top: `${buttonPosition.y}px`,
                    left: `${buttonPosition.x}px`,
                    width: '28px',
                    height: '28px',
                }"
                    class="click-me-button cursor-pointer rounded-full bg-primary text-primary-content shadow-md hover:shadow-lg active:shadow-sm"
                    @click="handleClick" aria-label="Click me button"></button>

                <!-- Score Display -->
                <div
                    class="absolute left-2 top-2 px-2 text-xl font-bold text-primary drop-shadow-sm sm:left-4 sm:top-4 sm:text-2xl">
                    Score: {{ score }}
                </div>
            </div>
        </transition>
    </div>
</template>

<script lang="ts">
import { ref, onMounted, nextTick } from 'vue';

interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}

export default {
    name: 'Game',
    setup() {
        const score = ref<number>(0);
        const buttonPosition = ref({ x: 150, y: 150 }); // Initial placeholder
        const loading = ref(true);
        const containerRef = ref<HTMLElement | null>(null);
        const buttonRef = ref<HTMLElement | null>(null);
        const BUTTON_SIZE = 28; // Define button size as a constant

        const checkOverlap = (rect1: Rect, rect2: Rect): boolean => {
            return (
                rect1.x < rect2.x + rect2.width &&
                rect1.x + rect1.width > rect2.x &&
                rect1.y < rect2.y + rect2.height &&
                rect1.y + rect1.height > rect2.y
            );
        };

        const getRandomPosition = () => {
            if (!containerRef.value) {
                console.warn('Container dimensions not available for positioning.');
                return { x: 150, y: 150 }; // Fallback
            }

            const containerWidth = containerRef.value.offsetWidth;
            const containerHeight = containerRef.value.offsetHeight;
            const buttonSize = buttonRef.value?.offsetWidth || BUTTON_SIZE;
            const padding = 20; // Padding from container edges
            const maxAttempts = 50;

            // Define the score area (top-left corner)
            const scoreAreaPadding = 10; // Extra buffer around score
            const scoreAreaRect: Rect = {
                x: 0,
                y: 0,
                width: 100 + scoreAreaPadding, // Estimated width of "Score: XX"
                height: 35 + scoreAreaPadding, // Estimated height of score text
            };

            const minX = padding;
            const minY = padding;
            const maxX = Math.max(minX, containerWidth - buttonSize - padding);
            const maxY = Math.max(minY, containerHeight - buttonSize - padding);

            const rangeX = Math.max(0, maxX - minX);
            const rangeY = Math.max(0, maxY - minY);

            let randomX: number, randomY: number, buttonRect: Rect, attempts = 0;

            do {
                randomX = Math.random() * rangeX + minX;
                randomY = Math.random() * rangeY + minY;

                buttonRect = {
                    x: randomX,
                    y: randomY,
                    width: buttonSize,
                    height: buttonSize,
                };

                attempts++;
                if (attempts > maxAttempts) {
                    console.warn(`Could not find non-overlapping position for button after ${maxAttempts} attempts.`);
                    // Place it in the center as a fallback
                    randomX = containerWidth / 2 - buttonSize / 2;
                    randomY = containerHeight / 2 - buttonSize / 2;
                    break;
                }
            } while (rangeX > 0 && rangeY > 0 && checkOverlap(buttonRect, scoreAreaRect)); // Only check if there's a valid range

            return { x: Math.floor(randomX), y: Math.floor(randomY) };
        };

        onMounted(() => {
            nextTick(() => {
                if (containerRef.value) {
                    buttonPosition.value = getRandomPosition();
                } else {
                    console.warn('Container ref not available on mount.');
                    buttonPosition.value = { x: 150, y: 150 }; // Fallback
                }
                loading.value = false;
            });
        });

        const handleClick = () => {
            score.value++;
            buttonPosition.value = getRandomPosition();
        };

        // --- Transition Hooks ---
        const beforeEnter = (el: Element) => {
            const htmlEl = el as HTMLElement;
            htmlEl.style.opacity = '0';
            htmlEl.style.transform = 'scale(0.8)';
        };

        const enter = (el: Element, done: () => void) => {
            const htmlEl = el as HTMLElement;
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    htmlEl.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    htmlEl.style.opacity = '1';
                    htmlEl.style.transform = 'scale(1)';
                });
            });
            setTimeout(done, 500); // Match transition duration
        };

        const leave = (el: Element, done: () => void) => {
            const htmlEl = el as HTMLElement;
            htmlEl.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            htmlEl.style.opacity = '0';
            htmlEl.style.transform = 'scale(0.8)';
            setTimeout(done, 500); // Match transition duration
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
    display: flex;
    align-items: center;
    justify-content: center;
    transition:
        transform 0.2s cubic-bezier(0.68, -0.55, 0.27, 1.55),
        /* Elastic bounce */
        top 0.15s ease-out,
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

.skeleton {
    animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    border-radius: inherit;
    /* Inherit corner rounding */
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