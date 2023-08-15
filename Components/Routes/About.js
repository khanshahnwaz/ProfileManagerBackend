const app = require("express");
const router = app.Router();
const user = require("../Collections/User");
const about = require("../Collections/About/About");
const checkUser = require("../LoginMiddleware/checkUser");
router.put("/editAbout", checkUser, async (req, res) => {
  const data = req.body.about;
  // check if user exists or not
  const FID = req.user.id;
  const UserData = await user.findById({ _id: FID });
  console.log(FID, "and data is", data);
  if (!UserData)
    return res.status(401).json({ Message: "User does not exist." });
  //    check if user is editing details or adding for the first time
  const check = await about.findOne({ FID: FID });
  console.log("Got the data", check);
  try {
    const result = await about.findOne({ FID: FID }).updateOne(
      {
        FID: FID,
      },
      {
        About: data,
      }
    );
    console.log("updation status", result);
    const newAbout = about.findOne({ FID: FID }).About;
  } catch (err) {
    return res
      .status(500)
      .json({ Message: "Internal server error", Error: err });
  }
  const userAbout = await about.findOne({ FID: FID });

  return res.json({
    Message: "About updated successfully.",
    status: 201,
    data: userAbout.About,
  });
});
module.exports = router;
