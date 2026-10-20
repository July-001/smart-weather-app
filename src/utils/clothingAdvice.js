/**
 * 穿衣建议生成工具
 * 基于温度、降水概率、风速等规则生成个性化穿衣建议
 */

/**
 * 根据天气数据生成穿衣建议
 *
 * @param {Object} params 天气参数
 * @param {number} params.tempMax 最高气温（°C）
 * @param {number} params.tempMin 最低气温（°C）
 * @param {number} [params.precipitationProbability=0] 降水概率（%）
 * @param {number} [params.windSpeedMax=0] 最大风速（km/h）
 * @returns {string[]} 穿衣建议列表
 */
export function getClothingAdvice({
  tempMax,
  tempMin,
  precipitationProbability = 0,
  windSpeedMax = 0
}) {
  const advice = []
  const avgTemp = (tempMax + tempMin) / 2

  // 温度规则
  if (avgTemp <= 0) {
    advice.push('天寒地冻，穿上羽绒服和厚毛衣，戴好帽子、围巾与手套')
  } else if (avgTemp <= 10) {
    advice.push('气温较低，建议穿厚外套或大衣，注意保暖')
  } else if (avgTemp <= 18) {
    advice.push('天气微凉，建议穿夹克、卫衣等春秋装')
  } else if (avgTemp <= 26) {
    advice.push('气温舒适，穿长袖衬衫或薄外套即可')
  } else {
    advice.push('天气炎热，建议穿短袖、短裤等清凉夏装，注意防晒补水')
  }

  // 降水概率规则
  if (precipitationProbability >= 60) {
    advice.push('降水概率较高，出门记得带伞，尽量减少户外活动')
  } else if (precipitationProbability >= 30) {
    advice.push('可能有降水，建议随身备一把伞')
  }

  // 风速规则
  if (windSpeedMax >= 35) {
    advice.push('风力较大，注意防风保暖，远离广告牌等高空坠物区域')
  } else if (windSpeedMax >= 20) {
    advice.push('风力稍大，外出注意防风')
  }

  // 昼夜温差规则
  if (tempMax - tempMin >= 12) {
    advice.push('昼夜温差较大，早晚注意添衣，谨防感冒')
  }

  return advice
}
