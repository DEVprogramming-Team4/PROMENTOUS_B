const express = require("express");
const router = express.Router();
const mysql = require("../mysql");
/****
 * FOR LOGIN  + USER INFO
 *
 */
// 유저 단일 정보 가져오기 
router.get("/:userId", async (req, res) => {
    let userId = req.params.userId;
    const userDetail = await mysql.query("userDetail", [userId]);
    //console.log("userDetail return---------------------");
    //console.log(userDetail[0]);

    res.send(userDetail[0]);
  });
  

module.exports = router; // NECCESARY END STATE
