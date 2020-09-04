<template>
  <v-container id="parent">
    <v-row
      class="fill-height"
      align-content="center"
      justify="center"
    >
      <v-col
        class="text-center"
        cols="12"
      >
        <span :class="['headline', error ? 'red--text' : '']">
          {{ error ? error : 'Loading...' }}
        </span>
      </v-col>
      <v-col cols="6" v-if="!error">
        <v-progress-linear
          color="teal"
          indeterminate
          rounded
          height="6"
        ></v-progress-linear>
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped>
  #parent {
    height: 100%;
  }
</style>
<script>
export default {
  props: ['error']
}
</script>