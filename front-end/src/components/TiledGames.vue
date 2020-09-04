<template>
  <v-container fluid class="pa-8">
    <v-row>
      <v-col id="title" cols="12">
        <h1>Games</h1>
      </v-col>
      <v-col cols="12">
        <v-text-field 
          outlined
          hide-details
          append-icon="mdi-magnify"
          placeholder="Search"
          v-model="search"
          @click:append="callFilter"
        >
        </v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-header class="headline">Filter By</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-card :class="filterClasses">
              <v-card-title>System Name</v-card-title>
              <v-chip-group
                column
                active-class="primary--text"
                multiple
                v-model="selectedSystems"
              >
                <v-chip v-for="systemName of systemNames" :key="systemName">
                  {{ systemName }}
                </v-chip>
              </v-chip-group>
            </v-card>
          
            <v-card :class="filterClasses">
              <v-card-title>Publisher</v-card-title>
              <RemoteChipGroup 
                ref="publisherChips"
                url="distinct?coll=game&property=publisher" 
              />
            </v-card>
          
            <v-card :class="filterClasses">
              <v-card-title>Genre</v-card-title>
              <RemoteChipGroup 
                ref="genreChips"
                url="distinct?coll=game&property=genre" 
              />
            </v-card>
            
            <v-row justify="end">
              <v-col cols="12" md="2" align="center">
                <v-btn color="success" @click="clearFilter">Clear Filter</v-btn>
              </v-col>
              <v-col cols="12" md="2" align="center">
                <v-btn color="success" @click="callFilter">Apply Filter</v-btn>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>
    <v-row 
      align="center"
    >
      <v-col 
        v-for="game of games"
        :key="game._id"
        cols="12"
        sm="4"
        lg="3"
        xl="2"
        class="hoverable" 
        max-height="400"
      >
        <v-card 
          hover
          :to="{ path: `/game/${game._id}` }"
        >
          <v-img
            :src="game.image"
            position="bottom"
          >
            <v-card-title class="outline--text">
              {{ game.title }}
            </v-card-title>
            <v-card-subtitle class="outline--text">
              {{ game.systemName }}
            </v-card-subtitle>
          </v-img>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped>
  #title {
    border-top: 1px solid gray;
    border-bottom: 1px solid gray;
  }

  .hoverable:hover {
    transform: scale(0.98);
  }

  .outline--text {
    text-shadow: 
      -1px -1px 0px #000, 
       1px -1px 0px #000, 
      -1px  1px 0px #000, 
       1px  1px 0px #000;
  }
</style>
<script>
import RemoteChipGroup from '@/components/RemoteChipGroup'
import { schemas } from '../../../shared-modules/validation'

export default {
  props: ['games', 'filterFunction'],
  data() {
    return {
      search: '',
      selectedSystems: [],
      systemNames: schemas.definitions.game.properties.systemName.enum,
      filterClasses: ['px-4', 'my-2', 'secondary']
    }
  },
  components: {
    RemoteChipGroup
  },
  methods: {
    // Get all the information our of the filter components and put it in the
    // basic filter format, then send it to the parent component's filter function
    callFilter() {
      const selectedSysNames = this.selectedSystems.map(i => this.systemNames[i]);
      const filter = {};
      if(this.search.length > 0) {
        // Filter based on exact title matching
        filter.title = this.search;
      }
      if(selectedSysNames.length > 0) {
        // Filter based on the occurence of the value in the collection
        filter.systemName = {
          '$in': selectedSysNames
        }
      }
      if(this.$refs.publisherChips){
        const selectedPublishers = this.$refs.publisherChips.getStringValues();
        if(selectedPublishers.length > 0) {
          // Filter based on the occurence of the value in the collection
          filter.publisher = {
            '$in': selectedPublishers
          }
        }
      }
      if(this.$refs.genreChips){
        const selectedGenres = this.$refs.genreChips.getStringValues();
        if(selectedGenres.length > 0) {
          // Filter based on the occurence of the value in the collection
          filter.genre = {
            '$in': selectedGenres
          }
        }
      }
      // Call the parent component's filter function instead of trying to have 
      // the child alter the parent's data
      this.filterFunction(filter);
    },
    clearFilter() {
      this.filterFunction({});
    }
  }
}
</script>