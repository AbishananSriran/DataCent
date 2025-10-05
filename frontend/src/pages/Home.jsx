import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import Navbar from "../components/Navbar";
import { Button } from "../components/Button";
import Footer from "../components/Footer";
import { useCurrentPlan } from "../context/CurrentPlanContext";

export default function Home() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const { setCurrentPlan } = useCurrentPlan();

  const handleSelect = (plan, id) => {
    setCurrentPlan({
      project_name: plan.project_name,
      client_nodes: plan.client_nodes,
      cloudflare_nodes: plan.cloudflare_nodes,
      data_centers: plan.data_centers,
      routing: plan.routing,
      money_saved: plan.money_saved,
      kwh_saved: plan.kwh_saved,
      infrastructure_plan: plan.infrastructure_plan,
    });
    navigate(`/reports/${id}`);
  };

  // 🔥 DELETE handler
  const handleDelete = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/networks/${projectId}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error("Failed to delete project");

      // Remove deleted project from UI
    } catch (err) {
      console.error("Error deleting project:", err);
      alert("Something went wrong while deleting. Please try again.");
    }
  };

  useEffect(() => {
    if (!user.isLoggedIn) {
      navigate("/login");
    } else {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/api/networks`)
        .then((res) => res.json())
        .then((data) => {
          setPlans(data);
        })
        .catch((err) => console.error(err));
    }
  }, [user.isLoggedIn, navigate, user.id]);

  if (!user.isLoggedIn) return <p>Redirecting to login...</p>;

  return (
    <div className="relative min-h-screen overflow-hidden text-gray-100 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-gray-950/80"></div>
      </div>

      <Navbar />

      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
            <h1 className="text-4xl font-bold text-white tracking-wide drop-shadow-lg">
              Your Network Projects
            </h1>
          </div>

          {plans.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8 animate-fadeInUp">
              {plans.map((plan) => (
                <div
                  key={plan._id}
                  className="relative bg-white/10 backdrop-blur-lg border border-white/10 p-6 rounded-2xl shadow-2xl hover:shadow-yellow-500/20 transition-all hover:scale-[1.02]"
                >
                  {/* 🗑️ Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(plan._id);
                      setPlans((prev) => prev.filter((p) => p._id !== plan._id));
                    }}
                    className="absolute top-4 right-4 text-red-400 hover:text-red-600 transition"
                    title="Delete project"
                  >
                    ✕
                  </button>

                  <div onClick={() => handleSelect(plan, plan._id)} className="cursor-pointer">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent mb-3">
                      {plan.project_name}
                    </h3>

                    <p className="text-gray-300 mb-1">
                      <span className="font-semibold text-blue-300">Client Nodes:</span>{" "}
                      {plan.client_nodes.length}
                    </p>
                    <p className="text-gray-300 mb-1">
                      <span className="font-semibold text-purple-300">Cloudflare Nodes:</span>{" "}
                      {plan.cloudflare_nodes?.length || "Disabled"}
                    </p>
                    <p className="text-gray-300 mb-1">
                      <span className="font-semibold text-yellow-300">Optimal Data Centers:</span>{" "}
                      {plan.data_centers.length}
                    </p>
                    <p className="text-gray-300 mb-1">
                      <span className="font-semibold text-blue-400">Optimal Routing Nodes:</span>{" "}
                      {plan.routing.length}
                    </p>
                    <p className="text-gray-300 mb-1">
                      <span className="font-semibold text-green-300">Money Saved:</span>{" "}
                      ${plan.money_saved.toLocaleString()}
                    </p>
                    <p className="text-gray-300 mb-1">
                      <span className="font-semibold text-emerald-300">Energy Saved / Day:</span>{" "}
                      {plan.kwh_saved.toFixed(2)} kWh
                    </p>

                    <p className="text-gray-400 text-sm mt-2">
                      Infrastructure Plan: {plan.infrastructure_plan.substring(0, 80)}...
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <p className="text-white font-bold text-center text-lg mt-10">
                You have no saved plans yet!
              </p>

              <div className="mt-8 flex justify-center">
                <Link to="/projects">
                  <Button>Create Global Network</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
