const app = require("express");
const user = require("../Collections/User");
const router = app.Router();
const about = require("../Collections/About/About");
const skills = require("../Collections/Skills/Skills");
const certificate = require("../Collections/Certification/Certification");
const experiences = require("../Collections/Experience/Experience");
const educations = require("../Collections/Education/Education");

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dkkksi4pu",
  api_key: "486834434673173",
  api_secret: "c_9Ej6b6Q7lsI6zUAzFlWOceJ4M",
});

// bcrypt for password hashing
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // to generate tokens
const secretKey = "This is Shahnwaz Khan";
// const {Auth}=require('two-step-auth')
// const nodemailer=require('nodemailer')
const checkUser = require("../LoginMiddleware/checkUser");
const certification = require("../Collections/Certification/Certification");
const experience = require("../Collections/Experience/Experience");
const education = require("../Collections/Education/Education");
// Route 1: Register new user . Login not required
router.post("/signUp", async (req, res) => {
  // console.log("Hi I am here.")
  console.log("Requested data is", req.body);

  const check = await user.findOne({ Email: req.body.email });
  if (check) {
    console.log("Email already exists.");
    return res.json({ Message: "Email already exists.", status: 400 });
  }
  // Encrypting password to keep safe
  // generate salt
  const salt = await bcrypt.genSalt(10);
  // generate hash
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  try {
    const create = await user.create({
      Name: req.body.name,
      Email: req.body.email,
      Phone: req.body.phone,
      Password: hashedPassword,
      Photo: "/img/user.jpg",
      UserName:req.body.userName,
      Description:req.body.description,
      BirthDate:req.body.date,
      Gender:req.body.gender
    });

    const payLoad = {
      user: {
        id: create._id,
      },
    };
    const token = jwt.sign(payLoad, secretKey);
    await about.create({
      FID: create._id,
      About: "Please add about yourself.",
    });
    await skills.create({
      FID: create._id,
      Skills: ["Add your skills separated with comma"],
    });
    await certificate.create({
      FID: create._id,
      Certificate: [
        {
          Name: "Certificate name",
          Platform: "Certificate source",
        },
      ],
    });
    await experiences.create({
      FID: create._id,
      ExperienceYear: 0,
      FromYear: 0,
      ToYear: 0,
      CompanyName: "Mobilics",
      Role: "Dummy Entry",
      Type: "Delete this and add yours!",
    });

    await educations.create({
      FID: create._id,
      InstituteName: "Your College/School name",
      FromYear: 1234,
      ToYear: 1235,
      Degree: "Name of course or class",
      About: "Some details about this degress",
    });

    const userData = {
      userName:create.UserName,
      gender:create.Gender,
      birthDate:create.BirthDate,
      name: create.Name,
      email: create.Email,
      phone: create.Phone,
      photo: create.Photo,
      about: "Please add about yourself.",
      skills: ["Add your skills separated with comma"],
      certificate: [
        {
          Name: "Certificate name",
          Platform: "Certificate source",
        },
      ],
      experience: [
        {
          ExperienceYear: 7,
          FromYear: 2010,
          ToYear: 2017,
          CompanyName: "Mobilics",
          Role: "Dummy Entry",
          Type: "Delete this and add yours!",
        },
      ],
      education: [
        {
          InstituteName: "Your College/School name",
          FromYear: 1234,
          ToYear: 1235,
          Degree: "Name of course or class",
          About: "Some details about this degress",
        },
      ],
    };

    return res.status(201).json({
      Message: "Account created successfully.",
      token: token,
      status: 201,
      data: userData,
    });
  } catch (err) {
    console.log("error", err);
    return res.status(500).json({ Message: "Internal server error." });
  }
});

// Router 2 : Login register user . No login required
router.post("/login", async (req, res) => {
  // console.log("I am hit ");
  try {
    const { Email, Password } = req.body;
    const checkEmail = await user.findOne({ Email: Email });
    if (!checkEmail) {
      return res.status(404).json({ Message: "Account not found." });
    }
    const oldPassword = await user.findOne({ Email: Email });
    console.log("user is", oldPassword);
    // console.log(oldPassword)
    const checkPassword = await bcrypt.compare(Password, oldPassword.Password);
    if (!checkPassword) {
      console.log("Password did not match.");
      return res
        .status(401)
        .json({ Message: "Wrong password detected.", status: 401 });
    } else console.log("Password matched.");
    const payLoad = {
      user: {
        id: oldPassword._id,
      },
    };
    console.log("first");
    const aboutText = await about.findOne({ FID: oldPassword._id });
    // console.log(aboutText)
    console.log("first2");

    const skill = await skills.findOne({ FID: oldPassword._id });
    console.log("firs3");

    const certificateData = await certificate.findOne({ FID: oldPassword._id });
    console.log("first4");

    const experinces = await experiences.find({ FID: oldPassword._id });
    console.log("first5");

    const education = await educations.find({ FID: oldPassword._id });

    console.log("Skills are", skill);

    const userData = {
      name: oldPassword.Name,
      userName:oldPassword.UserName,
      gender:oldPassword.Gender,
      email: oldPassword.Email,
      phone: oldPassword.Phone,
      photo: oldPassword.Photo,
      skills: skill.Skills,
      about: aboutText.About,
      certificate: certificateData.Certificate,
      experience: experinces,
      education: education,
    };
    const token = jwt.sign(payLoad, secretKey);
    // localStorage.setItem('token', token)
    return res.json({
      Message: "Welcome to Profile_Manager.",
      token,
      status: 200,
      data: userData,
    });
  } catch (err) {
    return res.status(500).json({ Message: "Internal server error", Error: err });
  }
});

