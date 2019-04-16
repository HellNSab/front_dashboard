<template>
  <div class="lists-container">
    <div class="header">
      <div class="list-names" @click.prevent.stop="displayListSelector = !displayListSelector">
        <div class="list-current-name">{{currentList.name}}</div>
        <v-icon v-if="allLists.length > 1" :name="displayListSelector ? 'chevron-up' : 'chevron-down'" class="list-selector-icon"/>
        <div class="list-selector" v-if="displayListSelector">
          <div class="list-name" v-for="list in allLists.filter(list => list._id !== currentList._id)" :key="list._id" @click.prevent.stop="selectList(list)">- {{list.name}}</div>
        </div>
      </div>
      <div class="list-menu">
        <v-icon name="ellipsis-v" class="list-menu-icon" @click.native.prevent.stop="displayMenu = !displayMenu"/>
        <div class="menu-content" v-if="displayMenu">
          <div class="menu-item" @click.prevent.stop="$emit('edit-list-name'); displayMenu = false">Edit list name</div>
          <div class="menu-item" @click.prevent.stop="remove">Delete list</div>
        </div>
      </div>
    </div>
    <ul class="list-content">
      <li v-for="(item, index) in currentList.items || []" :key="index">
        <div v-if="index !== editedIndex" class="list-item">
          <div class="item-text">
            {{item}}
          </div>
          <div class="action-list">
            <v-icon class="action-item" name="pen" @click.native.prevent.stop="setEditMode(index)"/>
            <v-icon class="action-item" name="trash" @click.native.prevent.stop="deleteItem(index)"/>
          </div>
        </div>
        <div v-else class="list-item">
          <input type="text" v-model="inputText" placeholder="new list item" class="item-input" :autofocus="true" @keyup.enter.prevent.stop="validateEditItem(index)">
          <div class="action-list">
            <v-icon class="action-item" name="check" color="green" @click.native.prevent.stop="validateEditItem(index)"/>
            <v-icon class="action-item" name="ban" color="red" @click.native.prevent.stop="setEditMode()"/>
          </div>
        </div>
      </li>
      <div>
        <div v-if="!creatingItem && !editedIndex" class="list-item" @click.prevent.stop="creatingItem = true">
          <div class="new-item-text">
            Add new item
          </div>
        </div>
        <div v-else-if="creatingItem" class="list-item">
          <input type="text" v-model="inputText" placeholder="new list item" class="item-input" :autofocus="true" @keyup.enter.prevent.stop="validateCreateItem">
          <div class="action-list">
            <v-icon class="action-item" name="check" color="green" @click.native.prevent.stop="validateCreateItem"/>
            <v-icon class="action-item" name="ban" color="red" @click.native.prevent.stop="creatingItem = false"/>
          </div>
        </div>
      </div>
    </ul>
  </div>
</template>

<script>
  import { mapActions, mapState } from "vuex";

  export default {
    name: "lists",
    data () {
      return {
        displayListSelector: false,
        displayMenu: false,
        creatingItem: false,
        editedIndex: null,
        inputText: ''
      }
    },
    created() {
      this.fetchLists()
    },
    computed: {
      ...mapState({
        allLists: state => state.lists.allLists,
        currentList: state => state.lists.currentList
      })
    },
    methods: {
      ...mapActions("lists", [
        "fetchLists",
        "updateList",
        "changeCurrentList",
        "deleteList"
      ]),
      setEditMode(index) {
        this.editedIndex = index
        if (index) this.inputText = this.currentList.items[index]
      },
      async validateCreateItem() {
        if (!this.inputText) return
        const newListItems = [ ...(this.currentList.items || []), this.inputText ]
        await this.updateList({ ...this.currentList, items: newListItems })
        this.inputText = ''
        this.creatingItem = false
      },
      async validateEditItem(editedIndex) {
        const newListItems = (this.currentList.items || []).map((item, index) => {
          if (editedIndex !== index) return item
          return this.inputText
        })
        await this.updateList({ ...this.currentList, items: newListItems })
        this.inputText = ''
        this.editedIndex = null
      },
      async deleteItem(indexToDelete) {
        const newListItems = (this.currentList.items || []).filter((item, index) => index !== indexToDelete)
        await this.updateList({ ...this.currentList, items: newListItems })
      },
      selectList (list) {
        this.changeCurrentList(list)
        this.displayListSelector = false
      },
      async remove () {
        await this.deleteList(this.currentList)
        this.displayMenu = false
      }
    }
  };
</script>

<style scoped lang="scss">
  @import "@/assets/variables.scss";

  .lists-container {
    flex: 1;
    .header {
      display: flex;
      justify-content: space-between;
      padding: 5px 0;
      margin: 0 5px;
      border-bottom: 1px solid $color-font;
      align-items: center;
      position: relative;
      .list-names {
        flex: 1;
        display: flex;
        margin-top: 10px;
        .list-current-name {
          user-select: none;
          margin-left: 5px;
          user-select: none;
          font-weight: 700;
        }
        .list-selector-icon {
          margin-left: 10px;
          margin-top: 1px;
          cursor: pointer;
        }
        .list-selector {
          position: absolute;
          top: 100%;
          padding: 5px 0;
          background-color: $color-soft-background;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          .list-name {
            flex: 1;
            cursor: pointer;
            user-select: none;
            padding: 5px 2em 5px 10px;
            &:hover {
              text-decoration: underline;
            }
          }
        }
      }
      .list-menu {
        cursor: pointer;
        padding: 0 5px;
        .menu-content {
          position: absolute;
          top: 100%;
          right: 0;
          background-color: $color-contrast;
          border: solid 1px $color-font;
          display: flex;
          flex-direction: column;
          z-index: 10;
          .menu-item {
            flex: 1;
            cursor: pointer;
            user-select: none;
            padding: 8px 10px;
            &:not(:last-child) {
              border-bottom: solid 1px $color-font;
            }
            &:hover {
              background-color: $color-high-contrast;
            }
          }
        }
      }
    }
    .list-content {
      display: flex;
      flex-direction: column;
      margin: 10px 0;
      align-items: stretch;
      list-style-position: outside;
      .list-item {
        flex: 1;
        display: flex;
        flex-direction: row;
        cursor: pointer;
        transition: all 0.15s ease-in;
        padding: 5px;
        flex: 1;
        .item-text,
        .item-input {
          text-align: left;
          word-wrap: wrap;
          font-style: italic;
          font-weight: 300;
          margin: auto auto auto 0;
        }
        .item-input {
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
        .new-item-text {
          font-size: .9em;
          font-style: italic;
          font-weight: 300;
          cursor: pointer;
          user-select: none;
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
</style>
