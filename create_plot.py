import pandas as pd
from novem import Plot

"""
This is a demo for visualisation purposes only

The data is not accurate or meaningful and is used for illustration purposes 
only
"""

# let's start by getting some sample data
df = pd.read_csv('https://data.novem.no/v1/examples/plot/nei_rgn_perf.csv')

# set index and filter refernece data
df = df.set_index('Date')[['Africa','Oceania']]

# add columns
df.columns = ['Index','Benchmark']

# calculate a simple diff
df['Diff'] = df['Index'] - df['Benchmark']


# Create the novem plot
plt = Plot('complex_test')

# set chart to custom
plt.type = 'custom'

# upload the data, feel free to experiment with the filters
df.loc['2022-01-01':'2022-10-31'].pipe(plt)

# add our custom ccs and javascript
with open('./custom/custom.js', 'r') as f:
  plt.api_write('/config/custom/custom.js', f.read())

# add our custom ccs and javascript
with open('./custom/custom.css', 'r') as f:
  plt.api_write('/config/custom/custom.css', f.read())

# print our url
print(plt.url)

