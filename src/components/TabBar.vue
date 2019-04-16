<template>
  <div class="bar-container">
    <div class="tab-list">
      <div class="tab-item">TD</div>
      <div class="tab-item">CAL</div>
      <div class="tab-item">WTD</div>
      <div class="tab-item">SUP</div>
    </div>
    <div class="action-list">
      <div class="action-item">SET</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'tab-bar'
  }
</script>

<style scoped lang="scss">
  @import '@/assets/variables.scss';

  .bar-container {
    display: flex;
    flex-direction: column;
    padding: 10px;
    background-color: $color-soft-background;
    .tab-list {
      display: flex;
      flex-direction: column;
      margin-bottom: auto;
      .tab-item {
        margin: 10px;
      }
    }
    .action-list {
      display: flex;
      flex-direction: column;
      .action-item {
        margin: 10px;
      }
    }
  }
</style>
