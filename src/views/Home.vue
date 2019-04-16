<template>
  <div class="container">
    <dash-board class="main"/>
    <tab-bar class="side-bar"/>
    <router-view></router-view>
  </div>
</template>

<script>
  import DashBoard from '@/components/DashBoard'
  import TabBar from '@/components/TabBar'
  export default {
    name: 'home',
    components: {
      DashBoard,
      TabBar
    }
  }
</script>

<style scoped lang="scss">
  .container {
    display: flex;
    .main {
      flex: 1;
    }
  }
</style>