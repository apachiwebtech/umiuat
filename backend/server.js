const sql = require('mysql')
const express = require('express')
const nodemailer = require('nodemailer');
const dotenv = require('dotenv')
const app = express()
const path = require('path');
const multer = require('multer');
const cors = require('cors');
const bodyParser = require('body-parser');
const async = require('async');
const moment = require('moment')
const Razorpay = require("razorpay");
const crypto = require('crypto');
const { validatePaymentVerification, validateWebhookSignature } = require('./node_modules/razorpay/dist/utils/razorpay-utils');
const cron = require('node-cron');
const cluster = require('cluster');
const os = require('os');
const numCPUs = os.cpus().length;
const axios = require('axios');

dotenv.config();


app.use(
  cors({
    origin: '*',
  })
);

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.json());
app.use(bodyParser.json());

// const storage = multer.diskStorage({
//   destination: '../public_html/pet-app/upload/subcategory/', // 
//   filename: (req, file, cb) => {
//     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//   },
// });

// const upload = multer({ storage: storage });


app.get('/nodeapp', (req, res) => {
  return res.json("this is from backend")
});

// const port = process.env.PORT;


function checkpaymentstatus() {

  const secret = process.env.RAZORPAY_SECRET;
  let Placed = "placed";
  const date = new Date()


  const checkPayDetails = "SELECT * FROM `payment_log` WHERE pstatus = 0 and deleted = 0";

  con.query(checkPayDetails, (err, data) => {
    if (err) {
      console.error("Database Error:", err);
      return;
    }

    // Iterate over each item in the data array
    data.forEach((item) => {
      const { order_id, razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = item;

      try {
        // Validate the payment verification
        const isValid = validatePaymentVerification(
          { order_id: razorpay_order_id, payment_id: razorpay_payment_id },
          razorpay_signature,
          secret
        );

        if (isValid) {
          console.log(`Payment for order_id ${razorpay_order_id} is valid`);

          // Update the payment status to 1 (or any other status you want)
          const updatePaymentStatus = "UPDATE payment_log SET pstatus = 1 WHERE razorpay_order_id = ?";

          con.query(updatePaymentStatus, [razorpay_order_id], (updateErr) => {
            if (updateErr) {
              console.error("Failed to update payment status:", updateErr);
            } else {

              const updateorder = "update `order` set ostatus = ? , orderstatus = 1 , payment_date = ? ,transactionid= ?, razor_orderid =? ,razor_signature= ?, transacamount= ? , paystatus = 1  where  id = ?  and deleted = 0"

              con.query(updateorder, [Placed, date, razorpay_payment_id, razorpay_order_id, razorpay_signature, amount, order_id], (err, data) => {
                if (err) {
                  console.log(err)
                } else {
                  const updatecart = "update `awt_cart` set orderstatus = 1 where orderid = ?"

                  con.query(updatecart, [order_id], (err, data) => {
                    if (err) {
                      console.log(err)
                    } else {
                      console.log(data)

                    }
                  })
                }
              })
            }

          });

        } else {

          const updatePaymentStatus = "UPDATE payment_log SET pstatus = 2 WHERE razorpay_order_id = ?";

          con.query(updatePaymentStatus, [razorpay_order_id], (err, data) => {
            if (err) {
              console.log(err)
            } else {
              console.log("Payment Failed")
            }
          })




        }
      } catch (error) {
        console.error(`Verification Error for order_id ${razorpay_order_id}:`, error);
      }


    });
  });
}





if (cluster.isMaster) {
  console.log(`Master process is running with PID: ${process.pid}`);
  console.log(`Forking ${numCPUs} workers...`);

  // Fork workers based on the number of CPUs
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Restart workers if they die, and assign cron job to a new worker
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died with code: ${code}, signal: ${signal}`);
    cluster.fork();  // Fork a new worker


  });
} else {
  // Check if this worker should run the cron job
  if (cluster.worker.id <2) {
    console.log(`Worker ${cluster.worker.id} is running the cron job`);
    cron.schedule('* * * * *', () => {
      console.log(`Cron job running in worker ${cluster.worker.id}`);
      try {
        getPaymentStatus();
      } catch (error) {
        console.error('Error in cron job:', error);
      }
    });
  }
  




  // All workers share the HTTP server
  app.listen(8081, () => {
    console.log(`Worker ${process.pid} satyam started`);
  });
}

const con = sql.createConnection({
  host: 'localhost',
  user: 'food',
  password: '',
  database: 'food',
})


// const con = sql.createConnection({
//   host: 'localhost',
//   user: 'viggorve_umi',
//   password: 'FDVL}LYY&dI2',
//   database: 'viggorve_umi',
//   timezone: '+05:30'
// })

con.connect((err) => {
  if (err) {
    console.log('err')
  }
  else {
    console.log('connection is ok')
  }
})


app.get('/nodeapp/getos' , (req,res) =>{

  return res.json({os:cluster.worker.id})
  
})


app.post('/nodeapp/user_login', (req, res) => {
  let email = req.body.email;
  let otp = req.body.otp;

  const sql = "SELECT ar.* , c.companyname, c.locationname , c.locationid FROM `awt_registeruser` as ar LEFT JOIN `company` as c on c.id = ar.companyid WHERE ar.email = ? and ar.deleted = 0 and ar.active = 1"

  con.query(sql, [email], (err, data) => {
    if (err) {
      return res.json(err)
    } else {



      if (data.length !== 0) {

        let sql2;
        let param;


        console.log(email, "email")

        if (email == "satyamsatkr875@gmail.com" || email == "Satyamsatkr875@gmail.com") {
          sql2 = "UPDATE awt_registeruser SET otp = '1141' WHERE email = ?";
          param = [email]

          console.log("1")

        } else {

          sql2 = "UPDATE awt_registeruser SET otp = ? WHERE email = ?";
          param = [otp, email]

          console.log("2")
        }


        con.query(sql2, param, (err, data) => {
          if (err) {
            return res.json(err)
          }
          else {


            if (data.length !== 0) {

              const sql = "SELECT ar.* , c.companyname, c.locationname , c.locationid FROM `awt_registeruser` as ar LEFT JOIN `company` as c on c.id = ar.companyid WHERE ar.email = ? and ar.deleted = 0;";
              con.query(sql, [email], (err, data) => {
                if (err) {
                  return res.json(err)
                } else {


                     const locid = data[0].locationid

                     const locidArray = locid.split(',');

                     const newquery = 'SELECT id FROM location WHERE id IN (?) and status = 1';

                     con.query(newquery , [locidArray] , (err,newdata) =>{
                         if(err){
                             return res.json(err)
                         }else{

                             return res.json({data :data , locid : newdata  })
                         }
                     })

                //   return res.json(email)
                }
              })
            }

          }
        })
      }

      else {
        return res.json({ data: 1 })
      }
    }
  })

})







app.post('/nodeapp/login', (req, res) => {
  let email = req.body.email;
  let fullname = req.body.fullname;
  let mobile = req.body.mobile;
  let otp = req.body.otp;

  const sql = "SELECT * FROM awt_registeruser WHERE email = ? AND deleted = 0";

  con.query(sql, [email], (err, data) => {
    if (err) {
      return res.json(err); // Return JSON error response
    } else {
      if (data.length !== 0) {
        const updatesql = 'UPDATE `awt_registeruser` SET active = 1 , otp = ?  WHERE email = ? AND deleted = 0';

        con.query(updatesql, [otp, email], (error, result) => {
          if (error) {
            return res.json(error);

          } else if (result.affectedRows == 0) {

            return res.json("No rows were updated.");

          } else {

            const sql = "SELECT ar.* , c.companyname, c.locationname , c.locationid FROM `awt_registeruser` as ar LEFT JOIN `company` as c on c.id = ar.companyid WHERE ar.email = ? and ar.deleted = 0;";
            con.query(sql, [email], (err, data) => {
              if (err) {
                return res.json(err)
              } else {

                const locid = data[0].locationid

                const locidArray = locid.split(',');

                const newquery = 'SELECT id FROM location WHERE id IN (?) and status = 1';

                con.query(newquery, [locidArray], (err, newdata) => {
                  if (err) {
                    return res.json(err)
                  } else {

                    return res.json({ data: data, locid: newdata })
                  }
                })


                // return res.json(data)



              }
            })
          }
        });
      } else {

        return res.json({ data: 1 }) // Return JSON response

      }
    }
  });
});



app.post('/nodeapp/otp', (req, res) => {
  let email = req.body.email;
  let fullname = req.body.fullname;
  let mobile = req.body.mobile;
  let value = req.body.value;
  let otp = req.body.otp;
  const currentDate = new Date();
  let params;

  if (value == 1) {
    const sql = "SELECT ar.role, ar.id,ar.email, ar.firstname,ar.lastname,ar.otp,ar.value, ar.mobile from awt_registeruser as ar where ar.email =?  and ar.otp = ? and ar.deleted = 0 ";
    params = [email, otp]

    con.query(sql, params, (err, data) => {
      if (err) {
        return res.json(err)
      } else {

        //  const mailOptions = {
        //             from: process.env.SMTP_MAIL,
        //             to: email,
        //             subject: 'Welcome to Our Platform!',
        //             text: 'Thank you for registering. Your OTP is ' + otp,
        //           };

        //           transporter.verify(function (error, success) {
        //             if (error) {
        //               console.log(error);
        //             } else {
        //               console.log("Server is ready to take our messages");
        //             }
        //           });
        //           transporter.sendMail(mailOptions, (error, data) => {
        //             if (error) {
        //               console.log(error);
        //             } else {
        //               console.log('Email sent: ' + data);
        //             }
        //           });
        return res.json(data)
      }
    })
  }

  if (value == 0) {
    const sql = "SELECT * from awt_registeruser_dummy where email = ? and otp = ? and deleted = 0 ";
    params = [email, otp]
    con.query(sql, params, (err, data) => {
      if (err) {
        return res.json(err)
      } else {
        if (data.length !== 0) {

          const sql = "INSERT INTO awt_registeruser(`email`,`firstname`,`mobile`,`otp`,`created_date`) VALUES(?,?,?,?,?)"

          con.query(sql, [email, fullname, mobile, otp, currentDate], (err, data) => {
            if (err) {
              return res.json(err)
            } else {
              const insertedId = data.insertId;
              const sql = "SELECT ar.role, ar.id,ar.email, ar.firstname,ar.lastname,ar.otp,ar.value,au.pet_name, au.parent_name from awt_registeruser as ar left join awt_userprofile au on au.userid = ar.id WHERE ar.id = ? and ar.deleted = 0";

              con.query(sql, [insertedId], (err, data) => {
                if (err) {
                  console.log(err)
                }
                else {
                  return res.json(data)
                }
              })

            }
          })
        }


      }
    })
  }



});

// app.post('/nodeapp/provider_login', (req, res) => {
//   let email = req.body.email;
//   let otp = req.body.otp;


//   const sql = "SELECT * from awt_service_register where email = ? AND deleted = 0"


//   con.query(sql, [email], (err, data) => {
//     if (err) {
//       return res.json(err);
//     } else {

//       if (data.length !== 0) {
//         const mailOptions = {
//           from: 'dharvik.badga22@gmail.com',
//           to: email,
//           subject: 'OTP for login into pupcat app',
//           text: `your otp has been updated to ${otp}`,

//         }
//         transporter.verify(function (error, success) {
//           if (error) {
//             console.log(error);
//           } else {
//             console.log("Server is ready to take our messages");
//           }
//         });
//         transporter.sendMail(mailOptions, (error, data) => {
//           if (error) {
//             console.log(error);
//           } else {
//             console.log('Email sent: ' + data);
//           }
//         });
//         const sql2 = "UPDATE awt_service_register SET otp = ? WHERE email = ?";

//         con.query(sql2, [otp, email], (err, data) => {
//           if (err) {
//             return res.json(err)
//           }
//           else {
//             if (data.length !== 0) {

//               const sql = "SELECT * from awt_service_register WHERE email = ? and deleted = 0";
//               con.query(sql, [email], (err, data) => {
//                 if (err) {
//                   return res.json(err)
//                 } else {
//                   return res.json(data)
//                 }
//               })
//             }

//           }
//         })

//       } else {
//         const sql3 = "INSERT INTO awt_registeruser_dummy(`email`,`otp`) VALUES (?, ?)";
//         con.query(sql3, [email, otp], (err, data) => {
//           if (err) {
//             return res.json(err);
//           }
//           else {
//             const insertedId = data.insertId;

//             const mailOptions = {
//               from: 'Your Sender Email',
//               to: email,
//               subject: 'Welcome to Our Platform!',
//               text: 'Thank you for registering. Your OTP is ' + otp,
//             };

//             transporter.verify(function (error, success) {
//               if (error) {
//                 console.log(error);
//               } else {
//                 console.log("Server is ready to take our messages");
//               }
//             });
//             transporter.sendMail(mailOptions, (error, data) => {
//               if (error) {
//                 console.log(error);
//               } else {
//                 console.log('Email sent: ' + data);
//               }
//             });
//             const sql = "SELECT * from awt_registeruser_dummy WHERE id = ? and deleted = 0";
//             con.query(sql, [insertedId], (err, data) => {
//               if (err) {
//                 console.log(err)
//               }
//               else {

//                 return res.json(data)
//               }
//             })

//           }
//         })
//       }
//     }
//   });
// });

// app.post('/nodeapp/provider_otp', (req, res) => {
//   let email = req.body.email;
//   let value = req.body.value;
//   let otp = req.body.otp;
//   const currentDate = new Date();


//   let params;

//   if (value == 1) {
//     const sql = "SELECT * from awt_service_register where email = ? and otp = ? and deleted = 0 ";
//     params = [email, otp]
//     con.query(sql, params, (err, data) => {
//       if (err) {
//         return res.json(err)
//       } else {

//         return res.json(data)
//       }
//     })
//   }

//   if (value == 0) {
//     const sql = "SELECT * from awt_registeruser_dummy where email = ? and otp = ? and deleted = 0 ";
//     params = [email, otp]

//     con.query(sql, params, (err, data) => {
//       if (err) {
//         return res.json(err)
//       } else {
//         if (data.length !== 0) {

//           const sql = "INSERT INTO awt_service_register(`email`,`otp`,`created_date`) VALUES(?,?,?)"

//           con.query(sql, [email, otp, currentDate], (err, data) => {
//             if (err) {
//               return res.json(err)
//             } else {
//               const insertedId = data.insertId;

//               const sql = "SELECT * from awt_service_register WHERE id = ? and deleted = 0";
//               con.query(sql, [insertedId], (err, data) => {
//                 if (err) {
//                   console.log(err)
//                 }
//                 else {
//                   return res.json(data)
//                 }
//               })

//             }
//           })
//         }


//       }
//     })
//   }



// });

app.post('/nodeapp/resend', (req, res) => {
  let email = req.body.email;
  let value = req.body.value;
  let otp = req.body.otp;

  let sql;
  let params;

  if (value == 1) {
    sql = "UPDATE awt_registeruser SET otp = ? WHERE email = ? and  deleted = 0";
    params = [otp, email];
  }
  else {
    sql = "UPDATE awt_registeruser_dummy SET otp = ? WHERE email = ? and  deleted = 0";
    params = [otp, email];
  }

  con.query(sql, params, (err, data) => {
    if (err) {
      return res.json(err)
    }
    else {
      return res.json(data)
    }
  })
});

// app.post('/nodeapp/resend_provider', (req, res) => {
//   let email = req.body.email;
//   let value = req.body.value;
//   let otp = req.body.otp;

//   let sql;
//   let params;

//   if (value == 1) {
//     sql = "UPDATE awt_service_register SET otp = ? WHERE email = ? and  deleted = 0";
//     params = [otp, email];
//   }
//   else {
//     sql = "UPDATE awt_registeruser_dummy SET otp = ? WHERE email = ? and  deleted = 0";
//     params = [otp, email];
//   }

//   con.query(sql, params, (err, data) => {
//     if (err) {
//       return res.json(err)
//     }
//     else {
//       return res.json(data)
//     }
//   })
// });

app.post('/nodeapp/dashboard', (req, res) => {
  const type = req.body.type;
  const sql = "SELECT id, title ,icon, type , status, link from awt_dashboard where type = ? and status = 1 and deleted = 0";

  con.query(sql, [type], (err, data) => {
    if (err) {
      return res.json(err)
    }
    else {
      return res.json(data)
    }
  })
})
app.get('/nodeapp/dashboard', (req, res) => {

  const sql = "SELECT * from awt_breeds ";

  con.query(sql, (err, data) => {
    if (err) {
      return res.json(err)
    }
    else {
      return res.json(data)
    }
  })
})

// app.post('/nodeapp/petProfile', (req, res) => {
//   const userId = req.body.userId;
//   const state = req.body.state;
//   const city = req.body.city;
//   const pincode = req.body.pincode;

//   const sql = 'INSERT INTO awt_userprofile (`userid`, `state`, `city`, `pincode`) VALUES (?,?,?,?)'

//   con.query(sql, [userId, state, city, pincode], (err, data) => {
//     if (err) {
//       return res.json(err);
//     } else {
//       return res.json(data);
//     }
//   })
// })





const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.PLAY_PASSWORD,
  },

});

// app.post('/nodeapp/category', (req, res, next) => {
//   //   const sql = 'SELECT id , category , upload_image FROM awt_category WHERE deleted = 0';

//   let locid = req.body.locid

//   const sql = 'SELECT act.id,act.upload_image , act.category FROM awt_product LEFT JOIN vendor ON awt_product.v_id = vendor.id left join location on location.id = vendor.location LEFT JOIN awt_category as act on act.id = awt_product.cat_id WHERE awt_product.deleted = 0 and vendor.location = ? and vendor.status = 1 and vendor.active = 1 and vendor.deleted = 0 and location.status = 1 and location.deleted = 0 and awt_product.status = 1 and awt_product.deleted = 0 group by act.id;'


//   con.query(sql, [locid], (error, data) => {
//     if (error) {
//       return res.json(error);
//     } else {
//       return res.json(data);
//     }
//   })
// })

app.post('/nodeapp/category', (req, res, next) => {
//   const sql = 'SELECT id , category , upload_image FROM awt_category WHERE deleted = 0';

let locid = req.body.locid;
let version = req.body.version;
let ios = req.body.ios;

const sql = 'SELECT act.id,act.upload_image , act.category FROM awt_product LEFT JOIN vendor ON awt_product.v_id = vendor.id left join location on location.id = vendor.location LEFT JOIN awt_category as act on act.id = awt_product.cat_id WHERE awt_product.deleted = 0 and vendor.location = ? and vendor.status = 1 and vendor.active = 1 and vendor.deleted = 0 and location.status = 1 and location.deleted = 0 and awt_product.status = 1 and awt_product.deleted = 0 group by act.id;'
  

  con.query(sql,[locid],(error, data) => {
    if (error) {
      return res.json(error);
    } else {
        if(version || ios){
      return res.json(data);
            
        }else{
            
      return res.json([]);
        }
    }
  })
})



// app.post('/nodeapp/banner', (req, res, next) => {
//   // Split the locid string by comma and convert it to an array of integers
//   const locidArray = req.body.locid.split(',').map(Number);


//   const sql = `SELECT id ,external_type ,location , vendor ,link ,upload_image  FROM awt_banner WHERE deleted = 0 AND location IN (?)`;

//   con.query(sql, [locidArray], (error, data) => {
//     if (error) {
//       return res.json(error);
//     } else {
//       return res.json(data);
//     }
//   });
// });

app.post('/nodeapp/banner', (req, res, next) => {
    // Split the locid string by comma and convert it to an array of integers
    const locidArray = req.body.locid.split(',').map(Number);
    const version = req.body.version;
    const ios = req.body.ios;
    
    const sql = `SELECT id ,external_type ,location , vendor ,link ,upload_image  FROM awt_banner WHERE deleted = 0 AND location IN (?)`;
    
    con.query(sql, [locidArray], (error, data) => {
        if (error) {
            return res.json(error);
        } else {
            if(version || ios){
                
            return res.json(data);
            }else{
                return res.json([{
                            "id": 1000,
        "external_type": 1,
        "location": 5,
        "link": "https://play.google.com/store/apps/details?id=com.umifood.app",
        "upload_image": "1727674654-update.jpg"
                }])
            }
        }
    });
});

app.post('/nodeapp/getlisting', (req, res, next) => {
  const { latitiude, longitude, } = req.body;

  const getNearest = 'SELECT id,latitude, longitude from awt_vendor WHERE deleted = 0';

  con.query(getNearest, (error, data) => {
    if (error) {
      return res.json(error);
    }
    else {
      return res.json(data);
    }
  })

})



app.post('/nodeapp/order', async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const options = req.body;

    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).send("error");
    }
    res.json(order);


  } catch (err) {
    console.log(err);
    res.status(500).send("error");
  }
})


app.get('/nodeapp/getLocation', (req, res) => {
  const sql = 'SELECT * FROM location WHERE deleted = 0';

  con.query(sql, (error, data) => {
    if (error) {
      return res.json(error);
    } else {
      return res.json(data);
    }
  })
})


// app.post('/nodeapp/products', (req, res, next) => {

//   let locid = req.body.locid

//   const sql = 'SELECT awt_product.id ,awt_product.v_id, awt_product.cat_id, awt_product.title, awt_product.discount_price , awt_product.description, awt_product.upload_image,awt_product.price,awt_product.hsnno,awt_product.cgst,awt_product.sgst,awt_product.rate,awt_product.type, vendor.company_name AS vendor_name FROM awt_product LEFT JOIN vendor ON awt_product.v_id = vendor.id left join location on location.id = vendor.location  WHERE awt_product.deleted = 0 and vendor.location = ? and vendor.status = 1 and vendor.active = 1 and vendor.deleted = 0 and location.status = 1 and location.deleted = 0 and awt_product.status = 1 and awt_product.deleted = 0 ';

//   con.query(sql, [locid], (error, data) => {
//     if (error) {
//       return res.json(error);
//     } else {
//       return res.json(data);
//     }
//   })
// })

app.post('/nodeapp/products', (req, res, next) => {

  let locid = req.body.locid;
  let version  = req.body.version;
  let ios  = req.body.ios;

  const sql = 'SELECT awt_product.id ,awt_product.v_id, awt_product.cat_id, awt_product.title, awt_product.discount_price , awt_product.description, awt_product.upload_image,awt_product.price,awt_product.hsnno,awt_product.cgst,awt_product.sgst,awt_product.rate,awt_product.type, vendor.company_name AS vendor_name FROM awt_product LEFT JOIN vendor ON awt_product.v_id = vendor.id left join location on location.id = vendor.location  WHERE awt_product.deleted = 0 and vendor.location = ? and vendor.status = 1 and vendor.active = 1 and vendor.deleted = 0 and location.status = 1 and location.deleted = 0 and awt_product.status = 1 and awt_product.deleted = 0';

  con.query(sql, [locid], (error, data) => {
    if (error) {
      return res.json(error);
    } else {
        if(version || ios){
            
      return res.json(data);
        }else{
            
      return res.json([]);
        }
    }
  })
})

app.post('/nodeapp/detail_product', (req, res) => {
  let proid = req.body.proid;


  const sql = 'select * from  `awt_product` where id = ? and deleted = 0'

  con.query(sql, [proid], (err, data) => {
    if (err) {
      return res.json(err)
    } else {
      return res.json(data)
    }
  })
})
app.post('/nodeapp/getcatlisting', (req, res) => {
  let cat_id = req.body.cat_id;
  let loc_id = req.body.loc_id;


  const sql = 'select ap.*, ac.category , v.company_name from  `awt_product` as ap left join `awt_category` as ac on ap.cat_id = ac.id LEFT JOIN vendor as v on ap.v_id = v.id left join location as l on l.id = v.location where ap.cat_id = ? and ap.deleted = 0 and v.location = ? and v.status = 1 and ap.status = 1 and v.deleted = 0 and l.status = 1 and l.deleted = 0;'

  con.query(sql, [cat_id, loc_id], (err, data) => {
    if (err) {
      return res.json(err)
    } else {
      return res.json(data)
    }
  })
})

app.post('/nodeapp/getvendorlisting', (req, res) => {

  let vendid = req.body.vendid;

  const sql = 'select ap.* , v.company_name, v.city  , v.logo from  `awt_product` as ap  left join `vendor` as v on ap.v_id = v.id   where ap.v_id = ? and ap.deleted = 0 and ap.status = 1 and v.status = 1 and v.active = 1 and v.deleted = 0'

  con.query(sql, [vendid], (err, data) => {
    if (err) {
      return res.json(err)
    } else {
      return res.json(data)
    }
  })
})



app.post('/nodeapp/addToCart', async (req, res) => {

  let userid = req.body.userId;
  let orderid = req.body.orderid;
  let product_id = req.body.pro_id;
  let pro_name = req.body.pro_name;
  let catid = req.body.cat_id;
  let price = req.body.price;
  let p_qty = req.body.p_qty
  let date = new Date()
  let v_id = req.body.v_id;
  let newcgst = req.body.cgst;
  let newsgst = req.body.sgst;
  let hsnno = req.body.hsnno;
  let newcgstamt = req.body.cgstamt;
  let newsgstamt = req.body.sgstamt;
  // const gst = 5

  // const percentage = (gst + 100) / 100;
  // const amtbeforegst = (price * p_qty) / percentage;

  // const gstamt = price - amtbeforegst;

  // const cgst = gstamt / 2
  // const sgst = gstamt / 2

  const cgst = newcgst * p_qty
  const sgst = newsgst * p_qty

  const cgstamt = newcgstamt * p_qty
  const sgstamt = newsgstamt * p_qty

  const gstamt = cgstamt + sgstamt



  if (!orderid) {
    const sql = 'INSERT INTO `order` (`userid`,`created_date`) VALUES (?,?)';

    con.query(sql, [userid, date], (err, data) => {
      if (err) {
        res.json(err);
      } else {
        console.log(data.insertId);

        const Inorderid = data.insertId

        const sql = 'INSERT INTO `awt_cart` (`orderid`,`v_id`,`proid`,`pname`,`catid`,`price`,`pqty`,`gstamt`, `CGST`,`SGST`,`cgstamt`,`sgstamt`,`hsn_code`,`created_date`) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)';

        con.query(sql, [Inorderid, v_id, product_id, pro_name, catid, price, p_qty, gstamt, newcgst, newsgst, cgstamt, sgstamt, hsnno, date], (err, data) => {

          const insertedid = data.insertId;

          const getorderno = "select * from `order` where `ostatus` != 'incart'"

          con.query(getorderno, (err, data) => {
            if (err) {
              return res.json(err)
            } else {

              const count = data.length
              const ordercount = count + 1
              const currentDate = new Date();
              const day = String(currentDate.getDate()).padStart(2, '0');
              const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero based
              const year = currentDate.getFullYear().toString().substr(-2);

              const orderno = "UMI" + "-" + year + month + day + "-" + ordercount + '-' + v_id

              const updateorderno = "update `awt_cart` set orderno = ? where id = ? "

              con.query(updateorderno, [orderno, insertedid], (err, data) => {
                if (err) {
                  return res.json(err)
                } else {
                  const sql = 'select * from awt_cart where id = ?';

                  con.query(sql, [insertedid], (err, data) => {
                    if (err) {
                      return res.json(err)
                    } else {
                      return res.json(data)
                    }
                  })
                }
              })
            }
          })




        })
      }
    })

  } else if (userid && orderid) {


    const sql = 'UPDATE `order` set userid = ? , updated_date = ? WHERE  id = ?';

    con.query(sql, [userid, date, orderid], (err, data) => {
      if (err) {
        return res.json(err)
      } else {
        const sql = "select * from awt_cart where orderid = ? and proid = ?";

        con.query(sql, [orderid, product_id], (err, data) => {
          if (err) {
            return res.json(err)
          } else {
            if (data.length == 0) {

              const getorderno = "select * from `order` where `ostatus` != 'incart'"

              con.query(getorderno, (err, data) => {
                if (err) {
                  return res.json(err)
                } else {
                  const count = data.length
                  const ordercount = count + 1
                  const currentDate = new Date();
                  const day = String(currentDate.getDate()).padStart(2, '0');
                  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero based
                  const year = currentDate.getFullYear().toString().substr(-2);

                  const orderno = "UMI" + "-" + year + month + day + "-" + ordercount + '-' + v_id

                  const sql = 'INSERT INTO `awt_cart` (`orderid`, `orderno`,`v_id`,`proid`,`pname`,`catid`,`price`,`pqty`,`gstamt`, `CGST`,`SGST`,`cgstamt`,`sgstamt`,`hsn_code`,`created_date`) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';

                  con.query(sql, [orderid, orderno, v_id, product_id, pro_name, catid, price, p_qty, gstamt, newcgst, newsgst, cgstamt, sgstamt, hsnno, date], (err, data) => {
                    if (err) {
                      return res.json(err)
                    } else {
                      return res.json(data)
                    }
                  })


                }
              })


            } else {

              let checkzero

              if (p_qty == 0) {
                checkzero = 'update `awt_cart` set  pname = ?, v_id = ?,catid = ?, price = ?, pqty = ?,  gstamt = ? , CGST =?, SGST =? ,cgstamt = ?,sgstamt = ? , created_date = ? ,deleted = 1  where orderid = ? and proid = ?';
              } else {
                checkzero = 'update `awt_cart` set  pname = ?, v_id = ?,catid = ?, price = ?, pqty = ? , gstamt = ?, CGST = ?, SGST = ?,cgstamt = ?, sgstamt = ? , created_date = ? ,deleted = 0  where orderid = ? and proid = ?';
              }

              con.query(checkzero, [pro_name, v_id, catid, price, p_qty, gstamt, newcgst, newsgst, cgstamt, sgstamt, date, orderid, product_id], (err, data) => {
                if (err) {
                  return res.json(err)
                } else {
                  console.log(data)
                  return res.json(data)
                }
              })
            }

          }
        })


      }
    })
  }

  // } else {

  //   const sql = "select * from awt_cart where orderid = ? and proid = ?";

  //   con.query(sql, [orderid, product_id], (err, data) => {
  //     if (err) {
  //       return res.json(err)
  //     } else {
  //       if (data.length == 0) {
  //         const sql = 'INSERT INTO `awt_cart` (`orderid`,`v_id`,`proid`,`pname`,`catid`,`price`,`pqty`, `gstamt`,CGST,SGST,`created_date`) values (?,?,?,?,?,?,?,?,?,?,?)';

  //         con.query(sql, [pro_name, v_id, catid, price, p_qty, gstamt, cgst, sgst, date, orderid, product_id], (err, data) => {
  //           if (err) {
  //             return res.json(err)
  //           } else {
  //             return res.json(data)
  //           }
  //         })
  //       } else {
  //         let checkzero;

  //         if (p_qty == 0) {
  //           checkzero = 'update `awt_cart` set  pname = ?, v_id = ?,catid = ?, price = ?, pqty = ?,  gstamt = ? , CGST =?,SGST = ? ,created_date = ? ,deleted = 1  where orderid = ? and proid = ?';
  //         } else {
  //           checkzero = 'update `awt_cart` set  pname = ?, v_id = ?,catid = ?, price = ?, pqty = ? , gstamt = ?,CGST = ?,SGST = ?, created_date = ? ,deleted = 0  where orderid = ? and proid = ?';
  //         }

  //         con.query(checkzero, [pro_name, v_id, catid, price, p_qty, gstamt, cgst, sgst, date, orderid, product_id], (err, data) => {
  //           if (err) {
  //             return res.json(err)
  //           } else {
  //             return res.json(data)
  //           }
  //         })
  //       }
  //     }
  //   })


  // }


})



// app.post('/nodeapp/getcartData', (req, res) => {

//   let order_id = req.body.order_id;

//   const sql = 'select  ac.* , ap.upload_image , ap.description , ap.type from `awt_cart` ac left join `awt_product` as ap on ac.proid = ap.id where  ac.orderid = ? and ac.deleted = 0'

//   con.query(sql, [order_id], (err, data) => {
//     if (err) {
//       return res.json(err)
//     } else {
//       return res.json(data)
//     }
//   })
// })

app.post('/nodeapp/getcartData', (req, res) => {

  let order_id = req.body.order_id;
  let version = req.body.version;
  let ios = req.body.ios;

  const sql = 'select  ac.* , ap.upload_image , ap.description , ap.type from `awt_cart` ac left join `awt_product` as ap on ac.proid = ap.id where  ac.orderid = ? and ac.deleted = 0'

  con.query(sql, [order_id], (err, data) => {
    if (err) {
      return res.json(err)
    } else {
        if(version || ios){
      return res.json(data)
            
        }else{
            return res.json([])
        }
    }
  })
})

app.post('/nodeapp/vendorProducts', (req, res, next) => {
  const { vendorId } = req.body;
  const sql = 'SELECT * FROM awt_product WHERE v_id = ? AND deleted = 0'
  con.query(sql, [vendorId], (error, data) => {
    if (error) {
      return res.json(error);
    } else {
      return res.json(data);
    }
  })
})

// app.post('/nodeapp/vendorList', (req, res, next) => {
//   let loc_id = req.body.loc_id;


//   const sql = 'SELECT id , company_name FROM vendor WHERE location = ? and  deleted = 0 and status = 1 and active = 1';

//   con.query(sql, [loc_id], (error, data) => {
//     if (error) {
//       return res.json(error);
//     } else {
//       return res.json(data);
//     }
//   })
// })

app.post('/nodeapp/vendorList', (req, res, next) => {
  let loc_id = req.body.loc_id;
  let version = req.body.version;
  let ios = req.body.ios;


  const sql = 'SELECT id , company_name FROM vendor WHERE location = ? and  deleted = 0 and status = 1 and active = 1';

  con.query(sql, [loc_id], (error, data) => {
    if (error) {
      return res.json(error);
    } else {
        if(version || ios){
      return res.json(data);
            
        }else{
            return res.json([])
        }
    }
  })
})


app.get('/nodeapp/selectLocation', (req, res, next) => {
  const { latitude, longitude } = req.body;

  const getLocation = 'SELECT id, location, longitude, latitude from location WHERE deleted = 0';

  con.query(sql, (err, data) => {
    if (err) {
      return res.json(err);
    }
    else return res.json(data);

  })
})

app.post('/nodeapp/deletecart', (req, res) => {
  const { user_id, prodid } = req.body;

  const sql = 'UPDATE table_name SET deleted = 1 WHERE user_id = ? and prod_id = ?'

  con.query(sql, [user_id, prodid], (error, data) => {
    if (error) {
      return res.json(error);
    } else {
      return res.json(data);
    }
  })
})

app.post('/nodeapp/getMobile', (req, res) => {
  const data = req.body.user_id;

  const sql = 'SELECT mobile FROM `awt_registeruser` WHERE id = ?';

  con.query(sql, [data], (error, data) => {
    if (error) {
      return res.json();
    } else {
      return res.json(data);
    }
  })
})
app.post('/nodeapp/updateMobile', (req, res, next) => {
  const { mobile, user_id } = req.body;
  console.log(mobile, user_id);
  const sql = 'UPDATE awt_adminuser SET mobile = ? WHERE id = ?';

  con.query(sql, [mobile, user_id], (error, data) => {
    if (error) {
      return res.json(error);
    } else {
      return res.json(data);
    }
  })
})

app.post('/nodeapp/remove_product', (req, res) => {
  let cart_id = req.body.cart_id

  const sql = 'update `awt_cart` set deleted = 1 where id = ?'

  con.query(sql, [cart_id], (err, data) => {
    if (err) {
      return res.json(err)
    } else {
      return res.json(data)
    }
  })


})

app.post(`/nodeapp/update_product_count`, (req, res) => {
  let cart_id = req.body.cartid
  let pqty = req.body.proqty
  let cgst = req.body.cgstamt
  let sgst = req.body.sgstamt

  let newcgst = cgst * pqty
  let newsgst = sgst * pqty

  let gst = newcgst + newsgst

  const sql = 'update `awt_cart` set  gstamt = ?,cgstamt = ? , sgstamt = ?, pqty = ? where id = ?'

  con.query(sql, [gst, newcgst, newsgst, pqty, cart_id], (err, data) => {
    if (err) {
      return res.json(err)
    } else {
      return res.json(data)
    }
  })


})




app.post('/nodeapp/check_coupen_new', (req, res) => {
  let coupon = req.body.coupon
  let v_id = req.body.v_id;
  let companyid = req.body.companyid;
  let date = new Date();
  let amount = req.body.amount;


  let user_id = req.body.user_id;

  const sql = "select * from `awt_coupon_code` where couponCode = ?  and status = 1"

  con.query(sql, [coupon], (err, data) => {
    if (err) {
      return res.json(err)
    } else {
      if (data.length !== 0) {
        const vendors = data.map((item) => item.vendor.split(',').map(Number));
        const parsedV_id = v_id.map(Number);
        const company = data.map((item) => item.company.split(',').map(Number))


        // Err Messages 

        const user_err = data[0].userError;
        const validityError = data[0].validityError;
        const couponError = data[0].couponError;
        const minAmterr = data[0].minAmtError;


        const vendorMatches = vendors.some((vendor) => vendor.some(id => parsedV_id.includes(id)))
        const companyMatches = company.some(innerArray => innerArray.includes(Number(companyid)))

        if (vendorMatches && companyMatches) {
          const enddate = data[0].endDate;
          const startdate = data[0].startDate;
          const couponid = data[0].id

          if (startdate && enddate) {

            const checkdatewise = "SELECT * FROM `awt_coupon_code` WHERE startDate <= ? AND endDate >= ? AND couponCode = ?";

            con.query(checkdatewise, [date, date, coupon], (err, data) => {
              if (err) {
                return res.json(err);
              } else {
                if (data.length == 0) {
                  return res.json({ msg: validityError })

                } else {

                  const minmaxAmt = "select * from `awt_coupon_code` where minAmt <= ? AND maxAmt >= ? AND couponCode = ? ";

                  con.query(minmaxAmt, [amount, amount, coupon], (err, data) => {
                    if (err) {
                      return res.json(err)
                    } else {
                      if (data.length == 0) {
                        return res.json({ msg: minAmterr })
                      } else {
                        const checkusecount = "select * from `order` where couponID = ? and ostatus = 'placed' ";

                        con.query(checkusecount, [couponid], (err, data) => {
                          if (err) {
                            return res.json(err)
                          } else {

                            const usagecount = data.length;

                            const checktotalusage = "select * from `awt_coupon_code` where totalUsage >= ? and couponCode = ?";

                            con.query(checktotalusage, [usagecount, coupon], (err, data) => {
                              if (err) {
                                return res.json(err)
                              } else {
                                if (data.length == 0) {
                                  return res.json({ msg: user_err })
                                } else {
                                  const checkuserusagecount = "select * from  `order` where couponID = ? and ostatus = 'placed' and userid = ?"

                                  con.query(checkuserusagecount, [couponid, user_id], (err, userusagedata) => {
                                    if (err) {
                                      return res.json(err)
                                    } else {

                                      const userusagecount = userusagedata.length;

                                      const checkusersage = "select * from `awt_coupon_code` where userUsage > ? and couponCode = ?"

                                      con.query(checkusersage, [userusagecount, coupon], (err, data) => {
                                        if (err) {
                                          return res.json(err)
                                        } else {
                                          if (data.length == 0) {
                                            return res.json({ msg: "err" })
                                          } else {
                                            // const finalquery = "select id as  couponid , discountAmtPer , couponCode ,couponType from `awt_coupon_code` where couponCode = ? and status = 1"

                                            // con.query(finalquery, [coupon], (err, data) => {
                                            //   if (err) {
                                            //     return res.json(err)
                                            //   } else {
                                            //     return res.json(data)
                                            //   }
                                            // })

                                            const getflag = "select * from `awt_coupon_code` where couponCode = ? and status = 1"

                                            let resultsArray = [];
                                            con.query(getflag, [coupon], (err, data) => {
                                              if (err) {
                                                return res.json(err);
                                              } else {
                                                if (data && data.length > 0) {
                                                  const flag = data[0].couponType;
                                                  const percentage = data[0].discountAmtPer;
                                                  const couponid = data[0].id;
                                                  const couponCode = data[0].couponCode;
                                                  const minamt = data[0].minAmt


                                                  if (flag == 2) {
                                                    const famount = amount - (amount * (percentage / 100));
                                                    resultsArray.push({ couponid: couponid, discountAmtPer: famount, couponCode: couponCode, minamt: minamt }); // Assuming you want to send the result as a response
                                                  } else {
                                                    resultsArray.push({ couponid: couponid, discountAmtPer: percentage, couponCode: couponCode, minamt: minamt });
                                                  }

                                                  res.json(resultsArray);
                                                } else {
                                                  res.json({ message: 'No data found' });
                                                }
                                              }
                                            });

                                          }
                                        }
                                      })

                                    }
                                  })
                                }
                              }
                            })
                          }
                        })
                      }
                    }
                  })
                }
              }
            });
          } else {
            const checkdatewise = "SELECT * FROM `awt_coupon_code` WHERE  couponCode = ?";

            con.query(checkdatewise, [coupon], (err, data) => {
              if (err) {
                return res.json(err);
              } else {
                if (data.length == 0) {
                  return res.json({ msg: validityError })

                } else {

                  const minmaxAmt = "select * from `awt_coupon_code` where minAmt <= ? AND maxAmt >= ? AND couponCode = ? ";

                  con.query(minmaxAmt, [amount, amount, coupon], (err, data) => {
                    if (err) {
                      return res.json(err)
                    } else {
                      if (data.length == 0) {
                        return res.json({ msg: minAmterr })
                      } else {
                        const checkusecount = "select * from `order` where couponID = ? and ostatus = 'placed' ";

                        con.query(checkusecount, [couponid], (err, data) => {
                          if (err) {
                            return res.json(err)
                          } else {

                            const usagecount = data.length;

                            const checktotalusage = "select * from `awt_coupon_code` where totalUsage >= ? and couponCode = ?";

                            con.query(checktotalusage, [usagecount, coupon], (err, data) => {
                              if (err) {
                                return res.json(err)
                              } else {
                                if (data.length == 0) {
                                  return res.json({ msg: user_err })
                                } else {
                                  const checkuserusagecount = "select * from  `order` where couponID = ? and ostatus = 'placed' and userid = ?"

                                  con.query(checkuserusagecount, [couponid, user_id], (err, userusagedata) => {
                                    if (err) {
                                      return res.json(err)
                                    } else {

                                      const userusagecount = userusagedata.length;

                                      const checkusersage = "select * from `awt_coupon_code` where userUsage > ? and couponCode = ?"

                                      con.query(checkusersage, [userusagecount, coupon], (err, data) => {
                                        if (err) {
                                          return res.json(err)
                                        } else {
                                          if (data.length == 0) {
                                            return res.json({ msg: "err" })
                                          } else {
                                            // const finalquery = "select id as  couponid  , discountAmtPer , couponCode ,couponType from `awt_coupon_code` where couponCode = ? and status = 1"

                                            // con.query(finalquery, [coupon], (err, data) => {
                                            //   if (err) {
                                            //     return res.json(err)
                                            //   } else {
                                            //     return res.json(data)
                                            //   }
                                            // })

                                            const getflag = "select * from `awt_coupon_code` where couponCode = ? and status = 1"
                                            let resultsArray = [];
                                            con.query(getflag, [coupon], (err, data) => {
                                              if (err) {
                                                return res.json(err);
                                              } else {
                                                if (data && data.length > 0) {
                                                  const flag = data[0].couponType;
                                                  const percentage = data[0].discountAmtPer;
                                                  const couponid = data[0].id;
                                                  const couponCode = data[0].couponCode;
                                                  const minamt = data[0].minAmt;


                                                  if (flag == 2) {
                                                    const famount = amount - (amount * (percentage / 100));
                                                    resultsArray.push({ couponid: couponid, discountAmtPer: famount, couponCode: couponCode, minamt: minamt }); // Assuming you want to send the result as a response
                                                  } else {
                                                    resultsArray.push({ couponid: couponid, discountAmtPer: percentage, couponCode: couponCode, minamt: minamt });
                                                  }

                                                  res.json(resultsArray);
                                                } else {
                                                  res.json({ message: 'No data found' });
                                                }
                                              }
                                            });
                                          }
                                        }
                                      })

                                    }
                                  })
                                }
                              }
                            })
                          }
                        })
                      }
                    }
                  })
                }
              }
            });
          }

        } else {



          return res.json({ msg: "Enter valid coupon No" })
        }
      } else {

        if (coupon == "") {

          return res.json({ msg: "Please Enter coupon code" })
        } else {

          return res.json({ msg: "Coupon Not Found" })
        }
      }


    }
  })
})






// app.post('/nodeapp/get_loc', (req, res) => {
//   let loc_id = req.body.loc_id;

//   // Split the loc_id string into an array of individual IDs
//   let loc_ids = loc_id.split(',');

//   const sql = 'SELECT id, location FROM `location` WHERE deleted = 0 and  status = 1';

//   con.query(sql, (err, data) => {
//     if (err) {
//       return res.json(err);
//     } else {
//       // Filter the data based on loc_ids
//       const filter = data.filter((item) => loc_ids.includes(String(item.id)));
//       return res.json(filter);
//     }
//   });
// });

app.post('/nodeapp/get_loc', (req, res) => {
  let loc_id = req.body.loc_id;
  let version  = req.body.version;
  let ios  = req.body.ios;

  // Split the loc_id string into an array of individual IDs
  let loc_ids = loc_id.split(',');

  const sql = 'SELECT id, location FROM `location` WHERE deleted = 0 and  status = 1';

  con.query(sql, (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      // Filter the data based on loc_ids
      if(version || ios){
                const filter = data.filter((item) => loc_ids.includes(String(item.id)));
      return res.json(filter);
      }else{
          return res.json([])
      }

    }
  });
});


app.post('/nodeapp/getorderdetails', (req, res) => {
  let user_id = req.body.user_id;

  const sql = "SELECT orderno, mobileno,address1,paymode,ostatus , ac.proid FROM `order` as o left JOIN awt_cart as ac on o.id = ac.orderid WHERE o.userid = ? and o.deleted = 0;"

  con.query(sql, [user_id], (err, data) => {
    if (err) {
      return res.json(err)
    } else {
      return res.json(data)
    }
  })
})


app.post('/nodeapp/update_profile', (req, res) => {
  let email = req.body.email;
  let mobile = req.body.mobile;
  let fullname = req.body.fullname
  let user_id = req.body.user_id
  let gender = req.body.gender

  const sql = "update `awt_registeruser` set email = ? , mobile = ? , firstname = ?, gender = ? where id = ? and deleted = 0"

  con.query(sql, [email, mobile, fullname, gender, user_id], (err, data) => {
    if (err) {
      return res.json(err)
    } else {
      return res.json(data)
    }
  })

})


app.post(`/nodeapp/getorderhistory`, (req, res) => {

  let user_id = req.body.user_id;

  const sql = "select id, orderno,ostatus,totalamt,order_date from `order` where userid = ? and ostatus != 'incart' order by id desc"

  con.query(sql, [user_id], (err, data) => {
    if (err) {
      return res.json(err)
    } else {
      return res.json(data)
    }
  })
})

app.post(`/nodeapp/getitemlist`, (req, res) => {

  let order_id = req.body.order_id;

  const sql = "select id ,  pname , pqty , price , orderstatus from `awt_cart` where orderid = ? and deleted = 0"

  con.query(sql, [order_id], (err, data) => {
    if (err) {
      return res.json(err)
    } else {
      return res.json(data)
    }
  })
})

app.post('/nodeapp/ordercomplete', (req, res) => {


  let order_id = req.body.order_id;
  let date = new Date();
  let Placed = "placed";
  let razorpay_payment_id = req.body.razorpay_payment_id;
  let razorpay_order_id = req.body.razorpay_order_id;
  let razorpay_signature = req.body.razorpay_signature;
  let transactionamt = req.body.transactionamt



  const sql = "update `order` set ostatus = ? , orderstatus = 1 , payment_date = ? ,transactionid= ?, razor_orderid =? ,razor_signature= ?, transacamount= ? , paystatus = 1  where  id = ?  and deleted = 0"

  con.query(sql, [Placed, date, razorpay_payment_id, razorpay_order_id, razorpay_signature, transactionamt, order_id], (err, data) => {
    if (err) {
      return res.json(err)
    } else {

      const updatecart = "update `awt_cart` set orderstatus = 1 where orderid = ?"

      con.query(updatecart, [order_id], (err, data) => {
        if (err) {
          return res.json(err)
        } else {
          return res.json({ status: 1 })


        }
      })

    }
  })
})


app.post('/nodeapp/orderadd', (req, res) => {

  let locationid = req.body.locationid;
  let firstname = req.body.firstname;
  let order_id = req.body.order_id;
  let mobile = req.body.mobile;
  let email = req.body.email;
  let totalPrice = req.body.totalPrice;
  let date = new Date();
  let placed = "incart";
  let v_id = req.body.v_id;
  let v_id_str = String(v_id);



  const sql = "update `order` set vendor_id = ?, location_id = ? ,firstname = ? , mobileno = ? , email = ? , payment_date = ? , order_date = ? , updated_date = ? ,totalamt = ?  , orderstatus = 0  where id = ?  and deleted = 0"

  con.query(sql, [v_id_str, locationid, firstname, mobile, email, date, date, date, totalPrice, order_id], (err, data) => {
    if (err) {
      return res.json(err)
    } else {

      const updatecart = "update `awt_cart` set orderstatus = 0 where orderid = ?"

      con.query(updatecart, [order_id], (err, data) => {
        if (err) {
          return res.json(err)
        } else {

          const sql = "select * from `order` where `ostatus` != 'incart'"

          con.query(sql, (err, data) => {
            if (err) {
              return res.json(err)
            } else {


              const count = data.length
              const ordercount = count + 1
              const currentDate = new Date();
              const day = String(currentDate.getDate()).padStart(2, '0');
              const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero based
              const year = currentDate.getFullYear().toString().substr(-2);

              const orderno = "UMI" + "-" + year + month + day + "-" + ordercount;
              const sql = "update `order` set `orderno` = ? , `ostatus` = ?  where `id`  = ?"

              con.query(sql, [orderno, placed, order_id], (err, data) => {
                if (err) {
                  return res.json(err)
                } else {

                  const getcart = 'select  ac.* , ap.upload_image from `awt_cart` ac left join `awt_product` as ap on ac.proid = ap.id where  ac.orderid = ? and ac.deleted = 0'

                  con.query(getcart, [order_id], (err, data) => {
                    if (err) {
                      return res.json(err)
                    } else {

                      return res.json(data)



                    }
                  })

                }
              })


              //   const checkorderno = "select * from `order` where orderno IS NULL and  id =? "

              //   con.query(checkorderno, [order_id], (err, data) => {
              //     if (err) {
              //       return res.json(err)
              //     } else {
              //       const datacount = data.length

              //       if (datacount == 1) {


              //       } else {
              //          return res.json("Already have orderno")


              //       }
              //     }
              //   })





            }
          })
        }
      })





    }
  })
})


app.post('/nodeapp/orderconfirm', (req, res) => {

  let locationid = req.body.locationid;
  let firstname = req.body.firstname;
  let order_id = req.body.order_id;
  let mobile = req.body.mobile;
  let email = req.body.email;
  let totalPrice = req.body.totalPrice;
  let date = new Date();
  let placed = "placed";
  let v_id = req.body.v_id;
  let v_id_str = String(v_id);


  const gst = 5

  const percentage = (gst + 100) / 100;
  const gstamt = totalPrice / percentage;

  const sql = "update `order` set vendor_id = ?, location_id = ? ,firstname = ? , mobileno = ? , email = ? , payment_date = ? , order_date = ? , updated_date = ? ,totalamt = ? , gstamt = ? , orderstatus = 1  where id = ?  and deleted = 0"

  con.query(sql, [v_id_str, locationid, firstname, mobile, email, date, date, date, totalPrice, gstamt, order_id], (err, data) => {
    if (err) {
      return res.json(err)
    } else {

      const updatecart = "update `awt_cart` set orderstatus = 1 where orderid = ?"

      con.query(updatecart, [order_id], (err, data) => {
        if (err) {
          return res.json(err)
        } else {

          const sql = "select * from `order` where `ostatus` != 'incart'"

          con.query(sql, (err, data) => {
            if (err) {
              return res.json(err)
            } else {
              const count = data.length
              const ordercount = count + 1
              const currentDate = new Date();
              const day = String(currentDate.getDate()).padStart(2, '0');
              const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero based
              const year = currentDate.getFullYear().toString().substr(-2);

              const orderno = "UMI" + "-" + year + month + day + "-" + ordercount


              const sql = "update `order` set `orderno` = ? , `ostatus` = ?  where `id`  = ?"

              con.query(sql, [orderno, placed, order_id], (err, data) => {
                if (err) {
                  return res.json(err)
                } else {

                  const getcart = 'select  ac.* , ap.upload_image from `awt_cart` ac left join `awt_product` as ap on ac.proid = ap.id where  ac.orderid = ? and ac.deleted = 0'

                  con.query(getcart, [order_id], (err, data) => {
                    if (err) {
                      return res.json(err)
                    } else {

                      return res.json(data)

                      // Send confirmation email
                      //   const mailOptions = {
                      //     from: 'dharvik.badga22@gmail.com', // Replace with your email
                      //     to: 'satyamsatkr875@gmail.com',

                      //     subject: 'Order Confirmation',

                      //     text: `Dear ${firstname},\n\nYour order has been confirmed.\n\nOrder Number: ${orderno}\nTotal Price: ${totalPrice}\n\nThank you for shopping with us!\n\nBest regards,\nYour Company`,


                      //     html: `<div style='padding: 50px 0px;background: #f5f5f5;width: 100%;font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif;'>
                      //  <div style='border: 0px solid #70d8ed; padding: 20px;background: #fff; width: 700px; margin: 0 auto;'>
                      //     <div style='padding-bottom:20px;margin-bottom:20px;border-bottom:1px solid #f5f5f5;'>
                      //         <div style=' text-align:center;'>
                      //             <a href=''>
                      //                 <img src='https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?cs=srgb&dl=pexels-anjana-c-169994-674010.jpg&fm=jpg' style='width:150px;' />
                      //             </a>
                      //         </div>
                      //     </div>            
                      //     <div>
                      //         <p style='margin:0px 0px 10px 0px; letter-spacing: 0.5px;'>Hello <b>${firstname}</b>, </p>
                      //         <p style='margin:0px 0px 10px 0px; letter-spacing: 0.5px;'>Thank you for Booking Order Your order<b>( ${orderno} )</b> has been placed successfully.</p>
                      //         <p></p>
                      //         <h3 style='color:#4d4d4d;margin: 0;padding: 10px 0px 10px; letter-spacing: 0.5px;'>Shipping/Billing Address:</h3>
                      //         <div style='letter-spacing: 0.5px;color: #4d4d4d;line-height: 20px;margin-bottom: 15px;'>

                      //         </div>
                      //         <div style='background-color: #f2f2f2;padding: 10px;'>
                      //             <div style='background-color: white; padding: 10px;'>
                      //                 <h3 style='letter-spacing: 0.5px; margin: 0; padding: 10px 0px;'>Order Summary | <strong>(${orderno})</strong></h3>
                      //                 <table style='width: 100%; font-size: 12px; border-collapse: collapse;'>
                      //                     <thead>
                      //                         <tr>

                      //                         <th style='border-bottom-width: 1px;border-bottom-color: #f7f7f7; border-bottom-style: solid;padding-bottom: 10px; padding-top: 10px; text-align: left;'><strong>Product image</strong></th>
                      //                             <th style='border-bottom-width: 1px;border-bottom-color: #f7f7f7; border-bottom-style: solid;padding-bottom: 10px; padding-top: 10px; text-align: left;'><strong>Product Name</strong></th>
                      //                             <th style='border-bottom-width: 1px;border-bottom-color: #f7f7f7; border-bottom-style: solid;padding-bottom: 10px; padding-top: 10px; text-align: left;'><strong>HSN </strong></th>
                      //                             <th style='border-bottom-width: 1px;border-bottom-color: #f7f7f7; border-bottom-style: solid;padding-bottom: 10px; padding-top: 10px; text-align: left;'><strong>Gst</strong></th>
                      //                             <th style='border-bottom-width: 1px;border-bottom-color: #f7f7f7; border-bottom-style: solid;padding-bottom: 10px; padding-top: 10px; text-align: left;'><strong>Qty</strong></th>
                      //                             <th style='border-bottom-width: 1px;border-bottom-color: #f7f7f7; border-bottom-style: solid;padding-bottom: 10px; padding-top: 10px; text-align: right;'><strong>Amount</strong></th>
                      //                         </tr>
                      //                     </thead>
                      //                     <tbody>

                      //                   ${data.map((items) => {
                      //       const gstamt = parseFloat(items.gstamt);
                      //       return (
                      //         `<tr>

                      //           <td style='width: 30%;'>
                      //             <img style="width:100px" src='https://thetalentclub.co.in/umi/upload/product/${items.upload_image}' />
                      //             <br />
                      //           </td>
                      //           <td style='width: 10%;'><p>${items.pname}</p></td>
                      //           <td style='padding:10px 0px; width: 20%;'>${items.hsn_code}</td>
                      //           <td style='padding:10px 0px; width: 10%;'>${gstamt.toFixed(1)}</td>
                      //           <td style='padding:10px 0px; text-align: right; width: 10%;'>${items.pqty}</td>
                      //           <td style='padding:10px 0px; text-align: right; width: 20%;'>${items.price * items.pqty}</td>
                      //         </tr>`
                      //       )
                      //     })}  





                      //                               <tr>
                      //                                     <td colspan='4' style='text-align:right;padding: 10px 0px;'>Basic Amt: </td>
                      //                                     <td colspan='4' style='text-align: right;padding: 10px 0px;'>${totalPrice}</td>
                      //                                 </tr>


                      //                                   <tr>    
                      //                                         <td colspan='4' style='text-align:right;padding: 10px 0px;'>Coupon Discount : </td>
                      //                                         <td colspan='4' style='text-align: right; padding: 10px 0px;'></td>
                      //                                     </tr>

                      //                                  <tr>
                      //                                     <td colspan='4' style='text-align:right;padding: 10px 0px;'><h3>Final Payable Amount : </h3></td>
                      //                                     <td colspan='4' style='text-align:right;padding: 10px 0px;'><h3>${totalPrice}</h3></td>
                      //                                 </tr>



                      //                 </tbody>
                      //             </table>
                      //             </div>
                      //         </div>
                      //         <div style='padding: 10px 0px 0px;'>
                      //             For any queries visit <a href='' style='text-decoration: none; color:#709deb;'></a>.
                      //         </div>
                      //         <p style='margin: 0;padding: 10px 0px 5px;'>Thank you</p>
                      //         <p style='margin: 0;'></p>
                      //     </div>

                      //   </div>
                      //   </div>`, // html body
                      //   };

                      //   transporter.sendMail(mailOptions, (error, info) => {
                      //      if (error) {
                      //       console.log(error);
                      //       return res.status(500).send('Error sending email');
                      //      } else {
                      //       console.log('Email sent: ' + info.response);
                      //       return res.json(data);
                      //      }
                      //   });






                    }
                  })

                }
              })
            }
          })
        }
      })





    }
  })
})

