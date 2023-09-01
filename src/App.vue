<script setup lang="ts">
import { ref, onMounted, } from 'vue';
import Handler from '@/components/Handler.vue';
import Snake from './snake';

const canvas = ref<any>(null)
const game = ref<Snake | null>(null)

const score = ref<number>(0)

// const eventhandler = (evtType: string, data: {}) => {

//     console.log('eventhandler', evtType, data);

//     switch (evtType) {
//         case 'onGameReady':

//             break;
//         case 'onAccountedResult':
//             // score.value = game.value?.getScore() || 0;
//             break;

//         default:
//             break;
//     }
// }
onMounted(() => {
  try {
    if (canvas.value) {
      game.value = new Snake(canvas.value, { width: 500, height: 500, grids: [30, 30] });
      game.value.init()

      // game.value.setSubscriber(eventhandler)
    }

  } catch (error) {

  }
})
const onHandleAction = (evt: { action: GameHandleAction, isLongPress: boolean }) => {
  const { up, down, toLeft, toRight, home, start, oprY, oprX, oprA, oprB, } = game.value?.handler || {}
  switch (evt.action) {
    case 'HOME':
      home?.()
      break;
    case 'START':
      start?.()
      break;
    case 'up':
      up?.();
      break
    case 'down':
      down?.();
      break
    case 'left':
      toLeft?.();
      break;
    case 'right':
      toRight?.()
      break;
    case 'Y':
      oprY?.();
      break;
    case 'X':
      oprX?.()
      break;
    case 'A':
      oprA?.()
      break;
    case 'B':
      oprB?.()
      break;
  }
}
</script>

<template>
  <p>Snake:{{ score }}</p>
  <div class="console"></div>
  <canvas ref="canvas"></canvas>
  <Handler @handle-action="onHandleAction" />
</template>

<style scoped>
canvas {
  width: 500px;
  height: 500px;
  /* background-color: #000; */
}


.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
