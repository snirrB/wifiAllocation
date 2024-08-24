import { Oval } from "react-loader-spinner";
import "./processingScreen.css";

const Waiter = ({ text, cover = undefined }) => {
  const className = cover ? "cover" : "";
  return (
    <div className={`waiter ${className}`}>
      <Oval
        height={80}
        width={80}
        color="white"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        ariaLabel="oval-loading"
        secondaryColor="transparent"
        strokeWidth={2}
        strokeWidthSecondary={2}
      />
      <p>{text}</p>
    </div>
  );
};

export default Waiter;
