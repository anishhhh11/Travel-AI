const ViewTripSkeleton = () => {
  return (
    <div className="p-6 md:px-16 lg:px-28 xl:px-40 2xl:px-56 space-y-6 animate-pulse">

      {/* Hero / Info */}
      <div className="h-40 bg-gray-200 rounded-2xl"></div>

      {/* Weather */}
      <div className="h-28 bg-gray-200 rounded-xl"></div>

      {/* Hotels */}
      <div className="space-y-4">
        <div className="h-6 w-40 bg-gray-200 rounded"></div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="h-32 bg-gray-200 rounded-xl"></div>
          <div className="h-32 bg-gray-200 rounded-xl"></div>
        </div>
      </div>

      {/* Places */}
      <div className="space-y-4">
        <div className="h-6 w-40 bg-gray-200 rounded"></div>
        <div className="h-32 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  );
};

export default ViewTripSkeleton;