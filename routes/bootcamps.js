// INITIALIZING NPM MODULES
const [router, path] = [require("express").Router(), require("path")];

// controllers
const {
  getBootcamps,
  getBootcampById,
  createNewBootcamp,
  updateBootcamp,
  deleteBootcamp,
} = require(path.join(__dirname, "..", "controllers", "bootcamps"));

router.route("/").get(getBootcamps).post(createNewBootcamp);

router
  .route("/:id")
  .get(getBootcampById)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;
