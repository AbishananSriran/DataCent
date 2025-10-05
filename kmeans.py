import math
import random

def _distance(a: tuple[int, int], b: tuple[int, int]) -> float:
    ay, ax = a
    by, bx = b
    return ((ay - by)**2 + (ax - bx)**2)**0.5

def _mean(locations: list[tuple[int, int]]) -> tuple[int, int]:
    return (
        sum(y for y, x in locations) / len(locations),
        sum(x for y, x in locations) / len(locations),
    )

def k_means_once(locations: list[tuple[int, int]], means: list[tuple[int, int]]) -> list[tuple[int, int]]:
    bests = {mean: [] for mean in means}
    for location in locations:
        best = min(means, key=lambda mean: _distance(mean, location))
        bests[best].append(location)
    return [_mean(locations) for locations in bests.values()]

def _random(k: int) -> list[tuple[int, int]]:
    locations = set()
    while len(locations) < k:
        locations.add((
            math.degrees(2*math.pi*random.uniform(0, 1)),
            math.degrees(math.acos(2*random.uniform(0, 1) - 1)),
        ))
    return list(locations)
