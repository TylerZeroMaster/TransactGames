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
          <v-toolbar-title>Get your game back</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <LoadingIndicator v-if="loading" />
        <span v-else>
          <v-card-title>
            Are you sure you want your game shipped back to you?
          </v-card-title>
          <v-card-actions>
            <v-btn color="success" @click="removeGame">
              Yes
            </v-btn>
            <v-btn color="error" @click="closeDialog">
              No
            </v-btn>
          </v-card-actions>
          <v-alert 
            v-if="response" 
            :type="success ? 'success' : 'error'" 
            class="ma-8" 
            dismissible
          >
            {{ response }}
          </v-alert>
        </span>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import LoadingIndicator from '@/components/LoadingIndicator'

export default {
  props: ['value', 'game'],
  data() {
    return {
      response: null,
      success: false,
      loading: false
    };
  },
  components: {
    LoadingIndicator,
  },
  methods: {
    closeDialog() {
      this.$emit('close', this.success);
      this.$emit('input', false);
      this.success = false;
      this.serverError = null;
    },
    async removeGame() {
      let error;
      this.success = false;
      this.serverError = null;
      this.loading = true;
      error = await this.$store.dispatch('removeGame', this.game._id);
      this.loading = false;
      if(error) {
        this.response = error;
      } else {
        this.response = 'Your game will be shipped back to you as soon as possible.';
        this.success = true;
      }
    }
  }
}
</script>