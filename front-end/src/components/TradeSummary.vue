<template>
  <!-- This component displays the image of the game traded away, an arrow 
  indicating the direction of the trade, then the image of the game to be 
  traded for -->
  <v-container>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="4" align="center">
        <v-img max-width="200" :src="gameTraded.image"></v-img>
        <v-card-subtitle class="title">
          {{ gameTraded.title }}
        </v-card-subtitle>
      </v-col>
      <v-col cols="12" sm="4" align="center" justify="center">
        <v-icon size="50">
          {{ 
            $vuetify.breakpoint.name === 'xs'
              ? 'mdi-arrow-down-thick'
              : 'mdi-arrow-right-thick' 
          }}
        </v-icon>
      </v-col>
      <v-col cols="12" sm="4" align="center">
        <v-img max-width="200" :src="gameRequested.image"></v-img>
        <v-card-subtitle class="title">
          {{ gameRequested.title }}
        </v-card-subtitle>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  props: ['gameTraded', 'gameRequested']
}
</script>