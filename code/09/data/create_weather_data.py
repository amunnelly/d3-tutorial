from vega_datasets import data

df = data.seattle_weather()

df['year'] = df['date'].apply(lambda x: int(x.strftime("%Y")))
df['dayOfYear'] = df['date'].apply(lambda x: int(x.strftime("%j")))
holder = []

for a, b in df.groupby("year"):
    precip = b['precipitation'].cumsum()
    [holder.append(p) for p in precip]

df['cumulativePricipitationByYear'] = holder

df.to_csv("seattle_weather.csv", index=False)
