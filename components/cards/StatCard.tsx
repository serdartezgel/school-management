import Image from "next/image";

const StatCard = ({
  type,
}: {
  type: "admin" | "teacher" | "student" | "parent";
}) => {
  return (
    <div className="min-w-[130px] flex-1 rounded-2xl p-4 odd:bg-blue-300 even:bg-yellow-200 dark:odd:bg-indigo-800 dark:even:bg-amber-700">
      <div className="flex items-center justify-between">
        <span className="bg-background rounded-full px-2 py-1 text-[10px] text-green-600">
          2025/26
        </span>
        <Image
          src="/images/more.png"
          alt="More"
          width={20}
          height={20}
          className="dark:invert-100"
        />
      </div>
      <h2 className="my-4 text-2xl font-semibold">100</h2>
      <h3 className="text-sm font-medium text-gray-600 capitalize dark:text-gray-300">
        {type}
      </h3>
    </div>
  );
};
export default StatCard;
