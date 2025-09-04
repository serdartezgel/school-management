import Image from "next/image";

import Theme from "@/components/navigation/navbar/Theme";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex h-screen items-center justify-center">
      <section className="bg-accent min-w-full rounded-xl border px-4 py-10 shadow-md sm:min-w-[520px] sm:px-8">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold">Silver Oak Academy</h1>
            <p className="pl-2 text-gray-500 dark:text-gray-400">
              Sign in to access your dashboard.
            </p>
          </div>

          <Image
            src="/images/logo1.png"
            alt="School Logo"
            width={60}
            height={60}
            className="object-contain"
          />
        </div>

        {children}

        <div className="mt-10 flex justify-end">
          <Theme />
        </div>
      </section>
    </main>
  );
};

export default AuthLayout;
