"use client"
import { MoralisProvider } from "react-moralis";
import Navbar from "../components/Navbar";
import LotteryEntrance from "@/components/LotteryEntrance";

export default function Home() {
  return (
   <main>
    <MoralisProvider initializeOnMount={false}>
    <Navbar/>
    <LotteryEntrance/>
    </MoralisProvider>
   </main>
  );
}
