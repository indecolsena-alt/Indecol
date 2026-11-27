"""Build the data for the profile, population-rate and same-period features.

Run from the project root after scripts/generar_catalogo.py:
    python scripts/generar_perfiles.py

Needs openpyxl and, besides DataBase/Delitos_final.csv, the two DANE population
workbooks in DataBase/ (see POPULATION_URL).

Writes:
    assets/data/perfiles/<delito>.js  zone, day, site, gender... one file per crime
    assets/data/comparativos.js       department cases for the comparable months
    assets/data/poblacion.js          DANE population by department and municipality
"""

from __future__ import annotations

import csv
import json
import re
import shutil
from collections import Counter, defaultdict
from pathlib import Path

import openpyxl

from generar_catalogo import (
    DEPARTMENT_NAMES, ROOT, SIEDCO_REGION_IDS, SOURCE, month_value, normalize, number,
    slug, year_value,
)

DATA = ROOT / "assets" / "data"
PROFILES = DATA / "perfiles"
POPULATION_PAGE = (
    "https://www.dane.gov.co/index.php/estadisticas-por-tema/"
    "demografia-y-poblacion/proyecciones-de-poblacion"
)
POPULATION_URL = "https://www.dane.gov.co/files/censo2018/proyecciones-de-poblacion/"
DEPARTMENT_BOOK = ROOT / "DataBase" / "PPED-AreaDep-2018-2050_VP.xlsx"
MUNICIPAL_BOOK = ROOT / "DataBase" / "PPED-AreaMun-2018-2042_VP.xlsx"

# a variable is offered for a crime only when this share of its cases has a value
MIN_COVERAGE = 0.6
TOP_VALUES = 9
OTHERS = "Otros"
MISSING = {"", "nan", "none", "no reportado", "no registra", "no identificado", "sin dato"}

DIMENSIONS = {
    "zona": "zona",
    "dia": "dia",
    "sitio": "clase_sitio",
    "genero": "genero",
    "edad": "edad",
    "arma": "armas_medios",
    "vehiculo": "vehiculo",
    "bien": "clase_bien",
    "modalidad": "descripcion_conducta",
}
DAYS = ("LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO")

