"use client";
import { useEffect } from "react";
import { useMoralis } from "react-moralis";

const Navbar = () => {
  const { enableWeb3, account,isWeb3Enabled,Moralis,deactivateWeb3,isWeb3EnableLoading } = useMoralis();

  //hook to auto connect to wallet 
  useEffect(()=>{
    //return if already connected
    if(isWeb3Enabled) return
    if(typeof window !== "undefined"){
      //check in lcStrg and connect using key
      if(window.localStorage.getItem("connected")){
        enableWeb3()
        console.log("Connected to Wallet")
      }
    }
  },[isWeb3Enabled])

  //hook for chaning the acc 
  useEffect(() => {
   Moralis.onAccountChanged((account) => {
    console.log(`Account changes to ${account}`)
    //if user disconnect the acc
    if(account == null){
      window.localStorage.removeItem("connected")
      //set isweb3 false
      deactivateWeb3()
      console.log("Null account found")
    }
   })
  },[])
  return (
    <nav className="flex flex-row items-center justify-between p-6 bg-violet-700">
      <div className="text-left font-bold text-2xl text-white">
        <h1>Smart Lottery</h1>
      </div>
      {account ? (
        <div className="rounded bg-black text-center p-2"><span className="font-bold text-green-500">
          Connected</span>
          <p className="text-xs text-violet-500">{account.slice(0,5)}...{account.slice(account.length - 4)}</p></div>
      ) : (
        <div className="text-right">
          <button
            className="bg-black text-violet-700 px-4 py-2 rounded"
            onClick={async () => {
              await enableWeb3();
              if(typeof window !== "undefined"){
                window.localStorage.setItem("connected","Injected")
              }
            }}
            disabled={isWeb3EnableLoading}
          >
            Connect
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
