"""Build the browser catalog from the source CSV.

Run from the project root:
    python scripts/generar_catalogo.py

The CSV is read sequentially; only aggregated counts and rankings are written.
"""

from __future__ import annotations

import csv
import json
import math
import re
import unicodedata
from collections import Counter, defaultdict
from datetime import datetime
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "DataBase" / "Delitos_final.csv"
OUTPUT = ROOT / "assets" / "data" / "catalogo.js"
DEPARTMENT_SOURCE = ROOT / "assets" / "data" / "departamentos.geojson"
DEPARTMENT_OUTPUT = ROOT / "assets" / "data" / "departamentos.js"
MONTHS = (
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
)
MONTH_ALIASES = {
    "ene": 1, "enero": 1,
    "feb": 2, "febrero": 2,
    "mar": 3, "marzo": 3,
    "abr": 4, "abril": 4,
    "may": 5, "mayo": 5,
    "jun": 6, "junio": 6,
    "jul": 7, "julio": 7,
    "ago": 8, "agosto": 8,
    "sep": 9, "sept": 9, "set": 9, "septiembre": 9, "setiembre": 9,
    "oct": 10, "octubre": 10,
    "nov": 11, "noviembre": 11,
    "dic": 12, "diciembre": 12,
}
CATEGORY_ICONS = {
    "control de armas": "🚔",
    "bienes y recursos": "💰",
    "vida e integridad": "🛡️",
    "informaticos": "💻",
    "funcion publica": "🏛️",
    "movilidad humana": "🔗",
    "hurtos": "🏠",
    "ambiental": "🌳",
    "transito": "🚦",
}
DEPARTMENT_NAMES = {
    "05": "ANTIOQUIA",
    "08": "ATLÁNTICO",
    "11": "BOGOTÁ D.C.",
    "13": "BOLÍVAR",
    "15": "BOYACÁ",
    "17": "CALDAS",
    "18": "CAQUETÁ",
    "19": "CAUCA",
    "20": "CESAR",
    "23": "CÓRDOBA",
    "25": "CUNDINAMARCA",
    "27": "CHOCÓ",
    "41": "HUILA",
    "44": "LA GUAJIRA",
    "47": "MAGDALENA",
    "50": "META",
    "52": "NARIÑO",
    "54": "NORTE DE SANTANDER",
    "63": "QUINDÍO",
    "66": "RISARALDA",
    "68": "SANTANDER",
    "70": "SUCRE",
    "73": "TOLIMA",
    "76": "VALLE DEL CAUCA",
    "81": "ARAUCA",
    "85": "CASANARE",
    "86": "PUTUMAYO",
    "88": "SAN ANDRÉS",
    "91": "AMAZONAS",
    "94": "GUAINÍA",
    "95": "GUAVIARE",
    "97": "VAUPÉS",
    "99": "VICHADA",
}
DEPARTMENT_REGION_CODES = {
    "andina": ("05", "11", "15", "17", "25", "41", "54", "63", "66", "68", "73"),
    "caribe": ("08", "13", "20", "23", "44", "47", "70"),
    "pacifica": ("19", "27", "52", "76"),
    "orinoquia": ("50", "81", "85", "99"),
    "amazonia": ("18", "86", "91", "94", "95", "97"),
    "insular": ("88",),
}
DEPARTMENT_REGION_BY_CODE = {
    code: region
    for region, codes in DEPARTMENT_REGION_CODES.items()
    for code in codes
}
SIEDCO_REGION_IDS = {
    "andina": "andina",
    "caribe": "caribe",
    "pacifica": "pacifica",
    "orinoquia": "orinoquia",
    "amazonia": "amazonia",
    "insular": "insular",
    "sin region": "sin-region",
    "no reportado": "sin-region",
}


def normalize(value: Any) -> str:
    text = unicodedata.normalize("NFKD", str(value or ""))
    return "".join(char for char in text if not unicodedata.combining(char)).casefold().strip()


def slug(value: str) -> str:
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9]+", "-", normalize(value))).strip("-")


def number(value: Any) -> float | int | None:
    if isinstance(value, bool) or value is None:
        return None
    if isinstance(value, (int, float)):
        return value
    text = str(value).strip().replace(" ", "")
    if not text:
        return None
    if "," in text and "." in text:
        if text.rfind(",") > text.rfind("."):
            text = text.replace(".", "").replace(",", ".")
        else:
            text = text.replace(",", "")
    elif "," in text:
        text = text.replace(",", ".")
    try:
        parsed = float(text)
    except ValueError:
        return None
    return int(parsed) if parsed.is_integer() else parsed