app.post(`/nodeapp/getorderstatus`, (req, res) => {

  let user_id = req.body.user_id;

  const sql = "select id, ostatus from `order` where userid = ? order by id desc limit 1"

  con.query(sql, [user_id], (err, data) => {
    if (err) {
      return res.json(err)
    } else {


      if (data.length > 0) {

        const order_id = data[0].id
        const order_status = data[0].ostatus

        const getcartstatus = 'select id,pname,orderstatus from `awt_cart` where orderid = ? and orderstatus > 2 and deleted = 0'

        con.query(getcartstatus, [order_id], (err, data) => {
          if (err) {
            return res.json(err)
          } else {
            return res.json({ mainorder: order_status, cartstatus: data })
          }
        })

      }

    }
  })
})

app.post('/nodeapp/getstatus', (req, res) => {

  let orderid = req.body.orderid;

  const sql = "select * from `awt_cart` where orderid = ? and orderstatus = 4"

  con.query(sql, [orderid], (err, data) => {
    if (err) {
      return res.json(err)
    } else {
      if (data.length == 0) {
        return res.json({ status: 0 })
      } else {
        return res.json({ status: 1 })

      }

    }
  })
})

app.post('/nodeapp/getcalculation', async (req, res) => {
  let orderid = req.body.orderid;
  let discper = req.body.discper;
  let newprice = discper / 100;

  const sql = "SELECT * FROM awt_cart WHERE orderid = ? AND deleted = 0";

  try {
    con.query(sql, [orderid], async (err, data) => {
      if (err) {
        return res.json(err);
      } else {

        for (const element of data) {
          const fprice = element.price - (element.price * newprice);

          const cartid = element.id

          const cpercentage = (Number(element.CGST) + 100) / 100;
          const newCgst = Number(fprice) / cpercentage;
          const FCgst = Number(fprice) - newCgst;

          const spercentage = (Number(element.SGST) + 100) / 100;
          const newSgst = Number(fprice) / spercentage;
          const FSgst = Number(fprice) - newSgst;

          let finalcgst = FCgst * element.pqty
          let finalsgst = FSgst * element.pqty

          const gstAmt = finalcgst + finalsgst;

          const insertSql = 'update awt_cart set cgstamt = ? ,sgstamt = ? , gstamt = ? where id = ?';

          await new Promise((resolve, reject) => {
            con.query(insertSql, [finalcgst, finalsgst, gstAmt, cartid], (insertErr, insertData) => {
              if (insertErr) {
                console.error('Error inserting data:', insertErr);
                reject(insertErr);
              } else {
                console.log('Data inserted successfully');
                resolve(insertData);
              }
            });
          });
        }

        res.json({ message: 'Calculations and insertions completed successfully' });
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/nodeapp/gstcalculation', async (req, res) => {
  let orderid = req.body.orderid;

  const sql = "SELECT DISTINCT CGST FROM awt_cart WHERE orderid = ? AND deleted = 0";

  con.query(sql, [orderid], async (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      try {
        let gstResults = [];

        for (const item of data) {
          const cgst = item.CGST;
          if (cgst > 0) {
            const gstquery = "SELECT SUM(cgstamt) as cgstamt,CGST,SGST,SUM(sgstamt) as sgstamt FROM awt_cart WHERE orderid = ? AND deleted = 0 AND CGST = ?";

            const result = await new Promise((resolve, reject) => {
              con.query(gstquery, [orderid, cgst], (err, result) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(result);
                }
              });
            });

            gstResults.push(result[0]);
          }
        }

        res.json(gstResults);
      } catch (err) {
        res.json(err);
      }
    }
  });
});


app.post('/nodeapp/getofferdata', (req, res) => {

  const company_id = req.body.company_id

  const sql = "select discountAmtPer as price,  couponCode , coupon_code_img ,description from awt_coupon_code where status = 1 and deleted = 0 and  FIND_IN_SET(?,company)"

  con.query(sql, [company_id], (err, data) => {
    if (err) {
      return res.json(err)
    } else {
      return res.json(data)
    }
  })
})

app.post('/nodeapp/getuserloc', (req, res) => {
  let user_id = req.body.user_id

  const sql = "SELECT  c.locationname , c.locationid FROM `awt_registeruser` as ar LEFT JOIN `company` as c on c.id = ar.companyid WHERE ar.id = ? and ar.deleted = 0 and ar.active = 1"

  con.query(sql, [user_id], (err, data) => {
    if (err) {
      return res.json(err)
    } else {
      return res.json(data)
    }
  })

})
app.post('/nodeapp/getcartcount', (req, res) => {

  let order_id = req.body.order_id

  const sql = "SELECT COUNT(*) as count FROM `awt_cart` WHERE orderid = ? and deleted = 0"

  con.query(sql, [order_id], (err, data) => {
    if (err) {
      return res.json(err)
    } else {
      return res.json(data)
    }
  })

})



// function verifyPaymentSignature(orderId, paymentId, signature) {
//   const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET);
//   hmac.update(orderId + "|" + paymentId);
//   const generatedSignature = hmac.digest('hex');

//   return generatedSignature === signature;
// }

// app.post('/nodeapp/payment_verify', (req, res) => {

//   const isValid = verifyPaymentSignature(req.body.razorpay_order_id, req.body.razorpay_payment_id, req.body.razorpay_signature);

//   if (isValid) {
//     // Payment is verified
//     res.json({ pstatus: 1 })
//   } else {
//     // Payment verification failed
//     res.json({ pstatus: 0 })
//   }


// })


app.post('/nodeapp/payment_verify', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = req.body;
  const secret = process.env.RAZORPAY_SECRET; // Use the same secret key you passed when creating the order
  const date = new Date();
  let transactionamt = req.body.transactionamt

  // Insert query with placeholders for values
  const addPaymentLog = "INSERT INTO payment_log (`order_id`, `razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature`, `created_date`,`amount`) VALUES (?,?,?,?,?,?)";

  // Values to be inserted
  const values = [order_id, razorpay_order_id, razorpay_payment_id, razorpay_signature, date, transactionamt];

  con.query(addPaymentLog, values, (err, data) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ error: 'Database error' });
    } else {
      // Payment log added successfully, continue with payment verification
      try {
        // Validate the payment verification
        const isValid = validatePaymentVerification(
          { order_id: razorpay_order_id, payment_id: razorpay_payment_id },
          razorpay_signature,
          secret
        );

        if (isValid) {
          // Payment is valid, proceed with your logic (e.g., update order status in the database)
          console.log("Success");
          res.json({ pstatus: 1 });
        } else {
          // Payment verification failed
          console.log("Failed");
          res.json({ pstatus: 0 });
        }
      } catch (error) {
        // Handle errors
        console.error("Verification Error:", error);
        res.status(500).send('Server Error');
      }
    }
  });
});






