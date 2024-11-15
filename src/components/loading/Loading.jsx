import ScaleLoader from "react-spinners/ScaleLoader";

const Loading = ({ loading }) => {
  return (
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
  );
};

export default Loading;
