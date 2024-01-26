"use client";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../../constants/index";

function LotteryEntrance() {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const raffleAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  //state
  const [entranceFee, setEntranceFee] = useState("0");
  const [noPlayer, setNoPlayers] = useState("0");
  const [recentWinner, setRecentWinner] = useState("No one");
  const [showModal, setShowModal] = useState(false);

  const { runContractFunction: enterRaffle } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "enterRaffle",
    params: {},
    msgValue: entranceFee,
  });

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getEntranceFee",
    params: {},
  });

  const { runContractFunction: getNoPlayers } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getNumberOfPlayers",
    params: {},
  });

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getRecentWinner",
    params: {},
  });

  async function UpdateUI() {
    const entranceFeeFromCall = (await getEntranceFee()).toString();
    const noPlayerFromCall = (await getNoPlayers()).toString();
    const recentWinnerFromCall = await getRecentWinner();
    //set state
    setEntranceFee(entranceFeeFromCall);
    setNoPlayers(noPlayerFromCall);
    setRecentWinner(recentWinnerFromCall);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
    
      UpdateUI();
    }
  }, [isWeb3Enabled]);

  const handleSuccess = async (tx) => {
    await tx.wait(1);
    handleNotification(tx);
    UpdateUI();
  };

  const handleNotification = () => {
    setShowModal(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <h1 className="text-4xl font-bold text-violet-700 mb-4">
        LotteryEntrance
      </h1>
      {raffleAddress ? (
        <div className="flex flex-col space-y-4">
          <p className="text-xl text-white">
            The Entrance Fee is {ethers.formatUnits(entranceFee, "ether")} ETH
          </p>
          <p className="text-xl text-white">
            Number of Players Participated {noPlayer}
          </p>
          <p className="text-xl text-white">
            Recent Players Won {recentWinner}
          </p>
          <button
            onClick={async () => {
              await enterRaffle({
                onSuccess: handleSuccess,
                onError: (error) => console.log(error),
              });
            }}
            className="bg-black text-xl font-bold text-violet-700 px-4 py-2 rounded border-violet-500 border-2"
          >
            Enter Lottery
          </button>
        </div>
      ) : (
        <p className="text-red-500">Please Connect to the Proper wallet !!!!</p>
      )}

      {showModal && (
        <div
          className="fixed z-10 inset-0 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-800 bg-opacity-75 transition-opacity"
              aria-hidden="true"
            ></div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              ​
            </span>
            <div className="inline-block align-bottom bg-black rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-black px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-green-500"
                      id="modal-title"
                    >
                      Transaction Successful
                    </h3>
                  </div>
                </div>
              </div>
              <div className="bg-violet-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-black text-base font-medium text-violet-700 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LotteryEntrance;
