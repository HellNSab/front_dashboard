<template>
  <div class="window-container">
    <div class="calendar-window">
      <div class="window-header">
        <div class="window-title">Calendar</div>
        <router-link to="/" class="window-action" tag="div">
          <v-icon name="minus" scale=".8" class="action-icon"/>
        </router-link>
      </div>
      <div class="window-content">
        <vue-scheduler class="scheduler"
          :events="eventList"
          @event-created="createEvent"
          @event-clicked="selectEvent"
          event-display="name"
          :available-views="['month']"
          :event-dialog-config="dialogConfig"/>
      </div>
    </div>
    <div v-if="selectedEvent" class="event-modal">
      <div class="modal-title">Event of the {{ selectedEventDate | '' }}</div>
      <div class="modal-content">
        <div class="modal-subtitle">Enter the new name of your event :</div>
        <div class="modal-input">
          <input type="text" v-model="newEventName" />
        </div>
        <div class="modal-actions">
          <div class="modal-action" @click="unselectEvent">
            <v-icon name="ban" class="modal-action-icon"/>
            <div class="modal-action-name">Cancel</div>
          </div>
          <div class="modal-action" @click="removeEvent">
            <v-icon name="trash" color="red" class="modal-action-icon"/>
            <div class="modal-action-name">Delete event</div>
          </div>
          <div class="modal-action" @click="validateEventNameEdition">
            <v-icon name="check" color="green" class="modal-action-icon"/>
            <div class="modal-action-name">Save changes</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import { mapActions, mapState } from "vuex"
  export default {
    name: 'calendar-view',
    data () {
      return {
        selectedEvent: false,
        selectedEventDate: '',
        newEventName: '',
        dialogConfig: {
          enableTimeInputs: false,
          fields: [
            {
              name: 'name',
              label: 'Event name'
            },
          ]
        }
      }
    },
    created() {
      this.fetchEvents()
    },
    computed: {
      ...mapState({
        eventList: state => state.events.eventList
      })
    },
    methods: {
      ...mapActions("events", [
        "fetchEvents",
        "createEvent",
        "editEvent",
        "deleteEvent"
      ]),
      selectEvent (event) {
        this.selectedEvent = event
        this.selectedEventDate = moment(event.date).format('dddd Do MMMM YYYY')
        this.newEventName = event.name
      },
      unselectEvent () {
        this.selectedEvent = false
        this.selectedEventDate = ''
        this.newEventName = ''
      },
      async removeEvent () {
        await this.deleteEvent(this.selectedEvent._id)
        this.unselectEvent()
      },
      async validateEventNameEdition () {
        await this.editEvent({ event: this.selectedEvent, editedEvent: { name: this.newEventName } })
        this.unselectEvent()
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '@/assets/variables.scss';

  .window-container {
    display: flex;
    position: absolute;
    top: 0; right: 0; bottom: 0; left: 0;
    background-color: #000b;
    padding: 50px 100px;
    overflow: hidden;
    z-index: 10;
    .event-modal {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -100%);
      display: flex;
      flex-direction: column;
      border: solid 1px $color-high-contrast;
      .modal-title {
        user-select: none;
        background-color: $color-low-contrast;
        border-bottom: solid 1px $color-high-contrast;
        padding-top: 8px; padding-bottom: 4px;
        font-weight: 800;
      }
      .modal-content {
        padding: 10px;
        background-color: rgba($color-background, .8);
        .modal-subtitle {
          user-select: none;
          font-style: italic;
          margin: 10px 4em 10px 0;
          padding: 0 40px;
          font-size: .9em;
        }
        .modal-input {
          padding: 0 40px;
          input {
            background-color: $color-low-contrast;
            border: solid 1px transparent;
            width: 100%;
            padding: 5px;
            color: $color-font;
            font-size: 1em;
            &:focus {
              border-color: $color-high-contrast;
            }
          }
        }
        .modal-actions {
          display: flex;
          margin: 30px 10px 7px 10px;
          justify-content: space-between;
          .modal-action {
            user-select: none;
            cursor: pointer;
            display: flex;
            background-color: $color-soft-background;
            padding: 5px 20px;
            transition: all .25s ease-in;
            &:not(:last-child) {
              margin-right: 10px;
            }
            &:not(:first-child) {
              margin-left: 10px;
            }
            .modal-action-icon {
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
    }
    .calendar-window {
      flex: 1;
      display: flex;
      justify-content: stretch;
      flex-direction: column;
      border: solid 1px $second-color-high-contrast;
      overflow: hidden;
      .window-header {
        display: flex;
        background-color: $color-low-contrast;
        border-bottom: solid 1px rgba($second-color-high-contrast, .4);
        padding-top: 8px; padding-bottom: 4px;
        .window-action {
          padding-right: 15px;
          padding-bottom: 4px;
          cursor: pointer;
        }
        .window-title {
          flex: 1;
          user-select: none;
          font-weight: 800;
        }
      }
      .window-content {
        flex: 1;
        background-color: $color-contrast;
        overflow-y: auto;
        .scheduler {
          flex: 1;
          margin: 20px;
        }
      }
    }
  }
</style>