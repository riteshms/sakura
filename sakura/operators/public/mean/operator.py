#!/usr/bin/env python
from sakura.daemon.processing.operator import Operator
from sakura.daemon.processing.parameter import NumericColumnSelection
from sakura.daemon.processing.stream import ComputedStream

class MeanOperator(Operator):
    NAME = "Mean"
    SHORT_DESC = "Get the mean value of a numeric column."
    TAGS = [ "statistics", "aggregate" ]
    def construct(self):
        # inputs
        self.input = self.register_input('Mean input data')
        
        # outputs
        output = self.register_output(
                    ComputedStream('Mean result', self.compute))
        output.add_column('Mean', float)
        output.length = 1
        
        # parameters
        self.input_column_param = self.register_parameter('Input column',
                NumericColumnSelection(self.input))
                
    def compute(self):
        column = self.input_column_param.value
        res = 0
        num = 0
        for chunk in column.chunks():
            res += chunk.sum()
            num += chunk.size
        mean = float(res)/num
        # our output has only 1 row and 1 column
        yield (mean,)
