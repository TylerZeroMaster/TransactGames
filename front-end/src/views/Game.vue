<template>
  <LoadingIndicator v-if="loading" :error="serverError" />
  <TheGamePage v-else :game="game" :tradeRequests="tradeRequests"/>
</template>
<script>
import LoadingIndicator from '@/components/LoadingIndicator'
import TheGamePage from '@/components/TheGamePage'

export default {
  data() {
    return {
      // The game displayed
      game: {},
      // trades involving the game displayed
      tradeRequests: [],
      loading: true,
      serverError: null
    }
  },
  components: {
    LoadingIndicator,
    TheGamePage
  },
  async created() {
    // Perform two requests at the same time
    const [game, tradeRequests] = await Promise.all([
      this.$store.dispatch(
        'getGame',
        this.$route.params.id 
      ),
      this.$store.dispatch(
        'getTradeRequests',
        this.$route.params.id
      )
    ]);
    // Probably sould display two errors if both requests error out; however,
    // in most cases, displaying one error should convery enough information to
    // the user.
    if(game.serverError) {
      this.serverError = game.serverError;
    } else if(tradeRequests.serverError) {
      this.serverError = tradeRequests.serverError;
    } else {
      this.game = game.data;
      this.tradeRequests = tradeRequests.data;
      this.loading = false;
    }
  }
}
</script>