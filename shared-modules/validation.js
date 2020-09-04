const Ajv = require('ajv'),
      _validator = new Ajv({ 
        allErrors: true,
        coerceTypes: true
      });

// This is the centralized source of validation for both the front-end and back-end
// For more information about the contents of the object, see JSON schema draft 7
const schemas = {
  definitions: {
    shippingInfo: {
      type: "object",
      properties: {
        firstName: {
          type: "string",
          pattern: "^[A-Za-z]+$"
        },
        lastName: {
          type: "string",
          pattern: "^[A-Za-z]+$"
        },
        streetAddress: {
          type: "string"
        },
        city: {
          type: "string"
        },
        state: {
          type: "string",
          pattern: "^[A-Z]{2}$"
        },
        zip: {
          type: "string",
          pattern: "^([0-9]{5})(-[0-9]{4}){0,1}$"
        },
      },
      required: ["firstName", "lastName", "streetAddress", "city", "state", "zip"]
    },
    billingInfo: {
      type: "object",
      properties: {
        email: {
          type: "string",
          format: "email"
        },
        cardType: {
          type: "string",
          enum: ["Visa", "Master Card", "American Express", "Discover"]
        },
        cardNumber: {
          type: "string"
        },
        cardExpiration: {
          type: "string",
          pattern: "^[01][0-9]/[0-9]{2}$"
        },
      },
      allOf:[
        { $ref: "#/definitions/shippingInfo" },
        {
          if: { 
            properties: { 
              cardType: { 
                const: "Visa" 
              } 
            } 
          },
          then: { 
            properties: { 
              cardNumber: { 
                pattern: "^(4\\d{12})(\\d{3})*$" 
              } 
            } 
          }
        },
        {
          if: { 
            properties: { 
              cardType: { 
                const: "Master Card" 
              } 
            } 
          },
          then: { 
            properties: { 
              cardNumber: { 
                pattern: "^(5[1-5]\\d{2}|222[1-9]|22[3-9]\\d|2[3-6]\\d{2}|27[01]\\d|2720)\\d{12}$" 
              } 
            } 
          }
        },
        {
          if: { 
            properties: { 
              cardType: { 
                const: "American Express" 
              } 
            } 
          },
          then: { 
            properties: { 
              cardNumber: { 
                pattern: "^3[47]\\d{13}$" 
              } 
            } 
          }
        },
        {
          if: { 
            properties: { 
              cardType: { 
                const: "Discover" 
              } 
            } 
          },
          then: { 
            properties: { 
              cardNumber: { 
                pattern: "^6(011|5\\d{2})\\d{12}$" 
              } 
            } 
          }
        }
      ],
      required: ["email", "cardType", "cardNumber", "cardExpiration"]
    },
    game: {
      type: "object",
      properties: {
        title: {
          type: "string"
        },
        releaseDate: {
          type: "number",
        },
        publisher: {
          type: "string"
        },
        systemName: {
          type: "string",
          enum: [
            "Xbox", 
            "Xbox 360", 
            "Xbox One", 
            "Playstation",
            "Playstation 2",
            "Playstation 3",
            "Playstation 4",
            "Gamecube",
            "Wii",
            "Wii U",
            "Switch",
            "Other Console"
          ]
        },
        genre: {
          type: "string"
        },
        image: {
          type: "string"
        },
        moreInfoLink: {
          type: "string"
        },
        tradeRequest: {
          type: "array",
          items: {
            $ref: "#/definitions/game"
          }
        }
      },
      required: ["title", "releaseDate", "publisher", "systemName", "genre"]
    },
    user: {
      type: "object",
      properties: {
        username: {
          type: "string",
          minLength: 1,
          pattern: "^[A-Za-z0-9]+$"
        },
        password: {
          type: "string",
          minLength: 8
        },
        signupDate: {
          format: "date"
        },
        billingInfo: {
          $ref: "#/definitions/billingInfo"
        },
        shippingInfo: {
          $ref: "#/definitions/shippingInfo"
        },
        games: {
          type: "array",
          item: {
            $ref: "#/definitions/game"
          }
        }
      },
      required: [
        "username", 
        "password", 
        "signupDate", 
        "billingInfo", 
        "shippingInfo",  
        "games", 
      ]
    }
  }
}

_validator.addSchema(schemas);

module.exports = {
  get validator() {
    return _validator;
  },

  schemas
};