import React, { useState, useEffect } from "react";
import { Tabs } from "antd";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import Swal from "sweetalert2";
import { Divider, Space, Tag } from 'antd';

const Profilescreen = () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    if (!user) {
      window.location.href = "/login";
    }
  }, []);

  const items = [
    {
      key: "1",
      label: <b>My Account</b>,
      children: (
        <><div className="col-md-6 bs ">
      
          <p><b>Name</b> : {user.name} </p>
          <p><b>Email</b> : {user.email} </p>
          <p><b>isAdmin</b> : {user.isAdmin ? "Yes": "No"}</p>
           {user.isAdmin && (
            <div className="text-right ">
            <button className="btn  " onClick={()=>window.location.href="/admin"}>
                Go to Admin Panel
            </button>
            </div>
          )}
          </div>
        </>
      ),
    },
    {
      key: "2",
      label: <b>My Bookings</b>,
      children: (
        <>
          <MyBookings />
        </>
      ),
    },
  ];
  return (
    <div className="ml-3 mt-3">
      <Tabs defaultActiveKey="1" items={items}></Tabs>
    </div>
  );
};

export default Profilescreen;

export function MyBookings() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const [bookings, setbookings] = useState([]);
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setloading(true);
        const data = await (
          await axios.post("https://skilledlabour.onrender.com/api/bookings/getbookingsbyuserid", {
            userid: user._id,
          })
        ).data;
        console.log(data);
        setbookings(data);
        setloading(false);
      } catch (error) {
        console.log(error);
        setloading(false);
        seterror(error);
      }
    };
    fetchData();
  }, []);

  async function cancelBooking(bookingid, serviceid) {
    try {
      setloading(true);
      const result = await (
        await axios.post("https://skilledlabour.onrender.com/api/bookings/cancelbooking", {
          bookingid,
          serviceid,
        })
      ).data;
      console.log(result);
      setloading(false);
      Swal.fire("Cancelled", "Your booking has been cancelled", "success").then(
        (result) => {
          window.location.reload();
        }
      );
    } catch (error) {
      console.log(error);
      setloading(false);
      Swal.fire("Oops", "Something went wrong", "error");
    }
  }

  return (
    <div>
      <div className="row">
        <div className="col-md-6">
          {loading && <Loader />}
          {bookings &&
            bookings.map((booking) => {
              return (
                <div className="bs">
                  <h1>Service : {booking.service}</h1>
                  <p>
                    <b>BookingId</b> : {booking._id}
                  </p>
                  <p>
                    <b>TransactionId</b> : {booking.transactionId}
                  </p>
                  <p>
                    <b>From</b> : {booking.fromdate}
                  </p>
                  <p>
                    <b>End</b> : {booking.todate}
                  </p>
                  <p>
                    <b>Amount</b> : {booking.totalamount}
                  </p>
                  <p>
                    <b>Status</b> : {""}
                     {booking.status === "cancelled" ?  (<Tag color="red">CANCELLED</Tag>) :  (<Tag color="lime">CONFIRMED</Tag>)  }
                  </p>

                  {booking.status !== "cancelled" && (
                    <div className="text-right">
                      <button
                        className="btn "
                        onClick={() => {
                          cancelBooking(booking._id, booking.serviceid);
                        }}
                      >
                        CANCEL BOOKING
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
