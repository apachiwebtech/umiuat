import React, { useEffect, useState } from 'react'
import InnerHeader from '../Layout/InnerHeader'
import axios from 'axios'
import { BASE_URL } from '../Utils/BaseUrl'

function OrderHistory() {


  const [data, setData] = useState([])
  const [list, setlist] = useState([])
  const [invoice, setInvoices] = useState([])


  async function getorderdetails() {


    const data = {
      user_id: localStorage.getItem(`food_id`)
    }
    axios.post(`${BASE_URL}/getorderhistory`, data)
      .then((res) => {
        console.log(res)
        setData(res.data)
      })
  }

  useEffect(() => {
    getorderdetails()
  }, [])


  const handlelist = (id) => {
    axios.post(`${BASE_URL}/getitemlist`, { order_id: id })

      .then((res) => {
        setlist(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }
  const handleinvoices = (id) => {
    axios.post(`${BASE_URL}/getinvoices`, { order_id: id })

      .then((res) => {
        setInvoices(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <>
      <InnerHeader />
      <div className='navi'>
        <p><i class="bi bi-bag"></i> My Orders</p>
      </div>
      {data.map((item) => {
        const orderDate = new Date(item.order_date);

        // Format the date to 'MM/DD/YYYY' format or any other preferred format
        const formattedDate = orderDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });

        const capitalizeFirstLetter = (string) => {
          return string.charAt(0).toUpperCase() + string.slice(1);
        };

        return (
          <div>
            <div className="card m-2 p-2 my-4">
              <div className='d-flex justify-content-between order-no'>
                <p className=''>Order number : <b>{item.orderno || "1"}</b></p>
                <b style={{ color: "lightslategrey" }}>{formattedDate}</b>
              </div>
              <div className='py-2 d-flex justify-content-between'>
                <p className='total-amt'>Order Amt: <b className='text-dark'>{item.totalamt || "0"}/-</b></p>
                <p className='total-amt'>Status:&nbsp;<b className={item.ostatus == "placed" ? "text-warning" : "text-success"}> {capitalizeFirstLetter(item.ostatus)}</b></p>
              </div>
              <div className='row'>
                <div className='col-6 p-2'>
                  <button className='btn border border-warning w-100' onClick={() => handlelist(item.id)} type="button" data-bs-toggle="modal" data-bs-target="#exampleModal">View Items</button>
                </div>
                <div className='col-6 p-2'>
                  <button className='btn border border-warning w-100' onClick={() => handleinvoices(item.id)} data-bs-toggle="modal" data-bs-target="#exampleModal1" type="button">Invoice</button>

                </div>

              </div>

            </div>

            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Item List</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <table width="100%" >
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Product Name</th>
                          <th>Price</th>
                          <th>Qty</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {list.map((item, index) => {
                          return (
                            <tr>
                              <td>{index + 1}</td>
                              <td>{item.pname}</td>
                              <td>{item.price}</td>
                              <td>{item.pqty}</td>
                              <td>{item.orderstatus == 1 ? <div className='text-danger'>Placed</div> : item.orderstatus == 2 ? <div className='text-warning'>Processing</div> : item.orderstatus == 3 ? <div className='text-success'>Ready</div> : item.orderstatus == 4 ? <div className='text-success'>Delivered</div> : <div></div>}</td>
                            </tr>
                          )
                        })}
                      </tbody>

                    </table>

                  </div>

                </div>
              </div>
            </div>
            <div class="modal fade" id="exampleModal1" tabindex="-1" aria-labelledby="exampleModalLabel1" aria-hidden="true">
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Invoice List</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <table width="100%" >
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Invoice No.</th>
                          <th>View</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoice.map((item, index) => {
                          return (
                            <tr>
                              <td>{index + 1}</td>
                              <td>{item.invoice_no}</td>
                              <td className='btn btn-primary btn-sm mb-1'  ><a href={`https://viggorventures.com/webloginuat/invoice.php?id=${item.id}`} download>Download</a></td>
                            </tr>
                          )
                        })}
                      </tbody>

                    </table>

                  </div>

                </div>
              </div>
            </div>

          </div>
        )

      })}

    </>
  )
}

export default OrderHistory