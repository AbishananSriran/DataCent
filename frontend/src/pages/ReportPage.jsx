import Navbar from "../components/Navbar";
import { GoogleMap, Marker, Polyline, useJsApiLoader } from "@react-google-maps/api";
import Footer from "../components/Footer";
import { useCurrentPlan } from "../context/CurrentPlanContext";
import { useState } from "react";

export default function ReportPage() {
  const { project_name, client_nodes, cloudflare_nodes, data_centers, routing, money_saved, kwh_saved, infrastructure_plan } = useCurrentPlan().currentPlan;

  // Google Maps loader
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

    const [simulating, setSimulating] = useState(false);
    const [tempClient, setTempClient] = useState(null);
    const [routePath, setRoutePath] = useState([]);

  return (
    <div className="relative min-h-screen overflow-hidden text-gray-100 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <Navbar />

      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
            <h1 className="text-4xl font-bold text-white tracking-wide">{project_name} - Final Report</h1>

            <button
                onClick={() => {
                setSimulating(true);
                setTempClient(null);
                setRoutePath([]);
                alert("Click on the map to place a client node for simulation.");
                }}
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-4 rounded-lg"
            >
                Simulate Client Path
            </button>
            </div>


        {/* === Map Section === */}
        <div className="w-full h-[500px] rounded-xl overflow-hidden border border-gray-700 mb-3">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={{ lat: 20, lng: 0 }}
              zoom={2}
              onClick={(e) => {
                if (!simulating) return;
                const clickPos = [e.latLng.lat(), e.latLng.lng()];
                setTempClient(clickPos);

                const path = [];
                let nextNode = clickPos;

                const closest = (points, from) => {
                    let minDist = Infinity;
                    let closestPoint = null;
                    points.forEach((p) => {
                        const dist = Math.hypot(p[0] - from[0], p[1] - from[1]);
                        if (dist < minDist) {
                        minDist = dist;
                        closestPoint = p;
                        }
                    });
                    return closestPoint;
                };

                path.push({lat: clickPos[0], lng: clickPos[1]});

                // Start calculating route
                if (cloudflare_nodes.length > 0){
                    // Step 1: Visit closest Cloudflare
                    nextNode = closest(cloudflare_nodes, clickPos);
                    path.push({lat: nextNode[0], lng: nextNode[1]});
                }

            if (routing.length > 0) {
                nextNode = closest([...routing, ...data_centers], nextNode || clickPos);
                path.push({lat: nextNode[0], lng: nextNode[1]});

                if (routing.some((r) => r[0] === nextNode[0] && r[1] === nextNode[1])) {
                    if (data_centers && data_centers.length > 0) {
                        const dcNode = closest(data_centers, nextNode);
                        path.push({lat: dcNode[0], lng: dcNode[1]});
                    }
                }

                setRoutePath(path);
                setSimulating(false);
            } else {
                if (data_centers && data_centers.length > 0) {
                    const dcNode = closest(data_centers, nextNode);
                    path.push({lat: dcNode[0], lng: dcNode[1]});
                }
            }

            setRoutePath(path);
            setSimulating(false);
            }}
            >
              {client_nodes.map((c, idx) => (
                <Marker key={`client-${idx}`} position={{lat: c[0], lng: c[1]}} icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                }} />
              ))}

              {cloudflare_nodes.map((cf, idx) => (
                <Marker key={`cf-${idx}`} position={{lat: cf[0], lng: cf[1]}} icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                }} />
              ))}

              {data_centers.map((o, idx) => (
                <Marker key={`opt-${idx}`} position={{lat: o[0], lng: o[1]}} icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
                }} />
              ))}

              {routing.map((r, idx) => (
                <Marker key={`route-${idx}`} position={{lat: r[0], lng: r[1]}} icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                }} />
              ))}

              {/* Existing markers */}
                {tempClient && (
                <Marker
                    position={tempClient}
                    icon={{ url: "http://maps.google.com/mapfiles/ms/icons/white-dot.png" }}
                />
                )}

                {routePath.length > 1 && (
                <Polyline
                    path={routePath}
                    options={{ strokeColor: "#FFFF00", strokeOpacity: 0.8, strokeWeight: 3 }}
                />
                )}
            </GoogleMap>
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">Loading Map...</div>
          )}
        </div>

        <div className="flex flex-wrap font-bold justify-center items-center gap-6 mb-6 text-gray-300 text-sm">
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-full inline-block"></span> Client Node
            </div>
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-blue-500 rounded-full inline-block"></span> Cloudflare Node
            </div>
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-yellow-400 rounded-full inline-block"></span> Data Center Node
            </div>
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full inline-block"></span> Routing Node
            </div>
        </div>

        {/* === Summary Cards === */}
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          <div className="flex-1 bg-white/10 backdrop-blur-lg border border-white/10 p-6 rounded-2xl shadow-2xl text-center">
            <h2 className="text-xl font-bold mb-2 text-yellow-400">Money Saved</h2>
            <p className="text-3xl font-semibold text-green-300">${money_saved.toLocaleString()}</p>
            <p className="text-gray-300 mt-2">Compared to your initial guesses</p>
          </div>

          <div className="flex-1 bg-white/10 backdrop-blur-lg border border-white/10 p-6 rounded-2xl shadow-2xl text-center">
            <h2 className="text-xl font-bold mb-2 text-yellow-400">Energy Saved</h2>
            <p className="text-3xl font-semibold text-green-300">{kwh_saved.toLocaleString()} kWh</p>
            <p className="text-gray-300 mt-2">Due to optimal node placement</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 mb-12 max-w-7xl mx-auto">
            {/* Final Report */}
            <div className="flex-[1.25] bg-white/10 backdrop-blur-lg border border-white/10 p-12 rounded-2xl shadow-2xl text-gray-100 prosem">
                <h2 className="text-xl font-bold mb-4 text-yellow-400">Final Report</h2>
                {infrastructure_plan.split("\n").map((para, idx) =>
                para.trim() ? <p key={idx}>{para.trim()}</p> : <br />
                )}
            </div>

            {/* Share Options */}
            <div className="flex-1 flex flex-col gap-6">
                {/* Email */}
                <a
                href={`mailto:?subject=Check out my network project report&body=View the full report here: ${window.location.href}`}
                className="flex-1 bg-white/10 backdrop-blur-lg border border-white/10 p-6 rounded-2xl shadow-2xl text-center hover:scale-105 transition-transform"
                >
                <img src="/email.jpg" alt="Email Icon" className="mx-auto mb-4 h-12 w-12" />
                <h2 className="text-xl font-bold mb-2 text-yellow-400">Email</h2>
                <p className="text-gray-300">Send this report via email</p>
                </a>

                {/* Twitter */}
                <a
                href={`https://twitter.com/intent/tweet?text=Check out my network project report!&url=${window.location.href}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-white/10 backdrop-blur-lg border border-white/10 p-6 rounded-2xl shadow-2xl text-center hover:scale-105 transition-transform"
                >
                <img src="/X.jpg" alt="X Icon" className="mx-auto mb-4 h-12 w-12" />
                <h2 className="text-xl font-bold mb-2 text-yellow-400">X</h2>
                <p className="text-gray-300">Share this report on X</p>
                </a>

                {/* LinkedIn */}
                <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-white/10 backdrop-blur-lg border border-white/10 p-6 rounded-2xl shadow-2xl text-center hover:scale-105 transition-transform"
                >
                <img src="/linkedin.png" alt="LinkedIn Icon" className="mx-auto mb-4 h-12 w-12" />
                <h2 className="text-xl font-bold mb-2 text-yellow-400">LinkedIn</h2>
                <p className="text-gray-300">Share this report on LinkedIn</p>
                </a>
            </div>
            </div>
        </section>
      <Footer />
    </div>
  );
}
