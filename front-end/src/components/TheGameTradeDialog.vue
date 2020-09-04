<template>
  <v-row justify="center">
    <v-dialog
      :value="value"
      max-width="800"
      persistent
    >
      <v-card>
        <v-card-title 
          :class="$vuetify.breakpoint.name === 'xs' ? '' : 'headline'"
        >
          Are you sure you want to trade?
        </v-card-title>

        <v-card-text>
          <TradeSummary 
            :gameTraded="p1.game" 
            :gameRequested="p2.game" 
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <span v-if="!tradeComplete">
            <v-btn
              color="error darken-1"
              text
              @click="closeDialog"
            >
              Cancel
            </v-btn>

            <v-btn
              color="success darken-1"
              text
              @click="trade"
            >
              Trade Now!
            </v-btn>
          </span>
          <span v-else>
            <v-btn
              color="success"
              @click="closeDialog"
            >
              Close
            </v-btn>
            
          </span>
          <v-snackbar 
            :color="error ? 'error' : 'success'" 
            class="ma-8"
            v-model="snackbar"
            dismissable
          >
            {{ response }}
            <v-btn
              text
              @click="snackbar = false"
            >
              Close
            </v-btn>
          </v-snackbar>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import TradeSummary from '@/components/TradeSummary'

export default {
  props: ['value', 'p1', 'p2'],
  data() {
    return {
      // If the snackbar should display
      snackbar: false,
      // Determines the color of the snackbar
      error: false,
      // The message displayed in the snackbar
      response: null,
      // The value emitted when the dialog closes
      tradeComplete: false
    };
  },
  components: {
    TradeSummary
  },
  methods: {
    // Close the dialog and reset all its data properties
    closeDialog() {
      this.$emit('close', this.tradeComplete);
      // $emit('input') is to reinforce the v-model property
      this.$emit('input', false);
      this.error = false;
      this.response = null;
    },
    async trade() {
      const error = await this.$store.dispatch(
        'trade', 
        // p1 and p2 are short for participant 1 and 2
        { p1: this.p1, p2: this.p2 }
      );
      if(error) {
        this.response = error;
        this.error = true;
      } else {
        this.error = false;
        this.tradeComplete = true;
        this.response = 'Thank you for trading with Transact Games!';
      }
      this.snackbar = true;
    }
  }
}
</script>