# display names for the values the source writes in capitals without accents
LABELS = {
    "MIERCOLES": "Miércoles", "SABADO": "Sábado",
    "JOVENES": "Jóvenes",
    "VIAS PUBLICAS": "Vías públicas",
    "ENTIDAD PUBLICA / ESTATAL": "Entidad pública o estatal",
    "FRENTE A RESIDENCIAS - VIA PUBLICA": "Vía pública frente a residencias",
    "FRENTE A RESIDENCIAS NO REPORTADO VIA PUBLICA": "Vía pública frente a residencias (sin precisar)",
    "CARCELES": "Cárceles",
    "TRAMO DE VIA": "Tramo de vía",
    "INSTALACIONES DE LA POLICIA": "Instalaciones de la Policía",
    "INSTALACIONES DEL EJERCITO": "Instalaciones del Ejército",
    "RIOS": "Ríos",
    "TIPO EXPLOTACION ORO": "Explotación de oro",
    "ESTABLECIMIENTO EDUCATIVO": "Establecimiento educativo",
    "ESTABLECIMIENTO DE SALUD": "Establecimiento de salud",
    "CAJERO AUTOMATICO": "Cajero automático",
    "LOTE BALDIO": "Lote baldío",
    "PERIMETRO URBANO": "Perímetro urbano",
    "RED VIRTUAL O INTERNET": "Red virtual o internet",
    "ARMA BLANCA / CORTOPUNZANTE": "Arma blanca o cortopunzante",
    "ARTEFACTO EXPLOSIVO/CARGA DINAMITA": "Explosivo o carga de dinamita",
    "DRON / EXPLOSIVO": "Dron con explosivo",
    "ARMA TRAUMATICA": "Arma traumática",
    "LLAMADA TELEFONICA": "Llamada telefónica",
    "ESCOPOLAMINA": "Escopolamina",
    "REVOLVER": "Revólver",
    "PISTOLA TRAUMATICA": "Pistola traumática",
    "REVOLVER TRAUMATICO": "Revólver traumático",
    "FUSIL / RIFLE": "Fusil o rifle",
    "ESCOPETA DE FISTO": "Escopeta de fisto",
    "AUTOMOVIL": "Automóvil",
    "CAMION": "Camión",
    "VEHICULO": "Vehículo",
    "VEHICULO-PANEL": "Vehículo panel",
    "TRACTO_CAMION": "Tractocamión",
    "MOTO-CARRO": "Motocarro",
    "CINTAS/CINTURON": "Cintas o cinturón",
    "PETARDO PLANFETARIO": "Petardo panfletario",
}
ACCENTS = {
    "administracion": "administración", "articulo": "artículo", "atipico": "atípico",
    "atribucion": "atribución", "celebracion": "celebración", "comunicacion": "comunicación",
    "concusion": "concusión", "contaminacion": "contaminación", "danos": "daños",
    "dano": "daño", "defraudacion": "defraudación", "destinacion": "destinación",
    "diferente": "diferente", "ecologico": "ecológico", "especifica": "específica",
    "explotacion": "explotación", "fraudulenta": "fraudulenta", "ilicita": "ilícita",
    "ilicito": "ilícito", "ilicitamente": "ilícitamente", "importancia": "importancia",
    "indebida": "indebida", "informatico": "informático", "informaticos": "informáticos",
    "informacion": "información", "interceptacion": "interceptación", "interes": "interés",
    "intervencion": "intervención", "invasion": "invasión", "malversacion": "malversación",
    "mecanismos": "mecanismos", "omision": "omisión", "peculado": "peculado",
    "proteccion": "protección", "publica": "pública", "publico": "público",
    "publicos": "públicos", "recaudador": "recaudador", "reciprocas": "recíprocas",
    "suplantacion": "suplantación", "tecnologias": "tecnologías", "tramite": "trámite",
    "trafico": "tráfico", "transmision": "transmisión", "usurpacion": "usurpación",
    "utilizacion": "utilización", "vias": "vías", "violacion": "violación",
    "virus": "virus", "prevaricato": "prevaricato", "accion": "acción",
    "ecologia": "ecología", "especies": "especies", "gestion": "gestión",
    "hidrobiologicos": "hidrobiológicos", "biologicos": "biológicos",
    "biodiversidad": "biodiversidad", "genetico": "genético", "geneticos": "genéticos",
    "mineria": "minería", "autorizacion": "autorización", "electronicos": "electrónicos",
    "electronico": "electrónico", "apropiacion": "apropiación", "aplicacion": "aplicación",
    "circunstancias": "circunstancias", "agravacion": "agravación", "obstruccion": "obstrucción",
    "sancion": "sanción", "contribucion": "contribución", "asignacion": "asignación",
    "funcion": "función", "usuario": "usuario", "organos": "órganos", "titulos": "títulos",
    "credito": "crédito", "evasion": "evasión", "retencion": "retención",
    "habitacion": "habitación", "callejon": "callejón", "bahia": "bahía",
    "vehiculo": "vehículo", "via": "vía", "anden": "andén", "solidos": "sólidos",
    "areas": "áreas", "ecologica": "ecológica", "exoticas": "exóticas",
    "obstaculizacion": "obstaculización", "ilegitima": "ilegítima",
    "telecomunicacion": "telecomunicación",
}


def sentence(text: str) -> str:
    words = [ACCENTS.get(word, word) for word in text.lower().split()]
    joined = " ".join(words)
    return joined[:1].upper() + joined[1:]


