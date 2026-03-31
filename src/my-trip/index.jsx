import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, where, query } from "firebase/firestore";
import { db } from "../service/Firebaseconfig";
import { useState } from "react";
import UserTripCardItems from "./components/UserTripCardItems";
import AsyncLoader from "../components/custom/AsyncLoader";
import TripSkeleton from "../components/custom/TripSkeleton";

const MyTrip = () => {
  useEffect(() => {
    getUserTrip();
  }, []);

  const navigate = useNavigate();
  const [userTrips, setUserTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getUserTrip = async () => {
    setIsLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      navigate("/");
      return;
    }

    const q = query(
      collection(db, "AiTrips"),
      where("userEmail", "==", user?.email)
    );
    const querySnapshot = await getDocs(q);
    setUserTrips([]);

    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      setUserTrips((prev) => [...prev, { ...doc.data(), id: doc.id }]);
    });
    setIsLoading(false);
  };

if (isLoading) {
  return (
    <div className="app-shell sm:px-10 md:px-20 lg:px-28 xl:px-36 px-5 py-10">
      <h2 className="section-title">My Trips</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <TripSkeleton key={i} />
          ))}
      </div>
    </div>
  );
}

  return (
    <div className="app-shell sm:px-10 md:px-20 lg:px-28 xl:px-36 px-5 py-10">
      <h2 className="section-title">My Trips</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
        {userTrips.map((trip, index) => {
          return <UserTripCardItems trip={trip} key={index} />;
        })}
      </div>
    </div>
  );
};

export default MyTrip;
