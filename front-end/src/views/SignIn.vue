<template>
  <v-container class="mt-4">
    <TheSignUpForm v-if="isSignUp" />
    <TheSignInForm v-else />
  </v-container>
    
</template>

<script>
// @ is an alias to /src
import TheSignInForm from '@/components/TheSignInForm.vue'
import TheSignUpForm from '@/components/TheSignUpForm.vue'

export default {
  name: 'SignIn',
  components: {
    TheSignUpForm,
    TheSignInForm
  },
  computed: {
    // If the path is signup, display the signup page
    isSignUp() {
      return this.$route.path === '/signup';
    }
  }
}
</script>
