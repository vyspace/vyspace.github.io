import xgboost as xgb
import numpy as np
data = np.random.rand(5,10) # 5 entities, each contains 10 features
label = np.random.randint(2, size=5) # binary target
dtrain = xgb.DMatrix( data, label=label)
dtest = dtrain
param = {'bst:max_depth':2, 'bst:eta':1, 'silent':1, 'objective':'binary:logistic' }
param['nthread'] = 4
param['eval_metric'] = 'auc' 
evallist  = [(dtest,'eval'), (dtrain,'train')]
num_round = 10
bst = xgb.train( param, dtrain, num_round, evallist )
bst.dump_model('dump.raw.txt')

----------------------yarn------------------------
import os
import subprocess
dir_path = os.getcwd()
hadoop_home = os.environ.get('HADOOP_HOME')
spark_home = os.environ.get('SPARK_HOME')
jn_home = os.environ.get('JN_HOME')
jar_name = '%s/Lib/xgb4j-0.0.1-jar-with-dependencies.jar' % jn_home
mode = 'cluster'
cmd_del = '%s/bin/hadoop fs -rm -R /hfile/out/xgb4j' % hadoop_home
cmd_train = '%s/bin/spark-submit --master yarn --deploy-mode %s --class org.vys.mvn.App %s' % (spark_home, mode, jar_name)
cmd_get = '%s/bin/hadoop fs -get /hfile/out/xgb4j %s' % (hadoop_home, dir_path)
print 'start train'
subprocess.Popen(cmd_del, shell=True, stderr = subprocess.PIPE )
p = subprocess.Popen(cmd_train, shell=True, stderr = subprocess.PIPE )
out = p.stderr.readlines()
for line in out:
    print line.strip()
subprocess.Popen(cmd_get, shell=True, stderr = subprocess.PIPE )




集群模式下如果输出文件夹已存在，会运行报错

1. 删除输出文件夹: $HADOOP_HOME/bin/hadoop fs -rm -R /hfile/out/xgb4j

2. 运行spark job： $SPARK_HOME/bin/spark-submit --master yarn --deploy-mode cluster --class org.vys.mvn.App $JN_HOME/Lib/xgb4j-0.0.1-jar-with-dependencies.jar

3. 将结果取回本地：$HADOOP_HOME/bin/hadoop fs -get /hfile/out/xgb4j $JN_HOME/Lib