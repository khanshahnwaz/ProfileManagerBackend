const app = require("express");
const router = app.Router();
const user = require("../Collections/User");
const connection = require("../Collections/Connections/Connection");
const checkUser = require("../LoginMiddleware/checkUser");

router.get("/readConnections", checkUser, async (req, res) => {
  const FID = req.user.id;
  // fetch all the users this user has added
  let dataArray = [];

  (await connection.find({ FID: FID }, { SID: 1, _id: 0 })).forEach((item) => {
    dataArray.push(item.SID);
  });
  // return res.json(dataArray)
  let notConnect = [...dataArray];
  notConnect.push(req.user.id);
  const data = await user.find({ _id: { $nin: notConnect } }, { _id: 0 });
  console.log("Not connected", data);
  // const arrayTO=['64da1ad7c2192f25aa0d91af','64da1adcc2192f25aa0d91bc'];
  // now fetch details of all connected connections
  const users = await user.find({ _id: { $in: dataArray } }, { _id: 0 });
  console.log("Connected users", users);

  return res.json({ Connected: users, NConnected: data });
});
router.post("/createConnection", checkUser, async (req, res) => {
  const FID = req.user.id;
  const { email } = req.body;

  // check both the users exists or not
  const checkFirst = await user.find({ FID: FID });
  if (!checkFirst) return res.json({ Message: "User does not exsit." });
  //    fetch id of second user
  const second = await user.findOne({ Email: email }).select("_id");
  if (!second) return res.json({ Message: "Requested user does not exist." });

  console.log("First user: ", FID, " second user : ", second._id);
  //    now since both the users are valid
  // check if the users are already connected or not
  const check = await connection.findOne({ FID: FID, SID: second });
  if (check) return res.json({ Message: "You are already connected." });
  // now create conneciton
  try {
    const result = await connection.create({ FID: FID, SID: second });
    console.log("Creation status", result);
    return res.status(201).json({ Message: "You are connected!", status: 201 });
  } catch (err) {
    return res.status(500).json({ Message: "Internal server error." });
  }
});

router.delete("/removeConnection", checkUser, async (req, res) => {
  const FID = req.user.id;
  const { email } = req.body;
  // check both the users exists or not
  const checkFirst = await user.find({ FID: FID });
  if (!checkFirst) return res.json({ Message: "User does not exsit." });
  // fetch id of second user
  const second = await user.findOne({ Email: email }).select("_id");
  if (!second) return res.json({ Message: "Requested user does not exist." });

  //    now since both the users are valid
  // check if the users are already connected or not
  if (!(await connection.findOne({ FID: FID, SID: second })))
    return res.json({ Message: "You are already not connected." });
  //   now remove connection
  try {
    const result = await connection.deleteOne({ FID: FID, SID: second });
    console.log("Removing connections status", result);
    return res
      .status(200)
      .json({ Message: "Connection removed successfully!", status: 200 });
  } catch (err) {
    return res.status(500).json({ Message: "Interal server error.", Error: err });
  }
});

module.exports = router;
