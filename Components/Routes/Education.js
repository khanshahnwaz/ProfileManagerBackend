const app = require("express");
const router = app.Router();
const user = require("../Collections/User");
const educations = require("../Collections/Education/Education");
const checkUser = require("../LoginMiddleware/checkUser");
router.post("/createEducation", checkUser, async (req, res) => {
  const data = req.body;
  const { InstituteName, FromYear, ToYear, Degree, About } = req.body;
  console.log("Updated educations ", data);
  // check if user exists or not
  const FID = req.user.id;
  const UserData = await user.findById({ _id: FID });
  console.log(FID, "and data is", data);
  if (!UserData)
    return res.status(401).json({ Message: "User does not exist." });
  //    check if user is editing details or adding for the first time
  const check = await educations.findOne({ FID: FID });
  console.log("Got the data", check);
  try {
    const result = await educations.create({
      FID: req.user.id,
      InstituteName: InstituteName,
      FromYear: FromYear,
      ToYear: ToYear,
      About: About,
      Degree: Degree,
    });
    console.log("creation status", result);
    // const neweducations=educations.findOne({FID:FID}).educations;
  } catch (err) {
    return res
      .status(500)
      .json({ Message: "Internal server error", Error: err });
  }
  const usereducations = await educations.find({ FID: FID });
  console.log(usereducations);
  return res.json({
    Message: "educations created successfully.",
    status: 201,
    data: usereducations,
  });
});

router.delete("/deleteEducation", checkUser, async (req, res) => {
  const data = req.body;
  const { InstituteName, FromYear, ToYear, Degree, About } = req.body;

  console.log("Education to be deleted.", data);

  // first check user exists or not
  const checkExistance = await user.findById({ _id: req.user.id });
  if (!checkExistance) return res.json({ Message: "User does not exist." });
  const oldeducations = await educations.find({ FID: req.user.id });
  console.log("Old educations ", oldeducations);
  const deletionData = {
    FID: req.user.id,
    About: About,
    InstituteName: InstituteName,
    FromYear: FromYear,
    ToYear: ToYear,
    Degree: Degree,
  };
  console.log("deletion data ", deletionData);
  try {
    const result = await educations.deleteOne(deletionData);
    console.log("Deletion status", result);
  } catch (err) {
    return res.status(500).json({ Message: "Internal sever erorr" });
  }
  const newData = await educations.find({ FID: req.user.id });

  return res
    .status(201)
    .json({
      Message: "Education deleted successfully",
      status: 200,
      data: newData,
    });
});
module.exports = router;
