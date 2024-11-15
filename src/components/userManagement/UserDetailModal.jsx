const UserDetailModal = ({
  openDetailModal,
  userDetail,
  setOpenDetailModal,
}) => {
  return (
    <div>
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
};

export default UserDetailModal;
