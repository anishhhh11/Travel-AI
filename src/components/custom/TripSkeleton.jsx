const TripSkeleton = () => {
  return (
    <div className="animate-pulse rounded-2xl bg-white shadow-sm p-4 space-y-4">

      {/* Image */}
      <div className="h-40 w-full bg-gray-200 rounded-xl"></div>

      {/* Title */}
      <div className="h-4 w-3/4 bg-gray-200 rounded"></div>

      {/* Subtitle */}
      <div className="h-3 w-1/2 bg-gray-200 rounded"></div>

      {/* Footer */}
      <div className="flex justify-between pt-2">
        <div className="h-3 w-16 bg-gray-200 rounded"></div>
        <div className="h-3 w-10 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

export default TripSkeleton;