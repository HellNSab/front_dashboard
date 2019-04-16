<template>
  <div id="app">
    <router-view class="content"/>
  </div>
</template>

<style lang="scss">
  @import '@/assets/variables.scss';
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: $color-font;
    background-color: $color-background;
    display: flex;
    position: absolute;
    top: 0; right: 0; bottom: 0; left: 0;
    .content {
      flex: 1;
    }
  }
</style>
