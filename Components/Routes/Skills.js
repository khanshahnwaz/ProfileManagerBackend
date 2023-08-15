const app = require("express");
const router = app.Router();
const user = require("../Collections/User");
const skills = require("../Collections/Skills/Skills");
const checkUser = require("../LoginMiddleware/checkUser");
router.put("/editSkills", checkUser, async (req, res) => {
  const data = req.body.skills;
  console.log("Updated skills ", data);
  // check if user exists or not
  const FID = req.user.id;
  const UserData = await user.findById({ _id: FID });
  console.log(FID, "and data is", data);
  if (!UserData)
    return res.status(401).json({ Message: "User does not exist." });
  //    check if user is editing details or adding for the first time
  const check = await skills.findOne({ FID: FID });
  console.log("Got the data", check);
  try {
    const result = await skills.findOne({ FID: FID }).updateOne(
      {
        FID: FID,
      },
      {
        Skills: data,
      }
    );
    console.log("updation status", result);
    // const newskills=skills.findOne({FID:FID}).skills;
  } catch (err) {
    return res
      .status(500)
      .json({ Message: "Internal server error", Error: err });
  }
  const userskills = await skills.findOne({ FID: FID });
  console.log(userskills);
  return res.json({
    Message: "skills updated successfully.",
    status: 201,
    data: userskills.Skills,
  });
});
module.exports = router;
