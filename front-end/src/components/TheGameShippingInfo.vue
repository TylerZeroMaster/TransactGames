<template>
  <v-card elevation="0">
    <v-card-title>
      Please follow the directons below to ship your game to our processing center.
    </v-card-title>
    <v-card-text>
      This is a placeholder. In the full implementation, this component would display a shipping label that the user could print and use to send their game to the processing center.
    </v-card-text>
    <v-card-subtitle>
      Your game will appear in your inventory immediately, but it will not be tradable until it has been processed.
    </v-card-subtitle>
  </v-card>
</template>
<script>
export default {
  props: ['game']
}
</script>