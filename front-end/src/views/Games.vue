<template>
  <span>
    <LoadingIndicator v-if="loading" :error="serverError" />
    <TiledGames :style="loading ? 'display: none' : ''" :games="games" :filterFunction="getGames" />
  </span>
</template>

<script>
// @ is an alias to /src
import LoadingIndicator from '@/components/LoadingIndicator'
import TiledGames from '@/components/TiledGames'

export default {
  data() {
    return {
      loading: true,
      games: null,
      serverError: null
    };
  },
  components: {
    LoadingIndicator,
    TiledGames
  },
  methods: {
    // This method is used to populate the page with games from the database
    // It is also sent to the TiledGames component to be called when the user 
    // clicks "Apply Filter"
    async getGames(filter) {
      let games;
      this.loading = true;
      games = await this.$store.dispatch('getGames', filter);
      if(!games.serverError) {
        this.games = games.data;
        this.loading = false;
      } else {
        this.serverError = games.serverError;
      }
    }
  },
  async created() {
    this.getGames({});
  }
}
</script>
