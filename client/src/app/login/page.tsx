import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Image from "next/image";
import Link from "next/link";
import JsonRenderer from "@/components/JsonRenderer"; // Ensure this component is correctly in `app/components`

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
        <div className="max-w-xl sm:mx-auto lg:max-w-2xl">
          <div className="flex flex-col mb-16 sm:text-center sm:mb-0">
            <div className="mb-6 sm:mx-auto cursor-pointer">
              <Link href="https://wso2.com/asgardeo/" passHref>
                <Image src="/asgardeo-logo.svg" height={200} width={200} alt="Asgardeo Logo" />
              </Link>
            </div>
            <div className="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
              <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 sm:text-4xl md:mx-auto">
                <span className="relative inline-block">Create</span>{" "}
                seamless login experiences in minutes
              </h2>
              <p className="text-base text-gray-700 md:text-lg">
                Asgardeo helps developers implement secure authentication flows in a few simple steps.
              </p>
            </div>
            <div>
              <Link href="https://wso2.com/asgardeo/" passHref>
                <button className="inline-flex items-center justify-center h-12 px-6 font-medium tracking-wide text-white transition duration-200 rounded shadow-md bg-deep-purple-accent-400 hover:bg-deep-purple-accent-700 focus:shadow-outline focus:outline-none">
                  Get started
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="mx-10">
      <p className="my-8 text-5xl lg:text-3xl font-bold tracking-tight text-gray-900">
        User Information
      </p>
      {session?.user && (
        <JsonRenderer
          src={session.user}
          name={null}
          enableClipboard={false}
          displayObjectSize={false}
          displayDataTypes={false}
          iconStyle="square"
          theme="monokai"
        />
      )}
    </main>
  );
}