app.post('/nodeapp/checkversion', (req, res) => {

  let myversion = req.body.myversion;

  const sql = "select * from version where version  = ?"

  con.query(sql, [myversion], (err, data) => {
    if (err) {
      return res.json(err)
    } else {
      if (data.length > 0) {

        return res.json({ status: 1 })
      } else {
        return res.json({ status: 0 })
      }
    }
  })
});
app.post('/nodeapp/checkiosversion', (req, res) => {

  let myversion = req.body.myversion;

  const sql = "select * from ios_version where version  = ?"

  con.query(sql, [myversion], (err, data) => {
    if (err) {
      return res.json(err)
    } else {
      if (data.length > 0) {

        return res.json({ status: 1 })
      } else {
        return res.json({ status: 0 })
      }
    }
  })
});

app.post('/nodeapp/update_order_id', (req, res) => {
  let { razor_order_id, order_id, price } = req.body;
  let date = new Date();

  const checkorderid = 'SELECT * FROM php_payment_log WHERE order_id = ?';

  con.query(checkorderid, [order_id], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
    //   if (data.length > 0) { // update 
      
    //     const update = 'UPDATE php_payment_log SET amount = ?, razorpay_order_id = ?, updated_date = ? WHERE order_id = ?';

    //     con.query(update, [price, razor_order_id, date, order_id], (err, data) => {
    //       if (err) {
    //         return res.json(err);
    //       } else {
    //         return res.json(data);
    //       }
    //     });

    //   } else {
        
    //   }
           const sql = 'INSERT INTO php_payment_log(`order_id`, `amount`, `razorpay_order_id`, `created_date`) VALUES (?, ?, ?, ?)';

        con.query(sql, [order_id, price, razor_order_id, date], (err, data) => {
          if (err) {
            return res.json(err);
          } else {
            return res.json(data);
          }
        });
        
        
    }
  });
});


