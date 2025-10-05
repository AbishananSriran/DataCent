import csv
import json
import os
import random
import typing

import bson
import fastapi
import google.genai
import pydantic
import pymongo.mongo_client

import kmeans

cities = None
cloudflare_nodes = None

# Gemini connection
gemini = google.genai.Client(api_key=os.environ["GEMINI_API_KEY"])

# DB connection
mongo = pymongo.mongo_client.MongoClient(os.environ["MONGODB_URI"])
mongo.admin.command('ping')  # ensure we are actually connected to the db
def _get_networks_collection():
    return mongo.get_database("hackthevalleyx").get_collection("networks")

app = fastapi.FastAPI()

class _AnalyzeLocationInput(pydantic.BaseModel):
    name: str
    prompt: typing.Optional[str] = None
class _AnalyzeLocationOutput(pydantic.BaseModel):
    text: str
@app.post("/api/analyze-location")
def _analyze_location(options: _AnalyzeLocationInput) -> _AnalyzeLocationOutput:
    prompt = options.prompt
    if prompt is None:
        prompt = f"I am building a data center at {options.name}. What are some regulations I might need to overcome?"
    response = gemini.models.generate_content(
        model="gemini-2.5-flash-lite",
        contents=prompt,
    )
    return _AnalyzeLocationOutput(text=response.text)


class _KMeansInput(pydantic.BaseModel):
    locations: list[tuple[float, float]]
    k: int
    predefined: typing.Optional[list[tuple[float, float]]] = ()
    snapToCity: bool = False
class _KMeansOutput(pydantic.BaseModel):
    locations: list[tuple[float, float]]
    snappedLocations: typing.Optional[list[tuple[float, float]]] = None
    snappedNames: typing.Optional[list[str]] = None

@app.post("/api/kmeans")
def _run_kmeans(options: _KMeansInput) -> _KMeansOutput:
    locations = options.locations
    k = options.k
    predefined = options.predefined

    means = locations.copy()
    random.shuffle(means)
    del means[k:]
    means[:len(predefined)] = predefined
    if len(means) != k:
        raise ValueError("ensure k <= len(locations)")

    best = (9e999, [])
    for _ in range(30):
        try:
            for _ in range(50):
                means = kmeans.k_means_once(locations, means)
        except Exception:
            pass
        else:
            score = kmeans.k_means_score(locations, means)
            best = max(best, (score, means))

    snappedNames = None
    snappedLocations = None
    if options.snapToCity:
        global cities
        if not cities:
            new_cities = {}
            with open("worldcities.csv", encoding="utf-8", newline="") as file:
                for row in csv.DictReader(file):
                    new_cities[row["city_ascii"]] = (float(row["lat"]), float(row["lng"]))
            cities = new_cities

        snappedNames = [
            min(cities, key=lambda name: kmeans._distance(cities[name], mean))
            for mean in means
        ]
        snappedLocations = [cities[city] for city in snappedNames]

    return _KMeansOutput(
        locations=means,
        snappedLocations=snappedLocations,
        snappedNames=snappedNames,
    )


class _NetworkInput(pydantic.BaseModel):
    id: typing.Optional[typing.Annotated[str, pydantic.BeforeValidator(str)]] = pydantic.Field(alias="_id", default=None)
    user_id: int
    project_name: str = "Unnamed Network"
    client_nodes: list[tuple[float, float]]
    data_center_guess: list[tuple[float, float]]
    routing_guess: list[tuple[float, float]]
    cloudflare_enabled: bool = False
class _Network(_NetworkInput):
    cloudflare_nodes: list[tuple[float, float]]
    data_centers: list[tuple[float, float]]
    routing: list[tuple[float, float]]
    money_saved: float
    kwh_saved: float
    infrastructure_plan: str

@app.get("/api/networks")
async def _list_networks() -> list[_Network]:
    networks = _get_networks_collection()
    return [_Network.model_validate(network) for network in networks.find()]

@app.post("/api/networks")
def _add_network(network: _Network) -> _Network:
    networks = _get_networks_collection()
    result = networks.insert_one(network.model_dump())
    network.id = str(result.inserted_id)
    return network

@app.delete("/api/networks/{id}")
def _remove_network(id: str):
    networks = _get_networks_collection()
    result = networks.delete_one({"_id": bson.ObjectId(id)})
    if result.deleted_count == 0:
        raise fastapi.HTTPException(status_code=404)
    return fastapi.Response(status_code=204)


@app.post("/api/networks/upload")
def _upload_network(network: _NetworkInput) -> _Network:
    global cloudflare_nodes
    if network.cloudflare_enabled and not cloudflare_nodes:
        with open("cloudflare.json", encoding="utf-8") as file:
            cloudflare_nodes = [(info["lat"], info["lon"]) for info in json.load(file)]

    client_nodes = cloudflare_nodes if network.cloudflare_enabled else network.client_nodes
    out = _run_kmeans(_KMeansInput(
        locations=client_nodes,
        k=len(network.data_center_guess) + len(network.routing_guess),
        snapToCity=True,
    ))

    closest_count = {location: 0 for location in out.snappedLocations}
    for client in network.client_nodes:
        closest = min(out.snappedLocations, key=lambda location: kmeans._distance(location, client))
        closest_count[closest] += 1
    locations = sorted(closest_count, key=lambda location: closest_count[location], reverse=True)
    data_centers = locations[:len(network.data_center_guess)]
    routing = locations[len(network.data_center_guess):]
    names = [name for name, location in zip(out.snappedNames, out.snappedLocations) if location in data_centers]

    infrastructure_plan = _analyze_location(_AnalyzeLocationInput(
        name=" and ".join(names)
    )).text

    return _add_network(_Network(
        **network.model_dump(),
        cloudflare_nodes=cloudflare_nodes if network.cloudflare_enabled else [],
        data_centers=data_centers,
        routing=routing,
        money_saved=0,
        kwh_saved=0,
        infrastructure_plan=infrastructure_plan,
    ))
