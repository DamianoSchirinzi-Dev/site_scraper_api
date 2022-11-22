const Joi = require("joi");
const express = require("express");
const app = express();

app.use(express.json());

const people = [
  { name: "John", id: 1 },
  { name: "Sarah", id: 2 },
  { name: "Natalie", id: 3 },
  { name: "Damiano", id: 4 },
  { name: "Taco", id: 5 },
];

const personSchema = Joi.object({
  name: Joi.string().min(3).required(),
});

// #region Endpoints
//Get all people
app.get("/api/people", (req, res) => {
  res.send(people);
});

//Get person by ID
app.get("/api/people/:id", (req, res) => {
  const person = findPersonById(req);
  if (!person)
    res
      .status(404)
      .send("Error 404: The person with the given ID was not found");

  res.send(person);
});

//Add new person
app.post("/api/people", (req, res) => {
  validateSchema(personSchema, req, res);

  const newPerson = {
    id: people.length + 1,
    name: req.body.name,
  };

  people.push(newPerson);
  res.send(newPerson);
});

//Update existing person
app.put("/api/people/:id", (req, res) => {
  const person = findPersonById(req);
  if (!person)
    return res
      .status(404)
      .send("Error 404: The person with the given ID was not found");

  validateSchema(personSchema, req, res);

  person.name = req.body.name;
  res.send(person);
});
// #endregion

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Live on http://localhost:${port}...`));

// #region Functions
function validateSchema(schema, req, res) {
  result = schema.validate(req.body);

  if (result.error) return res.status(400).send(result.error.message);
  else return result;
}

function findPersonById(req) {
  return people.find((p) => p.id === parseInt(req.params.id));
}
//#endregion
