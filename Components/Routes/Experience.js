const app = require("express");
const router = app.Router();
const user = require("../Collections/User");
const experiences = require("../Collections/Experience/Experience");
const checkUser = require("../LoginMiddleware/checkUser");
router.post("/createExperience", checkUser, async (req, res) => {
  const data = req.body;
  const { ExperienceYear, FromYear, ToYear, Role, Type, CompanyName } =
    req.body;
  console.log("Updated experiences ", data);
  // check if user exists or not
  const FID = req.user.id;
  const UserData = await user.findById({ _id: FID });
  console.log(FID, "and data is", data);
  if (!UserData)
    return res.status(401).json({ Message: "User does not exist." });
  //    check if user is editing details or adding for the first time
  const check = await experiences.findOne({ FID: FID });
  console.log("Got the data", check);
  try {
    const result = await experiences.create({
      FID: req.user.id,
      ExperienceYear: ExperienceYear,
      FromYear: FromYear,
      ToYear: ToYear,
      CompanyName: CompanyName,
      Type: Type,
      Role: Role,
    });
    console.log("creation status", result);
    // const newexperiences=experiences.findOne({FID:FID}).experiences;
  } catch (err) {
    return res
      .status(500)
      .json({ Message: "Internal server error", Error: err });
  }
  const userexperiences = await experiences.find({ FID: FID });
  console.log(userexperiences);
  return res.json({
    Message: "experiences created successfully.",
    status: 201,
    data: userexperiences,
  });
});

router.delete("/deleteExperience", checkUser, async (req, res) => {
  const data = req.body;
  const { ExperienceYear, FromYear, ToYear, Role, Type, CompanyName } =
    req.body;

  console.log("Experience to be deleted.", data);

  // first check user exists or not
  const checkExistance = await user.findById({ _id: req.user.id });
  if (!checkExistance) return res.json({ Message: "User does not exist." });
  const oldexperiences = await experiences.find({ FID: req.user.id });
  console.log("Old experiences ", oldexperiences);
  const deletionData = {
    FID: req.user.id,
    CompanyName: CompanyName,
    Type: Type,
    ExperienceYear: ExperienceYear,
    FromYear: FromYear,
    ToYear: ToYear,
    Role: Role,
  };
  console.log("deletion data ", deletionData);
  try {
    const result = await experiences.deleteOne(deletionData);
    console.log("Deletion status", result);
  } catch (err) {
    return res.status(500).json({ Message: "Internal sever erorr" });
  }
  const newData = await experiences.find({ FID: req.user.id });

  return res
    .status(201)
    .json({
      Message: "Experience deleted successfully",
      status: 200,
      data: newData,
    });
});
module.exports = router;
