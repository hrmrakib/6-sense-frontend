import { useState } from "react";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import toast from "react-hot-toast";

const UpdateUserModal = ({
  openUpdateModal,
  setOpenUpdateModal,
  refetch,
  currentUser,
}) => {
  const [onChangeUpdateFirstName, setOnChangeUpdateFirstName] = useState(
    currentUser?.firstname
  );
  const [onChangeUpdateLastName, setOnChangeUpdateLastName] = useState(
    currentUser?.lastname
  );
  const [onChangeUpdateEmail, setOnChangeUpdateEmail] = useState(
    currentUser?.email
  );
  const [onChangeUpdatePhone, setOnChangeUpdatePhone] = useState(
    currentUser?.phone
  );

  const axiosPublic = useAxiosPublic();

  const handleUpdateUserSubmit = (e) => {
    e.preventDefault();

    const updatedUserInfo = {
      firstname: onChangeUpdateFirstName,
      lastname: onChangeUpdateLastName,
      phone: onChangeUpdatePhone,
    };

    axiosPublic
      .put(`/api/update/${onChangeUpdateEmail}`, updatedUserInfo)
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

  console.log(currentUser);

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
              value={onChangeUpdateFirstName || currentUser.firstname}
              onChange={(e) => setOnChangeUpdateFirstName(e.target.value)}
              name='updateFirstName'
              required
            />
            <input
              type='text'
              value={onChangeUpdateLastName || currentUser.lastname}
              onChange={(e) => setOnChangeUpdateLastName(e.target.value)}
              name='updateLastName'
              required
            />

            <input
              type='email'
              name='updateEmail'
              onChange={(e) => setOnChangeUpdateEmail(e.target.value)}
              value={onChangeUpdateEmail || currentUser.email}
              readOnly
            />
            <input
              type='number'
              name='updatePhone'
              onChange={(e) => setOnChangeUpdatePhone(e.target.value)}
              value={onChangeUpdatePhone || currentUser.phone}
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
