import pandas as pd 
import numpy as np

def getData() -> pd.DataFrame:
    data = pd.read_excel("./test_log.xlsx", index_col=0)
    return data

def spoofGPS(row:pd.DataFrame) -> pd.DataFrame:
    row['lat'] += 0.01
    row['lon'] += 0.005
    row['yaw'] = np.random.uniform(90, 120) 
    row['roll'] += np.random.uniform(-0.1, 0.1)
    row['altitude_relative'] += np.random.uniform(-10, 10)
    row['eph'] += np.random.uniform(1, 3)
    row['epv'] += np.random.uniform(1, 3)
    row['satellites_visible'] = np.random.randint(4, 7)
    return row

def jammingGPS(df:pd.DataFrame, row:pd.DataFrame, jam_start_time, jam_end_time) -> pd.DataFrame:
    if jam_start_time <= row.name <= jam_end_time:
        row['satellites_visible'] = np.random.randint(0, 4)
        row['eph'] += np.random.uniform(5, 15)
        row['epv'] += np.random.uniform(5, 15)
        row['lat'] = df.loc[jam_start_time, 'lat']
        row['lon'] = df.loc[jam_start_time, 'lon']
        row['yaw'] = np.random.uniform(0, 360)
        row['roll'] += np.random.uniform(-1, 1)
        row['pitch'] += np.random.uniform(-1, 1)
    return row

def acelOff(df:pd.DataFrame, row:pd.DataFrame, off_start_time, off_end_time) -> pd.DataFrame:
    if off_start_time <= row.name <= off_end_time:
        row['roll'] += np.random.uniform(-5, 5)
        row['pitch'] += np.random.uniform(-5, 5)
        row['yaw'] = np.random.uniform(0, 360)
        row['eph'] += np.random.uniform(10, 20)
        row['epv'] += np.random.uniform(10, 20)
        row['satellites_visible'] = np.random.randint(0, 4)
        row['lat'] = df.loc[off_start_time, 'lat']
        row['lon'] = df.loc[off_start_time, 'lon']
    return row

def wind(row:pd.DataFrame) -> pd.DataFrame:
    row['vel'] += np.random.uniform(0, 2)
    row['yaw'] += np.random.uniform(-10, 10)
    row['roll'] += np.random.uniform(-2, 2)
    row['pitch'] += np.random.uniform(-2, 2)
    row['eph'] += np.random.uniform(0, 1)
    row['epv'] += np.random.uniform(0, 1)
    row['lat'] += np.random.uniform(-0.00001, 0.00001)
    row['lon'] += np.random.uniform(-0.00001, 0.00001)
    return row

if __name__ == "__main__":
    raw_log = getData()
    # exit_log = raw_log.apply(spoofGPS, axis=1)
    # exit_log.to_excel("./spoof_gps.xlsx")
    # exit_log = raw_log.apply(lambda row: jammingGPS(raw_log, row, 385, 653), axis=1)
    # exit_log.to_excel("./jamming_gps.xlsx")
    # exit_log = raw_log.apply(lambda row: acelOff(raw_log, row, 255, 700), axis=1)
    # exit_log.to_excel("./acel.xlsx")
    exit_log = raw_log.apply(wind, axis=1)
    exit_log.to_excel("./wind.xlsx")