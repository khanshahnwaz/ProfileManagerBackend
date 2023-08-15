const app = require("express");
const router = app.Router();
const user = require("../Collections/User");
const certificates = require("../Collections/Certification/Certification");
const checkUser = require("../LoginMiddleware/checkUser");
router.put("/editCertificate", checkUser, async (req, res) => {
  const data = req.body;
  console.log("Updated certificates ", data);
  // check if user exists or not
  const FID = req.user.id;
  const UserData = await user.findById({ _id: FID });
  console.log(FID, "and data is", data);
  if (!UserData)
    return res.status(401).json({ Message: "User does not exist." });
  //    check if user is editing details or adding for the first time
  const check = await certificates.findOne({ FID: FID });
  console.log("Got the data", check);
  try {
    const result = await certificates.findOne({ FID: FID }).updateOne(
      {
        FID: FID,
      },
      {
        Certificate: data,
      }
    );
    console.log("updation status", result);
    // const newcertificates=certificates.findOne({FID:FID}).certificates;
  } catch (err) {
    return res
      .status(500)
      .json({ Message: "Internal server error", Error: err });
  }
  const usercertificates = await certificates.findOne({ FID: FID });
  console.log(usercertificates);
  return res.json({
    Message: "certificates updated successfully.",
    status: 201,
    data: usercertificates.Certificate,
  });
});

router.put("/deleteCertificate", checkUser, async (req, res) => {
  const data = req.body;
  console.log("Certificate to be deleted.", data);

  // first check user exists or not
  const checkExistance = await user.findById({ _id: req.user.id });
  if (!checkExistance) return res.json({ Message: "User does not exist." });
  const oldCertificates = await certificates.findOne({ FID: req.user.id });
  console.log("Old certificates ", oldCertificates);
  const newCertificates = oldCertificates.Certificate.filter((item, i) => {
    console.log(item);
    if (item.Name != req.body.Name || item.Platform != req.body.Platform)
      return item;
  });
  console.log("new certificate", newCertificates);
  try {
    const result = await certificates.findOne({ FID: req.user.id }).updateOne(
      { FID: req.user.id },
      {
        Certificate: newCertificates,
      }
    );
    console.log("Updattion status", result);
  } catch (err) {
    return res.json({ Message: "Internal server error." });
  }
  const newData = await certificates.findOne({ FID: req.user.id });
  return res
    .status(201)
    .json({
      Message: "Certificates updated successfully",
      status: 200,
      data: newData.Certificate,
    });
});
module.exports = router;
