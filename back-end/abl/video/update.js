const schema = {
  type: "object",
  properties: {
    additionalProperties: true,
    title: { type: "string", minLength: 1, maxLength: 200 },
    description: { type: "string", minLength: 1, maxLength: 3000 },
    categories: {
      type: "array",
      minItems: 1,
      maxItems: 20,
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          match: { type: "number", minimum: 0, maximum: 1 },
        },
        required: ["id", "match"],
      },
    },
    keywords: {
      type: "array",
      items: { type: "string" },
      minItems: 1,
      maxItems: 30,
    },
    author: { type: "string", minLength: 1, maxLength: 200 },
    license: { type: "string", minLength: 1, maxLength: 200 },
    duration: {
      type: "number",
      minimum: 0,
    },
    created: { type: "string", format: "date" },
    link: {
      type: "object",
      properties: {
        oldLink: {
          type: "string",
          minLength: 1,
          maxLength: 500,
          pattern: "^(?:https?://)?(?:www.)?youtube.com/(.*)$",
        },
        newLink: {
          type: "string",
          minLength: 1,
          maxLength: 500,
          pattern: "^(?:https?://)?(?:www.)?youtube.com/(.*)$",
        },
      },
      minItems: 2,
      maxItems: 2,
    },
    mutation: {
      type: "object",
      properties: {
        dabing: {
          type: "array",
          items: { type: "string", minLength: 2, maxLength: 2 },
        },
        subtitles: {
          type: "array",
          items: { type: "string", minLength: 2, maxLength: 2 },
        },
      },
    },
  },
  required: ["title", "categories", "duration", "created", "link"],
};
async function update(req, res, connection) {
  try {
    const valid = ajv.validate(schema, req.body);
    if (valid) {
      let video = req.body;
      const response = await daoVideoUpdate(video, connection);
      res.json(response);
    } else {
      res.status(400).send({
        errorMessage: "validation of input failed",
        params: req.body,
        reason: ajv.errors,
      });
    }
  } catch (e) {
    if (e.includes("video with ")) {
      res.status(400).send({ errorMessage: e, params: req.body });
    } else {
      res.status(500).send(e);
    }
  }
}

module.exports = { update };
