#!/usr/bin/env python3

from gevent import Greenlet
from sakura.common.tools import set_unbuffered_stdout, \
                                wait_greenlets
from sakura.daemon.loading import load_operator_classes, \
                                load_datastores
from sakura.daemon.engine import DaemonEngine
from sakura.daemon.greenlets import \
            RPCServerGreenlet, RPCClientGreenlet

set_unbuffered_stdout()
print('Started.')

# load data, create engine
op_classes = load_operator_classes()
datastores = load_datastores()
engine = DaemonEngine(op_classes, datastores)

# prepare greenlets
g1 = RPCServerGreenlet(engine)
g1.prepare()
g2 = RPCClientGreenlet(engine)
g2.prepare()

# spawn them and wait until they end.
wait_greenlets(g1.spawn(),g2.spawn())
print('**out**')
