import useAxiosPublic from "../../hooks/useAxiosPublic";
import toast, { Toaster } from "react-hot-toast";

const CreateUserModal = ({ openUserModal, setOpenUserModal, refetch }) => {
  const axiosPublic = useAxiosPublic();

  const handleCreateUser = (e) => {
    e.preventDefault();

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

  return (
    <div>
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
    </div>
  );
};

export default CreateUserModal;
