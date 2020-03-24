#C:\Python31\python,exe
#-*- conding:utf-8 -*-

import requests as rq
import pandas as pd
from io import StringIO
import numpy as np
import time

date = time.strftime("%Y%m%d")

r= rq.post('http://www.twse.com.tw/indicesReport/MI_5MINS_HIST?response=csv&date=' +date)

df= pd.read_csv(StringIO("\n".join([i.translate({ord(c): None for c in ' '})
                                    for i in r.text.split('\n')
                                    if len(i.split('",')) == 6]).replace( '=', '')),header=0)

df.to_csv('D:\\Hongwei\\Stock\\' + date + 'TaiEx.csv', encoding= 'utf_8_sig', sep=',')

r.connection.close()
