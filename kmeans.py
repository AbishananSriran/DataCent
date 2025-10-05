import math
import random

def _distance(a: tuple[float, float], b: tuple[float, float]) -> float:
    ay, ax = a
    by, bx = b
    return ((ay - by)**2 + (ax - bx)**2)**0.5

def _mean(locations: list[tuple[float, float]]) -> tuple[float, float]:
    return (
        sum(y for y, x in locations) / len(locations),
        sum(x for y, x in locations) / len(locations),
    )

def k_means_once(locations: list[tuple[float, float]], means: list[tuple[float, float]]) -> list[tuple[float, float]]:
    bests = {mean: [] for mean in means}
    for location in locations:
        best = min(means, key=lambda mean: _distance(mean, location))
        bests[best].append(location)
    return [_mean(locations) for locations in bests.values()]

def _random(k: int) -> list[tuple[float, float]]:
    locations = set()
    while len(locations) < k:
        locations.add((
            math.degrees(2*math.pi*random.uniform(0, 1)),
            math.degrees(math.acos(2*random.uniform(0, 1) - 1)),
        ))
    return list(locations)
