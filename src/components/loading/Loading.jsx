import ScaleLoader from "react-spinners/ScaleLoader";

const Loading = ({ loading }) => {
  return (
    <div className='tbody_row'>
      {loading && (
        <div
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
        </div>
      )}
    </div>
  );
};

export default Loading;
