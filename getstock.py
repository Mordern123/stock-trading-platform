#C:\Python31\python,exe
#-*- conding:utf-8 -*-

import requests as rq
import pandas as pd
from io import StringIO
import numpy as np
import time

date = time.strftime("%Y%m%d")
#date = '20190215'

r = rq.post('http://www.twse.com.tw/exchangeReport/MI_INDEX?response=csv&date=' + date + '&type=ALL' ,headers={'Connection':'close'})

df = pd.read_csv(StringIO("\n".join([i.translate({ord(c): None for c in ' '})
    for i in r.text.split('\n')
        if len(i.split('",')) == 17]).replace('=', '')), header=0)

df.to_csv('D:\\Hongwei\\Stock\\getStock\\' + date + 'Stock.csv', encoding = 'utf_8_sig', sep = ',')

r.connection.close()


    







