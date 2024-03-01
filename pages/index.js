import Head from "next/head";
import Image from "next/image";
import { useSelector } from "react-redux";
export default function Home() {
  const name = useSelector(state => state.auth.name);
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="h-screen flex justify-center items-center">
        <h1 className="text-red-600">{name} ahehehe</h1>
      </div>
    </div>
  );
}