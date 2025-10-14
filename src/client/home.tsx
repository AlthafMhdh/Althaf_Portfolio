import { useState, useEffect } from "react";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase/config";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [popularLocations, setPopularLocations] = useState<{ city: string; count: number }[]>([]);

  

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-8xl mx-6 grid grid-cols-1 lg:grid-cols-12 gap-6 px-4 py-6">

        {/* LEFT COLUMN */}
        <div className="lg:col-span-3 space-y-6">

          {/* Search Filter */}
          <div className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
               Classified Search
            </h2>

            {/* Keywords */}
            <div className="mb-3">
              <label className="text-sm text-gray-600 mb-1 block">Keywords</label>
              <input
                type="text"
                placeholder="Find Cars, Pets, Mobile..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            {/* Category */}
            <div className="mb-3">
              <label className="text-sm text-gray-600 mb-1 block">Category</label>
              {/* <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none">
                <option>Choose category</option>
                <option>Cars</option>
                <option>Property</option>
                <option>Jobs</option>
              </select> */}
            </div>

            {/* Location */}
            <div className="mb-4">
              <label className="text-sm text-gray-600 mb-1 block">Location</label>
              <input
                type="text"
                placeholder="City, District"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            {/* Search Button */}
            {/* <Button
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium py-2 rounded-lg shadow-md hover:scale-[1.02] hover:shadow-lg transition-all duration-200"
            >
              🔍 Search Now
            </Button> */}
          </div>


          {/* Popular Locations */}
          <div className="bg-white p-4 rounded-2xl shadow-lg h-80 flex flex-col">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Popular Locations</h2>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {popularLocations.length === 0 ? (
                <p className="text-gray-400 italic text-center mt-6">No locations found</p>
              ) : (
                <ul className="space-y-3">
                  {popularLocations.map((loc, idx) => (
                    <li
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-lg bg-gray-50 hover:bg-primary/10 transition-colors duration-200"
                    >
                      <Link
                        to={`/ads?city=${encodeURIComponent(loc.city)}`}
                        className="flex items-center justify-between w-full"
                      >
                        <div className="flex items-center gap-2">
                        <span className="w-6 h-6 flex items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold">
                          {loc.city.charAt(0).toUpperCase()}
                        </span>
                        <span className="text-gray-700 font-medium">{loc.city}</span>
                        </div>
                        <span className="text-xs px-2 py-1 bg-primary text-white rounded-full shadow-md">
                          {loc.count} ads
                        </span>
                      </Link>
                      
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>


          <div className="w-full h-100 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xl font-semibold">
            Ad Here
          </div>

        </div>

        {/* MIDDLE COLUMN */}
        <div className="lg:col-span-6 space-y-6">
          {/* Banner */}
            <div className="w-full h-60 sm:h-72 bg-red-500 rounded-lg flex items-center justify-center text-white text-3xl font-bold">
            Add Banner Here..
          </div>

          {/* Featured Ads */}
          <section className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Featured Ads</h2>
              {/* <Button asChild variant="threeD" size="sm">
                <Link to="/ads?type=featured">View All</Link>
              </Button> */}
            </div>
            {/* {isLoading ? (
              <div className="flex justify-center"><Loader2 className="animate-spin" size={24} /></div>
            ) : featuredAds.length === 0 ? (
              <p className="text-gray-500 text-center">No featured ads found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {featuredAds.map(ad => <AdCard key={ad.id} ad={ad} />)}
              </div>
            )} */}
          </section>

          {/* Latest Ads */}
          <section className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Latest Ads</h2>
              {/* <Button asChild variant="threeD" size="sm">
                <Link to="/ads?type=recent">View All</Link>
              </Button> */}
            </div>
            {/* {isLoading ? (
              <div className="flex justify-center"><Loader2 className="animate-spin" size={24} /></div>
            ) : recentAds.length === 0 ? (
              <p className="text-gray-500 text-center">No latest ads found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {recentAds.map(ad => <AdCard key={ad.id} ad={ad} />)}
              </div>
            )} */}
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-3 space-y-6">

          <div className="w-full h-100 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xl font-semibold">
            Ad Here
          </div>

          {/* Recent Ads Small List */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-3">Recent Ads</h2>
            {/* {recentAds.length === 0 ? (
              <p className="text-gray-500">No ads</p>
            ) : (
              <ul className="space-y-3">
                {recentAds.map(ad => (
                  <li key={ad.id} className="flex items-center gap-3 border-b pb-2">
                    <img
                      src={ad.images?.[0] || "https://via.placeholder.com/80x60"}
                      alt={ad.title}
                      className="w-16 h-12 rounded-md object-cover"
                    />
                    <div className="text-sm">
                      <p className="font-medium">{ad.title}</p>
                      <p className="text-gray-500">Rs. {ad.price?.toFixed(2)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )} */}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;
