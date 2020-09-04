<template>
  <v-card 
    v-if="!isSignedUp" 
    @keypress="keypress" 
    max-width="800" 
    class="pa-md-8 pa-2 mx-auto" 
    outlined
  >
    <h1>Sign Up</h1>
    <v-divider class="my-4"></v-divider>
    <v-stepper v-model="step">
      <v-stepper-header>
        <v-stepper-step :complete="step > 1" :editable="step >= 1" step="1">
          User Information
        </v-stepper-step>

        <v-stepper-step :complete="step > 2" :editable="step >= 2" step="2">
          Shipping Information
        </v-stepper-step>

        <v-stepper-step :complete="step > 3" :editable="step >= 3" step="3">
          Billing Information
        </v-stepper-step>
      </v-stepper-header>

      <v-stepper-content step="1">
        
        <v-form
          ref="step1Form"
          class="pa-md-5"
        >
          <v-text-field 
            label="Username"
            v-model="user.username"
            :rules="basicValidator({ 
              uri:'#/definitions/user/properties/username' 
            })"
          ></v-text-field>

          <PasswordField 
            v-model="user.password" 
            label="Password" 
            :rules="basicValidator({ 
              uri:'#/definitions/user/properties/password',
              verbose: true
            })"
          />
        </v-form>
      </v-stepper-content>

      <v-stepper-content step="2">
        <v-form
          ref="step2Form"
          class="pa-md-5"
        >
          <v-text-field 
            label="First Name"
            v-model="user.shippingInfo.firstName"
            :rules="basicValidator({ 
              uri:'#/definitions/shippingInfo/properties/firstName',
              fieldName: 'First Name'
            })"
          ></v-text-field>

          <v-text-field 
            label="Last Name"
            v-model="user.shippingInfo.lastName"
            :rules="basicValidator({ 
              uri:'#/definitions/shippingInfo/properties/lastName' ,
              fieldName: 'Last Name'
            })"
          ></v-text-field>

          <v-text-field 
            label="Street Address"
            v-model="user.shippingInfo.streetAddress"
            :rules="basicValidator({ 
              uri:'#/definitions/shippingInfo/properties/streetAddress',
              fieldName: 'Street Address' 
            })"
          ></v-text-field>

          <v-text-field 
            label="City"
            v-model="user.shippingInfo.city"
            :rules="basicValidator({ 
              uri:'#/definitions/shippingInfo/properties/city',
              fieldName: 'City' 
            })"
          ></v-text-field>

          <StateSelect
            label="State"
            v-model="user.shippingInfo.state"
            :rules="basicValidator({ 
              uri:'#/definitions/shippingInfo/properties/state',
              fieldName: 'State' 
            })"
          />

          <v-text-field 
            label="Zip Code"
            v-model="user.shippingInfo.zip"
            :rules="basicValidator({ 
              uri:'#/definitions/shippingInfo/properties/zip',
              fieldName: 'Zip Code' 
            })"
          ></v-text-field>
        </v-form>
      </v-stepper-content>

      <v-stepper-content step="3">
        <v-form
          ref="step3Form"
          class="pa-md-5"
        >
          <v-text-field 
            label="First Name"
            v-model="user.billingInfo.firstName"
            :rules="basicValidator({ 
              uri:'#/definitions/shippingInfo/properties/firstName',
              fieldName: 'First Name'
            })"
          ></v-text-field>

          <v-text-field 
            label="Last Name"
            v-model="user.billingInfo.lastName"
            :rules="basicValidator({ 
              uri:'#/definitions/shippingInfo/properties/lastName' ,
              fieldName: 'Last Name'
            })"
          ></v-text-field>

          <v-text-field 
            label="Street Address"
            v-model="user.billingInfo.streetAddress"
            :rules="basicValidator({ 
              uri:'#/definitions/shippingInfo/properties/streetAddress',
              fieldName: 'Street Address' 
            })"
          ></v-text-field>

          <v-text-field 
            label="City"
            v-model="user.billingInfo.city"
            :rules="basicValidator({ 
              uri:'#/definitions/shippingInfo/properties/city',
              fieldName: 'City' 
            })"
          ></v-text-field>

          <StateSelect
            label="State"
            v-model="user.billingInfo.state"
            :rules="basicValidator({ 
              uri:'#/definitions/shippingInfo/properties/state',
              fieldName: 'State' 
            })"
          />

          <v-text-field 
            label="Zip Code"
            v-model="user.billingInfo.zip"
            :rules="basicValidator({ 
              uri:'#/definitions/shippingInfo/properties/zip',
              fieldName: 'Zip Code' 
            })"
          ></v-text-field>

          <v-text-field 
            label="Email"
            v-model="user.billingInfo.email"
            :rules="basicValidator({ 
              uri:'#/definitions/billingInfo/properties/email',
              fieldName: 'Email' 
            })"
          ></v-text-field>

          <v-select
            label="Card Type"
            v-model="user.billingInfo.cardType"
            :items="cardTypes"
            :rules="basicValidator({ 
              uri:'#/definitions/billingInfo/properties/cardType',
              fieldName: 'Card Type' 
            })"
          ></v-select>

          <v-text-field 
            label="Card Number"
            v-model="user.billingInfo.cardNumber"
            :rules="cardNumberValid"
          ></v-text-field>

          <v-text-field 
            label="Card Expiration"
            v-model="user.billingInfo.cardExpiration"
            :rules="expirationValid"
          ></v-text-field>
        </v-form>
      </v-stepper-content>
    </v-stepper>
    
    <v-alert v-if="serverErrors" type="error">
      <!-- v-html is userd here because the errors are joined on <br> so 
      one error is displayed per line -->
      <span v-html="errorHtml"></span>
    </v-alert>
    <v-card-actions class="mt-4">
      <v-spacer></v-spacer>
      <v-btn @click="nextStep" color="success">Next</v-btn>
    </v-card-actions>
  </v-card>
  <v-card v-else max-width="600" class="mx-auto pa-5">
    <v-card-title>
      Thanks for signing up!
    </v-card-title>
    <v-btn 
      color="success" 
      :to="{ path: '/signin', query: $route.query }"
    >
      Continune to sign in
    </v-btn>
  </v-card>
