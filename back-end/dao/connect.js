/**
 * This class provides connection to MongoDB database.
 * @author Petr Hejl <petr.hejl@freedev.cz>
 */
class daoConnect{
  // Define login endpoint and credentials.
  #host = 'localhost';
  #port = '27017';
  #dbname = 't7library';
  #mongoose = false;
  #user = 'root';
  #pass = 'example';
  #connection = false;

  /**
   * Establish new connection with MongoDB database.
   */
  constructor() {
      this.#mongoose = require('mongoose');
      this.#connect();
      this.#connection = this.#mongoose.connection;
      this.#connection.on('connected', () => {
          console.log('Connected to the mongo database.');
      });
      this.#connection.on('error', () => {
          console.error('Error when connection to the mongo database');
      });
      this.#connection.on('disconnected', () => {
          console.log('Disconnected from the mogno database.');
      });
  }

  /**
   * Mongoose doc says connection should be async.
   */
  async #connect() {
      await this.#mongoose.connect('mongodb://' + this.#host + ':' + this.#port + '/' + this.#dbname, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          authSource: "admin",
          user: this.#user,
          pass: this.#pass
      });
  }

  /**
   * Get MongoDB connection object representing current connection with default database.
   * @returns MongoDB connection object.
   */
  getConnection() {
      return this.#connection;
  }

  /**
   * Get complete video schema.
   * @returns schema Complete video schema.
   */
  getVideoSchema() {
      const schema = {
          type: 'object',
          properties: {
            id: { type: 'string', minLength:32, maxLength: 32 },
            title: { type: 'string', minLength: 1, maxLength: 200 },
            description: { type: 'string', minLength: 1, maxLength: 3000 },
            categories: {
              type: 'array',
              minItems: 1,
              maxItems: 20,
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  match: { type: 'number', minimum: 0, maximum: 1}
                },
                required: ['id', 'match']
              }
            },
            keywords: {
              type: 'array',
              items: { type: 'string' },
              minItems: 1,
              maxItems: 30
            },
            author: { type: 'string', minLength: 1, maxLength: 200 },
            license: { type: 'string', minLength: 1, maxLength: 200 },
            duration: { type: 'object', properties:{hours:{type:'number', maximum:100},minutes:{type:'number', maximum:59},seconds:{type:'number', maximum:59} } },
            created: { type: 'string', format:'date'},
            link: { type: 'string', minLength: 1, maxLength: 500, pattern:'^(?:https?:\/\/)?(?:www\.)?youtube\.com\/(.*)$' },
            mutation: {
              type: 'object',
              properties: {
                dabing: {
                  type: 'array',
                  items: { type: 'string', minLength: 1, maxLength: 5 }
                },
                subtitles: {
                  type: 'array',
                  items: { type: 'string', minLength: 1, maxLength: 5 }
                }
              }
            }
          }
        };
      return schema;
  }

  /**
   * Get complete category schema.
   * @returns schema Complete category schaema.
   */
  getCategorySchema() {
      const schema = {
          type: 'object',
          properties: {
              id: { type: 'string', minLength: 32, maxLength: 32 },
              name: { type: 'string', minLength: 3, maxLength: 200 },
              description: { type: 'string', minLength: 10, maxLength: 3000 }
          }
      };
    return schema;
  }

  /**
   * Get default search schema.
   * @returns searchSchema AJV schema
   */
  getSearchSchema() {
    const searchSchema = {
      type: 'object',
      properties: {
        title: { type: 'string', minLength: 0, maxLength: 200 },
        categories: {
          type: 'array',
          minItems: 0,
          maxItems: 20,
          items: {type: 'string', minLength: 0, maxLength: 100}
        },
        keywords: {
          type: 'array',
          items: { type: 'string' },
          minItems: 0,
          maxItems: 30
        },
        author: { type: 'string', minLength: 0, maxLength: 200 },
        license: { type: 'string', minLength: 0, maxLength: 200 },
        createdStart: { type: 'string', format:'date'},
        createdStop: { type: 'string', format:'date'},
        language: {
          type: 'array',
          items: { type: 'string' }
        }
      }
    };
    return searchSchema;
  }

}

daoConn = new daoConnect();

module.exports = { daoConnect };