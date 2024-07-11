import { sendMessageToArduino } from "./test-message";

/* eslint-disable react/react-in-jsx-scope */
export default function Settings() {

  const handleGoHome = () => {
		
		sendMessageToArduino('goHome');
  };
  
  const handleSetHome = () => {
		sendMessageToArduino('HOME');
	};
  
  return (
    <div className="flex flex-col justify-center gap-10 p-10 border-orange-600 bg-orange-200 rounded-lg w-[15%]">
      <button onClick={handleSetHome}>
       Set Home 
      </button>
      <button onClick={handleGoHome}>
        Go Home
      </button>
    </div>
  )
}