#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Translates a space/tab separated file to a
# pretty-printed JSON with attribute names based
# on argv.
#
# Copyright Andy Fang
# Licensed under The MIT License (MIT)
import fileinput
import sys
import json

output_dict = []


def pretty_print(obj):
    return json.dumps(obj, indent=4, separators=(',', ': '))


def get_attr_names():
    return sys.argv[2:]


if __name__ == '__main__':
    attr_names = get_attr_names()
    for line in fileinput.input([sys.argv[1]]):
        values = line.split()
        current_item = {}
        for k, v in zip(attr_names, values):
            current_item[k] = v
        output_dict.append(current_item)
    print(pretty_print(output_dict))
