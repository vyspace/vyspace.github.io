---
title: XGBoost Client
categories:
  - ai
tags:
  - 大数据
date: 2018-04-09 11:35:23
---
这篇文章我们主要测试下，之前部署好的XGBoost。

我们使用Jupyter编写代码，使用单机模式在Spark中运行。

``` python
import xgboost as xgb
import numpy as np
# 生成随机样本位于[0, 1)中
# 生成一个5行10列的数组，作为样本数据。
data = np.random.rand(5,10)
# 生成目标数据
label = np.random.randint(2, size=5)
dtrain = xgb.DMatrix(data, label=label)
dtest = dtrain
param = {'bst:max_depth':2, 'bst:eta':1, 'silent':1, 'objective':'binary:logistic' }
param['nthread'] = 4
param['eval_metric'] = 'auc' 
evallist  = [(dtest,'eval'), (dtrain,'train')]
num_round = 10
bst = xgb.train( param, dtrain, num_round, evallist )
bst.dump_model('dump.raw.txt')
```
<!--more-->

本系列文章[《目录》](/ai/hadoop-use/)