def year_value(value: Any) -> int | None:
    parsed = number(value)
    if parsed is None:
        return None
    try:
        year = int(parsed)
    except (OverflowError, ValueError):
        return None
    if parsed != year:
        return None
    return year if 1900 <= year <= 2100 else None


def month_value(value: Any) -> int | None:
    text = normalize(value).replace(".", "")
    numeric = number(value)
    if numeric is not None and numeric == int(numeric):
        month = int(numeric)
        return month if 1 <= month <= 12 else None
    return MONTH_ALIASES.get(text)


def display_label(value: str) -> str:
    words = value.strip().split()
    lowered = {"a", "al", "de", "del", "en", "la", "las", "los", "y"}
    return " ".join(
        word.casefold() if index and word.casefold() in lowered else word.capitalize()
        for index, word in enumerate(words)
    )


def value_bucket() -> dict[str, Any]:
    return {"records": 0, "cases": 0}


def finish_bucket(bucket: dict[str, Any]) -> dict[str, Any]:
    return {
        "records": bucket["records"],
        "cases": bucket["cases"],
    }


def summarize_crime(
    category_id: str,
    crime_id: str,
    crime: dict[str, Any],
) -> dict[str, Any]:
    finished_years = []
    for year in sorted(crime["years"]):
        bucket = crime["years"][year]
        months = bucket["months"]
        finished_years.append({
            "year": year,
            "records": bucket["records"],
            "cases": bucket["cases"],
            "months": [
                {"month": month, **finish_bucket(months[month])}
                for month in range(1, 13)
                if month in months
            ],
        })

    municipalities = crime["municipalities"]
    ranked_municipalities = sorted(
        municipalities.items(),
        key=lambda item: (
            -item[1]["cases"],
            normalize(item[0][1]),
            normalize(item[0][0]),
        ),
    )[:10]
    municipality_locations = {
        (normalize(department), normalize(name))
        for department, name in municipalities
    }
    return {
        "id": f"{category_id}-{crime_id}",
        "name": crime["name"],
        "source": "SIEDCO · 2020–2026",
        "categoryId": category_id,
        "records": crime["records"],
        "municipalityCount": len(municipality_locations),
        "_municipalityLocations": sorted(municipality_locations),
        "cases": crime["cases"],
        "years": finished_years,
        "municipalities": [
            {
                "department": department or None,
                "name": name,
                **finish_bucket(bucket),
            }
            for (department, name), bucket in ranked_municipalities
        ],
        "municipalityData": [
            {
                "department": department or None,
                "name": name,
                "region": bucket["region"],
                **finish_bucket(bucket),
                "years": [
                    {
                        "year": year,
                        "records": yearly["records"],
                        "cases": yearly["cases"],
                    }
                    for year, yearly in sorted(bucket.get("years", {}).items())
                ],
            }
            for (department, name), bucket in sorted(municipalities.items())
        ],
    }


