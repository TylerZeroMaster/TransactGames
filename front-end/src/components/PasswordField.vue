<template>
  <!-- This component is a reusable password text field with a show/hide 
  password function -->
  <!-- Here, I pass the rules and label props that were sent to this component 
  to the v-text-field -->
  <v-text-field 
    :label="label" 
    :value="value" 
    :rules="rules"
    :append-icon="showPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
    :type="showPassword ? 'text' : 'password'"
    @input="handleInput"
    @click:append="showPassword = !showPassword"
  ></v-text-field>
</template>
<script>

export default {
  props: ['label', 'value', 'rules'],
  data () {
    return {
      // keep track of the state of password visilbility
      showPassword: false
    }
  },
  methods: {
    handleInput (e) {
      // Effectively, this bubbles the input event up so that the parent 
      // component can use v-model
      this.$emit('input', e);
    }
  }
}

</script>