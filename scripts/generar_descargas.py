"""Build the downloadable CSV files (one per year and a complete one), zipped.

Run from the project root after scripts/generar_catalogo.py:
    python scripts/generar_descargas.py

Writes:
    assets/descargas/indecol-datos-<año>.zip    detail with month
    assets/descargas/indecol-datos-completo.zip every year, without month so that
                                                it still fits in an Excel sheet
    assets/data/descargas.js                    rows and sizes shown by the page
"""

from __future__ import annotations

import csv
import io
import json
import re
import zipfile
from collections import defaultdict

from generar_catalogo import (
    DEPARTMENT_NAMES, DEPARTMENT_REGION_BY_CODE, MONTHS, ROOT, SIEDCO_REGION_IDS,
    SOURCE, display_label, month_value, normalize, number, year_value,
)

OUTPUT = ROOT / "assets" / "descargas"
INDEX = ROOT / "assets" / "data" / "descargas.js"
EXCEL_ROWS = 1_048_576
REGION_NAMES = {
    "andina": "Andina", "caribe": "Caribe", "pacifica": "Pacífica",
    "orinoquia": "Orinoquía", "amazonia": "Amazonía", "insular": "Insular",
    "sin-region": "Sin región asignada",
}
PLACE = ["Región", "Departamento", "Código DANE", "Municipio", "Categoría", "Delito"]
PERSON = ["Zona", "Género", "Edad"]
VALUES = ["Casos", "Cantidad incautada (gramos)"]
# the source writes departments without accents and with these two short forms
SOURCE_SPELLING = {"BOGOTA D.C.": "BOGOTA D.C", "LA GUAJIRA": "GUAJIRA"}


def text(value: str | None, empty: str = "NO REPORTADO") -> str:
    value = str(value or "").strip()
    return value if value and value.casefold() not in ("nan", "none") else empty


def source_department(code: str) -> str:
    """Department name for a DANE code, spelled like the rest of the source."""
    name = normalize(DEPARTMENT_NAMES[code]).upper()
    return SOURCE_SPELLING.get(name, name)


def amount(value: float) -> int | float:
    value = round(value, 2)
    return int(value) if value == int(value) else value


def read_source() -> dict[int, dict[tuple, list[float]]]:
    """Sum cases and seized grams per year; each key starts with the month number."""
    years: dict[int, dict[tuple, list[float]]] = defaultdict(dict)
    with SOURCE.open("r", encoding="utf-8-sig", newline="") as source:
        reader = csv.DictReader(source)
        columns = {normalize(header): header for header in reader.fieldnames or []}
        for row in reader:
            get = lambda name: row.get(columns[name]) if name in columns else None
            if normalize(get("es_duplicado")) in {"1", "true", "si", "yes"}:
                continue
            year = year_value(get("ano"))
            month = month_value(get("mes"))
            cases = number(get("casos")) or 0
            seized = number(get("cantidad_incautada")) or 0
            if year is None or not (cases or seized):
                continue
            if seized and normalize(get("unidad")) != "gramo":
                raise ValueError(f"Línea {reader.line_num}: unidad no prevista {get('unidad')!r}")
            department = str(get("departamento") or "").strip()
            dane = str(get("codigo_dane") or "").strip()
            region = SIEDCO_REGION_IDS[normalize(get("region"))]
            # same rule as the catalog: recover the department from the DANE code
            if region == "sin-region":
                code = dane[:2] if re.fullmatch(r"\d{5}", dane) else ""
                if code in DEPARTMENT_REGION_BY_CODE:
                    region = DEPARTMENT_REGION_BY_CODE[code]
                    if normalize(department) in ("", "no reportado"):
                        department = source_department(code)
            key = (
                month or 0,
                REGION_NAMES[region],
                department or "Departamento no especificado",
                text(dane),
                text(get("municipio"), "Municipio no especificado"),
                str(get("tematica")).strip(),
                display_label(str(get("delito")).strip()),
                text(get("zona")),
                text(get("genero")),
                text(get("edad")),
            )
            total = years[year].setdefault(key, [0, 0])
            total[0] += cases
            total[1] += seized
    return years


def write_zip(name: str, header: list[str], rows: list[list]) -> dict:
    if len(rows) + 1 > EXCEL_ROWS:
        raise ValueError(f"{name}: {len(rows):,} filas no caben en una hoja de Excel")
    buffer = io.StringIO()
    writer = csv.writer(buffer, quoting=csv.QUOTE_ALL)
    writer.writerow(header)
    writer.writerows(rows)
    data = buffer.getvalue().encode("utf-8-sig")
    # fixed date: running the script again on the same data gives the same file
    info = zipfile.ZipInfo(f"{name}.csv", date_time=(2020, 1, 1, 0, 0, 0))
    info.compress_type = zipfile.ZIP_DEFLATED
    path = OUTPUT / f"{name}.zip"
    with zipfile.ZipFile(path, "w") as archive:
        archive.writestr(info, data, compresslevel=9)
    print(f"{path.name}: {len(rows):,} filas, {len(data) / 1e6:.1f} MB, zip {path.stat().st_size / 1e6:.1f} MB")
    return {
        "file": f"assets/descargas/{path.name}",
        "rows": len(rows),
        "cases": amount(sum(row[-2] for row in rows)),
        "bytes": len(data),
        "zipBytes": path.stat().st_size,
    }


def main() -> None:
    years = read_source()
    OUTPUT.mkdir(parents=True, exist_ok=True)
    files = {}
    complete: dict[tuple, list[float]] = {}
    for year in sorted(years):
        rows = [
            [*key[1:7], year, MONTHS[key[0] - 1].capitalize() if key[0] else "NO REPORTADO",
             *key[7:], amount(cases), amount(seized)]
            for key, (cases, seized) in sorted(years[year].items(), key=lambda item: (
                item[0][1:7], item[0][0], item[0][7:]))
        ]
        files[str(year)] = write_zip(
            f"indecol-datos-{year}", [*PLACE, "Año", "Mes", *PERSON, *VALUES], rows)
        for key, (cases, seized) in years[year].items():
            total = complete.setdefault((*key[1:7], year, *key[7:]), [0, 0])
            total[0] += cases
            total[1] += seized
    rows = [
        [*key, amount(cases), amount(seized)]
        for key, (cases, seized) in sorted(complete.items())
    ]
    files["completo"] = write_zip(
        "indecol-datos-completo", [*PLACE, "Año", *PERSON, *VALUES], rows)
    INDEX.write_text(
        "window.INDECOL_DESCARGAS="
        + json.dumps(files, ensure_ascii=False, separators=(",", ":")) + ";\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
