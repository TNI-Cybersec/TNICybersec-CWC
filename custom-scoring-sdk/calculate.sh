#!/bin/bash

java -Dfile.encoding=UTF-8 -classpath /opt/point-calculator/target/classes:/home/bionic/.m2/repository/org/projectlombok/lombok/1.18.10/lombok-1.18.10.jar cwc2020.calculators.VulnerableMachine.VulnerableMachinePointCalculator $1 "$2" $3
