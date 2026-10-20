<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <!-- 晴：太阳 -->
    <g v-if="category === 'clear'">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </g>

    <!-- 多云：太阳 + 云 -->
    <g v-else-if="category === 'partly'">
      <path d="M12 2v2M4.93 4.93l1.41 1.41M20 12h2M19.07 4.93l-1.41 1.41M15.947 12.65a4 4 0 0 0-5.925-4.128" />
      <path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z" />
    </g>

    <!-- 阴：云 -->
    <g v-else-if="category === 'cloudy'">
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    </g>

    <!-- 雾：云 + 横线 -->
    <g v-else-if="category === 'fog'">
      <path d="M17.5 15H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
      <path d="M16 18H7M17 22H9" />
    </g>

    <!-- 雨：云 + 雨线 -->
    <g v-else-if="category === 'rain'">
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="M8 19v1M8 14v1M16 19v1M16 14v1M12 21v1M12 16v1" />
    </g>

    <!-- 雪：云 + 雪点 -->
    <g v-else-if="category === 'snow'">
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="M8 15h.01M8 19h.01M12 17h.01M12 21h.01M16 15h.01M16 19h.01" />
    </g>

    <!-- 雷雨：云 + 闪电 -->
    <g v-else>
      <path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973" />
      <path d="M13 12l-3 5h4l-3 5" />
    </g>
  </svg>
</template>

<script setup>
import { computed } from 'vue'
import { getWeatherCategory } from '../utils/weatherCode'

const props = defineProps({
  /** WMO 天气代码 */
  code: { type: Number, required: true },
  /** 渲染尺寸（px） */
  size: { type: Number, default: 40 }
})

const category = computed(() => getWeatherCategory(props.code))
</script>
