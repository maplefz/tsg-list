/* 成立计时 */
<template>
  <div>
    三角字幕组成立于2012年1月16日，已成立 {{ years }} 年 {{ days }} 天。
  </div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'Dayse',
  computed: {
    yearsAndDays() {
      const startDate = moment('2012-01-16', 'YYYY-MM-DD');
      const today = moment();
      
      let years = today.year() - startDate.year();
      let days = today.dayOfYear() - startDate.dayOfYear();

      // 如果天数为负数，表示当前日期还没到周年日，需要减少一年，并调整天数
      if (days < 0) {
        years -= 1;
        days += today.isLeapYear() ? 366 : 365;
      }

      return { years, days };
    },
    years() {
      return this.yearsAndDays.years;
    },
    days() {
      return this.yearsAndDays.days;
    }
  }
}
</script>


<style scoped>
div {
  font-size: 19px;       /* 19像素字号 */
  color: #333;          /* 颜色 */
  text-align: center;   /* 居中 */
  font-weight: bold;    /* 加粗 */
}
</style>
