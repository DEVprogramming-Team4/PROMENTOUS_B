const express = require("express");
const router = express.Router();
const mysql = require("../mysql");
/****
 * FOR LOGIN  + USER INFO
 *
 */
// 모집글 상세 GET
router.get("/:userId", async (req, res) => {
    let userId = req.params.userId;
    const userDetail = await mysql.query("userDetail", [userId]);
    //console.log("userDetail return---------------------");
    //console.log(userDetail[0]);


    res.send(userDetail[0]);
  });
  

module.exports = router; // NECCESARY END STATE
