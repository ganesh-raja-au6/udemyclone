const [path] = [require("path")];
// Importing models from ./models
const Bootcamp = require(path.join(__dirname, "..", "models", "bootcamp"));

// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public
exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find();
    if (!bootcamps) {
      return res.status(400).json({ success: false, data: [] });
    }
    return res
      .status(201)
      .json({ success: true, count: bootcamps.length, data: bootcamps });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, data: [], error: `Internal server error.` });
  }
};

// @desc      Get Single Bootcamp by id
// @route     GET /api/v1/bootcamp/:id
// @access    Public
exports.getBootcampById = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
      return res
        .status(400)
        .json({ success: false, data: [], error: `No bootcamp found` });
    }
    return res.status(200).json({ success: true, data: bootcamp });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, data: [], error: `Internal server error.` });
  }
};

// @desc     Create a bootcamp
// @route    POST /api/v1/bootcamp
// @access   Private
exports.createNewBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    return res.status(200).json({ success: true, bootcamp });
  } catch (err) {
    return res
      .status(400)
      .json({ success: false, data: [], error: `Internal server error.` });
  }
};

// @desc     Update a bootcamp
// @route    PUT /api/v1/bootcamp
// @access   Private
exports.updateBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!bootcamp) {
      return res
        .status(403)
        .json({ success: false, data: [], error: "Bootcamp not found" });
    }
    return res
      .status(201)
      .json({ success: true, data: bootcamp, message: "Bootcamp updated" });
  } catch (err) {
    next(err)
  }
};

// @desc     Delete a bootcamp
// @route    DELETE /api/v1/bootcamp
// @access   Private
exports.deleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!bootcamp) {
      return res
        .status(403)
        .json({ success: false, data: [], error: "Bootcamp not found" });
    }
    return res
      .status(201)
      .json({ success: true, data: bootcamp, message: "Bootcamp updated" });
  } catch (err) {
    return res
      .status(400)
      .json({ success: false, data: [], error: `Internal server error.` });
  }
  res.status(200).json("Deleted Bootcamp");
};
