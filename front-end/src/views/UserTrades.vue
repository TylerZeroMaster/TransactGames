<template>
  <LoadingIndicator 
    v-if="loading" 
    :error="serverError" 
  />
  <v-container v-else>
    <v-row justify="center">
      <h1 class="ma-4">Active Trade Requests</h1>
    </v-row>
    <v-divider></v-divider>
    <span
      v-for="game of trades"
      :key="game._id"
    >
      <v-row justify="center">
        <v-col cols="12" lg="4">
          <TradeSummary
            :gameTraded="game"
            :gameRequested="game.tradeRequest"
          />
        </v-col>
        <v-col cols="12" lg="4">
          <v-row
            class="fill-height"
            align-content="center"
            justify="center"
          >
            <v-btn 
              color="error darken-1"
              @click="() => { removeTradeRequest(game._id) }"
            >
              Cancel Request
            </v-btn>
          </v-row>
        </v-col>
      </v-row>
      <v-divider></v-divider>
    </span>
  </v-container>
</template>
<script>

import TradeSummary from '@/components/TradeSummary'
import LoadingIndicator from '@/components/LoadingIndicator'

export default {
  data() {
    return {
      loading: true,
      serverError: null,
      trades: []
    }
  },
  components: {
    TradeSummary,
    LoadingIndicator
  },
  methods: {
    getTrades() {
      return this.$store.state.user.games.filter(g => g.tradeRequest);
    },
    async removeTradeRequest(gid) {
      let error;
      this.loading = true;
      error = await this.$store.dispatch(
        'removeTradeRequest',
        gid
      );
      if(error) {
        this.serverError = error;
      } else {
        this.trades = this.getTrades();
        this.loading = false;
      }
    }
  },
  async created() {
    // Update the user's games before display trades. This is imporant for
    // supporting synchronous web activity in the absence of websockets
    let error;
    error = await this.$store.dispatch('updateUserGames');
    if(error) {
      this.serverError = error;
    } else {
      this.trades = this.getTrades();
      this.loading = false;
    }
  }
}
</script>