app.post('/nodeapp/handleotpdelete' , (req,res) =>{
    let {email, otp} = req.body;
    
         let sql2;
           let param;


           
         if(email == "satyamsatkr875@gmail.com" || email == "Satyamsatkr875@gmail.com"){
                sql2 = "UPDATE awt_registeruser SET otp = '1141' WHERE email = ?";
                     param =[email]

        
         }  else{
                           
                     sql2 = "UPDATE awt_registeruser SET otp = ? WHERE email = ?";
                     param =[otp, email] 

         }
         
         
         con.query(sql2 , param , (err,data) =>{
             if(err){
                 return res.json(err)
             }else{
                 return res.json(data)
             }
         })
         
})
app.post('/nodeapp/confirmdelete', (req, res) => {
    let { email, otp } = req.body;
    
    const sql = "UPDATE awt_registeruser SET deleted = '1' WHERE email = ? AND otp = ?";

    con.query(sql, [email, otp], (err, result) => {
        if (err) {
            return res.json(err);
        } else {
            if (result.affectedRows > 0) {
                return res.json({ status: 1 });
            } else {
                return res.json({ status: 0 });
            }
        }
    });
});

const getPaymentStatus = async () => {
  
  const razorpayKey = process.env.RAZORPAY_KEY_ID;
  const razorpaySecret = process.env.RAZORPAY_SECRET;
  let Placed = "placed";
  const date = new Date();

  // Promise-based MySQL query function
  const queryAsync = (query, params) => {
    return new Promise((resolve, reject) => {
      con.query(query, params, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  };

  // Fetch pending payments
  const checkPayDetails = "SELECT * FROM `php_payment_log` WHERE pstatus = 0 and deleted = 0";

  try {
    const data = await queryAsync(checkPayDetails);

    // Iterate over each item in the data array
    for (const item of data) {
      const { order_id, razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = item;

      try {
        // Fetch payment details from Razorpay
        const response = await axios.get(`https://api.razorpay.com/v1/orders/${razorpay_order_id}`, {
          auth: {
            username: razorpayKey,
            password: razorpaySecret
          }
        });

        const isValid = response.data.status === 'paid'; // Check payment status

        if (isValid) {
          console.log(`Payment for order_id ${razorpay_order_id} is valid`);

          // Update payment_log table
          const updatePaymentStatus = "UPDATE php_payment_log SET pstatus = 1 WHERE razorpay_order_id = ?";
          await queryAsync(updatePaymentStatus, [razorpay_order_id]);

          // Update order table
          const updateOrderQuery = `
            UPDATE \`order\` 
            SET ostatus = ?, orderstatus = 1, payment_date = ?, transactionid = ?, razor_orderid = ?, razor_signature = ?, transacamount = ?, paystatus = 1 
            WHERE id = ? AND deleted = 0
          `;
          await queryAsync(updateOrderQuery, [Placed, date, razorpay_payment_id, razorpay_order_id, razorpay_signature, amount, order_id]);

          // Update cart status
          const updateCartQuery = "UPDATE `awt_cart` SET orderstatus = 1 WHERE orderid = ?";
          await queryAsync(updateCartQuery, [order_id]);

        } else {
          console.log(`Payment for order_id ${razorpay_order_id} failed`);

          // Update payment status to 2 (failed)
          const updatePaymentStatus = "UPDATE php_payment_log SET pstatus = 2 WHERE razorpay_order_id = ?";
          await queryAsync(updatePaymentStatus, [razorpay_order_id]);
        }

      } catch (error) {
        console.error(`Verification Error for order_id ${razorpay_order_id}:`, error);
      }
    }
  } catch (err) {
    console.error("Error fetching payment details:", err);
  }
};

