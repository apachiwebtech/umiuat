// Send confirmation email
              const mailOptions = {
                from: 'dharvik.badga22@gmail.com', // Replace with your email
                to: 'satyamsatkr875@gmail.com',

                subject: 'Order Confirmation',

                text: `Dear ${firstname},\n\nYour order has been confirmed.\n\nOrder Number: ${orderno}\nTotal Price: ${totalPrice}\n\nThank you for shopping with us!\n\nBest regards,\nYour Company`,


                html: `<div style='padding: 50px 0px;background: #f5f5f5;width: 100%;font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif;'>
                <div style='border: 0px solid #70d8ed; padding: 20px;background: #fff; width: 700px; margin: 0 auto;'>
                    <div style='padding-bottom:20px;margin-bottom:20px;border-bottom:1px solid #f5f5f5;'>
                        <div style=' text-align:center;'>
                            <a href=''>
                                <img src='https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?cs=srgb&dl=pexels-anjana-c-169994-674010.jpg&fm=jpg' style='width:150px;' />
                            </a>
                        </div>
                    </div>            
                    <div>
                        <p style='margin:0px 0px 10px 0px; letter-spacing: 0.5px;'>Hello </p>
                        <p style='margin:0px 0px 10px 0px; letter-spacing: 0.5px;'>Thank you for Booking Order Your order( ${orderno} )<b></b> has been placed successfully.</p>
                        <p></p>
                        <h3 style='color:#4d4d4d;margin: 0;padding: 10px 0px 10px; letter-spacing: 0.5px;'>Shipping/Billing Address:</h3>
                        <div style='letter-spacing: 0.5px;color: #4d4d4d;line-height: 20px;margin-bottom: 15px;'>

                        </div>
                        <div style='background-color: #f2f2f2;padding: 10px;'>
                            <div style='background-color: white; padding: 10px;'>
                                <h3 style='letter-spacing: 0.5px; margin: 0; padding: 10px 0px;'>Order Summary | <strong>(${orderno})</strong></h3>
                                <table style='width: 100%; font-size: 12px; border-collapse: collapse;'>
                                    <thead>
                                        <tr>
                                         
                                            <th style='border-bottom-width: 1px;border-bottom-color: #f7f7f7; border-bottom-style: solid;padding-bottom: 10px; padding-top: 10px; text-align: left;'><strong>Product Name</strong></th>
                                            <th style='border-bottom-width: 1px;border-bottom-color: #f7f7f7; border-bottom-style: solid;padding-bottom: 10px; padding-top: 10px; text-align: left;'><strong>HSN </strong></th>
                                            <th style='border-bottom-width: 1px;border-bottom-color: #f7f7f7; border-bottom-style: solid;padding-bottom: 10px; padding-top: 10px; text-align: left;'><strong>Price</strong></th>
                                            <th style='border-bottom-width: 1px;border-bottom-color: #f7f7f7; border-bottom-style: solid;padding-bottom: 10px; padding-top: 10px; text-align: left;'><strong>Qty</strong></th>
                                            <th style='border-bottom-width: 1px;border-bottom-color: #f7f7f7; border-bottom-style: solid;padding-bottom: 10px; padding-top: 10px; text-align: right;'><strong>Amount</strong></th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                       
                                     <tr>
                                
                                        <td style='width: 30%;'>
                                            <p></p>
                                            
                                            <br/>
                                        </td>
                                        <td style='width: 10%;'><p></p></td>
                                        <td style='padding:10px 0px; width: 20%;'></td>
                                        <td style='padding:10px 0px; width: 10%;'></td>
                                        <td style='padding:10px 0px; text-align: right; width: 20%;'></td>
                                    </tr>
                                
                                          
                                         

                                              <tr>
                                                    <td colspan='4' style='text-align:right;padding: 10px 0px;'>Basic Amt: </td>
                                                    <td colspan='4' style='text-align: right;padding: 10px 0px;'></td>
                                                </tr>
                                        
                                              
                                                   <tr>    
                                                        <td colspan='4' style='text-align:right;padding: 10px 0px;'>Coupon Discount : </td>
                                                        <td colspan='4' style='text-align: right; padding: 10px 0px;'></td>
                                                    </tr>
                                                
                                                 <tr>
                                                    <td colspan='4' style='text-align:right;padding: 10px 0px;'><h3>Final Payable Amount : </h3></td>
                                                    <td colspan='4' style='text-align:right;padding: 10px 0px;'><h3></h3></td>
                                                </tr>
                                
         
                   
                                </tbody>
                            </table>
                            </div>
                        </div>
                        <div style='padding: 10px 0px 0px;'>
                            For any queries visit <a href='' style='text-decoration: none; color:#709deb;'></a>.
                        </div>
                        <p style='margin: 0;padding: 10px 0px 5px;'>Thank you</p>
                        <p style='margin: 0;'></p>
                    </div>
                    
                </div>
             </div>`, // html body
              };

              transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  console.log(error);
                  return res.status(500).send('Error sending email');
                } else {
                  console.log('Email sent: ' + info.response);
                  return res.json(data);
                }
              });
