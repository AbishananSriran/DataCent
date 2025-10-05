import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Button } from "../components/Button";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

export default function Project() {
  const [step, setStep] = useState(0);

  // Step 1
  const [dataCenters, setDataCenters] = useState(1);
  const [routingNodes, setRoutingNodes] = useState(1);

  // Step 2
  const [useCloudflare, setUseCloudflare] = useState(false);

  // Step 3
  const [markers, setMarkers] = useState([]);
  const [csvFile, setCsvFile] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY", // Replace with your key
  });

  const handleMapClick = (e) => {
    setMarkers([...markers, { lat: e.latLng.lat(), lng: e.latLng.lng() }]);
  };

  const handleCsvUpload = (e) => {
    const file = e.target.files[0];
    setCsvFile(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden text-gray-100">
      {/* Background shapes */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-700 to-blue-500 opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
      </div>

      <Navbar />

      <div className="max-w-6xl mx-auto py-16 px-4 relative z-10">
        <h2 className="text-4xl font-bold text-white mb-12 text-center tracking-wide">
          Global Network Setup
        </h2>

        <div className="overflow-hidden relative">
          {/* Step 1 */}
          <div
            className={`transition-all duration-700 ease-in-out transform ${
              step === 0
                ? "translate-y-0 opacity-100 relative"
                : "-translate-y-full opacity-0 absolute inset-0"
            } bg-gray-900 rounded-2xl shadow-2xl p-10 grid gap-8 border border-gray-700`}
          >
            <div>
                <p className="font-semibold text-xl mb-6 text-white tracking-wide">
                Choose number of Data Centers and Routing Nodes
                </p>

              <label className="block font-semibold mb-2 text-gray-300">
                Number of Data Centers
              </label>
              <input
                type="number"
                min="1"
                value={dataCenters}
                onChange={(e) => setDataCenters(Number(e.target.value))}
                className="w-full border border-gray-700 rounded-lg p-3 bg-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2 text-gray-300">
                Number of Routing Nodes
              </label>
              <input
                type="number"
                min="1"
                value={routingNodes}
                onChange={(e) => setRoutingNodes(Number(e.target.value))}
                className="w-full border border-gray-700 rounded-lg p-3 bg-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setStep(1)} className="bg-blue-600 hover:bg-blue-700">
                Next
              </Button>
            </div>
          </div>

          {/* Step 2 */}
          <div
            className={`transition-all duration-700 ease-in-out transform ${
              step === 1
                ? "translate-y-0 opacity-100 relative"
                : step > 1
                ? "-translate-y-full opacity-0 absolute inset-0"
                : "translate-y-full opacity-0 absolute inset-0"
            } bg-gray-900 rounded-2xl shadow-2xl p-10 grid gap-8 border border-gray-700`}
          >
            <p className="font-semibold text-xl mb-6 text-white tracking-wide">
              Choose your Edge Layer
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Cloudflare */}
              <div
                onClick={() => setUseCloudflare(true)}
                className={`cursor-pointer p-6 rounded-xl shadow-md transition-transform transform hover:scale-105 ${
                  useCloudflare
                    ? "bg-gradient-to-br from-purple-600 to-purple-400 text-white shadow-lg"
                    : "bg-gray-800 text-gray-300"
                }`}
              >
                <div className="mb-3 flex items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mr-3 ${
                      useCloudflare ? "bg-white text-purple-600" : "bg-purple-500"
                    } text-xl font-bold`}
                  >
                    🌐
                  </div>
                  <h3 className="text-xl font-bold">Cloudflare Edge</h3>
                </div>
                <p className={`${useCloudflare ? "text-white/90" : "text-gray-400"} leading-relaxed`}>
                  Secure and accelerate your global network with Cloudflare's edge services.
                </p>
              </div>

              {/* No Edge */}
              <div
                onClick={() => setUseCloudflare(false)}
                className={`cursor-pointer p-6 rounded-xl shadow-md transition-transform transform hover:scale-105 ${
                  !useCloudflare
                    ? "bg-gradient-to-br from-green-600 to-green-400 text-white shadow-lg"
                    : "bg-gray-800 text-gray-300"
                }`}
              >
                <div className="mb-3 flex items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mr-3 ${
                      !useCloudflare ? "bg-white text-green-600" : "bg-green-500"
                    } text-xl font-bold`}
                  >
                    🛡️
                  </div>
                  <h3 className="text-xl font-bold">No Edge</h3>
                </div>
                <p className={`${!useCloudflare ? "text-white/90" : "text-gray-400"} leading-relaxed`}>
                  Run your network without an edge layer, giving you full control over traffic flow.
                </p>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <Button onClick={() => setStep(0)} className="bg-gray-700 hover:bg-gray-600">
                Back
              </Button>
              <Button onClick={() => setStep(2)} className="bg-blue-600 hover:bg-blue-700">
                Next
              </Button>
            </div>
          </div>

          {/* Step 3 */}
          <div
            className={`transition-all duration-700 ease-in-out transform ${
              step === 2 ? "translate-y-0 opacity-100 relative" : "translate-y-full opacity-0 absolute inset-0"
            } bg-gray-900 rounded-2xl shadow-2xl p-10 grid gap-8 border border-gray-700`}
          >
            <p className="font-semibold text-xl mb-6 text-white tracking-wide">
              Place client locations on the map OR upload a CSV of coordinates
            </p>

            <div className="grid sm:grid-cols-2 gap-6 h-[500px]">
              <div className="w-full h-full rounded-xl overflow-hidden border border-gray-700">
                {isLoaded ? (
                  <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                    center={{ lat: 0, lng: 0 }}
                    zoom={2}
                    onClick={handleMapClick}
                  >
                    {markers.map((m, idx) => (
                      <Marker key={idx} position={{ lat: m.lat, lng: m.lng }} />
                    ))}
                  </GoogleMap>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Loading Map...
                  </div>
                )}
              </div>

              <div className="w-full h-full rounded-xl border-2 border-dashed border-gray-600 flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:bg-gray-800 transition">
                <label className="cursor-pointer">
                  <input type="file" accept=".csv" onChange={handleCsvUpload} className="hidden" />
                  <div className="text-gray-400 text-lg mb-2 font-mono">
                    📁 Drop CSV here or click to upload
                  </div>
                  {csvFile && <div className="mt-2 text-green-400 font-semibold font-mono">{csvFile.name} uploaded</div>}
                </label>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <Button onClick={() => setStep(1)} className="bg-gray-700 hover:bg-gray-600">
                Back
              </Button>
              <Button onClick={() => alert("Network setup complete!")} className="bg-blue-600 hover:bg-blue-700">
                Finish
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
