<template>
  <div class="calendar-container">
    <div class="month-title">{{monthTitle}}</div>
    <div class="calendar">
      <div class="calendar-header">
        <div class="day-letter" v-for="day in weekdayLabels" :key="day">{{day}}</div>
      </div>
      <div class="week-list">
        <div class="week" v-for="(week, weekIndex) in weeks" :key="weekIndex">
          <div class="week-day" :class="{'current-day': weekday.toString() === currentDayInMonth}" v-for="(weekday, dayIndex) in week" :key="`day${dayIndex}_${weekIndex}`">{{weekday ? weekday : ''}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  export default {
    name: "calendar",
    data () {
      return {
        weekdayLabels: ['M', 'Tu', 'W', 'Th', 'F', 'Sa', 'Su'],
        weeks: [
          [ 0, 0, 0, 0, 0, 0, 0 ],
          [ 0, 0, 0, 0, 0, 0, 0 ],
          [ 0, 0, 0, 0, 0, 0, 0 ],
          [ 0, 0, 0, 0, 0, 0, 0 ],
          [ 0, 0, 0, 0, 0, 0, 0 ],
          [ 0, 0, 0, 0, 0, 0, 0 ]
        ],
        monthTitle: '',
        currentDayInMonth: ''
      }
    },
    created () {
      this.monthTitle = moment().format("MMMM Do YYYY")
      this.currentDayInMonth = moment().format("D")
      this.parseMonthDays()
    },
    methods: {
      parseMonthDays () {
        const daysInMonth = Number(moment().daysInMonth())
        const firstDayOfMonth = Number(moment([moment().year(), moment().month(), 1]).format('d'))
        for (var i = 0; i < daysInMonth + firstDayOfMonth - 1; i++) {
          const dayInMonth = i - firstDayOfMonth + 2
          const dayInWeek = i % 7
          const weekIndex = Math.floor(i/7)
          this.weeks[weekIndex][dayInWeek] = dayInMonth > 0 ? dayInMonth : 0
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "@/assets/variables.scss";

  .calendar-container {
    display: flex;
    flex: 1;
    flex-direction: column;
    margin: 20px;
    .month-title {
      margin: 0 auto 10px auto;
      font-weight: 900;
      font-size: 1.1em;
    }
    .calendar {
      display: flex;
      flex: 1;
      flex-direction: column;
      align-items: center;
      margin: auto;
      .calendar-header {
        display: flex;
        .day-letter {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 2px;
          height: 30px; width: 40px;
          font-weight: 700;
          background-color: transparentize($color: $color-font, $amount: .5);
        }
      }
      .week-list {
        flex: 1;
        display: flex;
        flex-direction: column;
        .week {
          display: flex;
          .week-day {
            user-select: none;
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 2px;
            height: 30px; width: 40px;
            font-weight: 700;
            background-color: transparentize($color: $color-font, $amount: .8);
            &.current-day {
              background-color: transparentize($second-color-high-contrast, .2);
            }
          }
        }
      }
    }
  }
</style>
