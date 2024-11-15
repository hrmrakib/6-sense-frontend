import React, { useState } from "react";
import useAxiosPublic from "../hooks/useAxiosPublic";
import Swal from "sweetalert2";
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import ScaleLoader from "react-spinners/ScaleLoader";

function UserManagement() {
  const [nameError, setNameError] = useState("");
  const [openUserModal, setOpenUserModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const axiosPublic = useAxiosPublic();

  const [onChangeUpdateFirstName, setOnChangeUpdateFirstName] = useState("");
  const [onChangeUpdateLastName, setOnChangeUpdateLastName] = useState("");
  const [onChangeUpdateEmail, setOnChangeUpdateEmail] = useState("");
  const [onChangeUpdatePhone, setOnChangeUpdatePhone] = useState(null);

  const [userDetail, setUserDetail] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    status: false,
  });

  const {
    data: users = [],
    refetch,
    isLoading: loading,
  } = useQuery({
    queryKey: ["currentUsers"],
    queryFn: async () => {
      const result = await axiosPublic.get("/api/users");
      return result.data;
    },
  });

  const handleCreateUser = (e) => {
    e.preventDefault();
    setNameError("");

    const firstname = e.target.firstname.value.trim();
    const lastname = e.target.lastname.value.trim();
    const email = e.target.email.value;
    const phone = e.target.phone.value;

    axiosPublic
      .post("/api/create", { firstname, lastname, email, phone })
      .then((res) => {
        console.log(res);

        if (res.data?.message) {
          return toast.error(res.data.message);
        }
        if (res.data?.insertedId) {
          refetch();
          return toast.success("User created successfully!");
        }
      })
      .catch((err) => {
        console.log("erroooor", err.message);
      });

    setTimeout(() => {
      return setOpenUserModal(false);
    }, 99);
  };

  const handleUpdateUser = (user) => {
    setOpenUpdateModal(true);

    const { firstname, lastname, email, phone } = user;

    setOnChangeUpdateFirstName(firstname);
    setOnChangeUpdateLastName(lastname);
    setOnChangeUpdateEmail(email);
    setOnChangeUpdatePhone(phone);
  };

  const handleUpdateUserSubmit = (e) => {
    e.preventDefault();

    const updatedUserInfo = {
      firstname: onChangeUpdateFirstName,
      lastname: onChangeUpdateLastName,
      phone: onChangeUpdatePhone,
    };

    console.log(updatedUserInfo);

    axiosPublic
      .put(`/api/update/${onChangeUpdateEmail}`, updatedUserInfo)
      .then((res) => {
        console.log(res.data);
        if (res.data?.modifiedCount > 0) {
          refetch();
          toast.success("Updated successfully!");
          setOpenUpdateModal(false);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const handleDeleteUser = (user) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosPublic
          .delete(`/api/delete/${user?.email}`)
          .then((res) => {
            console.log(res.data);
            if (res.data?.deletedCount > 0) {
              refetch();
              Swal.fire({
                title: "Deleted!",
                text: `${user?.firstname} has been deleted.`,
                icon: "success",
              });
            }
          })
          .catch((err) => {
            toast.error(err);
          });
      }
    });
  };

  const handleUserDetail = (user) => {
    setOpenDetailModal(true);
    console.log(user);
    setUserDetail({
      firstname: user?.firstname,
      lastname: user?.lastname,
      email: user?.email,
      phone: user?.phone,
      status: user?.block,
    });
  };

  const handleBlockUser = (user) => {
    axiosPublic
      .put(`/api/userStatus/${user.email}`)
      .then((res) => {
        if (res.data?.modifiedCount > 0) {
          refetch();
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <div className='table_container'>
      <Toaster position='top-center' reverseOrder={false} />
      <div className='header_box'>
        <h2 className='container_heading'>Users Information</h2>
        <button onClick={() => setOpenUserModal(true)} className='btn'>
          Add New User
        </button>
      </div>
      <table className='table'>
        <thead>
          <tr>
            <th className='t_heading'>#</th>
            <th className='t_heading'>Full Name</th>
            <th className='t_heading'>User Details</th>
            <th className='t_heading action_end'>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr className='tbody_row'>
            {loading && (
              <td
                style={{
                  width: "100px",
                  height: "100px",
                  margin: "20px auto",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ScaleLoader />
              </td>
            )}
          </tr>
          {users?.map((user, index) => (
            <tr key={index} className='tbody_row'>
              <td className='tbody_data'>{index + 1}</td>
              <td className='tbody_data'>{`${user?.firstname} ${user?.lastname}`}</td>
              <td
                className='tbody_data cursor-pointer underline'
                onClick={() => handleUserDetail(user)}
              >
                See Detail
              </td>
              <td className='tbody_data'>
                <div className='action'>
                  <button
                    onClick={() => handleUpdateUser(user)}
                    className='btn update_button'
                  >
                    Update
                  </button>

                  <button
                    onClick={() => handleDeleteUser(user)}
                    className='btn delete_button'
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleBlockUser(user)}
                    className={`btn ${
                      user.block ? "unblock_button" : "block_button"
                    }`}
                  >
                    {user.block ? "Unblock" : "Block"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Create user form */}
      {openUserModal && (
        <div className='create_user'>
          <div className='create_user_heading'>
            <h2>Create a new user</h2>
            <div
              onClick={() => setOpenUserModal(false)}
              className='close_user_modal'
            >
              Close
            </div>
          </div>
          <form onSubmit={handleCreateUser} className='user_form'>
            <input
              type='text'
              name='firstname'
              placeholder='Enter first name'
              required
            />
            <input
              type='text'
              name='lastname'
              placeholder='Enter last name'
              required
            />
            <p className='error'>{nameError}</p>
            <input
              type='email'
              name='email'
              placeholder='Enter email'
              required
            />
            <input
              type='number'
              name='phone'
              placeholder='Enter phone number'
              required
            />
            <button type='submit' className='btn submit_btn'>
              Submit
            </button>
          </form>
        </div>
      )}

      {/* update user info */}
      {openUpdateModal && (
        <div className='create_user'>
          <div className='create_user_heading'>
            <h2>Update the user</h2>
            <div
              onClick={() => setOpenUpdateModal(false)}
              className='close_user_modal'
            >
              Close
            </div>
          </div>
          <form onSubmit={handleUpdateUserSubmit} className='user_form'>
            <input
              type='text'
              value={onChangeUpdateFirstName}
              onChange={(e) => setOnChangeUpdateFirstName(e.target.value)}
              name='updateFirstName'
              required
            />
            <input
              type='text'
              value={onChangeUpdateLastName}
              onChange={(e) => setOnChangeUpdateLastName(e.target.value)}
              name='updateLastName'
              required
            />

            <input
              type='email'
              name='updateEmail'
              onChange={(e) => setOnChangeUpdateEmail(e.target.value)}
              value={onChangeUpdateEmail}
              readOnly
            />
            <input
              type='number'
              name='updatePhone'
              onChange={(e) => setOnChangeUpdatePhone(e.target.value)}
              value={onChangeUpdatePhone}
              required
            />

            <button type='submit' className='btn submit_btn'>
              Update
            </button>
          </form>
        </div>
      )}

      {/* update user info */}
      {openDetailModal && (
        <div className='create_user'>
          <div className='create_user_heading'>
            <h3>
              Detail of {`${userDetail.firstname} ${userDetail.lastname}`}
            </h3>
            <div
              onClick={() => setOpenDetailModal(false)}
              className='close_user_modal'
            >
              Close
            </div>
          </div>

          <div>
            <p className='mt-2'>
              <span className='font-bold'>First Name:</span>{" "}
              {userDetail.firstname}
            </p>
            <p className='mt-2'>
              <span className='font-bold'>Last Name:</span>{" "}
              {userDetail.lastname}
            </p>
            <p className='mt-2'>
              <span className='font-bold'>Email:</span> {userDetail.email}
            </p>
            <p className='mt-2'>
              <span className='font-bold'>Phone:</span> {userDetail.phone}
            </p>
            <p className='mt-2'>
              <span className='font-bold'>User Status:</span>{" "}
              {userDetail.status ? "Block" : "Unblock"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
