import pandas as pd

data = pd.read_csv('BertTrainableDataset.csv')

print(data.head())
# Check number of rows and columns in the dataset
print(data.shape)
# print(data['context'])