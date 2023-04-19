import { type NextPage } from "next";
import Head from "next/head";
import Layout from "~/components/Layout";


const NotFound: NextPage = () => {
    return (<>
    <Head>
    <title>Emotter - 404</title>
    <meta name="description" content="page not found!" />
    <link rel="icon" href="/emotter.svg" />
    </Head>
    <Layout>
        <div className="w-full h-full flex flex-col justify-start items-center pt-24 gap-4">
            <h1 className="font-bold text-white text-[7rem]">
                404
            </h1>
            <p className="text-2xl">page not found</p>
        </div>
    </Layout>
    </>)
}

export default NotFound