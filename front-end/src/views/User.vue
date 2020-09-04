<template>
  <!-- This is simply the parent component of views under the /user route -->
  <div>
    <h1 class="px-4 pt-4">{{ user.username }}'s Account</h1>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  data() {
    return {
      user: this.$store.state.user
    }
  }
}
</script>