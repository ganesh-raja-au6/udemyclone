// INITIALIZING NPM MODULES
const [mongoose] = [require("mongoose")];

const connectDB = async () => {
  const connection = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });

  console.log(`Database connected : ${connection.connection.host}`);
};

module.exports = connectDB;
