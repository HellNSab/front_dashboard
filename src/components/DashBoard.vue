<template>
  <div class="full-container">
    <div v-if="displayModal" class="modal">
      <div v-if="creatingNewList" class="small-modal">
        <div class="modal-title">Add new list</div>
        <div class="modal-content">
          <div class="modal-subtitle">Enter the name of your new list below :</div>
          <div class="modal-input">
            <input type="text" v-model="newListName">
          </div>
          <div class="modal-actions">
            <div class="modal-action" @click="cancelListCreation">
              <v-icon name="ban" color="red" class="modal-action-icon"/>
              <div class="modal-action-name">Cancel</div>
            </div>
            <div class="modal-action" :class="{ disabled: !newListName }" @click="validateNewList">
              <v-icon name="check" color="green" class="modal-action-icon"/>
              <div class="modal-action-name">Create</div>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="displayEditListNameModal" class="small-modal">
        <div class="modal-title">Edit list name</div>
        <div class="modal-content">
          <div class="modal-subtitle">Enter the new name of your list :</div>
          <div class="modal-input">
            <input type="text" v-model="newListName">
          </div>
          <div class="modal-actions">
            <div class="modal-action" @click="cancelListEdition">
              <v-icon name="ban" color="red" class="modal-action-icon"/>
              <div class="modal-action-name">Cancel</div>
            </div>
            <div class="modal-action" :class="{ disabled: !newListName }" @click="validateListNameEdition">
              <v-icon name="check" color="green" class="modal-action-icon"/>
              <div class="modal-action-name">Create</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="tile-list">
      <tile class="calendar" expanded_path="/calendar">
        <calendar />
      </tile>
      <tile class="weekly-todo" title="Weekly Todo" action_icon="plus" action_name="Add a todo" @tile-action-triggered="addWeeklyTodo">
        <todo-list />
      </tile>
      <tile class="weekly-spread">
        <weekly-spread />
      </tile>
      <tile class="notes" title="Notes">
        <notes />
      </tile>
      <tile class="lists" action_icon="plus" action_name="Add new list" @tile-action-triggered="addNewList">
        <lists @edit-list-name="displayEditListNameModal = true; displayModal = true"/>
      </tile>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import Tile from '@/components/tiles/Tile'
  import TodoList from '@/components/tiles/TodoList'
  import Notes from '@/components/tiles/Notes'
  import Lists from '@/components/tiles/Lists'
  import Calendar from '@/components/tiles/Calendar'
  import WeeklySpread from '@/components/tiles/WeeklySpread'
  export default {
    name: 'dash-board',
    components: {
      Tile,
      TodoList,
      Notes,
      Lists,
      Calendar,
      WeeklySpread
    },
    data() {
      return {
        displayModal: false,
        creatingNewList: false,
        displayEditListNameModal: false,
        newListName: ''
      }
    },
    methods: {
      ...mapActions('todos', [
        'createTodo'
      ]),
      ...mapActions('lists', [
        'createList',
        'updateListName'
      ]),
      addWeeklyTodo () {
        this.createTodo()
      },
      addNewList () {
        this.displayModal = true
        this.creatingNewList = true
      },
      async validateNewList () {
        if (!this.newListName) return
        await this.createList(this.newListName)
        this.displayModal = false
        this.creatingNewList = false
        this.newListName = ''
      },
      cancelListCreation () {
        this.displayModal = false
        this.creatingNewList = false
        this.newListName = ''
      },
      async validateListNameEdition () {
        if (!this.newListName) return
        await this.updateListName(this.newListName)
        this.displayModal = false
        this.displayEditListNameModal = false
        this.newListName = ''
      },
      cancelListEdition () {
        this.displayModal = false
        this.displayEditListNameModal = false
        this.newListName = ''
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '@/assets/variables.scss';

  .full-container {
    display: flex;
    position: relative;
    .modal {
      z-index: 10;
      position: absolute;
      top: 0; right: 0; bottom: 0; left: 0;
      background-color: rgba(black, .5);
      .small-modal {
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
          background-color: rgba($color-background, .7);
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
              border-color: $color-high-contrast;
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
    }
    .tile-list {
      flex: 1;
      padding: 10px;
      display: grid;
      grid-template-columns: 2fr 4fr 4fr;
      grid-template-rows: 3fr 3fr 4fr;
      grid-template-areas:
        "calendar weekly-spread weekly-spread"
        "weekly-todo weekly-spread weekly-spread"
        "weekly-todo notes lists";
      grid-gap: 10px;
      .calendar {
        grid-area: calendar;
      }
      .weekly-todo {
        grid-area: weekly-todo;
      }
      .weekly-spread {
        grid-area: weekly-spread;
      }
      .notes {
        grid-area: notes;
      }
      .lists {
        grid-area: lists;
      }
    }
  }
</style>
