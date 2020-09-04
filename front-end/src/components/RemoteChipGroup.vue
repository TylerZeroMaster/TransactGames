<template>
  <LoadingIndicator v-if="loading" :serverError="serverError" />
  <v-chip-group
    v-else
    column
    active-class="primary--text"
    multiple
    :value="value"
  >
    <v-chip 
      v-for="(item, i) of collection" 
      :key="item"
      @input="(e) => { handleInput(e, i) }"
    >
      {{ item }}
    </v-chip>
  </v-chip-group>
</template>
<script>
/**
 * - This components includes two arrays: selected and collection.
 * - Collection is the list of values that are shown in the chips.
 * - Selected stores the state of each chip.
 * - Given a uri, this component will request the values that it stores in collection
 * from a remote server.
 */

import LoadingIndicator from '@/components/LoadingIndicator'
import { apiLocation } from '@/models/config'
import axios from 'axios'

export default {
  props: ['value', 'url'],
  data() {
    return {
      loading: true,
      serverError: null,
      collection: [],
      selected: []
    };
  },
  components: {
    LoadingIndicator
  },
  methods: {
    handleInput(state, index) {
      // set the state to 1 or 0 depending on the chip's selection state
      this.selected[index] = +state;
      // tell the component's parents
      this.$emit('input', this.selected);
    },
    getStringValues() {
      // return a list of all the values of all the selected chips
      return this.collection.filter((e, i) => this.selected[i]);
    }
  },
  async created() {
    // Make a request for the information to be put in the chips in this group
    try {
      const response = await axios.get(apiLocation + this.url);
      this.collection = response.data;
      // Create an array that includes a 0 for each item in collection
      // but only if there is no v-model backing this component
      this.selected = this.value ? this.value : this.collection.map(() => 0);
      this.loading = false;
      this.$emit('input', this.selected);
    } catch(e) {
      this.serverError = e.response.data;
    }
  }
}
</script>