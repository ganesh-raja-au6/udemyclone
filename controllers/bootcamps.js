const { start } = require("repl");

const [path] = [require("path")];
const ErrorResponse = require(path.join(
  __dirname,
  "..",
  "utils",
  "ErrorResponse"
));
// Importing models from ./models
const Bootcamp = require(path.join(__dirname, "..", "models", "bootcamp"));

// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public
exports.getBootcamps = async (req, res, next) => {
  try {
    let query;
    const reqQuery = { ...req.query };
    const removeFields = ["select", "sort", "page", "limit"];
    removeFields.forEach((param) => delete reqQuery[param]);
    let queryString = JSON.stringify(reqQuery);
    queryString = queryString.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );
    query = Bootcamp.find(JSON.parse(queryString));
    if (req.query.select) {
      const fields = req.query.select.split(",").join(" ");
      query = query.select(fields);
    }
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 100;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit
    const total = await Bootcamp.countDocuments()
    query = query.skip(startIndex).limit(limit)
    const pagination = {}
    if(endIndex < total){
      pagination.next = {
        page : page + 1,
        limit
      }
    }
    if(startIndex > 0){
      pagination.prev = {
        page : page - 1,
        limit
      }
    }
    const bootcamps = await query;
    if (!bootcamps) {
      return res
        .status(500)
        .json({
          success: false,
          data: [],
          count: bootcamps.length,
          error: `No Bootcamps found.`,
        });
    } else {
      return res
        .status(500)
        .json({ success: true, count: bootcamps.length, pagination, data: bootcamps });
    }
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
      return new ErrorResponse(
        `Bootcamp not found with requested ID. ${req.params.id}`,
        404
      );
    }
    return res
      .status(201)
      .json({ success: true, data: bootcamp, message: "Bootcamp updated" });
  } catch (err) {
    next(
      new ErrorResponse(
        `Bootcamp not found with requested ID. ${req.params.id}`,
        404
      )
    );
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
