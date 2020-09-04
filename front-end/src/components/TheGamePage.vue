<template>
  <v-container class="pa-8">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-row>
          <v-col>
            <v-card>
              <v-card-title>
                {{ game.title }}
              </v-card-title>
              <v-card-text>
                <v-img
                  :src="game.image"
                  max-width="200"
                >
                </v-img>
              </v-card-text>

              <v-card-text class="font-weight-bold">
                <v-list>
                  <v-list-item 
                    v-for="(item, i) of gameDetails"
                    :key="i"
                  >
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ item.title }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ item.value }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>
                        <a :href="game.moreInfoLink" target="_blank" class="text-wrap">
                          Click here for more information about this game (external link)
                        </a>
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" md="4">
        <v-row>
          <v-col>
            <v-card>
              <v-card-actions>
                <v-btn 
                  color="primary" 
                  width="100%" 
                  text 
                  @click="!userHasGame ? sendGame() : returnGame()"
                  :disabled="!userHasGame ? userHasTrade : false"
                >
                  {{ !userHasGame ? 'Send In my Copy' : 'Return my Copy' }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card>
              <v-card-title>
                Trade Proposals
              </v-card-title>
              <v-list
                max-height="400"
                style="overflow-y: auto"
                v-if="tradeRequests.length > 0"
              >
                <v-list-item 
                  v-for="(trade, i) of tradeRequests"
                  :key="i"
                  @click="tradingFunction(trade)"
                  :disabled="tradeFilter(trade)"
                >
                  <v-list-item-avatar>
                    <v-img :src="trade.game.image"></v-img>
                  </v-list-item-avatar>
                  
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ trade.game.title }}
                    </v-list-item-title>

                    <v-list-item-subtitle>
                    {{ trade.game.systemName }}
                    </v-list-item-subtitle>

                  </v-list-item-content>

                </v-list-item>
              </v-list>
              <v-card-subtitle v-else>
                There are no trades that you can participate in at this time.
              </v-card-subtitle>

              <v-divider class="mt-2"></v-divider>

              <v-card-actions>
                <v-menu open-on-hover offset-y>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="primary"
                      v-on="on"
                      text
                      width="100%"
                      :disabled="userHasGame || !hasTradeGames || userHasTrade"
                    >
                      Request trade
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item
                      v-for="(game, index) in tradeGames"
                      :key="index"
                      @click="() => { requestTrade(game); }"
                    >
                      <v-list-item-avatar>
                        <v-img :src="game.image"></v-img>
                      </v-list-item-avatar>
                      <v-list-item-title>
                        {{ game.title }}
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-card-actions>

            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <TheGameShippingDialog 
      v-model="shipDialog" 
      :game="game" 
      @close="handleDialogClose"
    />
    <TheGameReturnDialog 
      v-model="returnDialog" 
      :game="game" 
      @close="handleDialogClose"
    />
    <TheGameTradeDialog 
      v-model="tradeDialog" 
      :p1="p1"
      :p2="p2"
      @close="handleDialogClose"
      v-if="tradeDialog"
    />
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import TheGameShippingDialog from '@/components/TheGameShippingDialog'
import TheGameReturnDialog from '@/components/TheGameReturnDialog'
import TheGameTradeDialog from '@/components/TheGameTradeDialog'

export default {
  props: ['game', 'tradeRequests'],
  data() {
    return {
      // Determine if shipping dialog should be displayed
      shipDialog: false,
      // Determine if return dialog should be displayed
      returnDialog: false,
      // Determine if trade dialog should be displayed
      tradeDialog: false,
      // A list of games the user is allowed to trade 
      // (initialized in updateGames method)
      tradeGames: []
    };
  },
  components: {
    TheGameShippingDialog,
    TheGameReturnDialog,
    TheGameTradeDialog
  },
  methods: {
    sendGame() {
      this.shipDialog = true;
    },
    returnGame() {
      this.returnDialog = true;
    },
    async updateGames() {
      await this.$store.dispatch('updateUserGames');
      // filter out games with pending trades and games that match 
      // the currently displayed one
      this.tradeGames = this.userGames.filter(
        g => !g.tradeRequest && g._id !== this.game._id
      );
    },
    // called when the dialogs emit a close event
    async handleDialogClose(success) {
      if(success) {
        await this.updateGames();
      }
    },
    requestTrade(gameTraded) {
      const matchedTrade = this.tradeRequests.find(
        trade => trade.game._id === gameTraded._id
      );
      this.p1 = {
        user: { _id: this.userId },
        game: gameTraded
      };
      // If there is a matching trade, store the user so that trade dialog 
      // can use it to complete a trade. If not, set the user to null so that
      // a trade request will be created
      this.p2 = {
        user: matchedTrade ? matchedTrade.user : null,
        game: this.game
      };
      this.tradeDialog = true;
    }
  },
  computed: {
    ...mapGetters(['userId', 'userGames']),
    gameDetails() {
      return [
        { title: 'Publisher', value: this.game.publisher },
        { title: 'Genre', value: this.game.genre },
        { title: 'System', value: this.game.systemName },
        { 
          title: 'Release Date',
          // Dates are stored as seconds since epoch in the database.
          // Convert the number to a data, get the ISO string, and remove 
          // the time portion.
          value: (new Date(this.game.releaseDate)).toISOString().split('T')[0] 
        }
      ]
    },
    tradeFilter() {
      return function (trade) {
        let enabled;
        if(trade.requested) {
          // If the game in the trade is the one requested, check if the user has
          // the game to trade away, and that the user does not have the game they 
          // would get from the trade (that is, the currently displayed game)

          // This searches tradeable games for the game in the trade
          const hasTradable = this.tradeGames.some(
            g => g._id === trade.game._id
          );
          enabled = hasTradable && !this.userHasGame;
        } else {
          // Otherwise, the game in the trade is the one the user would get 
          // from the trade. Consequently, check that they don't have the game, 
          // and that they do have the game requested 
          // (that is to say, the currently displayed game)

          // This searches all games for the game in the trade
          const gameInInv = this.userGames.some(
            g => g._id === trade.game._id
          );
          enabled = !gameInInv && this.userHasGame;
        }
        return !enabled;
        
      }
    },
    tradingFunction() {
      return function(trade) {
        const thisParticipant = {
          user: { _id: this.userId },
          game: this.game
        };
        const otherParticipant = {
          user: { _id: trade.user._id },
          game: trade.game
        };
        // If the trade proposal game represents the game that is requested,
        // then the current user must have the game requested, and the other user
        // must have this game
        if(trade.requested) {
          thisParticipant.game = trade.game;
          otherParticipant.game = this.game;
        }
        this.p1 = thisParticipant;
        this.p2 = otherParticipant;
        this.tradeDialog = true;
      }
    },
    hasTradeGames() {
      // Check if the user has any tradable games
      return this.tradeGames.length > 0;
    },
    userHasGame() {
      // Check if the user has the currently displayed game
      return this.userGames.some(
        g => g._id === this.game._id
      );
    },
    userHasTrade() {
      // Check if the user is already trying to trade for the currently displayed game
      return this.userGames.some(
        g => g.tradeRequest && g.tradeRequest._id === this.game._id
      );
    }
  },
  async created() {
    await this.updateGames();
  }
}
</script>