<template>
  <v-app>
    <v-navigation-drawer 
      v-model="drawer"
      app 
      clipped
    >
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="title">
              Transact Games
            </v-list-item-title>
            <v-list-item-subtitle class="ma-4 text-wrap">
              Give a game a second chance.
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider class="my-2"></v-divider>
        <!-- Create a link for each route in routes. If the route has childern, 
        create a list group and display the childern in the list group -->
        <template v-for="route of routes">
          <v-list-item 
            v-if="!route.children"
            :key="route.name"
            link 
            :to="route.path"
          >
            <v-list-item-icon>
              <v-icon>
                {{ route.meta.icon }}
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                {{ route.name }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-group v-else :key="route.name">
            <template v-slot:activator>
              <v-list-item-icon>
                <v-icon>
                  {{ route.meta.icon }}
                </v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>
                  {{ route.name }}
                </v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item 
              v-for="childRoute of route.children"
              :key="childRoute.name"
              link 
              :to="[route.path, childRoute.path].join('/')"
              class="pl-10"
            >
              <v-list-item-icon>
                <v-icon>
                  {{ childRoute.meta.icon }}
                </v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>
                  {{ childRoute.name }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
      </template>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      app
      clipped-left
      class="light-blue darken-4"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      
      <v-toolbar-title>
        {{ $route.name }}
      </v-toolbar-title>
      
      <v-spacer></v-spacer>

      <v-btn text to="/signin" v-if="!isSignedIn">Sign In</v-btn>
      <v-btn text @click="signOut" v-else>Sign Out</v-btn>
    </v-app-bar>

    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    // This varaible keeps track of the state of the navigation drawer
    drawer: null
  }),
  methods: {
    signOut() {
      if(this.$route.path != '/') {
        this.$router.push('/');
      }
      this.$store.commit({
        type: 'setUser',
        user: null
      });
    }
  },
  computed: {
    routes() {
      // return a list of all routes that are not supposed to be hidden
      return this.$router.options.routes.filter(r => !r.meta.hidden);
    },
    isSignedIn() {
      return this.$store.getters.signedIn;
    }
  },
  async created() {
    // enable the dark theme by default
    this.$vuetify.theme.dark = true;
  }
};
</script>
