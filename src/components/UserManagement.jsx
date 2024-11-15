import React, { useState } from "react";
import useAxiosPublic from "../hooks/useAxiosPublic";
import Swal from "sweetalert2";
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import UserDetailModal from "./userManagement/UserDetailModal";
import CreateUserModal from "./userManagement/CreateUserModal";
import UpdateUserModal from "./userManagement/UpdateUserModal";
import Loading from "./loading/Loading";

function UserManagement() {
  const [openUserModal, setOpenUserModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const axiosPublic = useAxiosPublic();

  const [currentUser, setCurrentUser] = useState(null);

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

  const handleUpdateUser = (user) => {
    setOpenUpdateModal(true);
    setCurrentUser(user);
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
          <Loading loading={loading} />
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
      <CreateUserModal
        openUserModal={openUserModal}
        setOpenUserModal={setOpenUserModal}
        refetch={refetch}
      />

      {/* update user info */}
      <UpdateUserModal
        openUpdateModal={openUpdateModal}
        setOpenUpdateModal={setOpenUpdateModal}
        refetch={refetch}
        currentUser={currentUser}
      />

      {/* user detail info */}
      <UserDetailModal
        openDetailModal={openDetailModal}
        userDetail={userDetail}
        setOpenDetailModal={setOpenDetailModal}
      />
    </div>
  );
}

export default UserManagement;
