<template>
  <div class="editor">
    <editor-menu-bar :editor="editor">
      <div class="menubar" slot-scope="{ commands, isActive }">
        <button class="button" :class="{ 'is-active': isActive.bold() }" @click="commands.bold">
          <v-icon name="bold"/>
        </button>
        <button class="button" :class="{ 'is-active': isActive.italic() }" @click="commands.italic">
          <v-icon name="italic"/>
        </button>
        <button class="button" :class="{ 'is-active': isActive.strike() }" @click="commands.strike">
          <v-icon name="strikethrough"/>
        </button>
        <button class="button" :class="{ 'is-active': isActive.underline() }" @click="commands.underline">
          <v-icon name="underline"/>
        </button>
        <button class="button" :class="{ 'is-active': isActive.bullet_list() }" @click="commands.bullet_list">
          <v-icon name="list-ul"/>
        </button>
        <button class="button" :class="{ 'is-active': isActive.ordered_list() }" @click="commands.ordered_list">
          <v-icon name="list-ol"/>
        </button>
      </div>
    </editor-menu-bar>
    <editor-content class="content" :editor="editor" onUpdate/>
  </div>
</template>

<script>
  import { mapActions, mapState } from "vuex"
  import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
  import {
    ListItem,
    OrderedList,
    BulletList,
    Bold,
    Italic,
    Strike,
    Underline,
  } from 'tiptap-extensions'

  export default {
    name: 'notes',
    components: {
      EditorContent,
      EditorMenuBar,
    },
    data() {
      return {
        editor: null
      }
    },
    async mounted() {
      await this.fetchHtmlNotes()
      this.editor = new Editor({ content: this.htmlNotes, extensions: [
        new Bold(),
        new Italic(),
        new Strike(),
        new Underline(),
        new ListItem(),
        new BulletList(),
        new OrderedList(),
      ],
      onUpdate: ({ getHTML }) => {
        const notes = getHTML()
        this.updateHtmlNotes(notes)
      } })
    },
    beforeDestroy() {
      this.editor.destroy()
    },
    computed: {
      ...mapState({
        htmlNotes: state => state.notes.htmlNotes
      })
    },
    methods: {
      ...mapActions("notes", [
        'fetchHtmlNotes',
        'updateHtmlNotes'
      ])
    }
  }
</script>

<style scoped lang="scss">
  @import "@/assets/variables.scss";

  .editor {
    display:flex;
    flex: 1;
    flex-direction: column;
    margin: 10px 10px;
    overflow: hidden;
    .menubar {
      margin-right: auto;
      .button {
        cursor: pointer;
        color: $color-font-soft;
        background-color: transparent;
        border: none;
        height: 1.2em; 
        width: 2em;
        &.is-active {
          color: $color-font;
        }
        &:hover {
          color: $color-font;
        }
      }
    }
    .content {
      overflow: auto;
      margin: 10px 0 auto 0;
      background-color: rgba($color-high-contrast, .4);
      padding: 2px 5px;
    }
  }
</style>
