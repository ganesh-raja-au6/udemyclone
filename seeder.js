const [path, mongoose, fs] = [
  require("path"),
  require("mongoose"),
  require("fs"),
];
require("dotenv").config({ path: "./config/config.env" });

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const Bootcamp = require(path.join(__dirname, "models", "Bootcamp"));
const Course = require(path.join(__dirname, "models", "Course"));

const bootcamps = JSON.parse(
  fs.readFileSync(path.join(__dirname, "_data", "bootcamps.json"))
);

const courses = JSON.parse(
  fs.readFileSync(path.join(__dirname, "_data", "courses.json"))
);

const importData = async () => {
  await Bootcamp.create(bootcamps);
  await Course.create(courses)
  process.exit();
};

const deleteData = async () => {
  await Bootcamp.deleteMany();
  await Course.deleteMany()
  process.exit();
};

if (process.argv[2] === "-i") {
  importData();
  console.log("Data Imported.");
}

if (process.argv[2] === "-d") {
  deleteData();
  console.log("Data destroyed.");
}
