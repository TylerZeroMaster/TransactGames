<template>
  <v-row justify="center">
    <v-dialog 
      :value="value" 
      fullscreen 
      hide-overlay 
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title>Send in your game</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <LoadingIndicator v-if="loading" />
        <span v-else>
          <TheGameShippingInfo :game="game" />
          <v-card-actions>
            <v-btn color="success" @click="addGame">
              Add {{ game.title }} to my inventory
            </v-btn>
          </v-card-actions>
          <v-alert v-if="serverError" type="error" class="ma-8" dismissible>
            {{ serverError }}
          </v-alert>
          <v-alert v-if="success" type="success" class="ma-8">
            The game has been added to your inventory. For more details, see your games list on your account page.
          </v-alert>
        </span>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import TheGameShippingInfo from '@/components/TheGameShippingInfo'
import LoadingIndicator from '@/components/LoadingIndicator'

export default {
  props: ['value', 'game'],
  data() {
    return {
      serverError: null,
      // The value emitted when the dialog closes
      success: false,
      loading: false
    };
  },
  components: {
    LoadingIndicator,
    TheGameShippingInfo
  },
  methods: {
    closeDialog() {
      this.$emit('close', this.success);
      this.$emit('input', false);
      this.success = false;
      this.serverError = false;
    },
    async addGame() {
      let error;
      this.success = false;
      this.serverError = false;
      this.loading = true;
      error = await this.$store.dispatch('addGame', this.game);
      this.loading = false;
      if(error) {
        this.serverError = error;
      } else {
        this.success = true;
      }
    }
  }
}
</script>