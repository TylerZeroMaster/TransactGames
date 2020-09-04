import Vue from 'vue'
import Vuex from 'vuex'

import axios from 'axios'

import { validator } from '../../../shared-modules/validation'
import { apiLocation } from '@/models/config'

Vue.use(Vuex);


/**
 * Get formatted error text from an axios exception
 * @param {*} e The axios expception to get the error text from
 * @returns Formatted error text
 */
function getErrorText(e) {
  if(e.response) {
    return e.response.data;
  } else {
    return 'Sorry, the connection timed out. Please try again later';
  }
}

/**
 * Make a get request and handle any error that occurs
 * @param {*} url The url to send the GET request to
 * @returns An object with data and serverError properties
 */
async function genericGet(url) {
  let response = {
    data: null,
    serverError: null
  };
  try {
    const httpResponse = await axios.get(apiLocation + url);
    response.data = httpResponse.data;
  } catch(e) {
    response.serverError = getErrorText(e);
  }
  return response;
}

const store = new Vuex.Store({
  state: {
    // This is the user that is signed in at the time
    user: null,
    // This is a reference to an AJV instance
    validator
  },
  getters: {
    schema: (state) => (uri) => {
      return state.validator.getSchema(uri);
    },
    signedIn: (state) => {
      return state.user != null;
    },
    userId: (state) => state.user._id,
    userGames: (state) => state.user.games,
    // Find the schema, validate the information, and display either a custom
    // message, or a canned message
    // This is used as a shortcut in form validation
    basicValidator: (state) => ({ uri, optional, fieldName, message, verbose }) => {
      return [
        v => {
          const schema = state.validator.getSchema(uri);
          fieldName = fieldName || uri.split('/').slice(-1);
          if(!optional && !v) {
            return fieldName + ' is required';
          }
          return (
            schema(v) 
            || message 
            || (verbose ? schema.errors[0].message : `${fieldName} is invalid.`)
          );
        }
      ]
    }
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload.user;
    },
    setGames(state, payload) {
      state.user.games = payload.games;
    },
    requestTrade(state, payload) {
      state.user.games.find(
        g => g._id === payload.gid
      ).tradeRequest = payload.gameRequested;
    },
    deleteTrade(state, payload) {
      const user = state.user;
      delete user.games.find(
        g => g._id === payload.gid
      ).tradeRequest;
      state.user = user;
    }
  },
  actions: {
    /**
     * Sign a user into the site
     * @param {*} state 
     * @param {*} payload An object containing the users' username and password
     * @returns An error string, or null if there was not an error
     */
    async signInUser({ commit }, payload) {
      let error;
      try {
        const response = await axios.post(
          apiLocation + 'signin',
          payload
        );
        commit({
          type: 'setUser',
          user: response.data
        });
      } catch(e) {
        error = e.response.status === 401 ? 
          'Invalid username or password'
          : 'An unknown error occured'
      }
      return error;
    },

    /**
     * Add a new user to the site
     * @param {*} state 
     * @param {*} user An object representing the new user
     * @returns An array of error strings, or an empty array if there was an errors
     */
    async signUpUser(state, user) {
      let errors = [];
      try {
        // Ask the server to create a new account
        await axios.post(
          apiLocation + 'signup',
          user
        );
      } catch(e) {
        // If a non-200 status code is recieved, get the errors from the response
        errors = e.response.data;
      }
      return errors;
    },

    /**
     * Get all the games in a user's inventory that match a specific filter
     * @param {*} state 
     * @param {*} filter The filter to apply to the search
     * @returns An object with data and serverError properties
     */
    async getUserGames({ state }, filter) {
      let response = {
        data: null,
        serverError: null
      };
      try {
        const httpResponse = await axios.post(
          apiLocation + `user/${state.user._id}/games`, 
          { filter }
        );
        response.data = httpResponse.data;
      } catch(e) {
        response.serverError = getErrorText(e);
      }
      return response;
    },

    /**
     * Update the Vuex user's games to reflect the most up-to-date information
     * This is called on many pages that need fresh game data
     * @param {*} state Provided by Vuex
     */
    async updateUserGames({ commit, dispatch }) {
      let error;
      try {
        const response = await dispatch(
          'getUserGames',
          {}
        );
        if(!response.serverError) {
          commit({
            type: 'setGames',
            games: response.data
          });
        }
      } catch(e) {
        error = getErrorText(e);
      }
      return error;
    },

    /**
     * Get games that match a specific filter
     * @param {*} state Provided by Vuex
     * @param {*} filter The filter to apply to the game search
     * @returns An object with data and serverError properties
     */
    async getGames(state, filter) {
      let response = {
        data: null,
        serverError: null
      };
      try {
        let httpResponse = await axios.post(
          apiLocation + 'games',
          { filter }
        );
        response.data = httpResponse.data;
      } catch (e) {
        response.serverError = getErrorText(e);
      }
      return response;
    },

    /**
     * Get one game from the database
     * @param gid The id of the game to get form the database
     * @returns An object with data and serverError properties
     */
    getGame: async (state, gid) => genericGet(`game/${gid}`),

    /**
     * Find all the games in a user's inventory that are part of a trade request
     * @param {*} state 
     * @param {*} id the id of the game to get trade requests for
     * @returns An object with data and serverError properties
     */
    getTradeRequests: async ({ state }, id) => 
      genericGet(`trade-requests?gid=${id}&uid=${state.user._id}`),

    /**
     * Add a game to the user's inventory
     * @param {*} state 
     * @param {*} game The game to be added to the user's inventory
     * The user can only have one of each game in their inventory at a time
     * @returns An error string, or null if there was not an error
     */
    async addGame({ state }, game) {
      const user = state.user;
      let error;
      if(user.games.indexOf(game) !== -1) {
        error = 'That game is already in your inventory';
      } else {
        try {
          await axios.patch(
            apiLocation + 'add-game', 
            { uid: user._id, game }
          );
        } catch(e) {
          error = getErrorText(e);
        }
      }
      return error;
    },

    /**
     * Remove a game from the user's inventory
     * @param {*} state 
     * @param {*} gid The id of the game to be removed from the user's inventory
     * @returns An error string, or null if there was not an error
     */
    async removeGame({ state }, gid) {
      const user = state.user;
      let error;
      if(!user.games.some(g => g._id === gid)) {
        error = 'That game is not in your inventory';
      } else {
        try {
          await axios.patch(
            apiLocation + 'remove-game', 
            { uid: user._id, gid }
          );
        } catch(e) {
          error = getErrorText(e);
        }
      }
      return error;
    },

    /**
     * Given two trade participants, request a trade if p2.user is null, otherwise
     * complete a trade. Each participant includes user and game properties. The
     * user property includes the id of the user who owns the associated game.
     * @param {*} state 
     * @param {*} payload An object containing two trade participants, p1 and p2
     */
    async trade(state, payload) {
      let error;
      try {
        await axios.patch(
          apiLocation + 'trade',
          payload
        );
      } catch(e) {
        error = getErrorText(e);
      }
      return error;
    },

    /**
     * Remove a trade request from a game
     * @param {*} state 
     * @param {*} gid The id of the game that contains the trade request
     * @returns An error string, or null if there was not an error
     */
    async removeTradeRequest({ commit, state }, gid) {
      const uid = state.user._id;
      let error;
      try {
        await axios.delete(
          apiLocation + `trade-request?uid=${uid}&gid=${gid}`
        );
        commit({
          type: 'deleteTrade',
          gid
        });
      } catch(e) {
        error = getErrorText(e);
      }
      return error
    }
  },
  modules: {
  }
})

export default store;