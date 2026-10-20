<template>
  <section class="daily panel">
    <h3 class="section-title">未来 7 天</h3>
    <ul class="daily-list">
      <li v-for="day in days" :key="day.date" class="daily-row">
        <span class="day-label num">{{ day.label }}</span>
        <span class="day-glyph">
          <WeatherGlyph :code="day.weatherCode" :size="22" />
        </span>
        <span class="day-desc">{{ day.text }}</span>
        <span class="day-rain num" :title="`降水概率 ${day.precipitationProbability ?? 0}%`">
          {{ day.precipitationProbability ?? 0 }}%
        </span>
        <span class="day-temp num">
          <b class="tmax">{{ day.tempMax }}°</b>
          <span class="tmin">{{ day.tempMin }}°</span>
        </span>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import WeatherGlyph from './WeatherGlyph.vue'
import { getWeatherInfo } from '../utils/weatherCode'

const props = defineProps({
  /** @type {import('vue').PropType<import('../types').WeatherData>} */
  weather: { type: Object, required: true }
})

const WEEK_LABELS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

/** 将 API 数据转换为展示友好的结构（星期标签、描述） */
const days = computed(() =>
  props.weather.daily.map((d, index) => {
    const info = getWeatherInfo(d.weatherCode)
    const date = new Date(`${d.date}T00:00:00`)
    return {
      ...d,
      label: index === 0 ? '今天' : WEEK_LABELS[date.getDay()],
      text: info.text,
      tempMax: Math.round(d.tempMax),
      tempMin: Math.round(d.tempMin)
    }
  })
)
</script>

<style scoped>
/* 表格式列表：细分隔线，桌面/移动端样式一致 */
.daily-list {
  list-style: none;
}

.daily-row {
  display: grid;
  grid-template-columns: 44px 28px 1fr 44px auto;
  align-items: center;
  gap: 10px;
  padding: 11px 2px;
}

.daily-row + .daily-row {
  border-top: 1px solid var(--c-line);
}

.day-label {
  font-size: 13px;
  font-weight: 700;
  color: var(--c-ink);
}

.day-glyph {
  color: var(--c-ink-secondary);
  display: inline-flex;
}

.day-desc {
  font-size: 13.5px;
  color: var(--c-ink-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.day-rain {
  font-size: 12.5px;
  color: var(--c-ink-muted);
  text-align: right;
}

.day-temp {
  display: flex;
  gap: 8px;
  align-items: baseline;
  justify-content: flex-end;
  min-width: 72px;
}

.tmax {
  font-size: 14.5px;
  font-weight: 700;
  color: var(--c-ink);
}

.tmin {
  font-size: 13px;
  color: var(--c-ink-muted);
}

@media (max-width: 480px) {
  .daily-row {
    grid-template-columns: 40px 24px 1fr 38px auto;
    gap: 8px;
  }

  .day-desc {
    font-size: 12.5px;
  }
}
</style>