def build_catalog() -> dict[str, Any]:
    if not SOURCE.is_file():
        raise FileNotFoundError(f"No se encontró el archivo de datos: {SOURCE}")

    categories_by_id: dict[str, dict[str, Any]] = {}
    total_records = 0
    total_cases = 0
    duplicate_records = 0
    source_records = 0
    months_by_year: dict[int, set[int]] = defaultdict(set)
    with SOURCE.open("r", encoding="utf-8-sig", newline="") as source:
        reader = csv.DictReader(source)
        if not reader.fieldnames:
            raise ValueError(f"{SOURCE.name}: no contiene encabezados")
        columns = {
            normalize(header): header
            for header in reader.fieldnames
            if header is not None
        }
        required = (
            "tematica", "delito", "ano", "mes", "municipio", "casos", "region",
        )
        missing = [field for field in required if field not in columns]
        if missing:
            raise ValueError(
                f"{SOURCE.name}: faltan columnas requeridas: {', '.join(missing)}"
            )
        department_column = columns.get("departamento")
        dane_code_column = columns.get("codigo_dane")
        duplicate_column = columns.get("es_duplicado")
        region_column = columns["region"]

        for row in reader:
            if not row or not any(value for value in row.values() if value is not None):
                continue
            source_records += 1
            duplicate_flag = (
                normalize(row.get(duplicate_column))
                if duplicate_column else ""
            )
            if duplicate_flag in {"1", "true", "si", "yes"}:
                duplicate_records += 1
                continue
            total_records += 1
            category_name = str(row.get(columns["tematica"]) or "").strip()
            crime_name = str(row.get(columns["delito"]) or "").strip()
            if not category_name or not crime_name:
                raise ValueError(
                    f"{SOURCE.name}, línea {reader.line_num}: "
                    "falta la temática o el delito"
                )

            category_id = slug(category_name)
            crime_id = slug(crime_name)
            category = categories_by_id.setdefault(category_id, {
                "id": category_id,
                "name": category_name,
                "icon": next(
                    (
                        icon for keyword, icon in CATEGORY_ICONS.items()
                        if keyword in normalize(category_name)
                    ),
                    "📊",
                ),
                "crimes": {},
            })
            crime = category["crimes"].setdefault(crime_id, {
                "name": display_label(crime_name),
                "records": 0,
                "cases": 0,
                "years": defaultdict(lambda: {
                    "records": 0,
                    "cases": 0,
                    "months": defaultdict(value_bucket),
                }),
                "municipalities": defaultdict(value_bucket),
            })
            crime["records"] += 1

            cases_value = number(row.get(columns["casos"]))
            if cases_value is None:
                raise ValueError(
                    f"{SOURCE.name}, línea {reader.line_num}: "
                    f"valor inválido en la columna casos: {row.get(columns['casos'])!r}"
                )
            total_cases += cases_value
            crime["cases"] += cases_value

            year = year_value(row.get(columns["ano"]))
            month = month_value(row.get(columns["mes"]))
            if year is not None and month is not None:
                months_by_year[year].add(month)
            if year is not None:
                yearly = crime["years"][year]
                yearly["records"] += 1
                yearly["cases"] += cases_value
                if month is not None:
                    monthly = yearly["months"][month]
                    monthly["records"] += 1
                    monthly["cases"] += cases_value

            municipality = str(row.get(columns["municipio"]) or "").strip()
            department = (
                str(row.get(department_column) or "").strip()
                if department_column else ""
            )
            source_region = normalize(row.get(region_column))
            region = SIEDCO_REGION_IDS.get(source_region)
            if region is None:
                raise ValueError(
                    f"{SOURCE.name}, línea {reader.line_num}: "
                    f"región no reconocida: {row.get(region_column)!r}"
                )
            if region == "sin-region":
                dane_code = str(row.get(dane_code_column) or "").strip()
                department_code = (
                    dane_code[:2] if re.fullmatch(r"\d{5}", dane_code) else ""
                )
                inferred_region = DEPARTMENT_REGION_BY_CODE.get(department_code)
                if inferred_region:
                    region = inferred_region
                    if normalize(department) in ("", "no reportado"):
                        department = DEPARTMENT_NAMES[department_code]
            if municipality and municipality.casefold() not in ("nan", "none"):
                location = crime["municipalities"][(department, municipality)]
                previous_region = location.setdefault("region", region)
                if previous_region != region:
                    raise ValueError(
                        f"{SOURCE.name}, línea {reader.line_num}: "
                        f"{municipality!r} en {department!r} aparece en más de una región"
                    )
                location["records"] += 1
                location["cases"] += cases_value
                if year is not None:
                    location_year = location.setdefault("years", defaultdict(value_bucket))[year]
                    location_year["records"] += 1
                    location_year["cases"] += cases_value

    categories = []
    all_years: set[int] = set()
    crime_count = 0
    for category in sorted(
        categories_by_id.values(),
        key=lambda item: normalize(item["name"]),
    ):
        crimes = [
            summarize_crime(category["id"], crime_id, crime)
            for crime_id, crime in sorted(
                category["crimes"].items(),
                key=lambda item: normalize(item[1]["name"]),
            )
        ]
        records_by_year: Counter[int] = Counter()
        cases_by_year: Counter[int] = Counter()
        municipalities: set[tuple[str, str]] = set()
        for crime in crimes:
            crime_count += 1
            for item in crime["years"]:
                records_by_year[item["year"]] += item["records"]
                cases_by_year[item["year"]] += item["cases"]
                all_years.add(item["year"])
            municipalities.update(crime.pop("_municipalityLocations"))

        categories.append({
            "id": category["id"],
            "name": category["name"],
            "icon": category["icon"],
            "records": sum(crime["records"] for crime in crimes),
            "cases": sum(crime["cases"] for crime in crimes),
            "crimeCount": len(crimes),
            "municipalityCount": len(municipalities),
            "years": [
                {
                    "year": year,
                    "records": records_by_year[year],
                    "cases": cases_by_year[year],
                }
                for year in sorted(records_by_year)
            ],
            "crimes": crimes,
        })

    if not categories:
        raise ValueError(f"No se encontraron registros en {SOURCE}")
    return {
        "generatedFrom": "DataBase/Delitos_final.csv",
        "sourceMetadata": {
            "filename": SOURCE.name,
            "sizeBytes": SOURCE.stat().st_size,
            "sourceRecords": source_records,
            "duplicateRecordsExcluded": duplicate_records,
            "modifiedAt": datetime.fromtimestamp(
                SOURCE.stat().st_mtime
            ).astimezone().isoformat(timespec="minutes"),
        },
        "crimeCount": crime_count,
        "categoryCount": len(categories),
        "totalRecords": total_records,
        "totalCases": total_cases,
        "years": sorted(all_years),
        "yearCoverage": [
            {
                "year": year,
                "monthsAvailable": sorted(months_by_year[year]),
                "complete": len(months_by_year[year]) == 12,
            }
            for year in sorted(all_years)
        ],
        "categories": categories,
    }


