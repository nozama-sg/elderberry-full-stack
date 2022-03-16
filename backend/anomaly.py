import numpy as np
import pandas as pd
from datetime import datetime
from prophet import Prophet

''' 
FOR CAREGIVER APP, DAILY UPDATE - returns array of all anomalies in that day
for heartRate, stepCount, timespent in each room
DATA FORMAT
x = [] : Array of time stamps in 'YYYY-MM-DD HH:MM:SS' in HOURLY interval
    e.g. x = ['2022-03-01 01:00:00', '2022-03-01 02:00:00' ...]
y = [] : Array of the actual data as an integer
    e.g. y = [30, 50 ...]
    
dayInQuestion = 'YYYY-MM-DD':
    Give me the current date
    e.g. 2022-03-01 for 1st mar, 2022-03-02 for 2nd mar
'''

def getAnomaliesDaily(x, y, dayInQuestion):
    m = Prophet(changepoint_range=0.95)
    data = {'ds': x, 'y': y}
    data_df = pd.DataFrame(data=data)

    data_df['ds'] = pd.to_datetime(data_df['ds'])

    train = data_df[(data_df['ds'] <= dayInQuestion)]
    test = data_df[(data_df['ds'] > dayInQuestion)]

    m.fit(train)
    future = m.make_future_dataframe(periods=test.shape[0], freq='H')

    forecast = m.predict(future)
    results = pd.concat([data_df.set_index('ds')['y'], forecast.set_index(
        'ds')[['yhat', 'yhat_lower', 'yhat_upper']]], axis=1)

    results['error'] = results['y'] - results['yhat']
    results['uncertainty'] = results['yhat_upper'] - results['yhat_lower']

    bottom_outliers = results[results['error'] < -1.5*results['uncertainty']]
    bottom_outlier_df = pd.concat(
        [pd.DataFrame(bottom_outliers['y'].index), pd.DataFrame(bottom_outliers['y'].array)], axis=1)
    bottom_outlier_dictionary = bottom_outlier_df.to_dict()

    top_outliers = results[results['error'] > 1.5*results['uncertainty']]
    top_outliers_df = pd.concat(
        [pd.DataFrame(top_outliers['y'].index), pd.DataFrame(top_outliers['y'].array)], axis=1)
    top_outlier_dictionary = top_outliers_df.to_dict()

    bottom_anomaly_times = list(bottom_outlier_dictionary['ds'].values())
    bottom_anomaly_values = list(bottom_outlier_dictionary[0].values())

    top_anomaly_times = list(top_outlier_dictionary['ds'].values())
    top_anomaly_values = list(top_outlier_dictionary[0].values())

    all_anomalies = []
    for i in range(len(bottom_anomaly_times)):
        all_anomalies.append({
            'date': bottom_anomaly_times[i],
            'val': bottom_anomaly_values[i]
        })

    for i in range(len(top_anomaly_times)):
        all_anomalies.append({
            'date': top_anomaly_times[i],
            'val': top_anomaly_values[i]
        })

    return all_anomalies

'''
FOR REPORT - MONTHLY UPDATE - returns the estimated normal upper and lower bounds 
for all data in the month
DATA FORMAT
x = [] : Array of time stamps in 'YYYY-MM-DD HH:MM:SS' in DAILY interval (time part can just be 00:00:00)
    e.g. x = ['2022-03-01 00:00:00', '2022-03-02 00:00:00' ...]
y = [] : Array of the actual data as an integer
    e.g. y = [30, 50 ...]
    
dayInQuestion = 'YYYY-MM-DD':
    Give me the first day of the month
    e.g. 2022-03-01 for Mar report, 2022-04-01 for April report
'''


def getBoundaries(x, y, dayInQuestion):
    m = Prophet(changepoint_range=0.95)
    data = {'ds': x, 'y': y}
    data_df = pd.DataFrame(data=data)

    data_df['ds'] = pd.to_datetime(data_df['ds'])

    train = data_df[(data_df['ds'] <= dayInQuestion)]
    test = data_df[(data_df['ds'] > dayInQuestion)]

    m.fit(train)
    future = m.make_future_dataframe(periods=test.shape[0], freq='D')

    forecast = m.predict(future)
    results = pd.concat([data_df.set_index('ds')['y'], forecast.set_index(
        'ds')[['yhat', 'yhat_lower', 'yhat_upper']]], axis=1)

    lower = results['yhat_lower'].aggregate(np.mean)
    upper = results['yhat_upper'].aggregate(np.mean)
    return lower, upper