def label(dimension: str, value: str) -> str:
    if value in LABELS:
        return LABELS[value]
    if dimension == "modalidad":
        match = re.match(r"ARTICULO\s+(\d+)\s?([A-J])?\s*[.\-]*\s*(.+)", value)
        if match:
            article = match.group(1) + (match.group(2) or "")
            return f"{sentence(match.group(3).strip(' .'))} (art. {article})"
        match = re.match(r"(.+?)\s+ART\.?\s*(\d+\w?)\s*C\.?P\.?", value)
        if match:
            return f"{sentence(match.group(1))} (art. {match.group(2)})"
    return sentence(value)


def department_key(value: str) -> str:
    key = re.sub(r"[.,]", "", normalize(value))
    return "la guajira" if key == "guajira" else key


def read_source():
    crimes = defaultdict(lambda: {
        "years": Counter(),
        "dims": {name: defaultdict(Counter) for name in DIMENSIONS},
    })
    codes = defaultdict(Counter)
    months_by_year = defaultdict(set)
    monthly = Counter()
    with SOURCE.open("r", encoding="utf-8-sig", newline="") as source:
        reader = csv.DictReader(source)
        columns = {normalize(header): header for header in reader.fieldnames}
        year_column, month_column = columns["ano"], columns["mes"]
        duplicate_column = columns.get("es_duplicado")
        for row in reader:
            if duplicate_column and normalize(row[duplicate_column]) in {"1", "true", "si", "yes"}:
                continue
            crime_id = f"{slug(row['tematica'])}-{slug(row['delito'])}"
            cases = number(row["casos"]) or 0
            year = year_value(row[year_column])
            month = month_value(row[month_column])
            if year is None:
                continue
            department = row["departamento"].strip()
            municipality = row["municipio"].strip()
            code = row["codigo_dane"].strip()
            # same rule as the catalog: recover an unreported department from the DANE code
            if (SIEDCO_REGION_IDS.get(normalize(row["region"])) == "sin-region"
                    and normalize(department) in ("", "no reportado")
                    and re.fullmatch(r"\d{5}", code) and code[:2] in DEPARTMENT_NAMES):
                department = DEPARTMENT_NAMES[code[:2]]
            if re.fullmatch(r"\d{4,5}", code):
                codes[(department, municipality)][code.zfill(5)] += 1
            if month is not None:
                months_by_year[year].add(month)
                monthly[(department_key(department), crime_id, year, month)] += cases
            if not cases:
                continue
            crime = crimes[crime_id]
            crime["years"][year] += cases
            for name, column in DIMENSIONS.items():
                value = row[column].strip().upper()
                if normalize(value) in MISSING:
                    continue
                crime["dims"][name][value][year] += cases
    return crimes, codes, months_by_year, monthly


def build_profile(crime, years):
    total = sum(crime["years"].values())
    dimensions = {}
    for name, values in crime["dims"].items():
        totals = {value: sum(counts.values()) for value, counts in values.items()}
        known = sum(totals.values())
        if not total or known / total < MIN_COVERAGE:
            continue
        ranked = sorted(totals, key=lambda value: (-totals[value], value))
        # a variable with practically a single value says nothing
        if totals[ranked[0]] / known >= 0.995:
            continue
        if name == "dia":
            ranked = [value for value in DAYS if value in totals]
        kept = ranked if name == "dia" or len(ranked) <= TOP_VALUES + 1 else ranked[:TOP_VALUES]
        labels = [label(name, value) for value in kept]
        rows = [[values[value][year] for year in years] for value in kept]
        rest = [value for value in ranked if value not in kept]
        if rest:
            others = [sum(values[value][year] for value in rest) for year in years]
            # the source has its own "OTRO": add the grouped values to it
            own = next((i for i, text in enumerate(labels) if text.lower() in ("otro", "otros")), None)
            if own is None:
                labels.append(OTHERS)
                rows.append(others)
            else:
                labels[own] = OTHERS
                rows[own] = [a + b for a, b in zip(rows[own], others)]
        dimensions[name] = {"labels": labels, "values": [[round(n) for n in row] for row in rows]}
    return {
        "years": years,
        "cases": [round(crime["years"][year]) for year in years],
        "dims": dimensions,
    }


