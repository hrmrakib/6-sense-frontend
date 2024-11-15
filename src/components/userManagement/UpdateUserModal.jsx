import { useState } from "react";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import toast from "react-hot-toast";

const UpdateUserModal = ({
  openUpdateModal,
  setOpenUpdateModal,
  refetch,
  currentUser,
}) => {
  const [firstName, setFirstName] = useState(currentUser?.firstName);
  const [lastName, setLastName] = useState(currentUser?.lastName);
  const [email, setEmail] = useState(currentUser?.email);
  const [phone, setPhone] = useState(currentUser?.phone);

  const axiosPublic = useAxiosPublic();

  const handleUpdateUserSubmit = (e) => {
    e.preventDefault();

    const updatedUserInfo = {
      firstname: firstName,
      lastname: lastName,
      phone: phone,
    };

    console.log({ updatedUserInfo });

    axiosPublic
      .put(`/api/update/${email}`, updatedUserInfo)
      .then((res) => {
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

  return (
    <div>
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
              value={firstName || currentUser.firstname}
              onChange={(e) => setFirstName(e.target.value)}
              name='firstName'
              required
            />
            <input
              type='text'
              value={lastName || currentUser.lastname}
              onChange={(e) => setLastName(e.target.value)}
              name='lastName'
              required
            />

            <input
              type='email'
              name='email'
              onChange={(e) => setEmail(e.target.value)}
              value={email || currentUser.email}
              readOnly
            />
            <input
              type='number'
              name='phone'
              onChange={(e) => setPhone(e.target.value)}
              value={phone || currentUser.phone}
              required
            />

            <button type='submit' className='btn submit_btn'>
              Update
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UpdateUserModal;
