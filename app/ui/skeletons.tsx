// Loading animation
const blurryText =
  "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-gray-300/60 before:to-transparent bg-gray-200 rounded-sm h-4 w-3/4 animate-pulse";

interface TableSkeletonProps {
  columnCount: number;
}

export default function TableSkeleton({ columnCount }: TableSkeletonProps) {
  const maxCount = columnCount > 10 ? 10 : columnCount;

  return (
    <div className="w-full overflow-hidden mt-10">
      <h2 className="text-2xl font-bold mb-4 text-gray-500">Loading...</h2>
      <div className="bg-gray-400 h-10 w-full"></div>
      <div className="divide-y divide-gray-200">
        {[...Array(5)].map((_, rowIndex) => (
          <div
            key={rowIndex}
            className={`flex items-center ${
              rowIndex % 2 === 0 ? "bg-white" : "bg-gray-100"
            } h-10 w-full relative`}
          >
            {[...Array(maxCount)].map((_, colIndex) => (
              <div
                key={colIndex}
                className={`flex items-center w-full ${
                  colIndex === 0 ? "justify-start ml-2" : "justify-end mr-2"
                }`}
              >
                <div className={blurryText}></div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