def write_js(path: Path, prefix: str, content) -> None:
    path.write_text(
        prefix + json.dumps(content, ensure_ascii=False, separators=(",", ":")) + ";\n",
        encoding="utf-8",
    )


def population_rows(book: Path):
    if not book.is_file():
        raise FileNotFoundError(f"Falta {book}. Descárgalo desde {POPULATION_PAGE}")
    workbook = openpyxl.load_workbook(book, read_only=True, data_only=True)
    sheet = workbook[workbook.sheetnames[-1]]
    header = None
    for row in sheet.iter_rows(values_only=True):
        if header is None:
            if row and row[0] == "DP":
                header = {str(name).strip(): index for index, name in enumerate(row) if name}
            continue
        yield {name: row[index] for name, index in header.items()}
    workbook.close()


def build_population(codes, years):
    def read(book, code_column):
        result = defaultdict(dict)
        for row in population_rows(book):
            area = next(value for name, value in row.items() if "REA" in name)
            year = next(value for name, value in row.items() if name.startswith("A") and "REA" not in name)
            if area != "Total" or year not in years:
                continue
            total = next(value for name, value in row.items() if name.upper() == "TOTAL")
            result[str(row[code_column]).zfill(2 if code_column == "DP" else 5)][year] = int(total)
        return result

    departments = read(DEPARTMENT_BOOK, "DP")
    municipalities = read(MUNICIPAL_BOOK, "MPIO")
    by_department = {
        department_key(name): [departments[code][year] for year in years]
        for code, name in DEPARTMENT_NAMES.items()
    }
    by_municipality = {}
    unmatched = []
    for (department, municipality), found in sorted(codes.items()):
        if normalize(municipality) in MISSING:
            continue
        code = found.most_common(1)[0][0]
        if code not in municipalities:
            unmatched.append((department, municipality, code))
            continue
        by_municipality[f"{normalize(department)}|{normalize(municipality)}"] = [
            municipalities[code][year] for year in years
        ]
    return {
        "source": "DANE · Proyecciones de población 2018–2050 (departamentos) y 2018–2042 (municipios)",
        "updated": "30 de julio de 2025",
        "url": POPULATION_PAGE,
        "years": years,
        "departments": by_department,
        "municipalities": by_municipality,
    }, unmatched


def main() -> None:
    crimes, codes, months_by_year, monthly = read_source()
    years = sorted(months_by_year)

    shutil.rmtree(PROFILES, ignore_errors=True)
    PROFILES.mkdir(parents=True)
    for crime_id, crime in sorted(crimes.items()):
        write_js(
            PROFILES / f"{crime_id}.js",
            f'(window.INDECOL_PERFILES=window.INDECOL_PERFILES||{{}})["{crime_id}"]=',
            build_profile(crime, years),
        )

    # the last month of an unfinished year is incomplete, so it is left out
    last = max(months_by_year[years[-1]])
    months = last - 1 if len(months_by_year[years[-1]]) < 12 else 12
    departments = defaultdict(lambda: defaultdict(lambda: [0] * len(years)))
    for (department, crime_id, year, month), cases in monthly.items():
        if month <= months and cases and normalize(department) not in MISSING:
            departments[department][crime_id][years.index(year)] += round(cases)
    write_js(DATA / "comparativos.js", "window.INDECOL_COMPARATIVOS=",
             {"months": months, "years": years, "departments": departments})

    population, unmatched = build_population(codes, years)
    write_js(DATA / "poblacion.js", "window.INDECOL_POBLACION=", population)

    print(f"Perfiles: {len(crimes)} delitos · comparación enero–mes {months}")
    print(f"Población: {len(population['departments'])} departamentos, "
          f"{len(population['municipalities'])} municipios; sin población: {unmatched}")


if __name__ == "__main__":
    main()
