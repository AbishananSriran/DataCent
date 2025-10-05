import csv
import os
import random
import typing

import fastapi
import pydantic
import google.genai

import kmeans

cities = {}
with open("worldcities.csv", encoding="utf-8", newline="") as file:
    for row in csv.DictReader(file):
        cities[row["city_ascii"]] = (float(row["lat"]), float(row["lng"]))

# Gemini connection
gemini = google.genai.Client(api_key=os.environ["GEMINI_API_KEY"])

app = fastapi.FastAPI()

class _AnalyzeLocationInput(pydantic.BaseModel):
    name: str
    prompt: typing.Optional[str] = None
class _AnalyzeLocationOutput(pydantic.BaseModel):
    text: str
@app.post("/api/analyze-location")
async def _analyze_location(options: _AnalyzeLocationInput) -> _AnalyzeLocationOutput:
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
