import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Button } from "../components/Button";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { BigButton } from "../components/BigButton";
import '../App.css'; // Import the CSS file for animations

export default function Project() {
  const [step, setStep] = useState(-1);
const [showSecondLine, setShowSecondLine] = useState(false);
const [showButton, setShowButton] = useState(false);
const [typedText1, setTypedText1] = useState("");
const [typedText2, setTypedText2] = useState("");


  // Step 1
  const [networkName, setNetworkName] = useState("My Network Project");
  const [dataCenters, setDataCenters] = useState(1);
  const [routingNodes, setRoutingNodes] = useState(1);

  // Step 2
  const [useCloudflare, setUseCloudflare] = useState(false);

  // Step 3
  const [markers, setMarkers] = useState([]);
  const [csvFile, setCsvFile] = useState(null);

  // Step 4
  const [dataCenterMarkers, setDataCenterMarkers] = useState([]);
  const [routingMarkers, setRoutingMarkers] = useState([]);
  const [placingType, setPlacingType] = useState("dataCenter");

  // Step 5
  const [submitted, setSubmitted] = useState(false);

  // Google Maps Loader
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

    // === Typewriter Pre-Step Logic ===
    useEffect(() => {
    if (step === -1) {
        const line1 = "Welcome to the Global Network Builder.";
        const line2 = "Ready to build your dream infrastructure platform?";
        let i = -1;
        let j = -1;

        // Reset state each time we enter pre-step
        setTypedText1("");
        setTypedText2("");
        setShowSecondLine(false);
        setShowButton(false);

        // Type first line
        const typeLine1 = setInterval(() => {
        if (i < line1.length-1) {
            setTypedText1((prev) => prev + line1[i]);
            i++;
        } else {
            clearInterval(typeLine1);

            // Pause, then start line 2
            setTimeout(() => {
            setShowSecondLine(true);
            const typeLine2 = setInterval(() => {
                if (j < line2.length-1) {
                setTypedText2((prev) => prev + line2[j]);
                j++;
                } else {
                clearInterval(typeLine2);
                // Finally show the button after a short delay
                setTimeout(() => setShowButton(true), 300);
                }
            }, 40);
            }, 500);
        }
        }, 40);

        return () => clearInterval(typeLine1);
    }
    }, [step]);


  // Client map click
  const handleMapClick = (e) => {
    const coords = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    setMarkers((prev) => [...prev, coords]);
  };

  // File upload
  const handleCsvUpload = (e) => {
    const file = e.target.files[0];
    setCsvFile(file);
  };

  // Node placement
  const handleGuessMapClick = (e) => {
    const coords = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    if (placingType === "dataCenter" && dataCenterMarkers.length < dataCenters) {
      setDataCenterMarkers((prev) => [...prev, coords]);
    } else if (placingType === "routing" && routingMarkers.length < routingNodes) {
      setRoutingMarkers((prev) => [...prev, coords]);
    } else if (placingType === "dataCenter") {
        alert(`You have already placed ${dataCenters} Data Centers${dataCenters === 1 ? "" : "s"}!`);
    } else {
        alert(`You have already placed ${routingNodes} Routing Node${routingNodes === 1 ? "" : "s"}!`);
    }
  };

  // Finish setup
  const handleFinish = () => {
    setSubmitted(true);

    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/networks/upload/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "user_id": 1,
            "project_name": networkName,
            "client_nodes": markers.map((m) => [m.lat, m.lng]),
            "data_center_guess": dataCenterMarkers.map((dc) => [dc.lat, dc.lng]),
            "routing_guess": routingMarkers.map((rm) => [rm.lat, rm.lng]),
            "cloudflare_enabled": false,
        })
    });

    setStep(4);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden text-gray-100">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-700 to-blue-500 opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
      </div>

      <Navbar />

      {/* === 👋 PRE-STEP: Welcome Screen === */}
    {step === -1 && (
    <div>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 tracking-wide font-mono">
            {typedText1}
            <span className="animate-pulse text-purple-400">|</span>
            </h2>

            {showSecondLine && (
            <h3 className="text-2xl sm:text-3xl text-gray-300 mt-3 font-mono">
                {typedText2}
                <span className="animate-pulse text-blue-400">|</span>
            </h3>
            )}
        </div>

                {showButton && (
        <div className="flex flex-col items-center justify-center text-center animate-fadeIn">
            <BigButton
                onClick={() => setStep(0)}
            >
            Begin Setup 🚀
            </BigButton>
        </div>
        )}
    </div>
    )}
    
      {/* === Your Existing Steps (1–5) === */}
        {step >= 0 && (
          <div className="overflow-hidden relative">
            <div className="max-w-6xl mx-auto py-16 px-4 relative z-10">
                <h2 className="text-4xl font-bold text-white mb-12 text-center tracking-wide">
                Global Network Setup
                </h2>

                <div className="overflow-hidden relative">
                {/* STEP 1: Node counts */}
                <div
                    className={`transition-all duration-700 ease-in-out transform ${
                    step === 0 ? "translate-y-0 opacity-100 relative" : "-translate-y-full opacity-0 absolute inset-0"
                    } bg-gray-900 rounded-2xl shadow-2xl p-10 grid gap-8 border border-gray-700`}
                >
                    <div>
                        <label className="block font-semibold mb-2 text-gray-300">Name of Network Project</label>
                        <input
                            type="text"
                            value={networkName}
                            onChange={(e) => setNetworkName(e.target.value)}
                            className="w-full border border-gray-700 rounded-lg p-3 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                    <div>
                    <label className="block font-semibold mb-2 text-gray-300">Number of Data Centers</label>
                    <input
                        type="number"
                        min="1"
                        value={dataCenters}
                        onChange={(e) => setDataCenters(Number(e.target.value))}
                        className="w-full border border-gray-700 rounded-lg p-3 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    </div>
                    <div>
                    <label className="block font-semibold mb-2 text-gray-300">Number of Routing Nodes</label>
                    <input
                        type="number"
                        min="1"
                        value={routingNodes}
                        onChange={(e) => setRoutingNodes(Number(e.target.value))}
                        className="w-full border border-gray-700 rounded-lg p-3 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    </div>

                    <div className="flex justify-end">
                    <Button onClick={() => setStep(1)}>
                        Next
                    </Button>
                    </div>
                </div>

                {/* STEP 2: Edge layer */}
                <div
                    className={`transition-all duration-700 ease-in-out transform ${
                    step === 1
                        ? "translate-y-0 opacity-100 relative"
                        : step > 1
                        ? "-translate-y-full opacity-0 absolute inset-0"
                        : "translate-y-full opacity-0 absolute inset-0"
                    } bg-gray-900 rounded-2xl shadow-2xl p-10 grid gap-8 border border-gray-700`}
                >
                    <p className="font-semibold text-xl mb-6 text-white tracking-wide">Choose your Edge Layer</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Cloudflare */}
                    <div
                        onClick={() => setUseCloudflare(true)}
                        className={`cursor-pointer p-6 rounded-xl shadow-md transition-transform transform hover:scale-105 ${
                        useCloudflare
                            ? "bg-gradient-to-br from-purple-600 to-purple-400 text-white"
                            : "bg-gray-800 text-gray-300"
                        }`}
                    >
                        <div className="mb-3 flex items-center">
                        <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center mr-3 ${
                            useCloudflare ? "bg-white text-purple-600" : "bg-purple-500"
                            } text-xl`}
                        >
                            🌐
                        </div>
                        <h3 className="text-xl font-bold">Cloudflare Edge</h3>
                        </div>
                        <p className={`${useCloudflare ? "text-white/90" : "text-gray-400"}`}>
                        Secure and accelerate your global network with Cloudflare's edge layer.
                        </p>
                    </div>

                    {/* No Edge */}
                    <div
                        onClick={() => setUseCloudflare(false)}
                        className={`cursor-pointer p-6 rounded-xl shadow-md transition-transform transform hover:scale-105 ${
                        !useCloudflare
                            ? "bg-gradient-to-br from-green-600 to-green-400 text-white"
                            : "bg-gray-800 text-gray-300"
                        }`}
                    >
                        <div className="mb-3 flex items-center">
                        <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center mr-3 ${
                            !useCloudflare ? "bg-white text-green-600" : "bg-green-500"
                            } text-xl`}
                        >
                            🛡️
                        </div>
                        <h3 className="text-xl font-bold">No Edge</h3>
                        </div>
                        <p className={`${!useCloudflare ? "text-white/90" : "text-gray-400"}`}>
                        Run your network without an edge layer for full traffic control.
                        </p>
                    </div>
                    </div>

                    <div className="flex justify-between mt-6">
                    <Button onClick={() => setStep(0)}>
                        Back
                    </Button>
                    <Button onClick={() => setStep(2)}>
                        Next
                    </Button>
                    </div>
                </div>

                {/* STEP 3: Clients */}
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
                            <Marker key={idx} position={m} />
                            ))}
                        </GoogleMap>
                        ) : (
                        <div className="flex h-full items-center justify-center text-gray-400">Loading Map...</div>
                        )}
                    </div>

                    <div className="w-full h-full rounded-xl border-2 border-dashed border-gray-600 flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:bg-gray-800 transition">
                        <label className="cursor-pointer w-full h-full flex flex-col justify-center items-center">
                            <input type="file" accept=".csv" onChange={handleCsvUpload} className="hidden" />
                            <div className="text-gray-400 text-lg mb-2 font-mono">
                            📁 Drop CSV here or click to upload
                            </div>

                            {csvFile ? (
                            <div className="mt-2 text-green-400 font-semibold font-mono">{csvFile.name} uploaded</div>
                            ) : (
                            <div className="text-gray-500 text-sm mt-4">
                                Example CSV format:<br/>
                                <code className="block bg-gray-800 text-green-400 rounded px-2 py-1 mt-1">
                                37.77,-122.42<br/>
                                40.71,-74.01<br/>
                                51.51,-0.12
                                </code>
                                <span className="text-gray-400 text-xs mt-1 block">
                                Each line: <strong>latitude,longitude</strong> with two decimals
                                </span>
                            </div>
                            )}
                        </label>
                        </div>
                    </div>

                    <div className="flex justify-between mt-6">
                    <Button onClick={() => setStep(1)}>
                        Back
                    </Button>
                    <Button onClick={() => setStep(3)}>
                        Next
                    </Button>
                    </div>
                </div>

                {/* STEP 4: Guess locations */}
                <div
                    className={`transition-all duration-700 ease-in-out transform ${
                    step === 3 ? "translate-y-0 opacity-100 relative" : "translate-y-full opacity-0 absolute inset-0"
                    } bg-gray-900 rounded-2xl shadow-2xl p-10 grid gap-8 border border-gray-700`}
                >
                    <p className="font-semibold text-xl mb-6 text-white tracking-wide">
                    Place your best guess for the optimal location for your <span className="text-yellow-400">Data Centers</span> and{" "}
                    <span className="text-blue-400">Routing Nodes</span>.
                    </p>

                    <div className="flex gap-4 mb-4">
                    <Button
                    onClick={() => setPlacingType("dataCenter")}
                    disabled={placingType === "dataCenter"}
                    className={`inline-flex items-center justify-center rounded-lg ${placingType === "dataCenter" ? "bg-yellow-600" : "bg-gray-700 hover:bg-gray-600"} px-4 py-2 text-white font-medium transition-colors`}
                    >
                    Place Data Centers
                    </Button>

                    <Button
                    onClick={() => setPlacingType("routing")}
                    disabled={placingType === "routing"}
                    className={`inline-flex items-center justify-center rounded-lg ${placingType === "routing" ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"} px-4 py-2 text-white font-medium transition-colors`}
                    >
                    Place Routing Nodes
                    </Button>
                    </div>

                    <div className="w-full h-[500px] rounded-xl overflow-hidden border border-gray-700">
                    {isLoaded ? (
                        <GoogleMap
                        mapContainerStyle={{ width: "100%", height: "100%" }}
                        center={{ lat: 0, lng: 0 }}
                        zoom={2}
                        onClick={handleGuessMapClick}
                        >
                        {dataCenterMarkers.map((m, idx) => (
                            <Marker key={`dc-${idx}`} position={m} icon={{
                            url: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
                            }} />
                        ))}
                        {routingMarkers.map((m, idx) => (
                            <Marker key={`rt-${idx}`} position={m} icon={{
                            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                            }} />
                        ))}
                        </GoogleMap>
                    ) : (
                        <div className="flex h-full items-center justify-center text-gray-400">Loading Map...</div>
                    )}
                    </div>

                    <div className="flex justify-between mt-6">
                    <Button onClick={() => setStep(2)}>
                        Back
                    </Button>
                    <Button onClick={handleFinish}>
                        Next
                    </Button>
                    </div>
                </div>

                {/* Step 5 — Interactive Loading */}
                <div
                    className={`transition-all duration-700 ease-in-out transform ${
                    step === 4
                        ? "translate-y-0 opacity-100 relative"
                        : "translate-y-full opacity-0 absolute inset-0"
                    } bg-gray-900 rounded-2xl shadow-2xl p-10 grid gap-8 border border-gray-700 text-center`}
                >
                    <AnimatedDeployment
                        dataCenters={dataCenters}
                        routingNodes={routingNodes}
                        submitted={submitted}
                    />
                </div>
                </div>
            </div>
          </div>
        )}
      {/* === End of Your Existing Steps === */}
    </div>
  );
}

