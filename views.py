from django.shortcuts import render

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from api.models import predict
from api.serializers import PredictSerializer

import os.path
import numpy as np
import pandas as pd
import matplotlib  
matplotlib.use('TkAgg')   
import matplotlib.pyplot as plt  
import pickle
import datetime as dt

import warnings
import itertools
import statsmodels.api as sm

plt.style.use('fivethirtyeight')

# Create your views here.
@api_view(['GET', 'POST'])
def request_predict(request):
    requestDict = dict(request.data)

    tag = requestDict['tag'][0]
    detail = requestDict['detail'][0]    
    rrange = requestDict['range'][0]
    
    if(rrange == 'week'):
        with open('storeAICWeek.pkl','rb') as f:  # Python 3: open(..., 'rb')
            pdq = pickle.load(f)
        with open('dataWeek.pkl','rb') as f:
            data = pickle.load(f)
        step = 25
    else:
        with open('storeAIC.pkl','rb') as f:  # Python 3: open(..., 'rb')
            pdq = pickle.load(f)
        with open('data.pkl','rb') as f:
            data = pickle.load(f)   
        step = 100

    path = "img/"+str(detail)+"/"+str(rrange)+'/'+str(tag)+".png"
    is_exist = os.path.isfile(path)
    if detail == 'view':
        if(not is_exist):
            y = data[tag]
            y.plot(label='observed', figsize=(20, 15))
            plt.savefig(path)
            plt.close()
    else:
        y = data[tag]
        p, d, q, P, D, Q, R = pdq[tag]

        if(not is_exist):
            mod = sm.tsa.statespace.SARIMAX(y,order=(p, d, q),seasonal_order=(P, D, Q, R),enforce_stationarity=False,enforce_invertibility=False)
            results = mod.fit()
            #Get forecast x steps ahead in future
            pred_uc = results.get_forecast(steps = step)
            pred_ci = pred_uc.conf_int()
            ax = y.plot(label='observed', figsize=(20, 15))
            pred_uc.predicted_mean.plot(ax=ax, label='Forecast')
            ax.fill_between(pred_ci.index,
                        pred_ci.iloc[:, 0],
                        pred_ci.iloc[:, 1], color='k', alpha=.25)
            ax.set_xlabel('Date')
            ax.set_ylabel('amout of Question')
            plt.savefig(path)
            plt.close()
    
    return Response({'path': path, 'result':'success'})