</template>
<script>
import { mapGetters } from 'vuex'
import PasswordField from '@/components/PasswordField'
import StateSelect from '@/components/StateSelect'
import { schemas } from '../../../shared-modules/validation'

export default {
  data() {
    return {
      // The current step number used by the stepper
      step: 1,
      // This is changed to true after the user has successfully signed up
      // When true, the display changes to allow the user to sign in
      isSignedUp: false,
      serverErrors: null,
      // Take the card types to show in the select box directly from the JSON schema
      cardTypes: schemas.definitions.billingInfo.properties.cardType.enum,
      // This object becomes the document that is stored in MongoDB when the user 
      // completes the signup process
      user: {
        shippingInfo: {},
        billingInfo: {}
      }
    }
  },
  components: {
    PasswordField,
    StateSelect
  },
  methods: {
    async nextStep() {
      // There is one form per step in the stepper
      // each step is named step{n}Form where n is the step number
      const form = this.$refs[`step${this.step}Form`];
      // If the form information is valid, continue to the next step
      if(form.validate()) {
        // Step 3 is the last step before signup occurs
        if(this.step < 3) {
          this.step++;
        } else {
          await this.signUp();
        }
      }
    },
    async signUp() {
      this.serverErrors = null;
      const errors = await this.$store.dispatch(
        'signUpUser', 
        { user: this.user }
      );
      if(errors.length === 0) {
        this.isSignedUp = true;
      } else {
        this.serverErrors = errors;
      }
    },
    async keypress(e) {
      if(e.key === 'Enter') {
        await this.nextStep();
      }
    },
    checkLuhn(purportedCC) {
      if(!purportedCC) {
        return false;
      } else {
        const nDigits = purportedCC.length;
        const parity = nDigits % 2;
        // ^ (XOR) 0x30 converts the character to its int value 
        // (ex: 1 = 0x31 ^ 0x30)
        var sum = purportedCC.charCodeAt(nDigits - 1) ^ 0x30;
        for(var i = 0; i < nDigits - 1; i++) {
            var digit = purportedCC.charCodeAt(i) ^ 0x30;
            if((i % 2) === parity) {
                digit *= 2;
            }
            if(digit > 9) {
                digit -= 9;
            }
            sum += digit;
        }
        return (sum % 10) === 0;
      }
    },
    checkExpiration(inputDate) {
      if(!inputDate) {
        return false;
      } else {
        const now = new Date();
        const year = parseInt(now.getFullYear().toString().substr(2));
        const month = now.getMonth() + 1;
        const [inputMonth, inputYear] = 
          inputDate.split("/").map(s => parseInt(s));
        // Make sure that the month is valid, the year is less than the current year
        // or the month is greater than the current month
        // In other words, make sure the expire date has not passed
        return (
          inputMonth <= 12
          && (
            inputYear > year 
            || (inputYear == year && inputMonth > month)
          )
        );
      }
    }
  },
  computed: {
    ...mapGetters(['basicValidator', 'schema']),
    cardNumberValid() {
      return [
        _ => {
          // Card number validation requires validating the entire billingInfo
          // document because it uses the cardType to select the cardNumber 
          // pattern
          const schema = this.schema('#/definitions/billingInfo');
          if(!schema(this.user.billingInfo)) {
            // Look for an error that is specifc to the cardNumber pattern 
            if(schema.errors.some(
                (err) => (
                  err.dataPath === '.cardNumber' 
                  && err.keyword === 'pattern'
                )
              )
            ) {
              return 'Invalid Card Number';
            }
          }
          return true;
        },
        v => this.checkLuhn(v) || 'Invalid Card Number'
      ]
    },
    expirationValid() {
      return [
        ...this.basicValidator({ 
          uri:'#/definitions/billingInfo/properties/cardExpiration',
          fieldName: 'Card Expiration' 
        }),
        v => this.checkExpiration(v) || 'Invalid expiration'
      ]
    },
    errorHtml() {
      // It looks better if one error is displayed per line
      return this.serverErrors.join('<br>');
    }
  }
}
</script>