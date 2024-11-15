import ScaleLoader from "react-spinners/ScaleLoader";

const Loading = ({ loading }) => {
  return (
    <div className='tbody_row'>
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
    </div>
  );
};

export default Loading;
