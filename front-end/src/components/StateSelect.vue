<template>
  <!-- Here, I pass the rules and label props that were sent to this component 
  to the v-text-field -->
  <v-select
    :label="label"
    :value="value"
    :rules="rules"
    :items="states"
    @input="handleInput"
  />
</template>
<script>
export default {
  props: ['label', 'value', 'rules'],
  data() {
    return {
      states: [
        'AL',
        'AK',
        'AZ',
        'AR',
        'CA',
        'CO',
        'CT',
        'DE',
        'FL',
        'GA',
        'HI',
        'ID',
        'IL',
        'IN',
        'IA',
        'KS',
        'KY',
        'LA',
        'ME',
        'MD',
        'MA',
        'MI',
        'MN',
        'MS',
        'MO',
        'MT',
        'NE',
        'NV',
        'NH',
        'NJ',
        'NM',
        'NY',
        'NC',
        'ND',
        'OH',
        'OK',
        'OR',
        'PA',
        'RI',
        'SC',
        'SD',
        'TN',
        'TX',
        'UT',
        'VT',
        'VA',
        'WA',
        'WV',
        'WI',
        'WY'
      ]
    }
  },
  methods: {
    handleInput(e) {
      // Effectively, this bubbles the input event up so that the parent 
      // component can use v-model
      // Known Issue: If you press enter on the StateSelect, there can be an error.
      // This appears to be a vuetify issue
      this.$emit('input', e);
    }
  }
}
</script>