def build_department_map() -> dict[str, Any]:
    if not DEPARTMENT_SOURCE.is_file():
        raise FileNotFoundError(
            f"No se encontró la cartografía departamental: {DEPARTMENT_SOURCE}"
        )
    source = json.loads(DEPARTMENT_SOURCE.read_text(encoding="utf-8"))
    features = source.get("features", [])
    if not features:
        raise ValueError(f"{DEPARTMENT_SOURCE.name}: no contiene departamentos")

    def positions(value: Any):
        if (
            isinstance(value, list)
            and len(value) >= 2
            and isinstance(value[0], (int, float))
            and isinstance(value[1], (int, float))
        ):
            yield value
        elif isinstance(value, list):
            for child in value:
                yield from positions(child)

    all_positions = [
        position
        for feature in features
        for position in positions(feature["geometry"]["coordinates"])
    ]
    min_lon = min(position[0] for position in all_positions)
    max_lon = max(position[0] for position in all_positions)
    min_lat = min(position[1] for position in all_positions)
    max_lat = max(position[1] for position in all_positions)
    width, height, padding = 680, 760, 18
    longitude_scale = math.cos(math.radians((min_lat + max_lat) / 2))
    scale = min(
        (width - 2 * padding) / ((max_lon - min_lon) * longitude_scale),
        (height - 2 * padding) / (max_lat - min_lat),
    )
    map_width = (max_lon - min_lon) * longitude_scale * scale
    map_height = (max_lat - min_lat) * scale
    offset_x = (width - map_width) / 2
    offset_y = (height - map_height) / 2

    def point(position: list[float]) -> str:
        x = offset_x + (position[0] - min_lon) * longitude_scale * scale
        y = offset_y + (max_lat - position[1]) * scale
        return f"{x:.2f},{y:.2f}"

    def ring_path(ring: list[list[float]]) -> str:
        return "M" + "L".join(point(position) for position in ring) + "Z"

    departments = []
    for feature in features:
        properties = feature.get("properties", {})
        code = str(properties.get("DPTO_CCDGO", ""))
        name = DEPARTMENT_NAMES.get(code)
        if not name:
            raise ValueError(
                f"Código departamental sin nombre: {code or 'vacío'}"
            )
        geometry = feature["geometry"]
        polygons = (
            [geometry["coordinates"]]
            if geometry["type"] == "Polygon"
            else geometry["coordinates"]
        )
        path = " ".join(
            ring_path(ring)
            for polygon in polygons
            for ring in polygon
        )
        key = re.sub(r"[.,]", "", normalize(name))
        departments.append({"key": key, "name": name, "path": path})

    return {"viewBox": f"0 0 {width} {height}", "departments": departments}


def write_catalog(catalog: dict[str, Any], output: Path, variable: str) -> None:
    output.write_text(
        f"window.{variable} = "
        + json.dumps(catalog, ensure_ascii=False, separators=(",", ":"))
        + ";\n",
        encoding="utf-8",
    )


def main() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    catalog = build_catalog()
    write_catalog(catalog, OUTPUT, "INDECOL_CATALOGO")
    department_map = build_department_map()
    DEPARTMENT_OUTPUT.write_text(
        "window.INDECOL_MAPA = "
        + json.dumps(department_map, ensure_ascii=False, separators=(",", ":"))
        + ";\n",
        encoding="utf-8",
    )
    print(
        f"Catálogo generado: {len(catalog['categories'])} categorías, "
        f"{catalog['crimeCount']} delitos, "
        f"{catalog['totalCases']:,.0f} casos "
        f"({catalog['sourceMetadata']['duplicateRecordsExcluded']:,} duplicados excluidos)."
    )
    print(OUTPUT.relative_to(ROOT))
    print(
        f"Mapa generado: {len(department_map['departments'])} departamentos."
    )
    print(DEPARTMENT_OUTPUT.relative_to(ROOT))


if __name__ == "__main__":
    main()