/* === Animated Deployment Component === */
function AnimatedDeployment({ dataCenters, routingNodes, submitted }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (!submitted) return;

    const timers = [
      setTimeout(() => setStage(1), 2000),
      setTimeout(() => setStage(2), 4000),
      setTimeout(() => setStage(3), 6500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [submitted]);

  const steps = [
    { icon: "🛰️", label: "Optimizing Global Network Routes..." },
    { icon: "🌐", label: "Finding Best Locations for Nodes..." },
    { icon: "📊", label: "Generating Final Deployment Report..." },
  ];

  return (
    <div className="flex flex-col items-center justify-center text-center min-h-[400px]">
      {stage < 3 ? (
        <>
          <div className="w-24 h-24 mb-8 relative">
            <div className="absolute inset-0 rounded-full border-4 border-gray-700"></div>
            <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
          </div>
          <h3 className="text-2xl font-semibold text-white flex items-center justify-center gap-3 mb-4">
            <span className="text-3xl">{steps[stage].icon}</span>
            {steps[stage].label}
          </h3>
          <div className="w-full max-w-md bg-gray-800 rounded-full h-2 overflow-hidden mt-6">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
              style={{ width: `${((stage + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </>
      ) : (
        <div className="mt-10 animate-fadeIn">
          <h3 className="text-3xl font-bold text-white mb-6">Setup Complete 🎉</h3>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
            You’ve configured{" "}
            <span className="text-yellow-400 font-semibold">{dataCenters}</span>{" "}
            Data Centers and{" "}
            <span className="text-blue-400 font-semibold">{routingNodes}</span>{" "}
            Routing Nodes globally.
          </p>
          <p className="text-gray-400 mt-4 font-mono">
            Network deployment successfully simulated! Redirecting to final report...
          </p>
        </div>
      )}
    </div>
  );
}
