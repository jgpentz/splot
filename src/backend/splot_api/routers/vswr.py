from fastapi import APIRouter
from typing import List, Dict, Any
from pydantic import BaseModel
import numpy as np
import xarray as xr
from internals.conversions.db import v2db
from internals.conversions.parameters import s2vswr


class Coord(BaseModel):
    attrs: Any
    data: list[float | int | str]
    dims: list[str]


class Coords(BaseModel):
    frequency: Coord
    m: Coord
    n: Coord


class Attrs(BaseModel):
    filepaths: List[str]


class Data(BaseModel):
    dims: List[str]
    attrs: Attrs
    data: List[List[List[float | int]]]
    coords: Coords
    name: Any


class Complex(BaseModel):
    imag: Data
    real: Data

    class Config:
        extra = "allow"


# Generate a route for processing sparams
router = APIRouter()


# Process the sparam files
@router.post("/vswr", tags=["vswr"])
async def process_vswr(complexDataObjs: List[Dict[str, Complex]]):
    processed_data = {}

    for obj in complexDataObjs:
        fname = list(obj.keys())[0]
        complex_xr = obj[fname]

        imag = np.array(complex_xr.imag.data)
        real = np.array(complex_xr.real.data)
        complex_values = real + 1j * imag

        new_xr = xr.DataArray(
            data=complex_values,
            dims=complex_xr.imag.dims,
            coords={
                "frequency": complex_xr.imag.coords.frequency.data,
                "m": complex_xr.imag.coords.m.data,
                "n": complex_xr.imag.coords.n.data,
            },
            attrs={"fname": fname, "filepaths": complex_xr.imag.attrs.filepaths},
        )

        # -------------------
        # Read the s params, convert complex voltage to dB, then to vswr,
        # replace nan and inf/-inf, then store in dict
        s = s2vswr(new_xr)
        s.data = np.nan_to_num(s, nan=0.0, posinf=np.finfo(np.float64).max, neginf=-np.finfo(np.float64).max)
        s_dict = s.to_dict()

        # Change m and n keys to contain a list of the data
        s_dict["m"] = s.m.data.tolist()
        s_dict["n"] = s.n.data.tolist()

        # Pull out all of the Smn permutations into their own key value pair
        for m in s.m.data:
            for n in s.n.data:
                # Select the data for the current permutation
                a = s.sel(m=m, n=n)
                s_dict[f"s{m}{n}"] = s.sel(m=m, n=n).data.tolist()
                s_dict[f"s{m}{n}"] = {"name": f"{fname} s{m}{n}", "data": [], "visible": True}

                # Store all of the data as a (freq, data) pair, only round
                # when the value is not float64.max, as rounding the max numbers
                # will turn this back into inf/-inf
                for freq, db in zip((a.frequency.data / 1e9), a.data):
                    if not db == np.finfo(np.float64).max and not db == -np.finfo(np.float64).max:
                        db = db.round(decimals=2)
                    data = {"frequency": freq, "value": db}
                    s_dict[f"s{m}{n}"]["data"].append(data)
        s_dict["del"] = False

        # Store the data in the final json
        processed_data[fname] = s_dict

        # Remove unused info
        del s_dict["dims"]
        del s_dict["attrs"]
        del s_dict["data"]
        del s_dict["coords"]
        del s_dict["name"]

    return processed_data