router.put("/editProfile", checkUser, async (req, res) => {
  const { email, phone, name,userName,gender } = req.body;
  console.log("New data is", email, phone, name);

  const FID = req.user.id;
  //    console.log(FID);
  try {
    // check if user exists or not
    const checkExistance = await user.findById({ _id: FID });
    if (!checkExistance)
      return res.status(400).json({ Message: "User does not exists." });
    console.log("User is", checkExistance);

    let result = await user.findById({ _id: FID }).updateOne(
      { _id: FID },
      {
        Name: name,
        Email: email,
        Phone: phone,
        UserName:userName,
        Gender:gender
      }
    );

    console.log("after updation", result);

    const updatedData = await user.findById({ _id: FID });
    console.log("Case 1");
    //    if(!result)
    //      return res.status(400):json({Messsage:"Couldn't edit",Error})
    const aboutText = await about.findOne({ FID: FID });
    console.log("Case 3");

    // console.log(aboutText)
    const skill = await skills.findOne({ FID: FID });
    console.log("Case 3");

    const certificates = await certificate.findOne({ FID: FID });
    console.log("Case 4");

    const experience = await experiences.find({ FID: FID });
    console.log("Case 5");

    const education = await educations.find({ FID: FID });
    console.log("Case 6");

    console.log(skill);
    const userData = {
      name: updatedData.Name,
      userName:updatedData.UserName,
      gender:updatedData.Gender,
      email: updatedData.Email,
      phone: updatedData.Phone,
      photo: updatedData.Photo,
      skills: skill.Skills,
      about: aboutText.About,
      certificate: certificates.Certificate,
      experience: experience,
      education: education,
    };
    console.log("new data is", userData);
    return res
      .status(200)
      .json({ Message: "Updated successfully!", data: userData, status: 200 });
  } catch (er) {
    return res
      .status(500)
      .json({ Message: "Internal server error.", Error: er });
  }
});

router.put("/editImage", checkUser, async (req, res) => {
  const imagePath = req.body.photo;
  // console.log(imagePath);
  try {
    const response = await cloudinary.uploader.upload(imagePath);
    console.log(response.url);
    const FID = req.user.id;
    await user.findOne({ _id: FID }).updateOne(
      { _id: FID },
      {
        Photo: response.url,
      }
    );
    return res.status(200).json({
      Message: "Image updatged successfully.",
      data: response.url,
      status: 200,
    });
  } catch (err) {
    return res.status(500).json({ Message: "Internal server error!" });
  }
});

router.get("/getData", checkUser, async (req, res) => {
  const FID = req.user.id;
  try{
  const userData = await user.findOne({ _id: FID }, { _id: 0 });
  const abouts = await about.findOne({ FID: FID }, { _id: 0, FID: 0 });
  const skill = await skills.findOne({ FID: FID }, { _id: 0, FID: 0 });
  const certificate = await certification.find(
    { FID: FID },
    { _id: 0, FID: 0 }
  );
  const experienc = await experience.find({ FID: FID }, { _id: 0, FID: 0 });
  const educatio = await education.find({ FID: FID }, { _id: 0, FID: 0 });
  // console.log("Userdata", userData);
  // console.log("About", abouts);
  // console.log("Skills ", skill);
  // console.log("Certificate ", certificate);
  // console.log("Experiences ", experienc);
  // console.log("Educations ", educatio);
  const data = {
    Name: userData.Name,
    UserName:userData.UserName,
    Gender:userData.Gender,
    Email: userData.Email,
    Phone: userData.Phone,
    Photo: userData.Photo,
    About: abouts.About,
    Skills: skill.Skills,
    Certificates: certificate,
    Experiences: experienc,
    Educations: educatio,
  };
  return res
    .status(200)
    .json({ Message: "Data fetched", status: 200, data: data });
}catch(err){
  return res.status(500).json({Message:"Internal server error."})
}
});
module.exports = router;
