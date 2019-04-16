<template>
  <div class="list-container">
    <div v-for="todo in todoList" :key="todo._id">
      <div v-if="todo._id !== editedTodoId" class="todo-item" @click="editTodoStatus(todo)">
        <div class="todo" :class="{'done-todo': todo.done}">
          <span class="bullet-point">
            <v-icon scale=".3" name="circle"/>
          </span>
          {{todo.text}}
        </div>
        <div class="action-list">
          <v-icon v-if="!todo.done" class="action-item" name="pen" @click.native.prevent.stop="setEditMode(todo._id)"/>
          <v-icon class="action-item" name="trash" @click.native.prevent.stop="deleteTodo(todo._id)"/>
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
  </div>
</template>

<script>
  import { mapActions, mapState } from "vuex"
  export default {
    name: "todo-list",
    data() {
      return {
        editedTodoId: "",
        inputText: ""
      }
    },
    created() {
      this.fetchTodos()
    },
    computed: {
      ...mapState({
        todoList: state => state.todos.todoList
      })
    },
    watch: {
      todoList: function(newList) {
        if (!newList[newList.length - 1].text)
          this.editedTodoId = newList[newList.length - 1]._id
      }
    },
    methods: {
      ...mapActions("todos", [
        "fetchTodos",
        "editTodo",
        "editTodoStatus",
        "deleteTodo"
      ]),
      setEditMode(todoId) {
        this.editedTodoId = todoId;
        this.inputText = this.todoList.find(todo => todo._id === todoId).text
      },
      validateEditTodo(todo) {
        this.editTodo({ todo, todoText: this.inputText })
        this.inputText = ''
        this.editedTodoId = ''
      }
    }
  }
</script>

<style scoped lang="scss">
@import "@/assets/variables.scss";

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
    .bullet-point {
      margin-right: 5px;
    }
    .todo,
    .todo-input {
      font-style: italic;
      font-weight: 300;
      margin: auto auto auto 0;
      text-align: left;
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
</style>
