<template>
  <div class="day-container">
    <div class="day-title">{{dayTitle}}</div>
    <div class="list-container">
      <div v-for="todo in todoList" :key="todo._id">
        <div v-if="todo._id !== editedTodoId" class="todo-item" @click="editDayTodoStatus({ updatedTodo: todo, date: day.date })">
          <div class="todo" :class="{'done-todo': todo.done}">
            <span class="bullet-point">
              <v-icon scale=".3" name="circle"/>
            </span>
            {{todo.text}}
          </div>
          <div class="action-list">
            <v-icon v-if="!todo.done" class="action-item" name="pen" @click.native.prevent.stop="setEditMode(todo._id)"/>
            <v-icon class="action-item" name="trash" @click.native.prevent.stop="deleteDayTodo({ deletedTodoId: todo._id, date: day.date })"/>
          </div>
        </div>
        <div v-else class="todo-item">
          <span class="bullet-point">
            <v-icon scale=".3" name="circle"/>
          </span>
          <input type="text" v-model="inputText" placeholder="todo text" class="todo-input" :autofocus="true" @keyup.enter.prevent.stop="validateEditTodo(todo)">
          <div class="action-list">
            <v-icon class="action-item" name="check" color="green" @click.native.prevent.stop="validateEditTodo(todo)"/>
            <v-icon class="action-item" name="ban" color="red" @click.native.prevent.stop="setEditMode('')"/>
          </div>
        </div>
      </div>
      <div>
        <div v-if="!creatingTodo && !editedTodoId" class="todo-item" @click.prevent.stop="creatingTodo = true">
          <div class="new-todo-text">
            Add new todo
          </div>
        </div>
        <div v-else-if="creatingTodo" class="todo-item">
          <input type="text" v-model="inputText" placeholder="new todo item" class="todo-input" :autofocus="true" @keyup.enter.prevent.stop="validateCreateTodo">
          <div class="action-list">
            <v-icon class="action-item" name="check" color="green" @click.native.prevent.stop="validateCreateTodo"/>
            <v-icon class="action-item" name="ban" color="red" @click.native.prevent.stop="creatingTodo = false"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
  import { mapActions } from "vuex"
  export default {
    name: "day-todo-list",
    props: ['day'],
    data() {
      return {
        editedTodoId: "",
        creatingTodo: "",
        inputText: ""
      }
    },
    computed: {
      todoList: function () {
        return this.day.todos || []
      },
      dayTitle: function () {
        return moment(this.day.date).format('dddd Do MMM YYYY')
      }
    },
    methods: {
      ...mapActions("weekly", [
        "createDayTodo",
        "editDayTodo",
        "editDayTodoStatus",
        "deleteDayTodo"
      ]),
      setEditMode(todoId) {
        this.editedTodoId = todoId
        this.inputText = this.todoList.find(todo => todo._id === todoId).text
      },
      validateEditTodo(todo) {
        this.editDayTodo({ updatedTodo: { ...todo, text: this.inputText }, date: this.day.date })
        this.inputText = ''
        this.editedTodoId = ''
      },
      validateCreateTodo() {
        this.createDayTodo({ newTodoText: this.inputText, date: this.day.date, todoIndex: this.todoList.length })
        this.inputText = ''
        this.creatingTodo = false
      }
    }
  }
</script>

<style scoped lang="scss">
@import "@/assets/variables.scss";

.day-container {
  display: flex;
  flex-direction: column;
  overflow: auto;
  .day-title {
    text-align: left;
    padding: 5px 10px;
    font-size: 1.4em;
    text-decoration: underline;
    font-style: italic;
    font-weight: 700;
    user-select: none;
  }
  .list-container {
    display: flex;
    flex-direction: column;
    flex: 1;
    margin: 10px;
    overflow-y: auto;
    .todo-item {
      flex: 1;
      display: flex;
      cursor: pointer;
      transition: all 0.15s ease-in;
      padding: 5px;
      justify-content: flex-start;
      text-align: left;
      .new-todo-text {
        font-size: .9em;
        font-style: italic;
        font-weight: 300;
        cursor: pointer;
        user-select: none;
        &:hover {
          text-decoration: underline;
        }
      }
      .bullet-point {
        margin-right: 5px;
      }
      .todo,
      .todo-input {
        font-style: italic;
        font-weight: 300;
        margin: auto auto auto 0;
        &.done-todo {
          text-decoration: line-through;
        }
      }
      .todo-input {
        background-color: transparent;
        border: none;
        border-bottom: solid 1px $color-font;
        color: $color-font;
        padding-bottom: 4px;
        font-size: 1em;
      }
      .action-list {
        margin: auto 0;
        padding: 0 5px;
        display: flex;
        opacity: 0;
        transition: all 0.25s ease-in;
        .action-item {
          height: 0.9em;
          &:not(:last-child) {
            margin-right: 10px;
          }
        }
      }
      &:hover {
        background-color: lighten($color-low-contrast, 7%);
        .action-list {
          opacity: 1;
        }
      }
    }
  }
}
</style>
