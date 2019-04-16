<template>
  <div class="container">
    <div class="creation-container" v-if="isCreatingWeeklyMode || !weeklyDays.length">
      <div class="creation-message">Select the days of your next weekly spread</div>
      <v-date-picker
        :columns="$screens({ default: 1, lg: 2 })"
        is-dark mode='range'
        :tint-color='red'
        v-model='newWeeklyRange'
        is-inline :min-date='weeklyEndDate'
        @input="updateNewWeekRange"/>
      <div class="actions">
        <div class="action" v-if="weeklyDays.length" @click="isCreatingWeeklyMode = false">
          <v-icon name="ban" color="red" class="action-icon"/>
          <div class="action-name">Cancel</div>
        </div>
        <div class="action" @click="validateNewWeeklyRange">
          <v-icon name="check" color="green" class="action-icon"/>
          <div class="action-name">Create weekly spread</div>
        </div>
      </div>
    </div>
    <div class="content" v-else>
      <div v-if="previousWeeklyId" class="page-navigation previous">
        <div class="navigation-button previous" @click="navigateToPreviousWeek">
          <v-icon name="angle-left" class="navigation-icon" scale="2" />
        </div>
      </div>
      <div class="spread-container">
        <div v-for="day in weeklyDays" :key="day.title" class="day-tile-container">
          <day-todo-list :day="day" class="day-tile"  :class="{'is-current-day': getIsCurrentDay(day)}"/>
        </div>
      </div>
      <div class="page-navigation next">
        <div class="navigation-button next" @click="nextWeeklyId ? navigateToNextWeek() : isCreatingWeeklyMode = true">
          <v-icon :name="nextWeeklyId ? 'angle-right' : 'plus'" class="navigation-icon" scale="2"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapState } from "vuex"
  import moment from 'moment'
  import DayTodoList from '@/components/tiles/spread/DayTodoList'
  export default {
    name: "weekly-spread",
    components: {
      DayTodoList,
    },
    data () {
      return {
        currentDayOfWeek: moment().format('dddd Do MMM YYYY'),
        isCreatingWeeklyMode: false,
        newWeeklyRange: {
          start: null,
          end: null
        }
      }
    },
    created() {
      this.fetchCurrentWeeklySpread()
    },
    computed: {
      ...mapState({
        weeklyDays: state => state.weekly.days,
        previousWeeklyId: state => state.weekly.previousWeeklyId,
        nextWeeklyId: state => state.weekly.nextWeeklyId,
        weeklyEndDate: state => new Date(state.weekly.weeklyEndDate),
      })
    },
    methods: {
      ...mapActions("weekly", [
        "fetchCurrentWeeklySpread",
        "navigateToPreviousWeek",
        "navigateToNextWeek",
        "createNewWeekly",
      ]),
      updateNewWeekRange (weeklyRange) {
        this.newWeeklyRange = weeklyRange
      },
      async validateNewWeeklyRange () {
        if (moment(this.newWeeklyRange.end).isBefore(moment(this.newWeeklyRange.start))) {
          await this.createNewWeekly({ start: this.newWeeklyRange.end, end: this.newWeeklyRange.start})
        } else {
          await this.createNewWeekly(this.newWeeklyRange)
        }
        this.isCreatingWeeklyMode = false
      },
      getIsCurrentDay (day) {
        if (moment(day.date).format('dddd Do MMM YYYY') === this.currentDayOfWeek) return true
        return false
      }
    },
  }
</script>

<style scoped lang="scss">
  @import "@/assets/variables.scss";
  
  .container {
    display: flex;
    flex: 1;
    .creation-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      flex: 1;
      .creation-message {
        font-size: 1.3em;
        font-weight: 900;
        margin-bottom: 20px;
      }
      .actions {
          display: flex;
          margin: 30px 10px 7px 10px;
          justify-content: space-between;
          .action {
            user-select: none;
            cursor: pointer;
            display: flex;
            background-color: $color-soft-background;
            padding: 10px 20px;
            transition: all .25s ease-in;
            &:not(:last-child) {
              margin-right: 10px;
            }
            &:not(:first-child) {
              margin-left: 10px;
            }
            .action-name {
              font-weight: 800;
            }
            .action-icon {
              margin: auto 10px auto 0;
            }
            &:not(.disabled):hover {
              background-color: $color-soft-background-hover;
            }
            &.disabled {
              opacity: .5;
              cursor: default;
            }
          }
        }
    }
    .content {
      display: flex;
      position: relative;
      .page-navigation {
        position: absolute;
        top: 0; bottom: 0;
        flex: 1;
        display: flex;
        z-index: 1;
        &.previous {
          left: 0;
        }
        &.next {
          right: 0;
        }
        .navigation-button {
          cursor: pointer;
          transition: all .25s ease-in;
          background-color: transparentize($color: $color-font, $amount: .5);
          padding: 15px 10px 12px;
          margin: auto 0;
          opacity: .2;
          &.previous {
            margin-right: 10px;
            border-top-right-radius: 3px;
            border-bottom-right-radius: 3px;
          }
          &.next {
            margin-left: 10px;
            border-top-left-radius: 3px;
            border-bottom-left-radius: 3px;
          }
        }
        &:hover {
          .navigation-button {
            opacity: 1;
          }
        }
      }
      .spread-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        padding: 10px 20px 20px 20px;
        overflow-y: auto;
        .day-tile-container {
          .day-tile {
            overflow: hidden;
            width: 300px;
            height: 260px;
            margin: 5px 10px;
            background-color: rgba($color-high-contrast, .5);
            &.is-current-day {
              background-color: rgba($color-high-contrast, 1);
            }
          }
        }
      }
    }
  }
</style>
