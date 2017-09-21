import sys, os, importlib, inspect
from sakura.daemon.processing.operator import Operator
from sakura.daemon.db.datastore import DataStore
import sakura.daemon.conf as conf

def load_operator_classes():
    print('Loading operators at %s' % conf.operators_dir)
    op_classes = {}
    sys.path.insert(0, conf.operators_dir)
    # for each operator directory
    for op_dir in os.listdir(conf.operators_dir):
        # load the module defined by operator.py
        mod = importlib.import_module(op_dir + '.operator')
        # look for the Operator subclass defined in this module
        def match(obj):
            return  inspect.isclass(obj) and \
                    inspect.getmodule(obj) == mod and \
                    issubclass(obj, Operator)
        matches = inspect.getmembers(mod, match)
        if len(matches) == 0:
            print("warning: no subclass of Operator found in %s/operator.py. Ignoring." % op_dir)
            continue
        for name, op_cls in matches:
            with open(conf.operators_dir + '/' + op_dir + '/icon.svg', 'r') as icon_file:
                op_cls.ICON = icon_file.read()
            op_classes[op_cls.NAME] = op_cls
    sys.path = sys.path[1:]
    return op_classes

def load_datastores():
    datastores = []
    for ds_conf in conf.data_stores:
        ds = DataStore(
            host = ds_conf['host'],
            admin_user = ds_conf['admin-user'],
            admin_password = ds_conf['admin-password'],
            driver_label = ds_conf['driver']
        )
        try:
            ds.refresh_databases()
            datastores.append(ds)
        except BaseException as exc:
            print('WARNING: Could not load %s Data Store at %s: %s. IGNORED.' % \
                    (ds_conf['driver'], ds.host, str(exc).strip()))
    return datastores
