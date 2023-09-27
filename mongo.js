const mongoose = require("mongoose");

// ERROR HANDLING
if (process.argv.length < 3) {
  console.log("Please enter DB password");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://tankaywee09:${password}@aaltocluster.atkdsmx.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({ name: String, number: Number });
const Person = mongoose.model("Person", personSchema);

// HANDLING DATA
if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });
  person.save().then((result) => {
    console.log(`added ${result.name} number ${result.number} to phonebook`);
    mongoose.connection.close();
  });
} else if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    console.log("phonebook:");
    result.forEach((person) => console.log(`${person.name} ${person.number}`));
    mongoose.connection.close();
  });
} else {
  console.log(
    "please use either of the following commands: node mongo.js <password> <name> <number> or node mongo.js <password>"
  );
  mongoose.connection.close();
}
