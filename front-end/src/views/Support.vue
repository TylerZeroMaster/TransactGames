<template>
  <div class="ma-5">
    <h1 class="ma-5">Support</h1>
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-header class="headline">FAQ</v-expansion-panel-header>
        <v-expansion-panel-content>
            <v-expansion-panels>
              <v-expansion-panel 
                v-for="faq of faqs" 
                :key="faq.title"
                class="my-2"
              >
                <v-card color="secondary">
                  <v-expansion-panel-header>
                    Q: {{ faq.title }}
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    {{ faq.value }}
                  </v-expansion-panel-content>
                </v-card>
              </v-expansion-panel>
            </v-expansion-panels>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header class="headline">
          Contact Us
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-divider></v-divider>
          <v-card
            flat
            tile
            class="white--text text-center"
          >
            <v-card-text>
              <v-btn
                v-for="{ icon, to } in contactInfo"
                :key="icon"
                :to="to"
                class="mx-4 white--text"
                icon
              >
                <v-icon size="24px">{{ icon }}</v-icon>
              </v-btn>
              <a :href="'tel:' + phone">{{ phone }}</a>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>
<script>
export default {
  data() {
    return {
      phone: '123-123-1234',
      contactInfo: [
        { icon: 'mdi-facebook', to: '' },
        { icon: 'mdi-twitter', to: '' },
        { icon: 'mdi-linkedin', to: '' },
      ],
      faqs:[{
          title: 'Where do I start?',
          value: 'Start by finding a game you want to trade on the Games page. '
            + 'On that game\'s page, click the button labeled \'Ship in My Copy\''
            + ' for further instructions.'
        }, { 
          title: 'The game I want to trade isn\'t in the list. What do I do?', 
          value: 'For now, Transact Games only supports a small list of games. '
            + 'In the future, more games will be supported.' 
        }, {
          title: 'How do I trade a game?',
          value: 'Start by finding a game you want on the Games page. '
            + 'On that game\'s page, there is a trade proposal section on the right.'
            + 'You can either look for the game you want to trade away in the trade '
            + 'proposal list, or mouse over the \'Request Trade\' button and click '
            + 'the game you want to trade. If someone has already requested the '
            + 'reverse of your trade, the trade will complete immediately; otherwise'
            + ' a trade request will be created.'
        }, {
          title: 'Is there a limit to the number of games I can have in my inventory?',
          value: 'For now, there is no limit to the number of games that can be in your inventory.'
        }, {
          title: 'Why can I only have one of a particular game in my inventory at a time?',
          value: 'During the process of designing the site, it was decided that '
            + 'limiting users to one of a particular game would ultimately benifit '
            + 'more users than it would hurt.'
        }, {
          title: 'How do I cancel my subscription?',
          value: 'For the time being, you have to call support to cancel your subscription.'
            + ' In the future, there will be a more streamlined way to cancel.'
        }
      ]
    };
  }
}
</script>