"""Build the seized-drugs summary used by the "Incautación de estupefacientes" page.

Run from the project root:
    python scripts/generar_incautaciones.py

The source records this activity by weight (column cantidad_incautada, in grams);
its casos column is 0, so these figures are kept apart from the case catalog.
"""

from __future__ import annotations

import csv
import json
from collections import Counter, defaultdict

from generar_catalogo import ROOT, SOURCE, month_value, normalize, number, year_value

OUTPUT = ROOT / "assets" / "data" / "incautaciones.js"
CRIME = "incautacion de estupefacientes"


def build_summary() -> dict:
    if not SOURCE.is_file():
        raise FileNotFoundError(f"No se encontró el archivo de datos: {SOURCE}")

    records = 0
    total = 0.0
    by_year: Counter = Counter()
    by_month: dict[int, Counter] = defaultdict(Counter)
    by_substance: Counter = Counter()
    by_department: Counter = Counter()
    by_municipality: Counter = Counter()
    largest: dict | None = None

    with SOURCE.open("r", encoding="utf-8-sig", newline="") as source:
        reader = csv.DictReader(source)
        columns = {normalize(header): header for header in reader.fieldnames or []}
        required = (
            "delito", "ano", "mes", "departamento", "municipio",
            "clase_bien", "unidad", "cantidad_incautada",
        )
        missing = [field for field in required if field not in columns]
        if missing:
            raise ValueError(f"Faltan columnas requeridas: {', '.join(missing)}")
        duplicate_column = columns.get("es_duplicado")

        for row in reader:
            if normalize(row.get(columns["delito"])) != CRIME:
                continue
            if duplicate_column and normalize(row.get(duplicate_column)) in {"1", "true", "si", "yes"}:
                continue
            line = reader.line_num
            if normalize(row.get(columns["unidad"])) != "gramo":
                raise ValueError(f"Línea {line}: unidad distinta de GRAMO: {row.get(columns['unidad'])!r}")
            grams = number(row.get(columns["cantidad_incautada"]))
            year = year_value(row.get(columns["ano"]))
            month = month_value(row.get(columns["mes"]))
            if grams is None or grams < 0 or year is None or month is None:
                raise ValueError(f"Línea {line}: cantidad, año o mes inválido")

            substance = str(row.get(columns["clase_bien"]) or "").strip() or "SIN CLASIFICAR"
            department = str(row.get(columns["departamento"]) or "").strip()
            municipality = str(row.get(columns["municipio"]) or "").strip()

            records += 1
            total += grams
            by_year[year] += grams
            by_month[year][month] += grams
            by_substance[substance] += grams
            if normalize(department) not in ("", "no reportado"):
                by_department[department] += grams
                if normalize(municipality) not in ("", "no reportado", "nan", "none"):
                    by_municipality[(department, municipality)] += grams
            if largest is None or grams > largest["grams"]:
                largest = {
                    "grams": grams, "year": year, "month": month,
                    "department": department, "substance": substance,
                }

    if not records:
        raise ValueError("No se encontraron registros de incautación de estupefacientes")

    return {
        "records": records,
        "grams": round(total),
        "years": [
            {
                "year": year,
                "grams": round(by_year[year]),
                "months": [
                    {"month": month, "grams": round(grams)}
                    for month, grams in sorted(by_month[year].items())
                ],
            }
            for year in sorted(by_year)
        ],
        "substances": [
            {"name": name, "grams": round(grams)}
            for name, grams in by_substance.most_common()
        ],
        "departments": [
            {"name": name, "grams": round(grams)}
            for name, grams in by_department.most_common(10)
        ],
        "municipalities": [
            {"department": department, "name": name, "grams": round(grams)}
            for (department, name), grams in by_municipality.most_common(10)
        ],
        "largest": {**largest, "grams": round(largest["grams"])},
    }


def main() -> None:
    summary = build_summary()
    OUTPUT.write_text(
        "window.INDECOL_INCAUTACIONES = "
        + json.dumps(summary, ensure_ascii=False, separators=(",", ":"))
        + ";\n",
        encoding="utf-8",
    )
    print(f"{summary['records']:,} registros, {summary['grams'] / 1e6:,.1f} toneladas")
    print({item["year"]: len(item["months"]) for item in summary["years"]})
    print("meses del último año:", [item["month"] for item in summary["years"][-1]["months"]])
    print(OUTPUT.relative_to(ROOT))


if __name__ == "__main__":
    main()
