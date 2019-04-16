<template>
  <div class="tile-container">
    <router-link v-if="expanded_path" :to="expanded_path" class="expand-button" tag="div">
      <v-icon name="plus" class="action-icon" scale=".8" />
    </router-link>
    <div v-if="title" class="tile-title">{{title}}</div>
    <div class="tile-content">
      <slot />
    </div>
    <div v-if="action_icon" class="action-button" @click="triggerTileAction">
      <v-icon name="plus" class="action-icon"/>
      <div class="action-name">{{action_name}}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'tile',
    props: {
      'title': String,
      'action_name': String,
      'action_icon': String,
      'expanded_path': String,
    },
    methods: {
      triggerTileAction () {
        this.$emit('tile-action-triggered')
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '@/assets/variables.scss';
  
  .tile-container {
    border: solid 1px $color-high-contrast;
    background-image: linear-gradient($color-contrast, $color-low-contrast);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
    .expand-button {
      position: absolute;
      top: 7px; right: 10px;
      cursor: pointer;
    }
    .tile-title {
      padding-top: 10px;
      padding-bottom: 5px;
      font-weight: 700;
      font-size: 1.2em;
      border-bottom: solid 1px currentColor;
      margin: 0 10px;
      user-select: none;
    }
    .tile-content {
      display: flex;
      flex: 1;
      overflow: hidden;
    }
    .action-button {
      transition: all .25s ease-in;
      cursor: pointer;
      box-shadow: 0 1px 1px 3px $color-high-contrast;
      background-color: rgba($color-contrast, .6);
      margin-top: auto;
      display: flex;
      padding: 10px;
      justify-content: center;
      &:hover {
        background-color: rgba($color-contrast, 1);
      }
      .action-name {
        font-weight: 600;
        margin-left: 5px;
        user-select: none;
      }
      .action-icon {
        margin: auto 0;
        height: .8em;
      }
    }
  }
</style>
