<template>
  <v-card
    max-width="400"
    class="pa-5 mx-auto my-auto"
    @keypress="keypress"
  >
    <v-card-title>
      Sign In
    </v-card-title>
    <v-form
      ref="form"
      v-model="valid" 
      class="px-10"
      lazy-validation
    >
      <v-text-field label="Username" v-model="username"></v-text-field>
      <PasswordField v-model="password" label="Password" />
    </v-form>
    <v-alert v-if="serverError" type="error">
      {{ serverError }}
    </v-alert>
    <v-card-actions class="px-10">
      <v-btn :to="{ path:'/signup', query: $route.query }" color="warning">Sign Up</v-btn>
      <v-btn @click="signIn" color="success">Sign In</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import { mapGetters } from 'vuex'
import PasswordField from '@/components/PasswordField'

export default {
  data() {
    return {
      username: '',
      password: '',
      valid: true, 
      serverError: null
    }
  },
  components: {
    PasswordField
  },
  methods: {
    // try to sign in the user
    // Success: redirect to the redirect query field or page root
    // Failure: Display error
    async signIn() {
      if(this.valid) {
        let error = await this.$store.dispatch(
          'signInUser', 
          { username: this.username, password: this.password }
        );
        if(error) {
          this.serverError = error;
        } else if(this.signedIn) {
          const destination = this.$route.query.redirect || '/';
          this.$router.push(destination);
        }
      }
    },
    async keypress(e) {
      if(e.key === 'Enter') {
        await this.signIn();
      }
    }
  },
  computed: {
    ...mapGetters(['signedIn']),
  }
}
</script>