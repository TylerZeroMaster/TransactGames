<template>
  <span>
    <LoadingIndicator 
      v-if="loading" 
      :error="serverError" 
    />
    <TiledGames 
      :style="loading ? 'display: none' : ''" 
      :games="games" 
      :filterFunction="getUserGames" 
    />
  </span>
</template>
<script>
import LoadingIndicator from '@/components/LoadingIndicator'
import TiledGames from '@/components/TiledGames'

export default {
  data() {
    return {
      loading: true,
      serverError: null,
      games: []
    };
  },
  components: {
    LoadingIndicator,
    TiledGames
  },
  methods: {
    async getUserGames(filter) {
      let games;
      let userFilter = {};
      this.loading = true;
      // Convert the filter from the basic format to a format that will work
      // when the user collection is unwound on the games property
      // https://docs.mongodb.com/manual/reference/operator/aggregation/unwind/#pipe._S_unwind
      for(let [k, v] of Object.entries(filter)) {
        userFilter['games.' + k] = v;
      }
      games = await this.$store.dispatch('getUserGames', userFilter);
      if(!games.serverError) {
        this.games = games.data;
        this.loading = false;
      } else {
        this.serverError = games.serverError;
      }
    }
  },
  async created() {
    this.getUserGames({});
  }
}
</script>