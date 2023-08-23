import { type GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import LayoutMessage from "~/components/LayoutMessage";

const Message: NextPage = () => {
    return <>
     <Head>
        <title>Emotter</title>
        <meta name="description" content="Share what you think!" />
        <link rel="icon" href="/emotter.svg" />
        <script defer data-domain="emotter-two.vercel.app" src="https://plausible.io/js/script.js"></script>
      </Head>
      <LayoutMessage>
        <div className="h-full w-full">

        </div>
      </LayoutMessage>
    </>
}

